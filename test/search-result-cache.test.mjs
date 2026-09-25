import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const publicSource = readFileSync(
  new URL('../lib/supabase/tira-public.js', import.meta.url),
  'utf8'
)
const searchSource = readFileSync(
  new URL('../lib/supabase/search-live.js', import.meta.url),
  'utf8'
)

test('cachea el resultado completo del autocompletado durante 15 segundos', () => {
  assert.match(publicSource, /unstable_cache/)
  assert.match(publicSource, /hilo-cofrade-autocomplete-result-v1/)
  assert.match(publicSource, /revalidate:\s*15/)
  assert.match(publicSource, /getCachedPublicHiloEntities\(term, limit\)/)
})

test('la caché solo usa búsquedas completas', () => {
  assert.match(publicSource, /throwOnPartial:\s*true/)
  assert.match(searchSource, /PartialHiloSearchError/)
  assert.match(searchSource, /assertCompleteSearch\(failures, throwOnPartial\)/)
})

test('si la carga estricta falla, vuelve al camino directo no cacheado', () => {
  assert.match(publicSource, /catch \(error\)/)
  assert.match(publicSource, /runWithPublicSupabaseRead\(\(\) => searchHiloEntities\(term, limit\)\)/)
})

test('el modo estricto se aplica tanto al retorno sin candidatos como al retorno final', () => {
  const matches = searchSource.match(/assertCompleteSearch\(failures, throwOnPartial\)/g) || []
  assert.equal(matches.length, 2)
})
