import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('Autores dispone de ruta canónica transversal y ProfilePage', async () => {
  const page = await read('app/autores/[slug]/page.js')

  assert.match(page, /canonicalPath = `\/autores\/\$\{agent\.slug\}`/)
  assert.match(page, /'@type': 'ProfilePage'/)
  assert.match(page, /'@id': entityId/)
  assert.match(page, /mainEntity: \{ '@id': entityId \}/)
  assert.match(page, /schemaType\(agent\)/)
  assert.match(page, /agent\.kind === 'person' \? 'Person' : 'Organization'/)
})

test('las fichas débiles existen pero permanecen fuera de indexación', async () => {
  const loader = await read('lib/supabase/public-agents.js')
  const page = await read('app/autores/[slug]/page.js')

  assert.match(loader, /relationCount > 0/)
  assert.match(loader, /relationCount >= 3/)
  assert.match(loader, /sourceCount >= 1/)
  assert.match(loader, /editorialText\.length >= 80/)
  assert.match(page, /agent\.indexable[\s\S]*index: true/)
  assert.match(page, /index: false, follow: true/)
})

test('la capa pública de Autores no consulta contacto privado', async () => {
  const loader = await read('lib/supabase/public-agents.js')

  assert.doesNotMatch(loader, /\.select\([^\n]*email/)
  assert.doesNotMatch(loader, /\.select\([^\n]*phone/)
  assert.doesNotMatch(loader, /\.select\([^\n]*address[,')]/)
})

test('las Marchas enlazan al Autor canónico y preservan la URL histórica con 308', async () => {
  const marches = await read('lib/supabase/public-marches.js')
  const marchPage = await read('app/marchas/[slug]/page.js')
  const legacy = await read('app/marchas/autores/[slug]/page.js')

  assert.match(marches, /return `\/autores\/\$\{entity\.slug\}`/)
  assert.match(marchPage, /'@id': `\$\{absoluteUrl\(author\.href\)\}#person`/)
  assert.match(legacy, /permanentRedirect\(`\/autores\/\$\{slug\}`\)/)
})

test('Autores entra en sitemap propio y robots lo anuncia', async () => {
  const sitemap = await read('app/sitemap.js')
  const segments = await read('lib/seo-sitemap-segments.js')
  const robots = await read('app/robots.js')

  assert.match(sitemap, /getPublicAgentSitemapEntries/)
  assert.match(sitemap, /url: absoluteUrl\('\/autores'\)/)
  assert.match(sitemap, /\.\.\.authorEntries\(authors\)/)
  assert.match(segments, /autores: \['\/autores'\]/)
  assert.match(robots, /\/sitemaps\/autores\.xml/)
})

test('Tira del hilo trata los agentes como entidades navegables', async () => {
  const source = await read('lib/supabase/tira-del-hilo-authors-patrimony-v4.js')

  assert.match(source, /new Set\(\['agent', 'brotherhood', 'image', 'step'\]\)/)
  assert.match(source, /entity\.entity_type === 'agent'\) return `\/autores\/\$\{entity\.slug\}`/)
})
