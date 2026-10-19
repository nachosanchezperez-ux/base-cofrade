import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las fichas de imagen y de paso no repiten sus relaciones en «Tira del hilo»', () => {
  for (const path of ['app/imagenes/[slug]/page.js', 'app/pasos/[slug]/page.js']) {
    const page = read(path)
    assert.doesNotMatch(page, /RelationalThread/, path)
    assert.doesNotMatch(page, /tira-del-hilo/, path)
  }
})

test('la ficha de imagen muestra cada dato una sola vez', () => {
  const page = read('app/imagenes/[slug]/page.js')
  // La hermandad y la datación ya están en la cabecera.
  assert.doesNotMatch(page, /<small>Hermandad<\/small>/)
  assert.doesNotMatch(page, /<small>Fecha<\/small>/)
  // La autoría va en la cabecera o en el resumen, nunca en ambos.
  assert.match(page, /heroShowsAuthor \? \{\s*label: 'Autoría'/)
  assert.match(page, /\{summaryShowsAuthor \? <article>/)
  // Las otras imágenes y pasos, que solo vivían en el hilo, pasan al resumen.
  assert.match(page, /Otras imágenes de la hermandad/)
  assert.match(page, /También procesiona en/)
  // Sin cronología propia ni restauraciones no se pinta una cronología de una sola datación.
  assert.match(page, /\{showChronology && \(/)
})

test('la ficha de paso no repite datos entre cabecera y resumen ni lleva entradillas', () => {
  const page = read('app/pasos/[slug]/page.js')
  assert.doesNotMatch(page, /badges=/)
  assert.doesNotMatch(page, /imagen vinculada/)
  assert.doesNotMatch(page, /<small>Hermandad<\/small>/)
  assert.doesNotMatch(page, /<small>Ejecución<\/small>/)
  assert.doesNotMatch(page, /<small>Sistema de portadores<\/small>/)
  assert.doesNotMatch(page, /Formaciones vinculadas a este paso/)
  assert.doesNotMatch(page, /Las piezas del paso y su evolución material/)
})

test('sin fotografía no se pinta relleno en la cabecera', () => {
  const imageHero = read('components/ImageHeroV2.js')
  assert.doesNotMatch(imageHero, /initialsBackdrop/)
  assert.doesNotMatch(imageHero, />HC</)
  assert.match(read('components/ImageHeroV2.module.css'), /\.hero\.noPhoto \{\s*min-height: 0;/)
  const hero = read('components/RelationalEntityHero.js')
  assert.match(hero, /variant !== 'step' \|\| Boolean\(media\.photoSrc\)/)
  assert.match(read('components/RelationalEntityHeroPolish.module.css'), /\.hero \.grid\.gridNoMedia/)
})
