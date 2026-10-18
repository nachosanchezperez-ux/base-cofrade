import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { hiloArticlePath, hiloParagraphs, relatedHiloMovements } from '../lib/hilo-movements.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('cada noticia tiene su página y el ancla del índice se conserva', () => {
  assert.equal(hiloArticlePath('cigarreras-panaderos-2027'), '/el-hilo-se-mueve/cigarreras-panaderos-2027')
  assert.equal(hiloArticlePath('../x'), '/el-hilo-se-mueve')
  assert.match(read('lib/hilo-movements.js'), /anchorHref: `\$\{HILO_MOVEMENTS_PATH\}#\$\{id\}`/)
})

test('el contexto se divide en párrafos y las relacionadas priorizan al mismo protagonista', () => {
  assert.deepEqual(hiloParagraphs('Uno.\n\nDos.\nTres.'), ['Uno.', 'Dos.', 'Tres.'])
  const items = [
    { id: 'a', protagonist: { href: '/hermandades/x' } },
    { id: 'b', protagonist: { href: '/bandas/y' } },
    { id: 'c', protagonist: { href: '/hermandades/x' } },
    { id: 'd', protagonist: { href: '/bandas/z' } },
  ]
  assert.deepEqual(relatedHiloMovements(items, items[0], 2).map((item) => item.id), ['c', 'b'])
  assert.deepEqual(relatedHiloMovements(items, null), [])
})

test('la página de noticia publica NewsArticle con protagonista, menciones y fuentes', () => {
  const page = read('app/el-hilo-se-mueve/[slug]/page.js')
  assert.match(page, /'@type': 'NewsArticle'/)
  assert.match(page, /about: item\.protagonist\.href \?/)
  assert.match(page, /mentions: mentions\.map/)
  assert.match(page, /image: \[photo \? absoluteUrl\(photo\.src\) : absoluteUrl\('\/opengraph-image'\)\]/)
  assert.match(page, /const discoverFicha =/)
  assert.match(page, /citation: item\.sources\.map/)
  assert.match(page, /export const revalidate = 900/)
  assert.match(page, /notFound\(\)/)
  assert.match(page, /<h1>\{item\.title\}<\/h1>/)
  assert.match(page, /id="tira-del-hilo"/)
})

test('las noticias entran en el sitemap general y el índice declara su colección', () => {
  const sitemap = read('app/sitemap.js')
  assert.match(sitemap, /async function hiloArticleEntries\(\)/)
  assert.match(sitemap, /\.\.\.sitemapEntriesForSegment\(staticEntries, segment\), \.\.\.await hiloArticleEntries\(\)/)
  assert.match(read('app/el-hilo-se-mueve/page.js'), /collectionPageJsonLd\(\{ path: HILO_MOVEMENTS_PATH/)
})

test('la tarjeta usa la foto de la ficha del protagonista cuando no hay foto de archivo', async () => {
  // La elección de foto vive en un módulo puro compartido con la portada (#1253).
  const photo = read('lib/hilo-movement-photo.js')
  assert.match(photo, /if \(item\.cover\?\.path\) \{/)
  assert.match(photo, /caption: `Imagen de la ficha de \$\{name\}`/)
  assert.match(read('components/HiloMovementCards.js'), /export \{ hiloMovementPhoto \}/)
  const { hiloMovementPhoto } = await import('../lib/hilo-movement-photo.js')
  assert.equal(hiloMovementPhoto({ id: 'x', cover: { path: '/a.jpg' }, protagonist: { label: 'Hermandad X' } }).caption, 'Imagen de la ficha de Hermandad X')
  assert.equal(hiloMovementPhoto({ id: 'x' }), null)
  assert.match(read('lib/supabase/hilo-movements.js'), /getPublishedEntityCoverMediaMap\(protagonistIds/)
  assert.match(read('lib/supabase/hilo-movements.js'), /'hilo-editorial-movements-v5'/)
})
