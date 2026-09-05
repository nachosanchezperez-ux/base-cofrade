import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const sitemap = read('app/sitemap.js')
const robots = read('app/robots.js')
const publicIndexability = read('lib/supabase/public-indexability.js')
const categoryDirectory = read('components/HermandadesCategoryDirectory.js')
const routeDirectory = read('components/DirectoryRoutePage.js')
const extraordinaryDirectory = read('app/extraordinarias/page.js')

const categoryPages = [
  read('app/hermandades/semana-santa/page.js'),
  read('app/hermandades/gloria/page.js'),
  read('app/hermandades/sacramentales/page.js'),
]

const nestedDirectoryPages = [
  read('app/hermandades/semana-santa/[localidad]/[jornada]/page.js'),
  read('app/hermandades/gloria/[localidad]/[mes]/page.js'),
  read('app/hermandades/sacramentales/[localidad]/page.js'),
]

test('el sitemap descubre superficies públicas y rutas nacidas de datos', () => {
  for (const route of [
    '/directorio',
    '/extraordinarias',
    '/pregunta',
    '/hermandades/semana-santa',
    '/hermandades/gloria',
    '/hermandades/sacramentales',
  ]) {
    assert.match(sitemap, new RegExp(route.replaceAll('/', '\\/')))
  }

  assert.match(sitemap, /brotherhoodDirectory/)
  assert.match(sitemap, /getHermandadesDirectory/)
  assert.match(sitemap, /getExtraordinaryDirectory/)
  assert.match(sitemap, /getGloryDirectory/)
  assert.match(sitemap, /getCrewEventDirectory/)
  assert.match(sitemap, /directoryPath/)
  assert.match(sitemap, /\/extraordinarias\/\$\{outing\.slug\}/)
  assert.match(sitemap, /new Map\(entries\.map/)
})

test('el sitemap solo devuelve fichas aprobadas por el snapshot editorial compartido', () => {
  assert.match(sitemap, /getPublicIndexableEntityEntries/)
  assert.match(sitemap, /entityEntries\(indexableEntities\)/)
  assert.match(sitemap, /brotherhood:\s*\{ segment: 'hermandades'/)
  assert.match(sitemap, /band:\s*\{ segment: 'bandas'/)
  assert.match(sitemap, /image:\s*\{ segment: 'imagenes'/)
  assert.match(sitemap, /step:\s*\{ segment: 'pasos'/)
  assert.doesNotMatch(sitemap, /publishedEntities/)
  assert.doesNotMatch(sitemap, /filterPublicPageEntities/)
})

test('las cuatro familias comparten el mismo mínimo editorial', () => {
  for (const evaluator of [
    'isBrotherhoodEditoriallyIndexable',
    'isBandEditoriallyIndexable',
    'isImageEditoriallyIndexable',
    'isStepEditoriallyIndexable',
  ]) {
    assert.match(publicIndexability, new RegExp(`export function ${evaluator}`))
  }

  assert.match(publicIndexability, /meetsPublicEditorialMinimum/)
  assert.match(publicIndexability, /getPublicIndexableEntityEntries/)
  assert.match(publicIndexability, /getBandsDirectory/)
  assert.match(publicIndexability, /getImagesDirectory/)
  assert.match(publicIndexability, /getStepsDirectory/)
  assert.match(publicIndexability, /source_links/)
  assert.match(publicIndexability, /step_phases/)
  assert.match(publicIndexability, /music_accompaniment_periods/)
})

test('el sitemap solo publica rutas segmentadas de la clasificación real', () => {
  assert.match(sitemap, /hasDirectoryType/)
  assert.match(
    sitemap,
    /\.filter\(\(brotherhood\) => hasDirectoryType\(brotherhood, key\)\)/
  )
})

test('los directorios principales declaran canonical y metadatos sociales', () => {
  for (const page of categoryPages) {
    assert.match(page, /socialMetadata/)
    assert.match(page, /const path = '\/hermandades\//)
    assert.match(page, /\.\.\.socialMetadata\(\{ title, description, path \}\)/)
  }
})

test('las rutas segmentadas declaran canonical y datos estructurados', () => {
  for (const page of nestedDirectoryPages) {
    assert.match(page, /socialMetadata/)
    assert.match(page, /path=\{path\}/)
  }

  for (const component of [categoryDirectory, routeDirectory]) {
    assert.match(component, /breadcrumbJsonLd/)
    assert.match(component, /collectionPageJsonLd/)
    assert.match(component, /<JsonLd/)
  }
})

test('Extraordinarias enlaza cada ItemList con su guía canónica', () => {
  assert.match(
    extraordinaryDirectory,
    /outing\.slug \? `\/extraordinarias\/\$\{outing\.slug\}` : outing\.anchorHref/
  )
})

test('robots reserva las APIs y mantiene el noindex en el Panel', () => {
  assert.match(robots, /disallow:\s*\[[^\]]*'\/api\/'/)
  assert.match(robots, /'\/panel\/'/)

  const panelLayout = read('app/panel/layout.js')
  assert.match(panelLayout, /index:\s*false/)
  assert.match(panelLayout, /follow:\s*false/)
})

test('producción no publica rutas de diagnóstico', () => {
  for (const path of [
    'app/prueba-next/page.js',
    'app/prueba-supabase/page.js',
  ]) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), false)
  }

  assert.doesNotMatch(robots, /prueba-next|prueba-supabase/)
})
