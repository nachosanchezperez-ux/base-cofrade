import test from 'node:test'
import assert from 'node:assert/strict'

import { buildTiraEvidence, withTiraEvidence } from '../lib/tira-evidence.js'

test('explica una respuesta de acompañamientos actuales', () => {
  const result = buildTiraEvidence({
    kind: 'answer',
    answer: 'Hay dos bandas relacionadas.',
    path: ['Filtros', 'Hermandades', 'Acompañamientos', 'Bandas'],
    items: [{}, {}],
  })

  assert.equal(result[0].key, 'current_music')
})

test('distingue periodos históricos de acompañamientos actuales', () => {
  const result = buildTiraEvidence({
    kind: 'answer',
    answer: 'Ranking histórico.',
    path: ['Bandas', 'Acompañamientos históricos', 'Hermandades', 'Recuento'],
    items: [{}],
  })

  assert.deepEqual(result.map((item) => item.key), ['music_periods', 'derived_count'])
})

test('describe el sustento de una ruta del grafo', () => {
  const result = buildTiraEvidence({
    kind: 'answer',
    answer: 'He encontrado un camino documentado de 4 relaciones entre A y B.',
    path: ['Hermandad', 'Paso', 'Autor', 'Paso', 'Hermandad'],
    items: [{}, {}, {}, {}],
  })

  assert.equal(result[0].key, 'public_graph')
  assert.match(result[0].detail, /4 relaciones/)
})

test('combina datación y relación hermandad-imagen', () => {
  const result = buildTiraEvidence({
    kind: 'answer',
    answer: 'Tres imágenes anteriores.',
    path: ['Hermandad', 'Imágenes', 'Datación'],
    items: [{}, {}, {}],
  })

  assert.deepEqual(result.map((item) => item.key), ['image_dates', 'brotherhood_images'])
})

test('no añade evidencia a ausencia explícita', () => {
  const response = { kind: 'not_documented', answer: 'No documentado.' }
  assert.deepEqual(buildTiraEvidence(response), [])
  assert.deepEqual(withTiraEvidence(response), response)
})
