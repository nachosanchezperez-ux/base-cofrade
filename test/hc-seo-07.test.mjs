import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  heritageDirectoryLocalities,
  heritageDirectoryLocalityPath,
  heritageItemsForLocality,
} from '../lib/heritage-directory.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const items = [
  { id: '1', municipality: 'Sevilla capital', municipalitySlug: 'sevilla' },
  { id: '2', municipality: 'Camas', municipalitySlug: 'camas' },
  { id: '3', municipality: 'Sevilla capital', municipalitySlug: 'sevilla' },
  { id: '4', municipality: 'Camas', municipalitySlug: 'camas' },
  { id: '5', municipality: 'Sevilla capital', municipalitySlug: 'sevilla' },
  { id: '6', municipality: 'Camas', municipalitySlug: 'camas' },
  { id: '7', municipality: 'Pilas', municipalitySlug: 'pilas' },
  { id: '8', municipality: '', municipalitySlug: '' },
]

test('HC-SEO-07 crea localidades canónicas solo con masa crítica', () => {
  assert.deepEqual(heritageDirectoryLocalities(items, 'imagenes'), [
    { slug: 'sevilla', label: 'Sevilla capital', count: 3, href: '/imagenes/localidad/sevilla' },
    { slug: 'camas', label: 'Camas', count: 3, href: '/imagenes/localidad/camas' },
  ])
  assert.equal(heritageDirectoryLocalityPath('pasos', 'camas'), '/pasos/localidad/camas')
  assert.equal(heritageDirectoryLocalityPath('bandas', 'camas'), '')
})

test('HC-SEO-07 no publica páginas delgadas aunque exista una ficha', () => {
  assert.deepEqual(heritageItemsForLocality(items, 'imagenes', 'sevilla').map((item) => item.id), ['1', '3', '5'])
  assert.deepEqual(heritageItemsForLocality(items, 'imagenes', 'pilas'), [])
  assert.deepEqual(heritageItemsForLocality(items, 'imagenes', 'inexistente'), [])
})

test('los aterrizajes de imágenes y pasos declaran canonical, datos estructurados y 404', () => {
  const routeComponent = read('components/HeritageDirectoryRoutePage.js')
  for (const page of [
    read('app/imagenes/localidad/[localidad]/page.js'),
    read('app/pasos/localidad/[localidad]/page.js'),
  ]) {
    assert.match(page, /socialMetadata/)
    assert.match(page, /notFound\(\)/)
    assert.match(page, /robots: \{ index: false, follow: false \}/)
  }
  assert.match(routeComponent, /breadcrumbJsonLd/)
  assert.match(routeComponent, /collectionPageJsonLd/)
  assert.match(routeComponent, /RelationalEntityDirectory/)
})

test('los hubs y el sitemap descubren las rutas de patrimonio por localidad', () => {
  const imagesHub = read('app/imagenes/page.js')
  const stepsHub = read('app/pasos/page.js')
  const sitemap = read('app/sitemap.js')
  assert.match(imagesHub, /HeritageDirectoryFacets/)
  assert.match(stepsHub, /HeritageDirectoryFacets/)
  assert.match(sitemap, /heritageDirectoryEntries\(imageDirectory, stepDirectory\)/)
  assert.match(sitemap, /images: imageDirectory/)
  assert.match(sitemap, /steps: stepDirectory/)
})
