import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildHiloDirectoryItems,
  parseHiloSearchScope,
} from '../lib/hilo-search-scope.js'

const municipalities = ['Sevilla', 'La Rinconada', 'Cantillana', 'Gerena']

test('reconoce búsquedas territoriales sin depender de excepciones nominales', () => {
  assert.deepEqual(parseHiloSearchScope('La Rinconada', municipalities), {
    query: 'La Rinconada',
    municipality: 'La Rinconada',
    processionDay: '',
    entityGroup: 'mixed',
    brotherhoodType: '',
  })

  assert.deepEqual(parseHiloSearchScope('Bandas de Gerena', municipalities), {
    query: 'Bandas de Gerena',
    municipality: 'Gerena',
    processionDay: '',
    entityGroup: 'band',
    brotherhoodType: '',
  })

  assert.equal(parseHiloSearchScope('Baratillo', municipalities), null)
})

test('combina jornada, municipio y tipo de corporación', () => {
  assert.deepEqual(parseHiloSearchScope('Lunes Santo Sevilla', municipalities), {
    query: 'Lunes Santo Sevilla',
    municipality: 'Sevilla',
    processionDay: 'Lunes Santo',
    entityGroup: 'brotherhood',
    brotherhoodType: '',
  })

  assert.equal(
    parseHiloSearchScope('Agrupaciones parroquiales de La Rinconada', municipalities)?.brotherhoodType,
    'Agrupación Parroquial'
  )
})

test('genera accesos a listados indexables junto a las fichas', () => {
  const territorial = buildHiloDirectoryItems(
    parseHiloSearchScope('La Rinconada', municipalities),
    { brotherhoodCount: 7, bandCount: 1 }
  )

  assert.deepEqual(territorial.map((item) => item.href), [
    '/hermandades/localidad/la-rinconada',
    '/bandas/localidad/la-rinconada',
  ])
  assert.equal(territorial[0].actionLabel, 'Ver listado')

  const day = buildHiloDirectoryItems(
    parseHiloSearchScope('Lunes Santo Sevilla', municipalities),
    { brotherhoodCount: 9 }
  )
  assert.equal(day[0].href, '/hermandades/semana-santa/sevilla-capital/lunes-santo')

  const root = buildHiloDirectoryItems(
    parseHiloSearchScope('Hermandades', municipalities),
    { brotherhoodCount: 36 }
  )
  assert.equal(root[0].subtitle, 'Todas las fichas publicadas')
})
