import test from 'node:test'
import assert from 'node:assert/strict'

import { freeDirectIntent } from '../lib/tira-free-direct.js'

test('reconoce dedicatorias de marchas', () => {
  assert.equal(freeDirectIntent('¿A quién está dedicada Refúgiame?'), 'march_dedication')
  assert.equal(freeDirectIntent('¿Cuál es la dedicatoria de Refúgiame?'), 'march_dedication')
  assert.equal(freeDirectIntent('¿Y a quién está dedicada?', 'march'), 'march_dedication')
})

test('reconoce datación de composición', () => {
  assert.equal(freeDirectIntent('¿De qué año es Refúgiame?'), 'march_composition_date')
  assert.equal(freeDirectIntent('¿Cuándo se compuso Refúgiame?'), 'march_composition_date')
  assert.equal(freeDirectIntent('¿En qué año se compuso?', 'march'), 'march_composition_date')
})

test('reconoce estreno y clasificación musical', () => {
  assert.equal(freeDirectIntent('¿Cuándo se estrenó Refúgiame?'), 'march_premiere')
  assert.equal(freeDirectIntent('¿Dónde se estrenó Refúgiame?'), 'march_premiere')
  assert.equal(freeDirectIntent('¿Qué tipo de marcha es Refúgiame?'), 'march_type')
})

test('no secuestra preguntas que ya pertenecen al motor relacional', () => {
  assert.equal(freeDirectIntent('¿Quién compuso Refúgiame?'), null)
  assert.equal(freeDirectIntent('Busca alguna conexión entre El Baratillo y La Cena'), null)
})
