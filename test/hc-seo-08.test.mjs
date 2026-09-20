import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  heritageDirectoryTypePath,
  heritageDirectoryTypes,
  heritageItemsForType,
  heritageTypeForValue,
} from '../lib/heritage-directory.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const images = [
  { id: '1', type: 'Dolorosa' },
  { id: '2', type: 'Virgen · Dolorosa' },
  { id: '3', type: 'Dolorosa de vestir' },
  { id: '4', type: 'Cristo crucificado' },
  { id: '5', type: 'Crucificado' },
  { id: '6', type: 'Cristo · Crucificado' },
  { id: '7', type: 'Titular' },
]

const steps = [
  { id: '1', type: 'Palio' },
  { id: '2', type: 'Paso de palio' },
  { id: '3', type: 'Paso de Palio' },
  { id: '4', type: 'Misterio' },
  { id: '5', type: 'Paso de misterio' },
  { id: '6', type: 'misterio' },
  { id: '7', type: 'Paso procesional' },
]

test('HC-SEO-08 agrupa variantes equivalentes bajo una tipología canónica', () => {
  assert.equal(heritageTypeForValue('Virgen Dolorosa de vestir', 'imagenes')?.slug, 'dolorosas')
  assert.equal(heritageTypeForValue('Cristo · Crucificado', 'imagenes')?.slug, 'crucificados')
  assert.equal(heritageTypeForValue('Paso de Palio', 'pasos')?.slug, 'pasos-de-palio')
  assert.equal(heritageTypeForValue('Paso procesional de misterio', 'pasos')?.slug, 'pasos-de-misterio')
})

test('HC-SEO-08 excluye categorías ambiguas y exige tres fichas', () => {
  assert.deepEqual(heritageDirectoryTypes(images, 'imagenes'), [
    { slug: 'dolorosas', label: 'Dolorosas', count: 3, href: '/imagenes/tipo/dolorosas' },
    { slug: 'crucificados', label: 'Crucificados', count: 3, href: '/imagenes/tipo/crucificados' },
  ])
  assert.deepEqual(heritageDirectoryTypes(steps, 'pasos'), [
    { slug: 'pasos-de-palio', label: 'Pasos de palio', count: 3, href: '/pasos/tipo/pasos-de-palio' },
    { slug: 'pasos-de-misterio', label: 'Pasos de misterio', count: 3, href: '/pasos/tipo/pasos-de-misterio' },
  ])
  assert.equal(heritageTypeForValue('Titular', 'imagenes'), null)
  assert.equal(heritageTypeForValue('Paso procesional', 'pasos'), null)
})

test('HC-SEO-08 filtra cada aterrizaje con la clasificación normalizada', () => {
  assert.deepEqual(heritageItemsForType(images, 'imagenes', 'dolorosas').map((item) => item.id), ['1', '2', '3'])
  assert.deepEqual(heritageItemsForType(steps, 'pasos', 'pasos-de-palio').map((item) => item.id), ['1', '2', '3'])
  assert.deepEqual(heritageItemsForType(images, 'imagenes', 'inexistente'), [])
  assert.equal(heritageDirectoryTypePath('imagenes', 'dolorosas'), '/imagenes/tipo/dolorosas')
})

test('rutas, fichas, hubs y sitemap descubren las tipologías canónicas', () => {
  const routeComponent = read('components/HeritageDirectoryRoutePage.js')
  const facets = read('components/HeritageDirectoryFacets.js')
  const sitemap = read('app/sitemap.js')

  for (const page of [
    read('app/imagenes/tipo/[tipo]/page.js'),
    read('app/pasos/tipo/[tipo]/page.js'),
  ]) {
    assert.match(page, /socialMetadata/)
    assert.match(page, /notFound\(\)/)
    assert.match(page, /robots: \{ index: false, follow: false \}/)
  }

  assert.match(routeComponent, /collectionPageJsonLd/)
  assert.match(facets, /heritageDirectoryTypes/)
  assert.match(read('app/imagenes/[slug]/page.js'), /heritageDirectoryTypePath\('imagenes'/)
  assert.match(read('app/pasos/[slug]/page.js'), /heritageDirectoryTypePath\('pasos'/)
  assert.match(sitemap, /heritageDirectoryTypes\(images, 'imagenes'\)/)
  assert.match(sitemap, /heritageDirectoryTypes\(steps, 'pasos'\)/)
})
