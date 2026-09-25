import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(
  new URL('../lib/supabase/search-live.js', import.meta.url),
  'utf8'
)

test('cachea por 30 segundos los contenidos resueltos del buscador', () => {
  assert.match(source, /hilo-cofrade-search-content-v1/)
  assert.match(source, /revalidate:\s*30/)
  assert.match(source, /getCachedPublishedContentSearch\(term, candidateLimit\)/)
})

test('no conserva snapshots parciales de contenidos', () => {
  assert.match(source, /const failures = \[\]/)
  assert.match(source, /if \(failures\.length\)/)
  assert.match(source, /SearchContentCacheLoadError/)
})

test('mantiene fallback al camino directo si falla la caché', () => {
  assert.match(source, /stage: 'content_search_cache'/)
  assert.match(source, /loadPublishedContentSearchUncached\(\s*supabase,\s*term,\s*candidateLimit,\s*failures\s*\)/)
})
