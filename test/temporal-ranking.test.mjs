import test from 'node:test'
import assert from 'node:assert/strict'

import { sortTemporal, temporalIntent, temporalValue } from '../lib/temporal-ranking.js'

test('extrae años exactos y siglos sin inventar un año visible', () => {
  assert.deepEqual(temporalValue('1955'), { sort: 1955, precision: 'year', label: '1955', year: 1955 })
  const century = temporalValue('Mediados del siglo XIX')
  assert.equal(century.precision, 'century')
  assert.equal(century.century, 19)
  assert.equal(century.label, 'Mediados del siglo XIX')
})

test('ordena por antigüedad dejando sin datar al margen', () => {
  const result = sortTemporal([
    { name: 'C', dateText: '' },
    { name: 'B', dateText: '1955' },
    { name: 'A', dateText: 'Siglo XVII' },
  ], 'oldest')

  assert.deepEqual(result.dated.map((item) => item.name), ['A', 'B'])
  assert.deepEqual(result.undated.map((item) => item.name), ['C'])
})

test('entiende extremos y órdenes temporales', () => {
  assert.deepEqual(temporalIntent('¿Cuál es la más antigua?'), { direction: 'oldest', mode: 'extreme' })
  assert.deepEqual(temporalIntent('Ordénalas de más antigua a más reciente'), { direction: 'oldest', mode: 'sort' })
  assert.deepEqual(temporalIntent('Ordénalas de más reciente a más antigua'), { direction: 'newest', mode: 'sort' })
  assert.deepEqual(temporalIntent('¿Cuál es la más reciente?'), { direction: 'newest', mode: 'extreme' })
})
