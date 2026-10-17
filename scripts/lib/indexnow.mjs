// IndexNow: aviso a Bing (y a los buscadores que comparten el protocolo) de las
// URL nuevas o cambiadas. Utilidades puras, probadas en test/indexnow.test.mjs.
//
// La clave es pública por diseño: el protocolo la publica en
// https://hilocofrade.es/<clave>.txt para demostrar la propiedad del sitio.

export const INDEXNOW_HOST = 'hilocofrade.es'
export const INDEXNOW_KEY = 'a802f2a256a9b8dcb1e1492f0eacd723'
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
export const INDEXNOW_MAX_URLS = 10000

// <url><loc>…</loc><lastmod>…</lastmod></url> → [{ url, lastModified }]
export function sitemapEntries(xml = '', origin = `https://${INDEXNOW_HOST}`) {
  return [...String(xml).matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((match) => {
      const block = match[1]
      const url = (/<loc>([^<]+)<\/loc>/.exec(block)?.[1] || '').trim()
      const lastModified = (/<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1] || '').trim()
      return { url, lastModified }
    })
    .filter((entry) => entry.url.startsWith(`${origin}/`) || entry.url === origin)
}

// URL cambiadas desde `since` (Date). Sin fecha de cambio solo entran en modo «all».
export function changedUrls(entries = [], { since = null, all = false } = {}) {
  const urls = entries
    .filter((entry) => {
      if (all) return true
      if (!since || !entry.lastModified) return false
      const time = Date.parse(entry.lastModified)
      return Number.isFinite(time) && time >= since.getTime()
    })
    .map((entry) => entry.url)
  return [...new Set(urls)]
}

export function chunk(items = [], size = INDEXNOW_MAX_URLS) {
  const result = []
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size))
  return result
}

export function indexNowPayload(urlList = []) {
  return {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
    urlList,
  }
}
