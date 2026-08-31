import 'server-only'

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { CONTRIBUTION_TURNSTILE_ACTION } from './config.js'

const MIN_FORM_AGE_MS = 3_000
const MAX_FORM_AGE_MS = 45 * 60_000

function securitySecret() {
  return process.env.CONTRIBUTION_FORM_SECRET || process.env.TURNSTILE_SECRET_KEY || ''
}

function hmac(value, purpose) {
  const secret = securitySecret()
  if (!secret) return ''
  return createHmac('sha256', secret).update(`${purpose}\0${value}`).digest('base64url')
}

export function contributionReadiness() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
  const secretKey = process.env.TURNSTILE_SECRET_KEY || ''
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return {
    siteKey,
    enabled: process.env.PUBLIC_CONTRIBUTIONS_ENABLED === 'true'
      && Boolean(siteKey && secretKey && supabaseSecret && process.env.NEXT_PUBLIC_SUPABASE_URL),
  }
}

export function createContributionFormTicket(now = Date.now()) {
  if (!securitySecret()) return ''
  const payload = `${now}.${randomBytes(16).toString('base64url')}`
  return `${payload}.${hmac(payload, 'form-ticket')}`
}

export function verifyContributionFormTicket(ticket, now = Date.now()) {
  const parts = String(ticket || '').split('.')
  if (parts.length !== 3) return false
  const payload = `${parts[0]}.${parts[1]}`
  const expected = hmac(payload, 'form-ticket')
  if (!expected) return false

  const providedBuffer = Buffer.from(parts[2])
  const expectedBuffer = Buffer.from(expected)
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) return false

  const issuedAt = Number(parts[0])
  const age = now - issuedAt
  return Number.isSafeInteger(issuedAt) && age >= MIN_FORM_AGE_MS && age <= MAX_FORM_AGE_MS
}

export function contributionFingerprint(ipAddress, userAgent = '') {
  const source = ipAddress ? `ip:${ipAddress}` : `ua:${String(userAgent).slice(0, 300)}`
  const digest = hmac(source, 'rate-limit')
  return digest ? Buffer.from(digest, 'base64url').toString('hex') : ''
}

export function requestIp(requestHeaders) {
  const forwarded = requestHeaders.get('x-forwarded-for') || requestHeaders.get('x-real-ip') || ''
  return forwarded.split(',')[0].trim().slice(0, 64)
}

export function hasTrustedContributionOrigin(requestHeaders) {
  const origin = requestHeaders.get('origin')
  const host = (requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || '').split(',')[0].trim()
  const fetchSite = requestHeaders.get('sec-fetch-site')
  if (!origin || !host) return false
  if (fetchSite && !['same-origin', 'none'].includes(fetchSite)) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function verifyTurnstile({ token, remoteIp, expectedHostname }) {
  const secret = process.env.TURNSTILE_SECRET_KEY || ''
  if (!secret || !token || token.length > 2048) return false

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6_000)
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: controller.signal,
      cache: 'no-store',
    })
    if (!response.ok) return false
    const result = await response.json()
    if (!result.success || result.action !== CONTRIBUTION_TURNSTILE_ACTION) return false
    if (expectedHostname && result.hostname !== expectedHostname.split(':')[0]) return false
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

