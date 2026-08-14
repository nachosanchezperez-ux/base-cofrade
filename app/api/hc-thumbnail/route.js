import { createPublicKey, verify as verifySignature } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getCache } from '@vercel/functions'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA5xxcEG8HcsUxO5thhqFfzvXnuOC8HAp1Uab4yfmsXVI=
-----END PUBLIC KEY-----`)
const MAX_AGE_MS = 15 * 60 * 1000
const cache = getCache({ namespace: 'hc-captcha-v3' })

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

async function readState(sessionId) {
  const value = await cache.get(`${sessionId}:state`)
  if (value === undefined || value === null) return null
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return null }
  }
  if (Buffer.isBuffer(value)) {
    try { return JSON.parse(value.toString('utf8')) } catch { return null }
  }
  return value
}

function noStore(contentType) {
  return {
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Type': contentType,
  }
}

export async function GET(request) {
  if (process.env.VERCEL_ENV !== 'production') return new NextResponse(null, { status: 404 })
  try {
    const payload = signedPayload(request)
    const sessionId = String(payload.sessionId || '')
    if (!/^[a-z0-9-]{8,80}$/i.test(sessionId)) throw new Error('Identificador de sesión no válido.')
    const state = await readState(sessionId)
    if (!state?.screenshot) throw new Error('La captura no está disponible.')

    const source = Buffer.from(state.screenshot, 'base64')
    const image = await sharp(source)
      .resize({ width: 720, withoutEnlargement: true })
      .jpeg({ quality: 55, mozjpeg: true })
      .toBuffer()

    if (payload.format === 'base64') {
      return new NextResponse(image.toString('base64'), {
        status: 200,
        headers: noStore('text/plain; charset=utf-8'),
      })
    }

    return new NextResponse(image, {
      status: 200,
      headers: {
        ...noStore('image/jpeg'),
        'Content-Disposition': `inline; filename="hc-${sessionId}-thumbnail.jpg"`,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: noStore('application/json') }
    )
  }
}
