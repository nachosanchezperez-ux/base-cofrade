import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { parseContributionForm } from '../lib/contributions/validation.js'

// Exercise the actual module in Node; the server-only marker belongs to the
// Next.js module boundary and is the only import omitted in this test harness.
const source = (await readFile(new URL('../lib/contributions/security.js', import.meta.url), 'utf8'))
  .replace("import 'server-only'", '')
  .replace("'./config.js'", JSON.stringify(new URL('../lib/contributions/config.js', import.meta.url).href))
const security = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)

test('ticket, readiness y Turnstile fallan cerrados', async (t) => {
  const envNames = ['CONTRIBUTION_FORM_SECRET', 'TURNSTILE_SECRET_KEY', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
    'SUPABASE_SECRET_KEY', 'NEXT_PUBLIC_SUPABASE_URL', 'PUBLIC_CONTRIBUTIONS_ENABLED']
  const original = Object.fromEntries(envNames.map((name) => [name, process.env[name]]))
  const originalFetch = globalThis.fetch
  t.after(() => {
    for (const name of envNames) {
      if (original[name] === undefined) delete process.env[name]
      else process.env[name] = original[name]
    }
    globalThis.fetch = originalFetch
  })
  // Fixtures are scoped to this process, never used for a deployment or request.
  process.env.TURNSTILE_SECRET_KEY = 'local-test-only'
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'local-test-only'
  process.env.SUPABASE_SECRET_KEY = 'local-test-only'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://local-test.invalid'
  process.env.PUBLIC_CONTRIBUTIONS_ENABLED = 'true'
  delete process.env.CONTRIBUTION_FORM_SECRET
  assert.equal(security.contributionReadiness().enabled, false)
  assert.equal(security.createContributionFormTicket(), '')
  process.env.CONTRIBUTION_FORM_SECRET = 'short'
  assert.equal(security.contributionReadiness().enabled, false)
  process.env.CONTRIBUTION_FORM_SECRET = 'a'.repeat(32)
  assert.equal(security.contributionReadiness().enabled, true)
  const issued = 100_000
  const ticket = security.createContributionFormTicket(issued)
  assert.equal(security.verifyContributionFormTicket(ticket, issued + 2999), false)
  assert.equal(security.verifyContributionFormTicket(ticket, issued + 3000), true)
  assert.equal(security.verifyContributionFormTicket(ticket, issued + 45 * 60_000), true)
  assert.equal(security.verifyContributionFormTicket(ticket, issued + 45 * 60_000 + 1), false)
  assert.equal(security.verifyContributionFormTicket(ticket + 'x', issued + 3000), false)
  assert.equal(security.verifyContributionFormTicket(ticket, issued - 1), false)
  assert.notEqual(security.createContributionFormTicket(issued), ticket)
  assert.match(security.contributionFingerprint('127.0.0.1'), /^[a-f0-9]{64}$/)
  const headers = new Headers({ origin: 'https://hilocofrade.es', host: 'hilocofrade.es', 'sec-fetch-site': 'same-origin' })
  assert.equal(security.hasTrustedContributionOrigin(headers), true)
  headers.set('origin', 'https://untrusted.invalid')
  assert.equal(security.hasTrustedContributionOrigin(headers), false)
  assert.equal(security.hasTrustedContributionOrigin(new Headers()), false)

  const input = { token: 'mock-token', expectedHostname: 'hilocofrade.es' }
  let calls = 0
  globalThis.fetch = async () => { calls += 1; return { ok: true, json: async () => ({ success: true, action: 'public_contribution', hostname: 'hilocofrade.es' }) } }
  assert.equal(await security.verifyTurnstile({ ...input, token: '' }), false)
  assert.equal(await security.verifyTurnstile({ ...input, expectedHostname: '' }), false)
  assert.equal(calls, 0)
  assert.equal(await security.verifyTurnstile(input), true)
  for (const result of [
    { success: false },
    { success: 'true', action: 'public_contribution', hostname: 'hilocofrade.es' },
    { success: true, action: 'wrong', hostname: 'hilocofrade.es' },
    { success: true, action: 'public_contribution', hostname: 'untrusted.invalid' },
  ]) {
    globalThis.fetch = async () => ({ ok: true, json: async () => result })
    assert.equal(await security.verifyTurnstile(input), false)
  }
  globalThis.fetch = async () => ({ ok: false })
  assert.equal(await security.verifyTurnstile(input), false)
  globalThis.fetch = async () => { throw new Error('Unavailable') }
  assert.equal(await security.verifyTurnstile(input), false)
  globalThis.fetch = async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON') } })
  assert.equal(await security.verifyTurnstile(input), false)
})

test('el consentimiento exige una única confirmación afirmativa', () => {
  const form = new FormData()
  for (const [name, value] of Object.entries({ contribution_type: 'suggestion', title: 'Prueba de consentimiento',
    description: 'Prueba local sin crear ni enviar una aportación pública.' })) form.set(name, value)
  for (const value of ['', 'false', 'off', '0', 'true']) {
    form.set('privacy_consent', value)
    assert.throws(() => parseContributionForm(form), /aceptar el tratamiento/i)
  }
  form.set('privacy_consent', 'on')
  assert.equal(parseContributionForm(form).contactEmail, null)
  form.append('privacy_consent', 'on')
  assert.throws(() => parseContributionForm(form), /aceptar el tratamiento/i)
})
