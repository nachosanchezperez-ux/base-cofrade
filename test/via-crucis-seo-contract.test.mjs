import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../app/via-crucis-sevilla/page.js', import.meta.url), 'utf8')
const module = readFileSync(new URL('../components/BrotherhoodViaCrucisSection.js', import.meta.url), 'utf8')
const sitemap = readFileSync(new URL('../app/sitemap.js', import.meta.url), 'utf8')

test('el Vía Crucis tiene metadatos breves con canonical y redes', () => {
  const title = page.match(/const title = '([^']+)'/)?.[1]
  const description = page.match(/const description = '([^']+)'/)?.[1]
  assert.ok(title)
  assert.ok(description)
  assert.ok((title + ' · Hilo Cofrade').length <= 60)
  assert.ok(description.length <= 160)
  assert.match(title, /Vía Crucis del Consejo de Sevilla/)
  assert.match(description, /1976–2026/)
  assert.match(page, /socialMetadata\(\{ title, description, path: PATH \}\)/)
  assert.doesNotMatch(page, /index:\s*false/)
})

test('las ediciones permanecen accesibles en HTML antes de abrir pestañas', () => {
  assert.match(page, /chronologicalEditions\.map\(\(edition\)/)
  assert.match(page, /<details className=\{styles\.archiveIndexDetails\}>/)
  assert.match(page, /<ol className=\{styles\.archiveIndexList\}>/)
  assert.match(page, /councilExtraordinary2013/)
  assert.match(page, /councilNextEdition/)
  assert.match(page, /<SourcesBlock sources=\{viaCrucisSources\}/)
})

test('el grafo del archivo y sus enlaces reconocen una sola URL por edición', () => {
  assert.match(page, /'@type': 'CollectionPage'/)
  assert.match(page, /'@type': 'ItemList'/)
  assert.match(page, /'@type': 'ListItem'/)
  assert.match(page, /absoluteUrl\(edition\.brotherhood\.href\)/)
  assert.match(module, /href="\/via-crucis-sevilla"/)
  assert.match(sitemap, /absoluteUrl\('\/via-crucis-sevilla'\)/)
})
