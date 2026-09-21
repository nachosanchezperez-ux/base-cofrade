import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  directoryPath,
  directoryPeriod,
} from '../lib/brotherhood-directory.js'
import {
  brotherhoodDirectoryRoutes,
  brotherhoodsForDirectoryRoute,
} from '../lib/brotherhood-public-index.js'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const sample = [
  { id: '1', slug: 'a', nombrePopular: 'A', localidad: 'Sevilla', diaSalida: 'Lunes Santo', tipos: ['Penitencia'] },
  { id: '2', slug: 'b', nombrePopular: 'B', localidad: 'Sevilla', diaSalida: 'Lunes Santo', tipos: ['Penitencia'] },
  { id: '3', slug: 'c', nombrePopular: 'C', localidad: 'Sevilla', diaSalida: 'Lunes Santo', tipos: ['Penitencia'] },
  { id: '4', slug: 'd', nombrePopular: 'D', localidad: 'Sevilla', diaSalida: 'Martes Santo', tipos: ['Penitencia'] },
  { id: '5', slug: 'e', nombrePopular: 'E', localidad: 'Sevilla', diaSalida: 'Martes Santo', tipos: ['Penitencia'] },
  { id: '6', slug: 'f', nombrePopular: 'F', localidad: 'Osuna', tipos: ['Sacramental'] },
]

test('HC-SEO-10 solo publica facetas con al menos tres perfiles indexables', () => {
  const routes = brotherhoodDirectoryRoutes(sample, 'semana-santa')

  assert.deepEqual(routes.map(({ href, label, count }) => ({ href, label, count })), [{
    href: '/hermandades/semana-santa/sevilla-capital/lunes-santo',
    label: 'Sevilla capital · Lunes Santo',
    count: 3,
  }])
  assert.deepEqual(
    brotherhoodsForDirectoryRoute(
      sample,
      'semana-santa',
      '/hermandades/semana-santa/sevilla-capital/lunes-santo'
    ).map((item) => item.id),
    ['1', '2', '3']
  )
  assert.deepEqual(
    brotherhoodsForDirectoryRoute(
      sample,
      'semana-santa',
      '/hermandades/semana-santa/sevilla-capital/martes-santo'
    ),
    []
  )
  assert.deepEqual(brotherhoodDirectoryRoutes(sample, 'sacramentales'), [])
})

test('la taxonomía de Semana Santa normaliza Madrugá y descarta periodos ajenos', () => {
  const madruga = { localidad: 'Alcalá de Guadaíra', diaSalida: 'Madrugá', tipos: ['Penitencia'] }
  const thursdayDawn = { localidad: 'Osuna', diaSalida: 'Madrugá del Jueves Santo', tipos: ['Penitencia'] }
  const canonicalDawn = { localidad: 'Sevilla', diaSalida: 'Madrugada del Viernes Santo', tipos: ['Penitencia'] }
  const invalid = { localidad: 'Huévar del Aljarafe', diaSalida: 'Septiembre', tipos: ['Penitencia'] }

  assert.equal(directoryPeriod(madruga, 'semana-santa'), 'Madrugada')
  assert.equal(
    directoryPath(madruga, 'semana-santa'),
    '/hermandades/semana-santa/alcala-de-guadaira/madrugada'
  )
  assert.equal(directoryPeriod(thursdayDawn, 'semana-santa'), 'Jueves Santo')
  assert.equal(directoryPeriod(canonicalDawn, 'semana-santa'), 'Madrugada')
  assert.equal(directoryPath(invalid, 'semana-santa'), '')
})

test('las rutas dinámicas aplican frontera compartida, noindex y 404', async () => {
  const pages = await Promise.all([
    read('app/hermandades/semana-santa/[localidad]/[jornada]/page.js'),
    read('app/hermandades/gloria/[localidad]/[mes]/page.js'),
    read('app/hermandades/sacramentales/[localidad]/page.js'),
    read('app/hermandades/agrupaciones-parroquiales/[localidad]/page.js'),
  ])

  for (const page of pages) {
    assert.match(page, /getIndexableBrotherhoodDirectory/)
    assert.match(page, /brotherhoodsForDirectoryRoute/)
    assert.match(page, /robots: \{ index: false, follow: false \}/)
    assert.match(page, /notFound\(\)/)
    assert.match(page, /socialMetadata/)
    assert.match(page, /DirectoryRoutePage/)
  }
})

test('los hubs y el sitemap solo descubren facetas indexables con masa editorial', async () => {
  const [component, sitemap, sharedDirectory, ...hubs] = await Promise.all([
    read('components/HermandadesCategoryDirectory.js'),
    read('app/sitemap.js'),
    read('lib/supabase/indexable-brotherhood-directory.js'),
    read('app/hermandades/semana-santa/page.js'),
    read('app/hermandades/gloria/page.js'),
    read('app/hermandades/sacramentales/page.js'),
    read('app/hermandades/agrupaciones-parroquiales/page.js'),
  ])

  assert.match(component, /brotherhoodDirectoryRoutes\(items, typeKey\)/)
  assert.match(sitemap, /brotherhoodDirectoryRoutes\(brotherhoods\)/)
  assert.match(sitemap, /directoryEntries\(indexableBrotherhoods\)/)
  assert.match(sharedDirectory, /getPublicIndexableEntityEntries/)
  assert.match(sharedDirectory, /filterIndexableBrotherhoods/)

  for (const hub of hubs) {
    assert.match(hub, /getIndexableBrotherhoodDirectory/)
    assert.doesNotMatch(hub, /force-dynamic/)
  }
})
