import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { brotherhoodFichaPaths, runPool, sitemapPaths } from '../scripts/lib/prewarm.mjs'

test('el precalentamiento toma solo fichas de Hermandad del sitemap', () => {
  const xml = `<?xml version="1.0"?><urlset>
    <url><loc>https://hilocofrade.es/hermandades</loc></url>
    <url><loc>https://hilocofrade.es/hermandades/san-benito</loc></url>
    <url><loc>https://hilocofrade.es/hermandades/hermandad-del-prado</loc></url>
    <url><loc>https://hilocofrade.es/hermandades/semana-santa</loc></url>
    <url><loc>https://hilocofrade.es/hermandades/semana-santa/sevilla-capital/lunes-santo</loc></url>
    <url><loc>https://hilocofrade.es/hermandades/localidad/ecija</loc></url>
    <url><loc>https://hilocofrade.es/hermandades/gloria</loc></url>
    <url><loc>https://hilocofrade.es/hermandades/san-benito</loc></url>
    <url><loc>https://otro.example/hermandades/ajena</loc></url>
  </urlset>`
  assert.deepEqual(brotherhoodFichaPaths(sitemapPaths(xml)), [
    '/hermandades/san-benito',
    '/hermandades/hermandad-del-prado',
  ])
})

test('runPool respeta la concurrencia y no se detiene por un fallo', async () => {
  let active = 0
  let peak = 0
  const results = await runPool([1, 2, 3, 4, 5, 6, 7], 3, async (n) => {
    active++
    peak = Math.max(peak, active)
    await new Promise((resolve) => setTimeout(resolve, 5))
    active--
    if (n === 4) throw new Error('falla')
    return n * 2
  })
  assert.equal(peak, 3)
  assert.equal(results.length, 7)
  assert.deepEqual(results[3], { ok: false, error: 'falla' })
  assert.deepEqual(results[6], { ok: true, value: 14 })
})

test('el flujo de producción precalienta tras la verificación sin bloquear', () => {
  const workflow = readFileSync(new URL('../.github/workflows/production-seo-smoke.yml', import.meta.url), 'utf8')
  assert.match(workflow, /prewarm:\n    needs: verify/)
  assert.match(workflow, /continue-on-error: true/)
  assert.match(workflow, /node scripts\/prewarm-brotherhood-pages\.mjs/)
  const script = readFileSync(new URL('../scripts/prewarm-brotherhood-pages.mjs', import.meta.url), 'utf8')
  assert.match(script, /const CONCURRENCY = 3/)
  assert.match(script, /\/sitemaps\/hermandades\.xml/)
  // No debe pedir saltarse la caché: el objetivo es dejarla llena.
  assert.doesNotMatch(script, /no-cache/)
})

test('los hubs excluidos coinciden con las carpetas estáticas de /hermandades', async () => {
  const { readdirSync } = await import('node:fs')
  const folders = readdirSync(new URL('../app/hermandades/', import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('['))
    .map((entry) => `/hermandades/${entry.name}`)
  assert.deepEqual(brotherhoodFichaPaths(folders), [])
})

test('solo main manual o Production success comparten el grupo de producción', () => {
  const workflow = readFileSync(new URL('../.github/workflows/production-seo-smoke.yml', import.meta.url), 'utf8')
  const expression = workflow.match(/group: production-seo-smoke-\$\{\{ (.*) \}\}/)[1]
  // Ejecutar la expresión con eventos representativos, incluidos los omitidos.
  const evaluate = new Function('github', `return ${expression}`)
  const event = (name, ref, environment, state, deploymentRef = 'main') => ({
    event_name: name, ref, run_id: 123,
    event: { deployment: { environment, ref: deploymentRef }, deployment_status: { state } },
  })
  assert.equal(evaluate(event('deployment_status', '', 'Production', 'success')), 'production')
  assert.equal(evaluate(event('workflow_dispatch', 'refs/heads/main', '', '')), 'production')
  assert.equal(evaluate(event('workflow_dispatch', 'refs/heads/preview', '', '')), 123)
  assert.equal(evaluate(event('deployment_status', '', 'Preview', 'success')), 123)
  assert.equal(evaluate(event('deployment_status', '', 'Production', 'pending')), 123)
  assert.equal(evaluate(event('deployment_status', '', 'Production', 'failure')), 123)
  // Vercel usa el SHA como deployment.ref, no el nombre de la rama.
  assert.equal(evaluate(event('deployment_status', '', 'Production', 'success', '78b1170e')), 'production')
})
