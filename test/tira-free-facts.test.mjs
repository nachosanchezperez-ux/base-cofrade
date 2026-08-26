import test from 'node:test'
import assert from 'node:assert/strict'

import {
  freeFactIntent,
  freeSetIntent,
} from '../lib/tira-free-facts.js'

test('reconoce opciones de escucha de una marcha', () => {
  assert.deepEqual(
    freeFactIntent('¿Dónde puedo escuchar Refúgiame?'),
    { kind: 'march_listen', entityTypes: ['march'] }
  )
  assert.deepEqual(
    freeFactIntent('¿Está en Spotify?', 'march'),
    { kind: 'march_listen', entityTypes: ['march'] }
  )
})

test('reconoce hechos básicos de hermandades y bandas', () => {
  assert.deepEqual(
    freeFactIntent('¿Cuándo se fundó El Baratillo?'),
    { kind: 'foundation', entityTypes: ['brotherhood', 'band'] }
  )
  assert.deepEqual(
    freeFactIntent('¿Qué tipo de hermandad es La Cena?'),
    { kind: 'brotherhood_type', entityTypes: ['brotherhood'] }
  )
  assert.deepEqual(
    freeFactIntent('¿De qué localidad es la Banda del Sol?'),
    { kind: 'location', entityTypes: ['band', 'brotherhood'] }
  )
})

test('reconoce datos materiales y técnicos de imágenes y pasos', () => {
  assert.deepEqual(
    freeFactIntent('¿Qué técnica tiene esta imagen?', 'image'),
    { kind: 'image_technique', entityTypes: ['image'] }
  )
  assert.deepEqual(
    freeFactIntent('¿Cuántas trabajaderas tiene este paso?', 'step'),
    { kind: 'step_workbenches', entityTypes: ['step'] }
  )
  assert.deepEqual(
    freeFactIntent('¿De qué material es?', 'step'),
    { kind: 'material', entityTypes: ['step'] }
  )
})

test('reconoce coincidencias sobre un conjunto conversado', () => {
  assert.deepEqual(
    freeSetIntent('¿Qué tienen en común?', 'image'),
    { kind: 'set_common', entityType: 'image' }
  )
  assert.deepEqual(
    freeSetIntent('¿Qué comparten todas?', 'march'),
    { kind: 'set_common', entityType: 'march' }
  )
  assert.equal(freeSetIntent('Compáralas.', 'image'), null)
})

test('no secuestra intents relacionales existentes', () => {
  assert.equal(freeFactIntent('¿Quién compuso Refúgiame?'), null)
  assert.equal(freeFactIntent('¿Qué bandas acompañan al Baratillo?'), null)
  assert.equal(freeFactIntent('Busca una conexión entre El Baratillo y La Cena'), null)
})
