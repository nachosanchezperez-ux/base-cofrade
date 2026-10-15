// Precalienta las fichas de Hermandad tras cada despliegue a producción.
//
// Cada despliegue vacía la caché de páginas (ISR). La primera visita a cada ficha
// la regeneraba y esperaba 2–4 s (64 % de las visitas el 12–14/10/2026, sobre todo
// robots de búsqueda que recorren todas las fichas). Pedirlas aquí deja la página
// generada para el siguiente visitante. Nunca hace fallar el flujo: solo informa.
import { brotherhoodFichaPaths, runPool, sitemapPaths } from './lib/prewarm.mjs'

const BASE_URL = 'https://hilocofrade.es'
const CONCURRENCY = 3
const REQUEST_TIMEOUT_MS = 30_000
const USER_AGENT = 'Hilo-Cofrade-Prewarm/1.0'

async function fetchText(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'user-agent': USER_AGENT },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  const text = await response.text()
  return { response, text }
}

const sitemap = await fetchText('/sitemaps/hermandades.xml')
if (sitemap.response.status !== 200) {
  console.warn(`::warning::Precalentamiento omitido: /sitemaps/hermandades.xml devolvió HTTP ${sitemap.response.status}`)
  process.exit(0)
}

const paths = brotherhoodFichaPaths(sitemapPaths(sitemap.text, BASE_URL))
console.log(`Precalentando ${paths.length} fichas de Hermandad (concurrencia ${CONCURRENCY})`)

const startedAt = Date.now()
const results = await runPool(paths, CONCURRENCY, async (path) => {
  const started = Date.now()
  const { response } = await fetchText(path)
  if (response.status !== 200) throw new Error(`HTTP ${response.status}`)
  return { ms: Date.now() - started, cache: response.headers.get('x-vercel-cache') || '' }
})

const failures = results
  .map((result, index) => ({ ...result, path: paths[index] }))
  .filter((result) => !result.ok)
const timings = results.filter((result) => result.ok).map((result) => result.value.ms).sort((a, b) => a - b)
const p50 = timings[Math.floor(timings.length * 0.5)] ?? 0
const p90 = timings[Math.floor(timings.length * 0.9)] ?? 0

for (const failure of failures.slice(0, 20)) {
  console.warn(`::warning::${failure.path}: ${failure.error}`)
}
console.log(`Precalentamiento terminado en ${Math.round((Date.now() - startedAt) / 1000)} s · ${timings.length} correctas · ${failures.length} con error · p50 ${p50} ms · p90 ${p90} ms`)
