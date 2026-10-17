// Envía a IndexNow las URL del sitemap cambiadas en las últimas horas.
//   node scripts/indexnow-submit.mjs              → cambiadas en las últimas 26 h
//   INDEXNOW_HOURS=72 node scripts/indexnow-submit.mjs
//   INDEXNOW_MODE=all node scripts/indexnow-submit.mjs   → todas (envío inicial)
//   INDEXNOW_DRY_RUN=1 …                           → solo cuenta, no envía
// Nunca falla el job por un rechazo de IndexNow: deja aviso en el registro.
import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_HOST,
  INDEXNOW_KEY,
  changedUrls,
  chunk,
  indexNowPayload,
  sitemapEntries,
} from './lib/indexnow.mjs'

const origin = `https://${INDEXNOW_HOST}`
const all = process.env.INDEXNOW_MODE === 'all'
const hours = Number(process.env.INDEXNOW_HOURS || 26)
const dryRun = process.env.INDEXNOW_DRY_RUN === '1'

async function main() {
  const keyResponse = await fetch(`${origin}/${INDEXNOW_KEY}.txt`, { cache: 'no-store' })
  const keyText = (await keyResponse.text()).trim()
  if (!keyResponse.ok || keyText !== INDEXNOW_KEY) {
    console.log(`::warning::La clave de IndexNow no está publicada en ${origin}/${INDEXNOW_KEY}.txt (HTTP ${keyResponse.status}). No se envía nada.`)
    return
  }

  const sitemap = await fetch(`${origin}/sitemap.xml`, { cache: 'no-store' })
  if (!sitemap.ok) {
    console.log(`::warning::No se pudo leer el sitemap (HTTP ${sitemap.status}).`)
    return
  }
  const entries = sitemapEntries(await sitemap.text(), origin)
  const since = new Date(Date.now() - hours * 60 * 60 * 1000)
  const urls = changedUrls(entries, { since, all })
  console.log(`Sitemap: ${entries.length} URL · ${all ? 'modo completo' : `cambiadas desde ${since.toISOString()}`}: ${urls.length}`)
  if (!urls.length) {
    console.log('::notice::IndexNow: ninguna URL cambiada en este periodo; no se envía nada.')
    return
  }
  if (dryRun) return

  for (const [index, batch] of chunk(urls).entries()) {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(indexNowPayload(batch)),
    })
    // 200 y 202: aceptado. 422/403/429: aviso, sin fallar el job.
    const ok = response.status === 200 || response.status === 202
    // ::notice:: deja el resultado visible en el resumen del run de GitHub Actions.
    const detail = ok ? '' : ` · ${(await response.text().catch(() => '')).slice(0, 200)}`
    console.log(`${ok ? '::notice::IndexNow aceptó' : '::warning::IndexNow respondió'} lote ${index + 1}: ${batch.length} URL · HTTP ${response.status}${detail}`)
  }
}

main().catch((error) => {
  console.log(`::warning::IndexNow no completado: ${error instanceof Error ? error.message : String(error)}`)
})
