import { createPublicKey, verify as verifySignature } from 'node:crypto'
import { NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA5xxcEG8HcsUxO5thhqFfzvXnuOC8HAp1Uab4yfmsXVI=
-----END PUBLIC KEY-----`)
const MAX_AGE_MS = 15 * 60 * 1000
const SESSION_MAX_AGE_MS = 8 * 60 * 1000
const EMAIL = 'nacho.sanchezperez@gmail.com'
const FORGOT_URL = 'https://supabase.com/dashboard/forgot-password'
const CHROMIUM_PACK = 'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar'

const sessions = globalThis.__hcCaptchaSessions || new Map()
globalThis.__hcCaptchaSessions = sessions

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

async function closeSession(sessionId) {
  const session = sessions.get(sessionId)
  sessions.delete(sessionId)
  if (!session) return
  try { await session.browser.close() } catch { /* El proceso puede haber terminado. */ }
}

async function purgeStaleSessions() {
  const now = Date.now()
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.createdAt > SESSION_MAX_AGE_MS) await closeSession(sessionId)
  }
}

async function challengeFrame(page) {
  return page.frames().find((frame) => /hcaptcha\.com|newassets\.hcaptcha\.com/.test(frame.url()) && /challenge|frame=challenge/.test(frame.url())) || null
}

async function stateOf(page) {
  let bodyText = ''
  try { bodyText = await page.locator('body').innerText({ timeout: 3000 }) } catch { /* La navegación puede estar en curso. */ }
  const success = /check your email for a reset code|reset code has been sent|email for a reset code/i.test(bodyText)
  const frame = await challengeFrame(page)
  let prompt = ''
  let frameText = ''
  let tileCount = 0
  if (frame) {
    try {
      frameText = await frame.locator('body').innerText({ timeout: 2500 })
      prompt = await frame.locator('.prompt-text, .challenge-prompt, h2, h1').first().innerText({ timeout: 1500 })
    } catch { /* El reto puede estar cambiando. */ }
    try { tileCount = await frame.locator('.task-image').count() } catch { /* Sin cuadrícula visible. */ }
  }
  return {
    success,
    challenge: Boolean(frame),
    prompt: prompt.trim(),
    tileCount,
    url: page.url(),
    bodyText: bodyText.slice(0, 1200),
    frameText: frameText.slice(0, 1200),
    frameUrls: page.frames().map((item) => item.url()).filter((item) => /hcaptcha/.test(item)).slice(0, 12),
  }
}

async function newBrowserSession(sessionId) {
  await closeSession(sessionId)
  chromium.setGraphicsMode = false
  const executablePath = await chromium.executablePath(CHROMIUM_PACK)
  const browser = await puppeteer.launch({
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

  sessions.set(sessionId, { browser, page, createdAt: Date.now() })
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
  await new Promise((resolve) => setTimeout(resolve, 9000))
  return stateOf(page)
}

async function sessionFor(sessionId) {
  const session = sessions.get(sessionId)
  if (!session) throw new Error('La sesión de navegador no está disponible en esta instancia.')
  return session
}

async function screenshot(sessionId) {
  const { page } = await sessionFor(sessionId)
  const buffer = await page.screenshot({ type: 'png', fullPage: false })
  return new NextResponse(buffer, {
    status: 200,
    headers: responseHeaders({
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="hc-${sessionId}.png"`,
    }),
  })
}

async function tileBoxes(page) {
  const frame = await challengeFrame(page)
  if (!frame) return []
  const handles = await frame.$$('.task-image')
  const boxes = []
  for (let index = 0; index < handles.length; index += 1) {
    const box = await handles[index].boundingBox()
    if (box) boxes.push({ index, ...box })
  }
  return boxes
}

async function clickTiles(sessionId, indexes) {
  const { page } = await sessionFor(sessionId)
  const boxes = await tileBoxes(page)
  for (const rawIndex of indexes || []) {
    const box = boxes.find((item) => item.index === Number(rawIndex))
    if (!box) throw new Error(`La casilla ${rawIndex} no está disponible.`)
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await new Promise((resolve) => setTimeout(resolve, 350))
  }
  return { boxes, state: await stateOf(page) }
}

async function clickVerify(sessionId) {
  const { page } = await sessionFor(sessionId)
  const frame = await challengeFrame(page)
  if (!frame) return stateOf(page)
  const selectors = ['.button-submit', 'button[type="submit"]', 'button']
  let clicked = false
  for (const selector of selectors) {
    const handles = await frame.$$(selector)
    for (const handle of handles) {
      const text = await handle.evaluate((node) => (node.textContent || '').trim())
      if (/verify|next|submit|skip/i.test(text)) {
        await handle.click()
        clicked = true
        break
      }
    }
    if (clicked) break
  }
  if (!clicked) throw new Error('No se encontró el botón para verificar el reto.')
  await new Promise((resolve) => setTimeout(resolve, 5500))
  const state = await stateOf(page)
  if (state.success) await closeSession(sessionId)
  return state
}

async function clickPoint(sessionId, x, y) {
  const { page } = await sessionFor(sessionId)
  await page.mouse.click(Number(x), Number(y))
  await new Promise((resolve) => setTimeout(resolve, 2500))
  return stateOf(page)
}

export async function GET(request) {
  if (process.env.VERCEL_ENV !== 'production') return new NextResponse(null, { status: 404 })
  try {
    await purgeStaleSessions()
    const input = signedPayload(request)
    const sessionId = String(input.sessionId || '')
    if (!validSessionId(sessionId)) throw new Error('Identificador de sesión no válido.')

    if (input.action === 'start') return json(await newBrowserSession(sessionId))
    if (input.action === 'status') {
      const { page } = await sessionFor(sessionId)
      return json({ ...(await stateOf(page)), boxes: await tileBoxes(page) })
    }
    if (input.action === 'screenshot') return screenshot(sessionId)
    if (input.action === 'tiles') return json(await clickTiles(sessionId, input.indexes))
    if (input.action === 'verify') return json(await clickVerify(sessionId))
    if (input.action === 'click') return json(await clickPoint(sessionId, input.x, input.y))
    if (input.action === 'close') {
      await closeSession(sessionId)
      return json({ closed: true })
    }
    return json({ error: 'Acción no válida.' }, 400)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
}
