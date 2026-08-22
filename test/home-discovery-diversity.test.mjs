import test from 'node:test'
import assert from 'node:assert/strict'

import { selectDiverseHomeThreads } from '../lib/home-discovery-diversity.js'

test('prioriza universos distintos antes de repetir una misma hermandad', () => {
  const candidates = [
    { id: 'gran-poder-image' },
    { id: 'gran-poder-brotherhood' },
    { id: 'gran-poder-step' },
    { id: 'san-benito' },
    { id: 'banda-sol' },
  ]
  const families = new Map([
    ['gran-poder-image', 'brotherhood:gran-poder'],
    ['gran-poder-brotherhood', 'brotherhood:gran-poder'],
    ['gran-poder-step', 'brotherhood:gran-poder'],
    ['san-benito', 'brotherhood:san-benito'],
    ['banda-sol', 'band:sol'],
  ])

  assert.deepEqual(
    selectDiverseHomeThreads(candidates, families, 3).map((item) => item.id),
    ['gran-poder-image', 'san-benito', 'banda-sol']
  )
})

test('rellena con el mismo universo si no existen alternativas suficientes', () => {
  const candidates = [
    { id: 'a' },
    { id: 'b' },
    { id: 'c' },
  ]
  const families = new Map([
    ['a', 'brotherhood:one'],
    ['b', 'brotherhood:one'],
    ['c', 'brotherhood:two'],
  ])

  assert.deepEqual(
    selectDiverseHomeThreads(candidates, families, 3).map((item) => item.id),
    ['a', 'c', 'b']
  )
})
