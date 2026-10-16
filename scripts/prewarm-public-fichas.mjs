// Precalienta las fichas públicas tras cada despliegue a producción.
//
// Cada despliegue vacía la caché de páginas (ISR). La primera visita a cada ficha
// (casi siempre un robot de búsqueda que recorre todas) esperaba la regeneración.
// Pedirlas aquí deja la página generada para el siguiente visitante. Las familias van
// por orden de coste: Hermandades (las más pesadas), Pasos, Imágenes y Bandas.
// Nunca hace fallar el flujo: solo informa, y se detiene al agotar su presupuesto.
import { fichaPaths, runPool, sitemapPaths } from './lib/prewarm.mjs'

const BASE_URL = 'https://hilocofrade.es'
const FAMILIES = ['hermandades', 'pasos', 'imagenes', 'bandas']
const CONCURRENCY = 4
const REQUEST_TIMEOUT_MS = 30_000
const TOTAL_BUDGET_MS = 20 * 60_000
const USER_AGENT = 'Hilo-Cofrade-Prewarm/1.0'

const startedAt = Date.now()
const outOfBudget = () => Date.now() - startedAt > TOTAL_BUDGET_MS

async function fetchText(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'user-agent': USER_AGENT },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  const text = await response.text()
  return { response, text }
}

function percentile(sorted, ratio) {
  return sorted[Math.floor(sorted.length * ratio)] ?? 0
}

for (const family of FAMILIES) {
  if (outOfBudget()) {
    console.warn(`::warning::Presupuesto agotado: se omiten ${family} y las siguientes familias`)
    break
  }

  let sitemap
  try {
    sitemap = await fetchText(`/sitemaps/${family}.xml`)
  } catch (error) {
    console.warn(`::warning::/sitemaps/${family}.xml: ${error instanceof Error ? error.message : error}`)
    continue
  }
  if (sitemap.response.status !== 200) {
    console.warn(`::warning::/sitemaps/${family}.xml devolvió HTTP ${sitemap.response.status}`)
    continue
  }

  const paths = fichaPaths(sitemapPaths(sitemap.text, BASE_URL), family)
  const familyStartedAt = Date.now()
  const results = await runPool(paths, CONCURRENCY, async (path) => {
    if (outOfBudget()) return { skipped: true }
    const started = Date.now()
    const { response } = await fetchText(path)
    if (response.status !== 200) throw new Error(`HTTP ${response.status}`)
    return { ms: Date.now() - started }
  })

  const failures = results
    .map((result, index) => ({ ...result, path: paths[index] }))
    .filter((result) => !result.ok)
  const done = results.filter((result) => result.ok && !result.value.skipped)
  const skipped = results.filter((result) => result.ok && result.value.skipped).length
  const timings = done.map((result) => result.value.ms).sort((a, b) => a - b)

  for (const failure of failures.slice(0, 10)) {
    console.warn(`::warning::${failure.path}: ${failure.error}`)
  }
  console.log(`${family}: ${done.length} correctas · ${failures.length} con error · ${skipped} omitidas · ${Math.round((Date.now() - familyStartedAt) / 1000)} s · p50 ${percentile(timings, 0.5)} ms · p90 ${percentile(timings, 0.9)} ms`)
}

console.log(`Precalentamiento terminado en ${Math.round((Date.now() - startedAt) / 1000)} s`)
