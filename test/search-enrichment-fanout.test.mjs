import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { selectCandidatesForEnrichment } from '../lib/search-enrichment-selection.js'

test('mantiene todos los empates en el corte del enriquecimiento', () => {
  const candidates = [
    { id: 'a', entity_type: 'march' },
    { id: 'b', entity_type: 'image' },
    { id: 'c', entity_type: 'step' },
    { id: 'd', entity_type: 'agent' },
    { id: 'e', entity_type: 'event' },
  ]
  const scoreById = new Map([
    ['a', 100],
    ['b', 90],
    ['c', 80],
    ['d', 80],
    ['e', 10],
  ])

  assert.deepEqual(
    selectCandidatesForEnrichment(candidates, { limit: 3, scoreById }).map((item) => item.id),
    ['a', 'b', 'c', 'd']
  )
})

test('preserva todas las Hermandades antes de resolver su nombre popular', () => {
  const candidates = [
    { id: 'h-low', entity_type: 'brotherhood' },
    { id: 'm-high', entity_type: 'march' },
    { id: 'i-mid', entity_type: 'image' },
    { id: 's-low', entity_type: 'step' },
  ]
  const scoreById = new Map([
    ['h-low', 1],
    ['m-high', 100],
    ['i-mid', 80],
    ['s-low', 10],
  ])

  assert.deepEqual(
    selectCandidatesForEnrichment(candidates, {
      limit: 1,
      scoreById,
      alwaysIncludeTypes: ['brotherhood'],
    }).map((item) => item.id),
    ['h-low', 'm-high']
  )
})

test('search-live usa el shortlist para todas las consultas de enriquecimiento', () => {
  const source = readFileSync(
    new URL('../lib/supabase/search-live.js', import.meta.url),
    'utf8'
  )

  assert.match(source, /selectCandidatesForEnrichment/)
  assert.match(source, /const enrichmentCandidates = selectCandidatesForEnrichment/)
  assert.match(source, /const candidateIds = enrichmentCandidates\.map/)
  assert.match(source, /const imageIds = enrichmentCandidates\.filter/)
  assert.match(source, /const stepIds = enrichmentCandidates\.filter/)
  assert.match(source, /const marchIds = enrichmentCandidates\.filter/)
  assert.match(source, /const entityResults = enrichmentCandidates/)
})
