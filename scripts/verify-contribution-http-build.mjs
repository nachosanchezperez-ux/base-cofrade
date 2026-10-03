// Read-only HTTP checks against the real build; no database credentials,
// browser emulation, receipt activation or external maintenance requests.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { once } from 'node:events'

const TEST_SECRET = 'synthetic-runtime-check-only-not-a-real-secret'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function withServer(mode, check) {
  const reservation = createServer()
  reservation.listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const port = reservation.address().port
  await new Promise((resolve) => reservation.close(resolve))
  const child = spawn(process.execPath, [
    'node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port),
  ], {
    env: {
      ...process.env,
      VERCEL_ENV: mode,
      PUBLIC_CONTRIBUTIONS_ENABLED: 'false',
      CONTRIBUTION_RETENTION_ENABLED: 'false',
      CRON_SECRET: mode === 'preview' ? TEST_SECRET : '',
      CONTRIBUTION_FORM_SECRET: '', TURNSTILE_SECRET_KEY: '', NEXT_PUBLIC_TURNSTILE_SITE_KEY: '',
      SUPABASE_SECRET_KEY: '', SUPABASE_SERVICE_ROLE_KEY: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  // Drain output without printing environment/runtime details.
  child.stdout.resume()
  child.stderr.resume()
  let exited = false
  let launchError = false
  const completion = new Promise((resolve) => {
    child.once('error', () => { launchError = true; exited = true; resolve() })
    child.once('exit', () => { exited = true; resolve() })
  })
  const origin = `http://127.0.0.1:${port}`
  try {
    let ready = false
    const deadline = Date.now() + 25_000
    while (Date.now() < deadline && !exited) {
      try {
        const response = await fetch(`${origin}/api/cron/contributions-retention`, { signal: AbortSignal.timeout(2000) })
        await response.arrayBuffer()
        ready = true
        break
      } catch { await delay(100) }
    }
    assert.ok(ready && !launchError, 'Compiled server must become available')
    await check(origin)
  } finally {
    if (!exited) child.kill('SIGTERM')
    const stopped = await Promise.race([completion.then(() => true), delay(2000).then(() => false)])
    if (!stopped) child.kill('SIGKILL')
    await completion
  }
}

async function maintenance(origin, authorization, status, error) {
  const response = await fetch(`${origin}/api/cron/contributions-retention`, {
    headers: authorization ? { authorization } : {}, signal: AbortSignal.timeout(5000),
  })
  assert.equal(response.status, status)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
  assert.deepEqual(await response.json(), { error })
}

await withServer('production', async (origin) => {
  await maintenance(origin, null, 401, 'Unauthorized')
  await maintenance(origin, `Bearer ${TEST_SECRET}`, 401, 'Unauthorized')
  const response = await fetch(`${origin}/colabora`, { signal: AbortSignal.timeout(5000) })
  assert.equal(response.status, 200)
  const html = await response.text()
  assert.match(html, /Las aportaciones públicas aún no están abiertas/)
  assert.match(html, /<meta name="robots" content="noindex, follow"/)
  assert.doesNotMatch(html, /<form\b/)
  console.log('PASS compiled HTTP: production closed; maintenance unauthorized')
})

await withServer('preview', async (origin) => {
  await maintenance(origin, null, 401, 'Unauthorized')
  await maintenance(origin, 'Bearer wrong', 401, 'Unauthorized')
  await maintenance(origin, `Bearer ${TEST_SECRET}`, 503, 'Unavailable')
  const response = await fetch(`${origin}/colabora`, { signal: AbortSignal.timeout(5000) })
  assert.equal(response.status, 200)
  const html = await response.text()
  assert.equal((html.match(/name="contribution_kind"/g) || []).length, 5)
  assert.match(html, /<meta name="robots" content="noindex, follow"/)
  assert.match(html, /<button(?=[^>]*type="submit")(?=[^>]*disabled)[^>]*>/)
  console.log('PASS compiled HTTP: preview has five options, disabled submit; authorized maintenance disabled')
})
