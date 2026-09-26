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

test('prefiere relaciones distintas cuando existen alternativas recientes', () => {
  const candidates = [
    { id: 'gran-poder-capataces', activityKind: 'step_personnel' },
    { id: 'pastora-capataces', activityKind: 'step_personnel' },
    { id: 'cigarreras-capataces', activityKind: 'step_personnel' },
    { id: 'baratillo-musica', activityKind: 'musical_heritage' },
    { id: 'cena-titulares', activityKind: 'titularity' },
  ]
  const families = new Map([
    ['gran-poder-capataces', 'brotherhood:gran-poder'],
    ['pastora-capataces', 'brotherhood:pastora'],
    ['cigarreras-capataces', 'brotherhood:cigarreras'],
    ['baratillo-musica', 'brotherhood:baratillo'],
    ['cena-titulares', 'brotherhood:cena'],
  ])

  assert.deepEqual(
    selectDiverseHomeThreads(candidates, families, 3).map((item) => item.id),
    ['gran-poder-capataces', 'baratillo-musica', 'cena-titulares']
  )
})


test('no abandona una tanda reciente solo para buscar otro tipo de relación antiguo', () => {
  const recent = Array.from({ length: 8 }, (_, index) => ({
    id: `recent-${index + 1}`,
    activityKind: 'titularity',
  }))
  const candidates = [
    ...recent,
    { id: 'older-music', activityKind: 'musical_heritage' },
    { id: 'older-step', activityKind: 'step_personnel' },
  ]
  const families = new Map(candidates.map((item) => [item.id, `family:${item.id}`]))

  assert.deepEqual(
    selectDiverseHomeThreads(candidates, families, 3).map((item) => item.id),
    ['recent-1', 'recent-2', 'recent-3']
  )
})
