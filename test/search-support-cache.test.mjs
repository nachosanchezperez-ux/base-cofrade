import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(
  new URL('../lib/supabase/search-live.js', import.meta.url),
  'utf8'
)

test('cachea durante 60 segundos los catálogos auxiliares del buscador', () => {
  assert.match(source, /unstable_cache/)
  assert.match(source, /hilo-cofrade-search-support-v1/)
  assert.match(source, /revalidate:\s*60/)
  assert.match(source, /from\('brotherhoods'\)\.select\('entity_id, popular_name, official_name'\)/)
  assert.match(source, /from\('band_names'\)\.select\('band_entity_id, name, short_name'\)/)
  assert.match(source, /from\('entity_names'\)\.select\('entity_id, name, status'\)/)
  assert.match(source, /from\('agent_names'\)\.select\('agent_entity_id, name'\)/)
  assert.match(source, /from\('municipalities'\)\.select\('id, name'\)\.order\('name'\)/)
})

test('la primera ola del buscador reutiliza el snapshot de soporte', () => {
  const start = source.indexOf('export async function searchHiloEntities')
  const scope = source.indexOf('const scope = parseHiloSearchScope', start)
  const firstWave = source.slice(start, scope)

  assert.match(firstWave, /getSearchSupportRows\(supabase, term, pattern, candidateLimit, failures\)/)
  assert.match(firstWave, /const \{[\s\S]*brotherhoodPopularRows[\s\S]*municipalities[\s\S]*\} = searchSupport/)
})

test('mantiene fallback a las consultas directas si el snapshot falla', () => {
  assert.match(source, /stage: 'search_support_snapshot'/)
  assert.match(source, /brotherhood_popular_names/)
  assert.match(source, /brotherhood_official_names/)
  assert.match(source, /band_short_names/)
  assert.match(source, /agent_aliases/)
})
