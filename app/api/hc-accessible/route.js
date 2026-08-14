import { createPublicKey, randomUUID, verify as verifySignature } from 'node:crypto'
import { NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium-min'
import { getCache, waitUntil } from '@vercel/functions'
import puppeteer from 'puppeteer-core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA7DQ1wS/uY8q8FKg1gS3hvAqg6jbAyaWvZoofGC9CoYY=
-----END PUBLIC KEY-----`)
const MAX_AGE_MS = 15 * 60 * 1000
const CONTROLLER_MAX_AGE_MS = 270 * 1000
const CACHE_TTL_SECONDS = 12 * 60
const EMAIL = 'nacho.sanchezperez@gmail.com'
const FORGOT_URL = 'https://supabase.com/dashboard/forgot-password'
const CHROMIUM_PACK = 'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar'
const cache = getCache({ namespace: 'hc-accessible-v1' })

function responseHeaders() {
  return { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
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
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > MAX_AGE_MS) throw new Error('Firma caducada.')
  return payload
}

function validSessionId(value) {
  return /^[a-z0-9-]{8,80}$/i.test(String(value || ''))
}

function stateKey(sessionId) { return `${sessionId}:state` }
function commandKey(sessionId) { return `${sessionId}:command` }

async function setJson(key, value) {
  await cache.set(key, JSON.stringify(value), {
    ttl: CACHE_TTL_SECONDS,
    name: 'Hilo Cofrade acceso Supabase temporal',
    tags: ['hc-accessible-temporal'],
  })
}

async function getJson(key) {
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

async function deleteKey(key) {
  try { await cache.delete(key) } catch { /* Caducará automáticamente. */ }
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function hcaptchaFrames(page) {
  return page.frames().filter((frame) => /hcaptcha\.com|newassets\.hcaptcha\.com/.test(frame.url()))
}

async function visibleInteractive(frame) {
  try {
    return await frame.evaluate(() => {
      const visible = (node) => {
        const rect = node.getBoundingClientRect()
        const style = window.getComputedStyle(node)
        return rect.width > 3 && rect.height > 3 && style.visibility !== 'hidden' && style.display !== 'none'
      }
      return Array.from(document.querySelectorAll('button, a, [role="button"], [tabindex="0"], input, textarea'))
        .filter(visible)
        .slice(0, 160)
        .map((node, index) => ({
          index,
          tag: node.tagName,
          text: (node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 240),
          ariaLabel: node.getAttribute('aria-label') || '',
          title: node.getAttribute('title') || '',
          type: node.getAttribute('type') || '',
          name: node.getAttribute('name') || '',
          placeholder: node.getAttribute('placeholder') || '',
          value: 'value' in node ? String(node.value || '').slice(0, 120) : '',
          href: node.getAttribute('href') || '',
        }))
    })
  } catch {
    return []
  }
}

async function frameText(frame) {
  try {
    return await frame.evaluate(() => (document.body?.innerText || document.body?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 5000))
  } catch {
    return ''
  }
}

async function collectState(browser, page, extra = {}) {
  const pages = await browser.pages()
  const pageStates = []
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const current = pages[pageIndex]
    let bodyText = ''
    try { bodyText = await current.locator('body').innerText({ timeout: 2200 }) } catch { /* Puede estar navegando. */ }
    const frames = []
    for (const frame of hcaptchaFrames(current)) {
      frames.push({
        url: frame.url(),
        text: await frameText(frame),
        interactive: await visibleInteractive(frame),
      })
    }
    pageStates.push({
      pageIndex,
      url: current.url(),
      title: await current.title().catch(() => ''),
      bodyText: bodyText.slice(0, 5000),
      frames,
    })
  }
  const combined = JSON.stringify(pageStates)
  const success = /check your email|reset code has been sent|email for a reset code|check your inbox/i.test(combined)
  return {
    status: success ? 'success' : 'active',
    success,
    pages: pageStates,
    updatedAt: Date.now(),
    ...extra,
  }
}

async function clickByLabel(pages, label) {
  const needle = String(label || '').trim().toLowerCase()
  if (!needle) throw new Error('Falta la etiqueta del elemento.')
  for (const page of pages) {
    const targets = [page, ...hcaptchaFrames(page)]
    for (const target of targets) {
      const handles = await target.$$('button, a, [role="button"], [tabindex="0"]')
      for (const handle of handles) {
        const value = await handle.evaluate((node) => `${node.textContent || ''} ${node.getAttribute('aria-label') || ''} ${node.getAttribute('title') || ''}`.replace(/\s+/g, ' ').trim().toLowerCase()).catch(() => '')
        if (value.includes(needle)) {
          await handle.click()
          return { clicked: value.slice(0, 300) }
        }
      }
    }
  }
  throw new Error(`No se encontró un elemento con «${label}».`)
}

async function clickInteractiveIndex(pages, pageIndex, frameIndex, interactiveIndex) {
  const page = pages[Number(pageIndex)]
  if (!page) throw new Error('Página no válida.')
  const target = frameIndex === null || frameIndex === undefined
    ? page
    : hcaptchaFrames(page)[Number(frameIndex)]
  if (!target) throw new Error('Marco no válido.')
  const handles = await target.$$('button, a, [role="button"], [tabindex="0"], input, textarea')
  const handle = handles[Number(interactiveIndex)]
  if (!handle) throw new Error('Elemento no válido.')
  await handle.click()
}

async function typeInto(pages, input) {
  const page = pages[Number(input.pageIndex || 0)] || pages[0]
  const target = input.frameIndex === null || input.frameIndex === undefined
    ? page
    : hcaptchaFrames(page)[Number(input.frameIndex)]
  if (!target) throw new Error('Marco no válido.')
  let handle = null
  if (input.selector) handle = await target.$(String(input.selector))
  if (!handle) {
    const handles = await target.$$('input:not([type="hidden"]), textarea')
    handle = handles[Number(input.inputIndex || 0)] || null
  }
  if (!handle) throw new Error('No se encontró un campo de texto.')
  await handle.click({ clickCount: 3 })
  await handle.type(String(input.text || ''), { delay: 45 })
}

async function autoOpenAccessible(browser, page) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const pages = await browser.pages()
    try {
      await clickByLabel(pages, 'Accessibility Options')
      await sleep(1600)
    } catch { /* Puede no estar visible todavía. */ }
    try {
      const result = await clickByLabel(await browser.pages(), 'Text Challenge')
      await sleep(2200)
      return result
    } catch { /* El menú puede requerir una segunda inspección. */ }
    try {
      const result = await clickByLabel(await browser.pages(), 'Accessibility: Text Challenge')
      await sleep(2200)
      return result
    } catch { /* Continúa. */ }
    await sleep(900)
  }
  return null
}

async function executeCommand(browser, page, command) {
  const pages = await browser.pages()
  if (command.type === 'click-label') return clickByLabel(pages, command.label)
  if (command.type === 'click-index') {
    await clickInteractiveIndex(pages, command.pageIndex, command.frameIndex, command.interactiveIndex)
    return { clicked: true }
  }
  if (command.type === 'type') {
    await typeInto(pages, command)
    return { typed: true }
  }
  if (command.type === 'press') {
    const selected = pages[Number(command.pageIndex || 0)] || page
    await selected.keyboard.press(String(command.key || 'Enter'))
    return { pressed: command.key || 'Enter' }
  }
  if (command.type === 'reload') {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 })
    return { reloaded: true }
  }
  if (command.type === 'auto-accessible') return autoOpenAccessible(browser, page)
  if (command.type === 'close') return { close: true }
  throw new Error('Comando no válido.')
}

async function runController(sessionId) {
  let browser = null
  const startedAt = Date.now()
  let lastCommandId = null
  try {
    await setJson(stateKey(sessionId), { status: 'launching', success: false, pages: [], startedAt, updatedAt: Date.now() })
    chromium.setGraphicsMode = false
    const executablePath = await chromium.executablePath(CHROMIUM_PACK)
    browser = await puppeteer.launch({
      args: [...chromium.args, '--disable-blink-features=AutomationControlled', '--lang=en-US,en', '--window-size=1440,1000'],
      defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
      executablePath,
      headless: 'shell',
    })
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36')
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9,es;q=0.8' })
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en', 'es'] })
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] })
      window.chrome = window.chrome || { runtime: {} }
    })
    await page.goto(FORGOT_URL, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await page.waitForSelector('input[type="email"]', { timeout: 45000 })
    await page.click('input[type="email"]', { clickCount: 3 })
    await page.type('input[type="email"]', EMAIL, { delay: 55 })
    await clickByLabel([page], 'Send reset code')
    await sleep(4500)
    const autoResult = await autoOpenAccessible(browser, page)
    await setJson(stateKey(sessionId), await collectState(browser, page, { startedAt, lastCommandId, autoResult }))

    while (Date.now() - startedAt < CONTROLLER_MAX_AGE_MS) {
      const command = await getJson(commandKey(sessionId))
      let commandResult = null
      let commandError = ''
      if (command?.id && command.id !== lastCommandId) {
        lastCommandId = command.id
        try {
          commandResult = await executeCommand(browser, page, command)
          if (commandResult?.close) {
            await setJson(stateKey(sessionId), await collectState(browser, page, { status: 'closed', startedAt, lastCommandId, commandResult }))
            await deleteKey(commandKey(sessionId))
            return
          }
          await sleep(2200)
        } catch (error) {
          commandError = error instanceof Error ? error.message : String(error)
        }
        await deleteKey(commandKey(sessionId))
      }
      const state = await collectState(browser, page, { startedAt, lastCommandId, commandResult, commandError })
      await setJson(stateKey(sessionId), state)
      if (state.success) return
      await sleep(800)
    }
    await setJson(stateKey(sessionId), await collectState(browser, page, { status: 'timeout', startedAt, lastCommandId }))
  } catch (error) {
    await setJson(stateKey(sessionId), {
      status: 'error', success: false, pages: [], startedAt, updatedAt: Date.now(), lastCommandId,
      error: error instanceof Error ? error.message : String(error),
    })
  } finally {
    if (browser) {
      try { await browser.close() } catch { /* Ya puede estar cerrado. */ }
    }
  }
}

async function start(sessionId) {
  await deleteKey(commandKey(sessionId))
  await setJson(stateKey(sessionId), { status: 'queued', success: false, pages: [], startedAt: Date.now(), updatedAt: Date.now() })
  waitUntil(runController(sessionId))
  return json({ started: true, status: 'queued' })
}

async function state(sessionId) {
  const value = await getJson(stateKey(sessionId))
  if (!value) return json({ error: 'La sesión no existe o ha caducado.' }, 404)
  return json(value)
}

async function command(sessionId, input) {
  const current = await getJson(stateKey(sessionId))
  if (!current) return json({ error: 'La sesión no existe o ha caducado.' }, 404)
  const value = {
    id: String(input.commandId || randomUUID()),
    type: String(input.command || ''),
    label: input.label,
    text: input.text,
    selector: input.selector,
    pageIndex: input.pageIndex,
    frameIndex: input.frameIndex,
    inputIndex: input.inputIndex,
    interactiveIndex: input.interactiveIndex,
    key: input.key,
    createdAt: Date.now(),
  }
  await setJson(commandKey(sessionId), value)
  return json({ queued: true, commandId: value.id })
}

export async function GET(request) {
  if (process.env.VERCEL_ENV !== 'production') return new NextResponse(null, { status: 404 })
  try {
    const input = signedPayload(request)
    const sessionId = String(input.sessionId || '')
    if (!validSessionId(sessionId)) throw new Error('Identificador de sesión no válido.')
    if (input.action === 'start') return start(sessionId)
    if (input.action === 'state') return state(sessionId)
    if (input.action === 'command') return command(sessionId, input)
    return json({ error: 'Acción no válida.' }, 400)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
}
