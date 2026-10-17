import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

import {
  INDEXNOW_KEY,
  INDEXNOW_MAX_URLS,
  changedUrls,
  chunk,
  indexNowPayload,
  sitemapEntries,
} from '../scripts/lib/indexnow.mjs'

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://hilocofrade.es/hermandades/el-baratillo</loc>
<lastmod>2026-10-17T08:00:00.000Z</lastmod>
</url>
<url>
<loc>https://hilocofrade.es/hermandades</loc>
</url>
<url>
<loc>https://hilocofrade.es/marchas/amarguras</loc>
<lastmod>2026-09-01T10:00:00.000Z</lastmod>
</url>
<url>
<loc>https://otro-sitio.es/x</loc>
<lastmod>2026-10-17T08:00:00.000Z</lastmod>
</url>
</urlset>`

test('lee loc y lastmod del sitemap y descarta otros dominios', () => {
  assert.deepEqual(sitemapEntries(xml), [
    { url: 'https://hilocofrade.es/hermandades/el-baratillo', lastModified: '2026-10-17T08:00:00.000Z' },
    { url: 'https://hilocofrade.es/hermandades', lastModified: '' },
    { url: 'https://hilocofrade.es/marchas/amarguras', lastModified: '2026-09-01T10:00:00.000Z' },
  ])
})

test('solo avisa de lo cambiado; el modo completo incluye también lo que no tiene fecha', () => {
  const entries = sitemapEntries(xml)
  assert.deepEqual(changedUrls(entries, { since: new Date('2026-10-16T06:00:00Z') }), ['https://hilocofrade.es/hermandades/el-baratillo'])
  assert.equal(changedUrls(entries, { all: true }).length, 3)
  assert.deepEqual(changedUrls(entries), [])
})

test('lotes de 10.000 y carga útil según el protocolo', () => {
  assert.equal(INDEXNOW_MAX_URLS, 10000)
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]])
  assert.deepEqual(indexNowPayload(['https://hilocofrade.es/a']), {
    host: 'hilocofrade.es',
    key: INDEXNOW_KEY,
    keyLocation: `https://hilocofrade.es/${INDEXNOW_KEY}.txt`,
    urlList: ['https://hilocofrade.es/a'],
  })
})

test('la clave está publicada en la raíz y el workflow corre a diario solo en main', () => {
  assert.match(INDEXNOW_KEY, /^[a-f0-9]{32}$/)
  const keyFile = new URL(`../public/${INDEXNOW_KEY}.txt`, import.meta.url)
  assert.ok(existsSync(keyFile))
  assert.equal(readFileSync(keyFile, 'utf8').trim(), INDEXNOW_KEY)
  const workflow = readFileSync(new URL('../.github/workflows/indexnow.yml', import.meta.url), 'utf8')
  assert.match(workflow, /cron: '17 4 \* \* \*'/)
  assert.match(workflow, /if: github\.ref == 'refs\/heads\/main'/)
  assert.match(workflow, /node scripts\/indexnow-submit\.mjs/)
})

test('el resultado queda visible en el resumen del run (aviso o nota)', () => {
  const script = readFileSync(new URL('../scripts/indexnow-submit.mjs', import.meta.url), 'utf8')
  assert.match(script, /::notice::IndexNow aceptó/)
  assert.match(script, /::warning::IndexNow respondió/)
  assert.match(script, /::notice::IndexNow: ninguna URL cambiada/)
})
