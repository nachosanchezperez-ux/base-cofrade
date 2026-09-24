import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

for (const section of ['hermandades', 'bandas']) {
  test(`las fichas de ${section} usan ISR y no fuerzan renderizado dinámico`, () => {
    const layout = read(`app/${section}/[slug]/layout.js`)
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(layout, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(layout, /force-dynamic/)
    assert.match(page, /export const revalidate = 900[;]?/)
  })
}

test('las fichas de Hermandades se generan bajo demanda sin precarga de datos', () => {
  const page = read('app/hermandades/[slug]/page.js')

  assert.match(page, /export function generateStaticParams\(\)/)
  assert.match(page, /return \[\];/)
})

for (const section of ['pasos', 'imagenes']) {
  test(`las fichas de ${section} usan ISR y se generan bajo demanda`, () => {
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(page, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(page, /force-dynamic/)
    assert.match(page, /export const revalidate = 900[;]?/)
  })
}

for (const section of ['marchas', 'crucetas-musicales']) {
  test(`las fichas de ${section} usan ISR y se generan bajo demanda`, () => {
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(page, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(page, /force-dynamic/)
    assert.match(page, /export const revalidate = 900[;]?/)
  })
}

for (const section of ['procesiones-de-gloria', 'extraordinarias']) {
  test(`las fichas temporales de ${section} usan ISR de cinco minutos`, () => {
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(page, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(page, /force-dynamic/)
    assert.match(page, /export const revalidate = 300[;]?/)
  })
}

test('Igualás y Ensayos difiere el directorio y conserva ISR en las fichas', () => {
  const directory = read('app/igualas-y-ensayos/page.js')
  const detail = read('app/igualas-y-ensayos/[slug]/page.js')

  assert.match(directory, /await connection\(\)/)
  assert.match(directory, /public-directory-cache/)
  for (const page of [detail]) {
    assert.match(page, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(page, /force-dynamic/)
    assert.match(page, /export const revalidate = 300[;]?/)
  }
  assert.match(detail, /const getCrewEvent = cache\(getCrewEventDetail\)/)
  assert.equal((detail.match(/getCrewEvent\(slug\)/g) || []).length, 2)
})

test('Pasos e Imágenes deduplican las consultas compartidas por metadata y página', () => {
  const stepPage = read('app/pasos/[slug]/page.js')
  const imagePage = read('app/imagenes/[slug]/page.js')
  const publicEntityPages = read('lib/supabase/public-entity-pages.js')

  assert.match(stepPage, /const getPaso = cache\(getPasoPageBySlug\)/)
  assert.match(publicEntityPages, /unstable_cache/)
  assert.match(publicEntityPages, /getPublishedEntityCoverMedia\(entity\.id\)/)
  assert.match(publicEntityPages, /getPublishedStepHeritage\(entity\.id\)/)
  assert.match(imagePage, /const getImagen = cache\(getImagenPageBySlug\)/)
  assert.match(imagePage, /const getEntityMedia = cache\(getPublishedEntityMedia\)/)
})
