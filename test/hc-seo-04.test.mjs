import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  filterIndexableBrotherhoods,
  groupBrotherhoodsByLocality,
} from '../lib/brotherhood-public-index.js'
import { renderBrotherhoodDirectory } from '../test-support/brotherhood-directory-ssr.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const fixture = [
  { id: 'mixed', slug: 'mixta-prueba', nombrePopular: 'Mixta de prueba', localidad: 'Sevilla', tipos: ['Penitencia', 'Gloria', 'Sacramental'], diaSalida: 'Lunes Santo', gloriaMes: 9 },
  { id: 'night', slug: 'madruga-prueba', nombrePopular: 'Madrugá de prueba', localidad: 'Sevilla', tipos: ['Penitencia'], diaSalida: 'Madrugada' },
  { id: 'undated', slug: 'gloria-sin-fecha-prueba', nombrePopular: 'Gloria sin fecha de prueba', localidad: 'Sevilla', tipos: ['Gloria'] },
  { id: 'town', slug: 'carmona-prueba', nombrePopular: 'Carmona de prueba', localidad: 'Carmona', tipos: ['Penitencia'], diaSalida: 'Martes Santo' },
]
const thin = { id: 'thin', slug: 'incompleta-prueba', nombrePopular: 'Incompleta de prueba', localidad: 'Sevilla', tipos: ['Gloria'] }

const directHrefs = (html) => [...html.matchAll(/href="(\/hermandades\/[^"?#]+)"/g)].map((match) => match[1])

test('el índice agrupa por localidad, prioriza Sevilla y ordena las fichas', () => {
  const groups = groupBrotherhoodsByLocality([
    { id: '3', slug: 'z', nombrePopular: 'Zeta', localidad: 'Carmona' },
    { id: '2', slug: 'a', nombrePopular: 'Ánimas', localidad: 'Carmona' },
    { id: '1', slug: 's', nombrePopular: 'Silencio', localidad: 'Sevilla' },
    { id: '4', slug: '', nombrePopular: 'Sin URL', localidad: 'Écija' },
  ])
  assert.deepEqual(groups.map((group) => group.locality), ['Sevilla', 'Carmona'])
  assert.deepEqual(groups[1].items.map((item) => item.slug), ['a', 'z'])
})

test('Hermandades renderiza enlaces HTML antes de ejecutar efectos o interacción cliente', async () => {
  const html = await renderBrotherhoodDirectory([...fixture, thin], fixture)
  const hrefs = directHrefs(html)
  for (const item of fixture) assert.ok(hrefs.includes(`/hermandades/${item.slug}`))
  assert.ok(!hrefs.includes(`/hermandades/${thin.slug}`))
  assert.match(html, /Hermandades por localidad/)
  assert.match(html, /<details\b/)
  assert.doesNotMatch(html, /<details\b[^>]*\bopen(?:=|\s|>)/)
  assert.equal((html.match(/id="indice-hermandades"/g) || []).length, 1)
  assert.equal((html.match(/id="hermandades-sevilla"/g) || []).length, 1)
})

test('el índice reduce el prefetch masivo sin retirar listas y enlaces rastreables', async () => {
  const index = read('components/BrotherhoodPublicIndex.js')
  const html = await renderBrotherhoodDirectory(fixture)
  assert.match(index, /prefetch=\{false\}/)
  assert.match(index, /href=\{`\/hermandades\/\$\{item\.slug\}`\}/)
  assert.match(html, /<ul(?:\s|>)/)
  assert.match(html, /<li(?:\s|>)/)
  assert.match(html, /<a\b[^>]*href="\/hermandades\/mixta-prueba"/)
})

test('el índice SSR excluye fichas no indexables y comparte el corte del sitemap', async () => {
  const brotherhoods = [...fixture, thin]
  const selected = filterIndexableBrotherhoods(brotherhoods, [
    ...fixture.map((item) => ({ id: item.id, entityType: 'brotherhood' })),
    { id: 'band', entityType: 'band' },
  ])
  const page = read('app/hermandades/page.js')
  const indexability = read('lib/supabase/public-indexability.js')
  const html = await renderBrotherhoodDirectory(brotherhoods, selected)
  const expected = new Set(selected.map((item) => `/hermandades/${item.slug}`))
  const fixtureHrefs = new Set(brotherhoods.map((item) => `/hermandades/${item.slug}`))
  const actual = new Set(directHrefs(html).filter((href) => fixtureHrefs.has(href)))
  assert.deepEqual(actual, expected)
  assert.match(page, /getPublicIndexableEntityEntries/)
  assert.match(page, /bandDirectory: \[\]/)
  assert.match(page, /buildBrotherhoodDirectoryNavigation\(indexableHermandades\)/)
  assert.match(page, /indexableIds: indexableHermandades\.map/)
  assert.match(page, /itemListElement: indexableHermandades\.map/)
  assert.match(indexability, /bandDirectory \?\? getBandsDirectory\(\)/)
})

test('una hermandad mixta conserva una identidad en ambos calendarios y las fechas desconocidas', async () => {
  const html = await renderBrotherhoodDirectory(fixture)
  const hrefs = directHrefs(html)
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
  assert.equal(hrefs.filter((href) => href === '/hermandades/mixta-prueba').length, 2)
  assert.match(text, /4 corporaciones en el directorio/)
  assert.match(text, /Madrugá/)
  assert.match(text, /Septiembre/)
  assert.match(text, /Sin fecha documentada/)
  assert.match(text, /no equivale a una convocatoria confirmada de este año/)
})
