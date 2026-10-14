// Utilidades puras del precalentamiento (probadas en test/prewarm-brotherhood-pages.test.mjs).

// Solo fichas de Hermandad: /hermandades/<slug>, sin hubs ni facetas
// (/hermandades/semana-santa/..., /hermandades/localidad/..., /hermandades/gloria/...).
// Coinciden con las carpetas estáticas de app/hermandades/.
const BROTHERHOOD_HUBS = new Set(['semana-santa', 'gloria', 'localidad', 'agrupaciones-parroquiales', 'sacramentales'])

export function sitemapPaths(xml = '', origin = 'https://hilocofrade.es') {
  return [...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => url.startsWith(`${origin}/`))
    .map((url) => new URL(url).pathname)
}

export function brotherhoodFichaPaths(paths = []) {
  return [...new Set(paths.filter((path) => {
    const match = /^\/hermandades\/([a-z0-9-]+)\/?$/.exec(path)
    return Boolean(match) && !BROTHERHOOD_HUBS.has(match[1])
  }).map((path) => path.replace(/\/$/, '')))]
}

// Ejecuta las tareas con una concurrencia limitada y sin abortar por un fallo.
export async function runPool(items, limit, worker) {
  const results = new Array(items.length)
  let next = 0
  async function lane() {
    while (next < items.length) {
      const index = next++
      try {
        results[index] = { ok: true, value: await worker(items[index], index) }
      } catch (error) {
        results[index] = { ok: false, error: error instanceof Error ? error.message : String(error) }
      }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, lane))
  return results
}
