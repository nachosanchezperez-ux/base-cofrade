import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const searchSource = readFileSync(
  new URL('../lib/supabase/search-live.js', import.meta.url),
  'utf8'
)
const baseline = readFileSync(
  new URL('../supabase/migrations/20260831070000_first_edition_baseline.sql', import.meta.url),
  'utf8'
)

test('el buscador no repite el filtro de tipos que ya impone entities', () => {
  const start = searchSource.indexOf('export async function searchHiloEntities')
  const end = searchSource.indexOf('const scope = parseHiloSearchScope', start)
  const firstWave = searchSource.slice(start, end)

  assert.match(firstWave, /\.from\('entities'\)[\s\S]*?\.ilike\('name', pattern\)/)
  assert.match(firstWave, /\.from\('entities'\)[\s\S]*?\.ilike\('summary', pattern\)/)

  const entityNameQuery = firstWave.match(/optionalRows\(supabase\.from\('entities'\)[\s\S]*?'entity_names', failures\)/)?.[0] || ''
  const entitySummaryQuery = firstWave.match(/optionalRows\(supabase\.from\('entities'\)[\s\S]*?'entity_summaries', failures\)/)?.[0] || ''

  assert.doesNotMatch(entityNameQuery, /\.in\('entity_type', SEARCHABLE_TYPES\)/)
  assert.doesNotMatch(entitySummaryQuery, /\.in\('entity_type', SEARCHABLE_TYPES\)/)
})

test('el constraint de entities coincide con los tipos públicos del buscador', () => {
  const expectedTypes = [
    'brotherhood',
    'advocation',
    'image',
    'step',
    'agent',
    'band',
    'march',
    'event',
    'heritage_asset',
  ]

  assert.match(baseline, /entities_entity_type_check/i)
  for (const type of expectedTypes) {
    assert.match(baseline, new RegExp(`['"]${type}['"]`))
  }
})
