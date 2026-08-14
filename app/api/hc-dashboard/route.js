import { createPublicKey, verify as verifySignature } from 'node:crypto'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA5xxcEG8HcsUxO5thhqFfzvXnuOC8HAp1Uab4yfmsXVI=
-----END PUBLIC KEY-----`)
const MAX_AGE_MS = 15 * 60 * 1000
const TARGET_EMAIL = 'nacho.sanchezperez@gmail.com'

function json(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  })
}

function signedPayload(request) {
  const url = new URL(request.url)
  const encoded = url.searchParams.get('payload') || ''
  const signature = url.searchParams.get('sig') || ''
  if (!encoded || !signature) throw new Error('Firma ausente.')
  const valid = verifySignature(null, Buffer.from(encoded), PUBLIC_KEY, Buffer.from(signature, 'base64url'))
  if (!valid) throw new Error('Firma no válida.')
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  const timestamp = Number(payload?.ts)
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > MAX_AGE_MS) throw new Error('Firma caducada.')
  return payload
}

async function readBody(response) {
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return text.slice(0, 2000) }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function absoluteUrl(src, base) {
  try { return new URL(src, base).toString() } catch { return null }
}

async function discover() {
  const pageUrl = 'https://supabase.com/dashboard/sign-in'
  const pageResponse = await fetch(pageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 HiloCofradeDiagnostic/1.0', Accept: 'text/html' },
    cache: 'no-store',
  })
  const html = await pageResponse.text()
  if (!pageResponse.ok) throw new Error(`No se pudo leer el inicio de sesión (${pageResponse.status}).`)

  const scripts = unique([
    ...(html.match(/<script[^>]+src=["']([^"']+)["']/gi) || []).map((tag) => tag.match(/src=["']([^"']+)["']/i)?.[1]),
    ...(html.match(/(?:https?:\/\/|\/)_next\/static\/[^"'\s<>]+\.js/gi) || []),
  ].map((src) => absoluteUrl(src, pageUrl))).slice(0, 80)

  const texts = [html]
  const loaded = []
  for (const script of scripts) {
    try {
      const response = await fetch(script, {
        headers: { 'User-Agent': 'Mozilla/5.0 HiloCofradeDiagnostic/1.0' },
        cache: 'no-store',
      })
      if (!response.ok) continue
      const text = await response.text()
      if (text.length > 8_000_000) continue
      texts.push(text)
      loaded.push(script)
    } catch {
      // Continúa con los demás fragmentos.
    }
  }

  const corpus = texts.join('\n')
  const urls = unique(corpus.match(/https:\/\/[a-z0-9._~-]+(?:\/[a-zA-Z0-9._~!$&'()*+,;=:@%\/-]*)?/g) || [])
    .filter((value) => /supabase|gotrue|auth|api/i.test(value))
    .slice(0, 100)
  const jwtCandidates = unique(corpus.match(/eyJ[a-zA-Z0-9_-]{40,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/g) || [])
    .slice(0, 20)
  const markers = ['NEXT_PUBLIC_GOTRUE_URL', 'NEXT_PUBLIC_API_URL', 'platform/reset-password', 'xguihxuzqibwxjnimxev', 'supabase.dashboard.auth.token']
  const snippets = []
  for (const marker of markers) {
    let index = corpus.indexOf(marker)
    let count = 0
    while (index !== -1 && count < 5) {
      snippets.push(corpus.slice(Math.max(0, index - 180), Math.min(corpus.length, index + marker.length + 260)))
      index = corpus.indexOf(marker, index + marker.length)
      count += 1
    }
  }

  return {
    pageStatus: pageResponse.status,
    scriptCount: scripts.length,
    loadedCount: loaded.length,
    urls,
    jwtCandidates,
    snippets: unique(snippets).slice(0, 30),
  }
}

async function requestReset() {
  const attempts = []
  for (const endpoint of [
    'https://api.supabase.com/platform/reset-password',
    'https://api.supabase.com/v1/platform/reset-password',
    'https://supabase.com/api/platform/reset-password',
  ]) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: TARGET_EMAIL,
          hcaptchaToken: null,
          redirectTo: 'https://supabase.com/dashboard/reset-password',
        }),
        cache: 'no-store',
      })
      attempts.push({ endpoint, status: response.status, body: await readBody(response) })
    } catch (error) {
      attempts.push({ endpoint, error: error instanceof Error ? error.message : String(error) })
    }
  }
  return { attempts }
}

async function probe() {
  const targets = [
    'https://api.supabase.com/auth/v1/health',
    'https://api.supabase.com/auth/v1/settings',
    'https://auth.supabase.com/health',
    'https://auth.supabase.com/auth/v1/health',
    'https://xguihxuzqibwxjnimxev.supabase.co/auth/v1/health',
  ]
  const results = []
  for (const target of targets) {
    try {
      const response = await fetch(target, { cache: 'no-store' })
      results.push({ target, status: response.status, body: await readBody(response) })
    } catch (error) {
      results.push({ target, error: error instanceof Error ? error.message : String(error) })
    }
  }
  return { results }
}

export async function GET(request) {
  if (process.env.VERCEL_ENV !== 'production') return new NextResponse(null, { status: 404 })
  try {
    const payload = signedPayload(request)
    if (payload.action === 'discover') return json(await discover())
    if (payload.action === 'request-reset') return json(await requestReset())
    if (payload.action === 'probe') return json(await probe())
    return json({ error: 'Acción no válida.' }, 400)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
}
