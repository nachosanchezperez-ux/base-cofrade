import { createPublicKey, randomUUID, verify as verifySignature } from 'node:crypto'
import { NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium-min'
import { getCache, waitUntil } from '@vercel/functions'
import puppeteer from 'puppeteer-core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA5xxcEG8HcsUxO5thhqFfzvXnuOC8HAp1Uab4yfmsXVI=
-----END PUBLIC KEY-----`)
const MAX_AGE_MS = 15 * 60 * 1000
const CONTROLLER_MAX_AGE_MS = 270 * 1000
const CACHE_TTL_SECONDS = 12 * 60
const EMAIL = 'nacho.sanchezperez@gmail.com'
const FORGOT_URL = 'https://supabase.com/dashboard/forgot-password'
const CHROMIUM_PACK = 'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar'
const cache = getCache({ namespace: 'hc-captcha-v3' })

function responseHeaders(extra = {}) {
  return {
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    ...extra,
  }
}

function json(body, status = 200) {
  return NextResponse.json(body, { status, headers: responseHeaders() })
}

function signedPayload(request) {
  const url = new URL(request.url)
  const encoded = url.searchParams.get('payload') || ''
  const signature = url.searchParams.get('sig') || ''
  if (!encoded || !signature) throw new Error('Firma ausente.')
  if (!verifySignature(null, Buffer.from(encoded), PUBLIC_KEY, Buffer.from(signature, 'base64url'))) {
    throw new Error('Firma no válida.')
  }
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  const timestamp = Number(payload?.ts)
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > MAX_AGE_MS) {
    throw new Error('Firma caducada.')
  }
  return payload
}

function validSessionId(value) {
  return /^[a-z0-9-]{8,80}$/i.test(String(value || ''))
}

function stateKey(sessionId) {
  return `${sessionId}:state`
}

function commandKey(sessionId) {
  return `${sessionId}:command`
}

async function cacheSetJson(key, value) {
  await cache.set(key, JSON.stringify(value), {
    ttl: CACHE_TTL_SECONDS,
    name: 'Hilo Cofrade CAPTCHA temporal',
    tags: ['hc-captcha-temporal'],
  })
}

async function cacheGetJson(key) {
  const value = await cache.get(key)
  if (value === undefined || value === null) return null
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return null }
  }
  if (Buffer.isBuffer(value)) {
    try { return JSON.parse(value.toString('utf8')) } catch { return null }
  }
  return value
}

async function cacheDelete(key) {
  try { await cache.delete(key) } catch { /* La entrada caducará igualmente. */ }
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function challengeFrame(page) {
  return page.frames().find((frame) => (
    /hcaptcha\.com|newassets\.hcaptcha\.com/.test(frame.url())
    && /challenge|frame=challenge/.test(frame.url())
  )) || null
}

async function elementBoxes(frame, selector) {
  const handles = await frame.$$(selector)
  const boxes = []
  for (const handle of handles) {
    const box = await handle.boundingBox()
    if (!box || box.width < 8 || box.height < 8) continue
    const metadata = await handle.evaluate((node) => ({
      tag: node.tagName,
      className: typeof node.className === 'string' ? node.className : '',
      text: (node.textContent || '').trim().slice(0, 120),
      ariaLabel: node.getAttribute('aria-label') || '',
      role: node.getAttribute('role') || '',
    })).catch(() => ({ tag: '', className: '', text: '', ariaLabel: '', role: '' }))
    boxes.push({ ...box, ...metadata })
  }
  return boxes
}

function deduplicateBoxes(items) {
  const result = []
  for (const item of items) {
    const duplicate = result.some((existing) => (
      Math.abs(existing.x - item.x) < 3
      && Math.abs(existing.y - item.y) < 3
      && Math.abs(existing.width - item.width) < 3
      && Math.abs(existing.height - item.height) < 3
    ))
    if (!duplicate) result.push(item)
  }
  return result.map((item, index) => ({ index, ...item }))
}

async function challengeDetails(page) {
  const frame = await challengeFrame(page)
  if (!frame) {
    return {
      challenge: false,
      prompt: '',
      frameText: '',
      tileBoxes: [],
      buttons: [],
      elements: [],
      frameUrls: page.frames().map((item) => item.url()).filter((item) => /hcaptcha/.test(item)).slice(0, 12),
    }
  }

  let metadata = { prompt: '', frameText: '', buttons: [], elements: [] }
  try {
    metadata = await frame.evaluate(() => {
      const visible = (node) => {
        const rect = node.getBoundingClientRect()
        const style = window.getComputedStyle(node)
        return rect.width > 4 && rect.height > 4 && style.visibility !== 'hidden' && style.display !== 'none'
      }
      const textOf = (node) => (node.textContent || '').replace(/\s+/g, ' ').trim()
      const promptSelectors = [
        '.prompt-text', '.challenge-prompt', '.prompt-text span',
        '[class*="prompt"]', 'h1', 'h2', 'h3', '[aria-live="polite"]',
      ]
      const prompt = promptSelectors
        .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
        .filter(visible)
        .map(textOf)
        .find((text) => text.length > 2 && text.length < 260) || ''
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], [tabindex="0"]'))
        .filter(visible)
        .slice(0, 80)
        .map((node) => ({
          text: textOf(node).slice(0, 120),
          ariaLabel: node.getAttribute('aria-label') || '',
          className: typeof node.className === 'string' ? node.className : '',
          title: node.getAttribute('title') || '',
        }))
      const elements = Array.from(document.querySelectorAll('canvas, img, button, [role="button"], [class*="task"], [class*="image"], [class*="challenge"]'))
        .filter(visible)
        .slice(0, 140)
        .map((node) => {
          const rect = node.getBoundingClientRect()
          return {
            tag: node.tagName,
            className: typeof node.className === 'string' ? node.className : '',
            text: textOf(node).slice(0, 90),
            ariaLabel: node.getAttribute('aria-label') || '',
            role: node.getAttribute('role') || '',
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          }
        })
      return {
        prompt,
        frameText: textOf(document.body).slice(0, 1800),
        buttons,
        elements,
      }
    })
  } catch {
    // El contenido del reto puede cambiar durante la inspección.
  }

  let boxes = []
  for (const selector of [
    '.task-image', '.image-wrapper', '.task-grid .image',
    '[class*="task-image"]', '[class*="image-wrapper"]',
  ]) {
    try { boxes.push(...await elementBoxes(frame, selector)) } catch { /* Continúa con el siguiente selector. */ }
  }

  return {
    challenge: true,
    prompt: metadata.prompt || '',
    frameText: metadata.frameText || '',
    tileBoxes: deduplicateBoxes(boxes).slice(0, 30),
    buttons: metadata.buttons || [],
    elements: metadata.elements || [],
    frameUrls: page.frames().map((item) => item.url()).filter((item) => /hcaptcha/.test(item)).slice(0, 12),
  }
}

async function pageState(page, screenshotBase64 = '') {
  let bodyText = ''
  try { bodyText = await page.locator('body').innerText({ timeout: 2500 }) } catch { /* La página puede estar navegando. */ }
  const details = await challengeDetails(page)
  const success = /check your email for a reset code|reset code has been sent|email for a reset code|check your inbox/i.test(bodyText)
  const failure = /unable to verify|captcha.*failed|something went wrong|too many requests/i.test(bodyText)
  return {
    status: success ? 'success' : failure ? 'page-error' : details.challenge ? 'challenge' : 'waiting',
    success,
    challenge: details.challenge,
    prompt: details.prompt,
    tileCount: details.tileBoxes.length,
    tileBoxes: details.tileBoxes,
    buttons: details.buttons,
    elements: details.elements,
    url: page.url(),
    bodyText: bodyText.slice(0, 1800),
    frameText: details.frameText,
    frameUrls: details.frameUrls,
    screenshot: screenshotBase64,
    updatedAt: Date.now(),
  }
}

async function captureScreenshot(page) {
  const buffer = await page.screenshot({ type: 'jpeg', quality: 58, fullPage: false })
  return buffer.toString('base64')
}

async function writeState(sessionId, state) {
  await cacheSetJson(stateKey(sessionId), state)
}

async function readState(sessionId) {
  return cacheGetJson(stateKey(sessionId))
}

async function clickTiles(page, indexes) {
  const details = await challengeDetails(page)
  for (const rawIndex of indexes || []) {
    const box = details.tileBoxes.find((item) => item.index === Number(rawIndex))
    if (!box) throw new Error(`La casilla ${rawIndex} no está disponible.`)
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await sleep(450)
  }
}

async function clickVerify(page) {
  const frame = await challengeFrame(page)
  if (!frame) throw new Error('El reto ya no está visible.')
  for (const selector of ['.button-submit', 'button[type="submit"]', 'button', '[role="button"]']) {
    const handles = await frame.$$(selector)
    for (const handle of handles) {
      const label = await handle.evaluate((node) => `${node.textContent || ''} ${node.getAttribute('aria-label') || ''} ${node.getAttribute('title') || ''}`.trim())
      if (/verify|next|submit|skip/i.test(label)) {
        await handle.click()
        return
      }
    }
  }
  throw new Error('No se encontró el botón para verificar el reto.')
}

async function executeCommand(page, command) {
  const type = String(command?.type || '')
  if (type === 'tiles') {
    await clickTiles(page, Array.isArray(command.indexes) ? command.indexes : [])
    return
  }
  if (type === 'verify') {
    await clickVerify(page)
    return
  }
  if (type === 'click') {
    const x = Number(command.x)
    const y = Number(command.y)
    if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('Coordenadas no válidas.')
    await page.mouse.click(x, y)
    return
  }
  if (type === 'press') {
    await page.keyboard.press(String(command.key || 'Enter'))
    return
  }
  if (type === 'reload') {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 })
    return
  }
  if (type === 'close') return
  throw new Error('Comando no válido.')
}

async function runController(sessionId) {
  let browser = null
  const startedAt = Date.now()
  let screenshotBase64 = ''
  let lastScreenshotAt = 0
  let lastCommandId = null

  try {
    await writeState(sessionId, {
      status: 'launching', success: false, challenge: false,
      prompt: '', tileCount: 0, tileBoxes: [], buttons: [], elements: [],
      bodyText: '', frameText: '', frameUrls: [], screenshot: '',
      startedAt, updatedAt: Date.now(), lastCommandId: null,
    })

    chromium.setGraphicsMode = false
    const executablePath = await chromium.executablePath(CHROMIUM_PACK)
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--disable-blink-features=AutomationControlled',
        '--lang=en-US,en',
        '--window-size=1440,1000',
        '--no-first-run',
        '--no-default-browser-check',
      ],
      defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
      executablePath,
      headless: 'shell',
    })

    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36')
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
      'Sec-CH-UA': '"Chromium";v="149", "Google Chrome";v="149", "Not_A Brand";v="99"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"Windows"',
    })
    try { await page.emulateTimezone('Europe/Madrid') } catch { /* No es imprescindible. */ }
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en', 'es'] })
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] })
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 })
      Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 })
      window.chrome = window.chrome || { runtime: {} }
    })

    await page.goto(FORGOT_URL, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await page.waitForSelector('input[type="email"]', { timeout: 45000 })
    await page.click('input[type="email"]', { clickCount: 3 })
    await page.type('input[type="email"]', EMAIL, { delay: 55 })

    const buttons = await page.$$('button')
    let submitted = false
    for (const button of buttons) {
      const label = await button.evaluate((node) => (node.textContent || '').trim())
      if (/send reset code/i.test(label)) {
        await button.click()
        submitted = true
        break
      }
    }
    if (!submitted) throw new Error('No se encontró la acción para enviar el código.')

    await sleep(4500)

    while (Date.now() - startedAt < CONTROLLER_MAX_AGE_MS) {
      const now = Date.now()
      if (!screenshotBase64 || now - lastScreenshotAt >= 4500) {
        screenshotBase64 = await captureScreenshot(page).catch(() => screenshotBase64)
        lastScreenshotAt = now
      }

      const command = await cacheGetJson(commandKey(sessionId))
      let commandError = ''
      if (command?.id && command.id !== lastCommandId) {
        lastCommandId = command.id
        try {
          if (command.type === 'close') {
            const current = await pageState(page, screenshotBase64)
            await writeState(sessionId, {
              ...current,
              status: 'closed',
              startedAt,
              lastCommandId,
              commandError: '',
            })
            await cacheDelete(commandKey(sessionId))
            return
          }
          await executeCommand(page, command)
          await sleep(command.type === 'verify' ? 5500 : 1800)
          screenshotBase64 = await captureScreenshot(page).catch(() => screenshotBase64)
          lastScreenshotAt = Date.now()
        } catch (error) {
          commandError = error instanceof Error ? error.message : String(error)
        }
        await cacheDelete(commandKey(sessionId))
      }

      const current = await pageState(page, screenshotBase64)
      await writeState(sessionId, {
        ...current,
        startedAt,
        lastCommandId,
        commandError,
      })
      if (current.success) return
      await sleep(750)
    }

    const current = await pageState(page, screenshotBase64)
    await writeState(sessionId, {
      ...current,
      status: 'timeout',
      startedAt,
      lastCommandId,
      commandError: '',
    })
  } catch (error) {
    const previous = await readState(sessionId)
    await writeState(sessionId, {
      ...(previous || {}),
      status: 'error',
      success: false,
      error: error instanceof Error ? error.message : String(error),
      startedAt,
      updatedAt: Date.now(),
      lastCommandId,
    })
  } finally {
    if (browser) {
      try { await browser.close() } catch { /* El proceso puede haber terminado. */ }
    }
  }
}

async function startController(sessionId) {
  const existing = await readState(sessionId)
  if (existing && ['launching', 'waiting', 'challenge'].includes(existing.status) && Date.now() - Number(existing.updatedAt || 0) < 60_000) {
    return { started: false, reused: true, status: existing.status }
  }
  await cacheDelete(commandKey(sessionId))
  await writeState(sessionId, {
    status: 'queued', success: false, challenge: false,
    prompt: '', tileCount: 0, tileBoxes: [], buttons: [], elements: [],
    bodyText: '', frameText: '', frameUrls: [], screenshot: '',
    startedAt: Date.now(), updatedAt: Date.now(), lastCommandId: null,
  })
  waitUntil(runController(sessionId))
  return { started: true, reused: false, status: 'queued' }
}

async function stateResponse(sessionId) {
  const state = await readState(sessionId)
  if (!state) return json({ error: 'La sesión no existe o ha caducado.' }, 404)
  const { screenshot, ...visible } = state
  return json({ ...visible, hasScreenshot: Boolean(screenshot) })
}

async function screenshotResponse(sessionId) {
  const state = await readState(sessionId)
  if (!state?.screenshot) return json({ error: 'La captura todavía no está disponible.' }, 404)
  return new NextResponse(Buffer.from(state.screenshot, 'base64'), {
    status: 200,
    headers: responseHeaders({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `inline; filename="hc-${sessionId}.jpg"`,
    }),
  })
}

async function enqueueCommand(sessionId, input) {
  const state = await readState(sessionId)
  if (!state) return json({ error: 'La sesión no existe o ha caducado.' }, 404)
  if (['success', 'closed', 'error', 'timeout'].includes(state.status)) {
    return json({ error: `La sesión está en estado ${state.status}.` }, 409)
  }
  const pending = await cacheGetJson(commandKey(sessionId))
  if (pending?.id && pending.id !== state.lastCommandId) {
    return json({ error: 'Todavía hay un comando pendiente.', commandId: pending.id }, 409)
  }
  const command = {
    id: String(input.commandId || randomUUID()),
    type: String(input.command || input.type || ''),
    indexes: Array.isArray(input.indexes) ? input.indexes.map(Number) : [],
    x: input.x,
    y: input.y,
    key: input.key,
    createdAt: Date.now(),
  }
  await cacheSetJson(commandKey(sessionId), command)
  return json({ queued: true, commandId: command.id })
}

export async function GET(request) {
  if (process.env.VERCEL_ENV !== 'production') return new NextResponse(null, { status: 404 })
  try {
    const input = signedPayload(request)
    const sessionId = String(input.sessionId || '')
    if (!validSessionId(sessionId)) throw new Error('Identificador de sesión no válido.')

    if (input.action === 'start') return json(await startController(sessionId))
    if (input.action === 'state' || input.action === 'status') return stateResponse(sessionId)
    if (input.action === 'screenshot') return screenshotResponse(sessionId)
    if (input.action === 'command') return enqueueCommand(sessionId, input)
    if (['tiles', 'verify', 'click', 'press', 'reload', 'close'].includes(input.action)) {
      return enqueueCommand(sessionId, { ...input, command: input.action })
    }
    return json({ error: 'Acción no válida.' }, 400)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
}
