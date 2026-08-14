import { createPublicKey, randomUUID, verify as verifySignature } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getCache } from '@vercel/functions'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA7DQ1wS/uY8q8FKg1gS3hvAqg6jbAyaWvZoofGC9CoYY=
-----END PUBLIC KEY-----`)
const MAX_AGE_MS = 15 * 60 * 1000
const CACHE_TTL_SECONDS = 12 * 60
const cache = getCache({ namespace: 'hc-captcha-v3' })

function headers(contentType = 'application/json') {
  return {
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Type': contentType,
  }
}

function json(body, status = 200) {
  return NextResponse.json(body, { status, headers: headers() })
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

async function readJson(key) {
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

async function writeJson(key, value) {
  await cache.set(key, JSON.stringify(value), {
    ttl: CACHE_TTL_SECONDS,
    name: 'Hilo Cofrade CAPTCHA temporal',
    tags: ['hc-captcha-temporal'],
  })
}

async function stateResponse(sessionId) {
  const state = await readJson(`${sessionId}:state`)
  if (!state) return json({ error: 'La sesión no existe o ha caducado.' }, 404)
  const { screenshot, ...visible } = state
  return json({ ...visible, hasScreenshot: Boolean(screenshot) })
}

async function commandResponse(sessionId, input) {
  const state = await readJson(`${sessionId}:state`)
  if (!state) return json({ error: 'La sesión no existe o ha caducado.' }, 404)
  const command = {
    id: String(input.commandId || randomUUID()),
    type: String(input.command || input.type || input.action || ''),
    indexes: Array.isArray(input.indexes) ? input.indexes.map(Number) : [],
    x: input.x,
    y: input.y,
    key: input.key,
    createdAt: Date.now(),
  }
  await writeJson(`${sessionId}:command`, command)
  return json({ queued: true, commandId: command.id })
}

async function thumbnailResponse(sessionId, asBase64) {
  const state = await readJson(`${sessionId}:state`)
  if (!state?.screenshot) return json({ error: 'La captura no está disponible.' }, 404)
  const image = await sharp(Buffer.from(state.screenshot, 'base64'))
    .resize({ width: 720, withoutEnlargement: true })
    .jpeg({ quality: 58, mozjpeg: true })
    .toBuffer()
  if (asBase64) {
    return new NextResponse(image.toString('base64'), {
      status: 200,
      headers: headers('text/plain; charset=utf-8'),
    })
  }
  return new NextResponse(image, {
    status: 200,
    headers: headers('image/jpeg'),
  })
}

export async function GET(request) {
  if (process.env.VERCEL_ENV !== 'production') return new NextResponse(null, { status: 404 })
  try {
    const input = signedPayload(request)
    const sessionId = String(input.sessionId || '')
    if (!/^[a-z0-9-]{8,80}$/i.test(sessionId)) throw new Error('Identificador de sesión no válido.')
    if (input.action === 'state') return stateResponse(sessionId)
    if (input.action === 'thumbnail') return thumbnailResponse(sessionId, input.format === 'base64')
    if (['click', 'tiles', 'verify', 'press', 'reload', 'close'].includes(input.action)) {
      return commandResponse(sessionId, input)
    }
    if (input.action === 'command') return commandResponse(sessionId, input)
    return json({ error: 'Acción no válida.' }, 400)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
}
