import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { compactSeoTitle, contextualEntitySeoTitle, marchSeoTitle } from '../lib/seo.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('compactSeoTitle no deja separadores colgando antes de los puntos suspensivos', () => {
  const title = compactSeoTitle('Tú eres el orgullo de nuestro pueblo · Marcha procesional')
  assert.equal(title, 'Tú eres el orgullo de nuestro pueblo…')
  assert.doesNotMatch(compactSeoTitle('Cruceta musical de la Banda — repertorio completo de Semana Santa'), /[·—–\-|/,:;]\s*…$/)
})

test('las Imágenes homónimas se distinguen por Hermandad y localidad', () => {
  const cachorro = contextualEntitySeoTitle('Santísimo Cristo de la Expiración', { context: 'El Cachorro', locality: 'Sevilla' })
  const ecija = contextualEntitySeoTitle('Santísimo Cristo de la Expiración', { context: 'La Expiración', locality: 'Écija' })
  assert.equal(cachorro, 'Santísimo Cristo de la Expiración · El Cachorro (Sevilla)')
  assert.notEqual(cachorro, ecija)
})

test('el contexto no se repite si ya figura en el nombre', () => {
  assert.equal(
    contextualEntitySeoTitle('Paso del Ecce-Homo · Ecce-Homo de Lebrija', { context: 'Ecce-Homo de Lebrija', locality: 'Lebrija' }),
    'Paso del Ecce-Homo · Ecce-Homo de Lebrija'
  )
  assert.equal(
    contextualEntitySeoTitle('Nuestra Señora de los Dolores', { context: 'Dolores de La Rinconada', locality: 'La Rinconada' }),
    'Nuestra Señora de los Dolores · Dolores de La Rinconada'
  )
})

test('la localidad se omite antes que la Hermandad cuando el título es demasiado largo', () => {
  const title = contextualEntitySeoTitle(
    'Paso de misterio del Santísimo Cristo de la Salud y María Santísima de la Luz',
    { context: 'La Carretería', locality: 'Sevilla' }
  )
  assert.equal(title, 'Paso de misterio del Santísimo Cristo de la Salud y María Santísima de la Luz · La Carretería')
})

test('sin Hermandad ni localidad se conserva el nombre', () => {
  assert.equal(contextualEntitySeoTitle('Santa María Magdalena'), 'Santa María Magdalena')
  assert.equal(contextualEntitySeoTitle('  '), '')
})

test('las Marchas homónimas se distinguen por compositor', () => {
  assert.equal(marchSeoTitle('Macarena', ['Abel Moreno Gómez']), 'Macarena, de Abel Moreno Gómez')
  assert.notEqual(marchSeoTitle('Macarena', ['Abel Moreno Gómez']), marchSeoTitle('Macarena', ['Emilio Cebrián Ruiz']))
  assert.equal(marchSeoTitle('Amparo', ['A', 'B', 'C']), 'Amparo, de A y otros')
  assert.equal(marchSeoTitle('Coronación', []), 'Coronación · Marcha procesional')
})

test('un título de Marcha largo se acorta sin separadores colgando', () => {
  const title = marchSeoTitle('Tú eres el orgullo de nuestro pueblo', ['Pablo Ojeda Jiménez'])
  assert.ok(title.length <= 58)
  assert.doesNotMatch(title, /[·,]\s*…$/)
})

test('las fichas de Imagen, Paso y Marcha usan los títulos contextuales', () => {
  assert.match(read('app/imagenes/[slug]/page.js'), /const title = contextualEntitySeoTitle\(imagen\.nombre, \{\s*context: hermandad\?\.nombrePopular,\s*locality: hermandad\?\.localidad,/)
  assert.match(read('app/pasos/[slug]/page.js'), /const title = contextualEntitySeoTitle\(paso\.nombre, \{\s*context: hermandad\?\.nombrePopular,\s*locality: hermandad\?\.localidad,/)
  assert.match(read('app/marchas/[slug]/page.js'), /const title = marchSeoTitle\(\s*march\.name,\s*march\.authors\.filter\(\(author\) => author\.role === 'composer'\)/)
})
