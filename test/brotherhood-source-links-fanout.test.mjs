import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { buildSourceLinkOrFilters, classifyBrotherhoodSourceLinks } from '../lib/brotherhood-source-scope.js'

test('clasifica fuentes globales de agentes sin ocultar las que también documentan la ficha', () => {
  const rows = [
    { source_id: 'source-agent-only', entity_id: 'agent-a' },
    { source_id: 'source-shared', entity_id: 'agent-a' },
    { source_id: 'source-shared', step_phase_id: 'phase-a' },
    { source_id: 'source-visible-entity', entity_id: 'entity-a' },
    { source_id: 'source-visible-outing', outing_id: 'outing-a' },
    { source_id: 'source-visible-period', music_accompaniment_period_id: 'period-a' },
    { source_id: 'source-unrelated', entity_id: 'other-entity' },
  ]

  const { scopedSourceIds, agentSourceIds } = classifyBrotherhoodSourceLinks(rows, {
    entityTargetIds: ['entity-a'],
    stepPhaseIds: ['phase-a'],
    outingIds: ['outing-a'],
    musicPeriodIds: ['period-a'],
    agentIds: ['agent-a'],
  })

  assert.deepEqual([...agentSourceIds].sort(), ['source-agent-only', 'source-shared'])
  assert.deepEqual(
    [...scopedSourceIds].sort(),
    ['source-shared', 'source-visible-entity', 'source-visible-outing', 'source-visible-period']
  )

  const visible = rows
    .map((row) => row.source_id)
    .filter((sourceId, index, all) => all.indexOf(sourceId) === index)
    .filter((sourceId) => !agentSourceIds.has(sourceId) || scopedSourceIds.has(sourceId))

  assert.deepEqual(
    visible.sort(),
    ['source-shared', 'source-unrelated', 'source-visible-entity', 'source-visible-outing', 'source-visible-period']
  )
})

test('mantiene explícito el alcance histórico de outing_series', () => {
  const { scopedSourceIds } = classifyBrotherhoodSourceLinks([
    { source_id: 'series-source', outing_series_id: 'series-a' },
  ], {
    outingSeriesTargetIds: ['series-a'],
  })

  assert.equal(scopedSourceIds.has('series-source'), true)
})

test('brotherhood-display hace una sola lectura de source_links para acotar Fuentes', () => {
  const source = readFileSync(
    new URL('../lib/supabase/brotherhood-display.js', import.meta.url),
    'utf8'
  )
  const matches = source.match(/\.from\(['"]source_links['"]\)/g) || []

  assert.equal(matches.length, 1)
  assert.match(source, /\.in\('source_id', databaseSourceIds\)/)
  assert.match(source, /classifyBrotherhoodSourceLinks/)
})


test('agrupa objetivos de source_links en un OR y parte solo cuando supera el límite', () => {
  const compact = buildSourceLinkOrFilters([
    ['entity_id', ['a', 'b', 'a']],
    ['cult_id', ['c']],
  ])

  assert.deepEqual(compact, ['entity_id.in.(a,b),cult_id.in.(c)'])

  const split = buildSourceLinkOrFilters([
    ['entity_id', ['a', 'b', 'c', 'd']],
    ['step_phase_id', ['e', 'f', 'g']],
  ], {
    maxFilterLength: 35,
    maxIdsPerClause: 2,
  })

  assert.ok(split.length > 1)
  assert.ok(split.every((filter) => filter.length <= 35 || !filter.includes(',')))
  const joined = split.join(',')
  for (const value of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
    assert.match(joined, new RegExp(`(?:\\(|,)${value}(?:,|\\))`))
  }
})

test('brotherhoods agrupa el primer pase de Fuentes con OR indexable', () => {
  const source = readFileSync(
    new URL('../lib/supabase/brotherhoods.js', import.meta.url),
    'utf8'
  )

  assert.match(source, /buildSourceLinkOrFilters/)
  assert.match(source, /\.from\('source_links'\)[\s\S]*?\.or\(filter\)/)
  assert.doesNotMatch(source, /loadPublicRowsInBatches\(\s*sourceTargetIds/)
})
