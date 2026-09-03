import test from 'node:test'
import assert from 'node:assert/strict'

import { meetsPublicEditorialMinimum } from '../lib/supabase/public-entity-page.js'

const base = {
  identity: 'Nuestra Señora de la Estrella Coronada',
  type: 'Gloria · Sacramental',
  context: 'Coria del Río',
  summary: 'Hermandad patronal documentada con sede, titular, cultos y salidas.',
  relations: [[{ name: 'Nuestra Señora de la Estrella Coronada' }]],
  sources: [{ id: 'source-1' }],
}

test('un hueco secundario documentado no bloquea la indexación de una ficha completa', () => {
  assert.equal(meetsPublicEditorialMinimum({
    ...base,
    publicValues: {
      nombre: 'Estrella de Coria del Río',
      pasos: [{ notes: 'Autoría original por documentar' }],
      salidas: [{ notes: 'Hora pendiente de confirmación oficial' }],
    },
  }), true)
})

test('un placeholder editorial de primer nivel sigue bloqueando la indexación', () => {
  assert.equal(meetsPublicEditorialMinimum({
    ...base,
    publicValues: {
      nombre: 'Estrella de Coria del Río',
      resumenEditorial: 'Pendiente de documentar',
    },
  }), false)
})

test('un resumen esencial placeholder sigue sin superar el mínimo editorial', () => {
  assert.equal(meetsPublicEditorialMinimum({
    ...base,
    summary: 'Pendiente de documentar',
    publicValues: {},
  }), false)
})
