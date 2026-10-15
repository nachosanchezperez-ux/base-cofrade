// Utilidades puras del precalentamiento (probadas en test/prewarm-public-fichas.test.mjs).

// Fichas de cada familia: /<familia>/<slug>, sin hubs ni facetas. Las exclusiones
// coinciden con las carpetas estáticas de app/<familia>/ (comprobado en el test).
export const FICHA_FAMILY_HUBS = Object.freeze({
  hermandades: new Set(['semana-santa', 'gloria', 'localidad', 'agrupaciones-parroquiales', 'sacramentales']),
  pasos: new Set(['localidad', 'tipo']),
  imagenes: new Set(['localidad', 'tipo']),
  bandas: new Set(['localidad', 'tipo']),
})

export function sitemapPaths(xml = '', origin = 'https://hilocofrade.es') {
  return [...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => url.startsWith(`${origin}/`))
    .map((url) => new URL(url).pathname)
}

export function fichaPaths(paths = [], family = 'hermandades') {
  const hubs = FICHA_FAMILY_HUBS[family]
  if (!hubs) throw new Error(`Familia sin fichas precalentables: ${family}`)
  const pattern = new RegExp(`^/${family}/([a-z0-9-]+)/?$`)
  return [...new Set(paths.filter((path) => {
    const match = pattern.exec(path)
    return Boolean(match) && !hubs.has(match[1])
  }).map((path) => path.replace(/\/$/, '')))]
}

export function brotherhoodFichaPaths(paths = []) {
  return fichaPaths(paths, 'hermandades')
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
