import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  bandDirectoryFacetPath,
  bandDirectoryFacets,
  bandsForDirectoryFacet,
} from '../lib/band-directory.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const bands = [
  { id: '1', type: 'Cornetas y Tambores', typeSlug: 'cornetas-y-tambores', municipality: 'Sevilla capital', municipalitySlug: 'sevilla' },
  { id: '2', type: 'Cornetas y Tambores', typeSlug: 'cornetas-y-tambores', municipality: 'Camas', municipalitySlug: 'camas' },
  { id: '3', type: 'Banda de Música', typeSlug: 'banda-de-musica', municipality: 'Camas', municipalitySlug: 'camas' },
]

test('HC-SEO-06 genera facetas canónicas de tipo y localidad desde datos publicados', () => {
  const facets = bandDirectoryFacets(bands)
  assert.deepEqual(facets.types, [
    { slug: 'banda-de-musica', label: 'Banda de Música', href: '/bandas/tipo/banda-de-musica', count: 1 },
    { slug: 'cornetas-y-tambores', label: 'Cornetas y Tambores', href: '/bandas/tipo/cornetas-y-tambores', count: 2 },
  ])
  assert.deepEqual(facets.municipalities, [
    { slug: 'camas', label: 'Camas', href: '/bandas/localidad/camas', count: 2 },
    { slug: 'sevilla', label: 'Sevilla capital', href: '/bandas/localidad/sevilla', count: 1 },
  ])
  assert.equal(bandDirectoryFacetPath('desconocido', 'x'), '')
})

test('HC-SEO-06 filtra estrictamente cada aterrizaje', () => {
  assert.deepEqual(bandsForDirectoryFacet(bands, 'tipo', 'cornetas-y-tambores').map((item) => item.id), ['1', '2'])
  assert.deepEqual(bandsForDirectoryFacet(bands, 'localidad', 'camas').map((item) => item.id), ['2', '3'])
  assert.deepEqual(bandsForDirectoryFacet(bands, 'tipo', 'inexistente'), [])
})

test('los aterrizajes declaran canonical, JSON-LD y 404 para facetas vacías', () => {
  const routeComponent = read('components/BandDirectoryRoutePage.js')
  for (const page of [
    read('app/bandas/tipo/[tipo]/page.js'),
    read('app/bandas/localidad/[localidad]/page.js'),
  ]) {
    assert.match(page, /socialMetadata/)
    assert.match(page, /notFound\(\)/)
    assert.match(page, /robots: \{ index: false, follow: false \}/)
  }
  assert.match(routeComponent, /breadcrumbJsonLd/)
  assert.match(routeComponent, /collectionPageJsonLd/)
  assert.match(routeComponent, /RelationalEntityDirectory/)
})

test('el hub, las fichas y el sitemap enlazan las nuevas rutas limpias', () => {
  const hub = read('app/bandas/page.js')
  const detail = read('app/bandas/[slug]/page.js')
  const sitemap = read('app/sitemap.js')
  assert.match(hub, /BandDirectoryFacets/)
  assert.match(detail, /\/bandas\/tipo\/\$\{band\.typeSlug\}/)
  assert.match(detail, /\/bandas\/localidad\/\$\{band\.municipalitySlug\}/)
  assert.doesNotMatch(detail, /\/bandas\?tipo=|\/bandas\?localidad=/)
  assert.match(sitemap, /getPublicBandsDirectory/)
  assert.match(sitemap, /bandDirectoryEntries\(bandDirectory\)/)
})
