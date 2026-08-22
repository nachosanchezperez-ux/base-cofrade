import test from 'node:test'
import assert from 'node:assert/strict'

import {
  chooseDiscoveryCandidate,
  discoveryDateKey,
  isDiscoveryIntent,
  stableHash,
} from '../lib/tira-discovery.js'

test('detecta peticiones de descubrimiento', () => {
  assert.equal(isDiscoveryIntent('Tira de algún hilo curioso sobre San Benito'), true)
  assert.equal(isDiscoveryIntent('Sorpréndeme con una relación'), true)
  assert.equal(isDiscoveryIntent('Muéstrame una conexión curiosa'), true)
  assert.equal(isDiscoveryIntent('¿Qué bandas acompañan a La Cena?'), false)
})

test('la selección es estable para la misma semilla', () => {
  const candidates = [
    { id: 'a', name: 'A', score: 100 },
    { id: 'b', name: 'B', score: 90 },
    { id: 'c', name: 'C', score: 80 },
  ]
  assert.deepEqual(
    chooseDiscoveryCandidate(candidates, '2026-08-22|seed'),
    chooseDiscoveryCandidate(candidates, '2026-08-22|seed')
  )
})

test('elimina duplicados antes de elegir', () => {
  const result = chooseDiscoveryCandidate([
    { id: 'a', name: 'A', score: 10 },
    { id: 'a', name: 'A repetida', score: 100 },
  ], 'x')
  assert.equal(result.id, 'a')
})

test('hash y fecha de descubrimiento son deterministas', () => {
  assert.equal(stableHash('abc'), stableHash('abc'))
  assert.match(discoveryDateKey(new Date('2026-08-22T00:00:00Z')), /^2026-08-22$/)
})
