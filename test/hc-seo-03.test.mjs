import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const page = read('app/marchas/page.js')
const detail = read('app/marchas/[slug]/page.js')
const data = read('lib/supabase/public-marches.js')
const header = read('components/HiloHeader.js')
const directory = read('app/directorio/page.js')
const sitemap = read('app/sitemap.js')

test('HC-SEO-03 publica un hub canónico para las 560 fichas de Marchas', () => {
  assert.match(page, /getPublicMarchDirectory/)
  assert.match(page, /socialMetadata\(\{ title, description, path: '\/marchas' \}\)/)
  assert.match(page, /CollectionPage/)
  assert.match(page, /marches\.length/)
  assert.match(page, /group\.items\.map/)
  assert.match(page, /href=\{march\.href\}/)
})

test('el directorio de Marchas pagina datos amplios y conserva autoría', () => {
  assert.match(data, /export const getPublicMarchDirectory/)
  assert.match(data, /loadPublicRowsInPages/)
  assert.match(data, /loadPublicRowsInBatches/)
  assert.match(data, /\.eq\('entity_type', 'march'\)/)
  assert.match(data, /\.eq\('status', 'published'\)/)
  assert.match(data, /\.from\('march_authors'\)/)
  assert.match(data, /author\.role === 'composer'/)
})

test('Marchas deja de ser una familia huérfana en la arquitectura pública', () => {
  assert.match(header, /\['\/marchas', 'Marchas'\]/)
  assert.match(directory, /href="\/marchas"/)
  assert.match(directory, /Marchas procesionales/)
  assert.match(sitemap, /absoluteUrl\('\/marchas'\)/)
  assert.match(detail, /\{ name: 'Marchas', path: '\/marchas' \}/)
  assert.match(detail, /<Link href="\/marchas">Marchas<\/Link>/)
  assert.doesNotMatch(detail, /\{ name: 'Crucetas musicales', path: '\/crucetas-musicales' \}/)
})
