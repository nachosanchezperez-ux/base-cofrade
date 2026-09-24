// Full Next build against a deliberately unavailable LOCAL backend.
// No production credentials are inherited. Run separately from npm test.
// --observe records a baseline; default requires zero backend calls.
// --debug-prerender continues after route errors. Never deploy its build output.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { mkdtemp, writeFile, rm, readFile, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const cwd = fileURLToPath(new URL('../', import.meta.url))
// Next loads these independently of the child environment whitelist.
const envFiles = (await readdir(cwd)).filter((name) => /^\.env(?:\.(?:local|production|production\.local))?$/.test(name))
assert.equal(envFiles.length, 0, 'Run in an isolated worktree without Next environment files')
const scratch = await mkdtemp(path.join(tmpdir(), 'hc-build-outage-'))
const calls = new Map()
let failing = true
let server
const backend = createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost')
  const label = url.pathname + (url.searchParams.has('entity_type') ? ` [${url.searchParams.get('entity_type')}]` : '')
  calls.set(label, (calls.get(label) || 0) + 1)
  response.setHeader('Content-Type', 'application/json')
  if (failing) {
    response.writeHead(503)
    response.end(JSON.stringify({ message: 'LOCAL_OUTAGE_FIXTURE' }))
    return
  }
  let rows = []
  if (url.pathname === '/rest/v1/entities' && url.searchParams.get('entity_type') === 'eq.band') {
    rows = [{ id: 'qa-band', name: 'Banda de prueba local', slug: 'banda-qa', summary: 'Contenido de prueba' }]
  } else if (url.pathname === '/rest/v1/bands') {
    rows = [{ entity_id: 'qa-band', band_type: 'Banda de Música' }]
  }
  response.end(JSON.stringify(rows))
})
await new Promise((resolve) => backend.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${backend.address().port}`
const guard = path.join(scratch, 'network-guard.cjs')
await writeFile(guard, `const original = global.fetch;
global.fetch = function(input, init) {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.origin !== ${JSON.stringify(origin)}) throw new Error('Outage test blocked external fetch: ' + url.origin);
  return original(input, init);
};\n`)
const env = Object.fromEntries(['PATH', 'HOME', 'TMPDIR', 'LANG', 'LD_LIBRARY_PATH'].filter((key) => process.env[key]).map((key) => [key, process.env[key]]))
Object.assign(env, {
  NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1',
  NODE_OPTIONS: `--require=${guard}`,
  NEXT_PUBLIC_SUPABASE_URL: origin,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'local-qa-not-a-credential',
  SUPABASE_SECRET_KEY: 'local-qa-not-a-credential',
  SUPABASE_SERVICE_ROLE_KEY: 'local-qa-not-a-credential',
  SUPABASE_PUBLIC_QUERY_TIMEOUT_MS: '1000', SUPABASE_PUBLIC_QUERY_TOTAL_TIMEOUT_MS: '2500',
})
let build
let timedOut = false
let output = ''
try {
  // Prevent previous valid data from masking cold-build dependencies.
  await rm(path.join(cwd, '.next'), { recursive: true, force: true })
  build = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build', ...(process.argv.includes('--debug-prerender') ? ['--debug-prerender'] : [])], { cwd, env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] })
  build.stdout.on('data', (data) => { output += data })
  build.stderr.on('data', (data) => { output += data })
  const timeout = setTimeout(() => { timedOut = true; process.kill(-build.pid, 'SIGTERM') }, 240000)
  const [exitCode] = await once(build, 'exit')
  clearTimeout(timeout)
  let prerendered = []
  try { prerendered = Object.keys(JSON.parse(await readFile(path.join(cwd, '.next/prerender-manifest.json'), 'utf8')).routes) } catch {}
  const result = { timestamp: new Date().toISOString(), mode: 'local-http-503', debugPrerender: process.argv.includes('--debug-prerender'), exitCode, timedOut,
    requestCount: [...calls.values()].reduce((a, b) => a + b, 0), requests: Object.fromEntries(calls), prerendered,
    failures: output.split('\n').filter((line) => /Failed to build|Error occurred prerendering|Export encountered|blocked external fetch/.test(line)),
    logPath: path.join(scratch, 'build.log') }
  await writeFile(result.logPath, output)
  await writeFile(path.join(scratch, 'result.json'), JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result, null, 2))
  assert.equal(exitCode, 0, `Build failed: ${result.logPath}`)
  if (!process.argv.includes('--observe')) assert.equal(result.requestCount, 0, 'Cold build must not query the unavailable backend')
  if (process.argv.includes('--runtime')) {
    const probe = createServer()
    await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve))
    const port = probe.address().port
    await new Promise((resolve) => probe.close(resolve))
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] })
    let runtimeLog = ''
    server.stderr.on('data', (data) => { runtimeLog += data })
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Next server did not start')), 20000)
      server.once('exit', () => { clearTimeout(timer); reject(new Error(runtimeLog)) })
      server.stdout.on('data', (data) => {
        runtimeLog += data
        if (runtimeLog.includes('Ready in')) { clearTimeout(timer); resolve() }
      })
    })
    const routes = ['/', '/bandas', '/crucetas-musicales', '/directorio', '/extraordinarias', '/hermandades', '/hermandades/semana-santa', '/hermandades/gloria', '/hermandades/sacramentales', '/hermandades/agrupaciones-parroquiales', '/imagenes', '/pasos', '/marchas', '/igualas-y-ensayos', '/procesiones-de-gloria', '/hermandades/el-baratillo']
    const outcomes = []
    async function request(route) {
      const response = await fetch(`http://127.0.0.1:${port}${route}`, { signal: AbortSignal.timeout(30000) })
      return { status: response.status, html: await response.text() }
    }
    try {
      for (const route of routes) {
        const response = await request(route)
        assert.equal(response.status, 500, `Cold outage must fail explicitly: ${route}`)
        assert.doesNotMatch(response.html, /LOCAL_OUTAGE_FIXTURE/)
        outcomes.push({ route, coldOutage: response.status })
        console.log(`PASS: ${route} cold outage ${response.status}`)
      }
      failing = false
      const recovered = await request('/bandas')
      assert.equal(recovered.status, 200)
      assert.match(recovered.html, /Banda de prueba local/)
      assert.match(recovered.html, /rel="canonical" href="https:\/\/hilocofrade.es\/bandas"/)
      const callsAfterRecovery = [...calls.values()].reduce((a,b) => a+b, 0)
      failing = true
      const cached = await request('/bandas')
      assert.equal(cached.status, 200)
      assert.match(cached.html, /Banda de prueba local/)
      assert.equal([...calls.values()].reduce((a,b) => a+b, 0), callsAfterRecovery, 'Warm cache must avoid backend calls')
      failing = false
      const emptyCalendar = await request('/igualas-y-ensayos')
      assert.equal(emptyCalendar.status, 200, 'A successful empty result is valid and retry must recover')
      await writeFile(path.join(scratch, 'runtime.json'), JSON.stringify({ outcomes, bandRecovery: 200, bandCachedDuringOutage: 200, cacheAdditionalCalls: 0, legitimateEmptyCalendar: 200 }, null, 2))
      console.log('PASS: cold outage HTTP 500 on 16 routes; band recovery, canonical, warm cache and legitimate empty calendar')
    } finally {
      await writeFile(path.join(scratch, 'runtime.log'), runtimeLog)
    }
  }
} finally {
  if (server?.exitCode === null) { server.kill('SIGTERM'); await once(server, 'exit') }
  if (build?.exitCode === null) { try { process.kill(-build.pid, 'SIGTERM') } catch {} }
  backend.closeAllConnections()
  await new Promise((resolve) => backend.close(resolve))
}
