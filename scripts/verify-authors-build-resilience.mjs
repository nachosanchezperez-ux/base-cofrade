// Prueba aislada: solo servicios HTTP locales, nunca Supabase de producción.
// Ejecutar aparte de npm test: construye únicamente /autores.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'

const cwd = fileURLToPath(new URL('../', import.meta.url))
const next = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url))
let failing = true
let requestCount = 0
const backend = createServer((request, response) => {
  requestCount += 1
  response.setHeader('Content-Type', 'application/json')
  if (failing) {
    response.writeHead(503)
    response.end(JSON.stringify({ message: 'QA backend temporarily unavailable' }))
    return
  }
  const url = new URL(request.url, 'http://localhost')
  let rows = []
  if (url.pathname === '/rest/v1/entities') {
    rows = [{ id: 'qa-author', name: 'Autor de verificación local', slug: 'qa-author', status: 'published', summary: 'Perfil de prueba' }]
  } else if (url.pathname === '/rest/v1/agents') {
    rows = [{ entity_id: 'qa-author', agent_kind: 'person' }]
  } else if (url.pathname === '/rest/v1/image_authorships') {
    rows = Array.from({ length: 3 }, () => ({ agent_entity_id: 'qa-author' }))
  }
  response.end(JSON.stringify(rows))
})
await new Promise((resolve) => backend.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${backend.address().port}`
const env = {
  ...process.env,
  NEXT_TELEMETRY_DISABLED: '1',
  NEXT_PUBLIC_SUPABASE_URL: origin,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'local-qa-not-a-credential',
  SUPABASE_PUBLIC_QUERY_TIMEOUT_MS: '1000',
  SUPABASE_PUBLIC_QUERY_TOTAL_TIMEOUT_MS: '2500',
}
let server
try {
  const build = spawn(process.execPath, [next, 'build', '--debug-build-paths=app/autores/page.js'], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  build.stdout.on('data', (data) => { output += data })
  build.stderr.on('data', (data) => { output += data })
  const [code] = await once(build, 'exit')
  assert.equal(code, 0, output)
  assert.equal(requestCount, 0, 'El build no debe consultar el backend')
  assert.match(output, /ƒ \/autores/)
  console.log('PASS: build de Autores con backend fallido y cero consultas')

  const portProbe = createServer()
  await new Promise((resolve) => portProbe.listen(0, '127.0.0.1', resolve))
  const port = portProbe.address().port
  await new Promise((resolve) => portProbe.close(resolve))
  server = spawn(process.execPath, [next, 'start', '-H', '127.0.0.1', '-p', String(port)], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] })
  let runtimeOutput = ''
  server.stderr.on('data', (data) => { runtimeOutput += data })
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Servidor no disponible: ${runtimeOutput}`)), 20000)
    server.once('exit', () => { clearTimeout(timeout); reject(new Error(runtimeOutput)) })
    server.stdout.on('data', (data) => {
      runtimeOutput += data
      if (runtimeOutput.includes('Ready in')) { clearTimeout(timeout); resolve() }
    })
  })
  const page = `http://127.0.0.1:${port}/autores`
  const failed = await fetch(page, { signal: AbortSignal.timeout(15000) })
  const failedHtml = await failed.text()
  assert.equal(failed.status, 500)
  assert.doesNotMatch(failedHtml, /QA backend temporarily unavailable/)
  console.log('PASS: fallo en frío devuelve HTTP 500 sin filtrar el error interno')

  failing = false
  const recovered = await fetch(page, { signal: AbortSignal.timeout(15000) })
  const html = await recovered.text()
  assert.equal(recovered.status, 200, runtimeOutput)
  assert.match(html, /Autor de verificación local/)
  assert.match(html, /rel="canonical" href="https:\/\/hilocofrade.es\/autores"/)
  const afterRecovery = requestCount
  failing = true
  const cached = await fetch(page, { signal: AbortSignal.timeout(15000) })
  assert.equal(cached.status, 200)
  assert.match(await cached.text(), /Autor de verificación local/)
  assert.equal(requestCount, afterRecovery, 'La segunda petición debe reutilizar la caché sin consultar el backend')
  console.log('PASS: recuperación con contenido SSR y canonical preservado')
  console.log('PASS: caché reutilizada con el backend de nuevo fallido')
} finally {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM')
    await once(server, 'exit')
  }
  backend.closeAllConnections()
  await new Promise((resolve) => backend.close(resolve))
}
