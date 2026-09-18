import assert from 'node:assert/strict'
import test from 'node:test'

import { getHiloLookupIntent } from '../lib/tira-search-intent.js'

test('la navegación directa sigue abriendo entidades concretas', () => {
  assert.deepEqual(
    getHiloLookupIntent('El Baratillo'),
    { term: 'El Baratillo', explicitNavigation: false }
  )
  assert.deepEqual(
    getHiloLookupIntent('Abre la ficha de La Cena'),
    { term: 'Cena', explicitNavigation: true }
  )
})

test('los listados territoriales no se secuestran como una búsqueda de ficha', () => {
  assert.equal(getHiloLookupIntent('Hermandades de La Rinconada'), null)
  assert.equal(getHiloLookupIntent('Las hermandades de La Rinconada'), null)
  assert.equal(getHiloLookupIntent('Todas las hermandades de La Rinconada'), null)
  assert.equal(getHiloLookupIntent('Las bandas de Gerena'), null)
  assert.equal(getHiloLookupIntent('Busca las hermandades de La Rinconada'), null)
  assert.equal(getHiloLookupIntent('Muestra las hermandades del Lunes Santo en Sevilla'), null)
})

test('las jornadas de Semana Santa llegan al motor territorial antes que al autocompletado', () => {
  assert.equal(getHiloLookupIntent('Lunes Santo'), null)
  assert.equal(getHiloLookupIntent('El Lunes Santo en Sevilla'), null)
  assert.equal(getHiloLookupIntent('La Madrugada de Sevilla'), null)
  assert.equal(getHiloLookupIntent('Sábado de Pasión en Sevilla'), null)
})
