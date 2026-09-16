import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const migration = readFileSync(
  new URL('../supabase/migrations/20260916210500_source_links_public_lookup_indexes.sql', import.meta.url),
  'utf8'
)

test('source_links indexa los ámbitos consultados por las fichas de Hermandad', () => {
  for (const column of [
    'entity_id',
    'cult_id',
    'heritage_update_id',
    'intervention_id',
    'step_phase_id',
    'outing_series_id',
    'music_accompaniment_period_id',
  ]) {
    assert.match(migration, new RegExp(`\\(${column}, source_id\\)`))
    assert.match(migration, new RegExp(`where ${column} is not null`))
  }
})
