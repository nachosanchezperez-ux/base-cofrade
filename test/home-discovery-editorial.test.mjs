import assert from 'node:assert/strict'
import test from 'node:test'

import { isEditorialHomeThread } from '../lib/home-discovery-editorial.js'

test('una ficha recién creada no ocupa Últimos hilos sin conocimiento relacionado', () => {
  assert.equal(isEditorialHomeThread({ activity_kind: 'entity_new' }), false)
})

test('las relaciones y ampliaciones documentadas sí pueden promocionarse', () => {
  for (const activityKind of [
    'titularity',
    'brotherhood_steps',
    'musical_heritage',
    'posters',
    'discography',
    'heritage_interventions',
  ]) {
    assert.equal(isEditorialHomeThread({ activity_kind: activityKind }), true)
  }
})

test('una fila incompleta nunca entra en la selección editorial', () => {
  assert.equal(isEditorialHomeThread(null), false)
  assert.equal(isEditorialHomeThread({}), false)
})
