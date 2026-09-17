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

test('las fichas de Hermandades precalientan los slugs conocidos', () => {
  const page = read('app/hermandades/[slug]/page.js')

  assert.match(page, /export function generateStaticParams\(\)/)
  assert.match(page, /hermandades\.map\(\(item\) => \(\{ slug: item\.slug \}\)\)/)
})

for (const section of ['pasos', 'imagenes']) {
  test(`las fichas de ${section} usan ISR y se generan bajo demanda`, () => {
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(page, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(page, /force-dynamic/)
    assert.match(page, /export const revalidate = 900[;]?/)
  })
}

test('Pasos e Imágenes deduplican las consultas compartidas por metadata y página', () => {
  const stepPage = read('app/pasos/[slug]/page.js')
  const imagePage = read('app/imagenes/[slug]/page.js')

  assert.match(stepPage, /const getPaso = cache\(getPasoPageBySlug\)/)
  assert.match(stepPage, /const getCoverMedia = cache\(getPublishedEntityCoverMedia\)/)
  assert.match(stepPage, /const getStepHeritage = cache\(getPublishedStepHeritage\)/)
  assert.match(imagePage, /const getImagen = cache\(getImagenPageBySlug\)/)
  assert.match(imagePage, /const getEntityMedia = cache\(getPublishedEntityMedia\)/)
})
