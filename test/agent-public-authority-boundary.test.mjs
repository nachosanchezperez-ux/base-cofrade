import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const AGENT_PUBLIC_MODULES = [
  'lib/supabase/search-live.js',
  'lib/supabase/search.js',
  'lib/supabase/directories.js',
  'lib/supabase/public-entity-pages.js',
  'lib/supabase/brotherhoods.js',
  'lib/supabase/brotherhood-display.js',
  'lib/supabase/brotherhood-musical-heritage.js',
  'lib/supabase/step-heritage.js',
  'lib/supabase/bandDiscography.js',
  'lib/supabase/tira-public.js',
  'app/api/tira-del-hilo/search/route.js',
]

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las superficies públicas que muestran personas no dependen de la sesión editorial', async () => {
  for (const path of AGENT_PUBLIC_MODULES) {
    const code = await source(path)
    assert.doesNotMatch(code, /@\/lib\/supabase\/server(?:['"]|\/)/, `${path} no debe depender del cliente cookie-aware`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
  }
})

test('los dos buscadores de entidades usan el cliente público stateless', async () => {
  for (const path of ['lib/supabase/search-live.js', 'lib/supabase/search.js']) {
    const code = await source(path)
    assert.match(code, /@\/lib\/supabase\/public['"]/)
    assert.match(code, /createPublicClient as createClient/)
    assert.match(code, /entity_type.*agent|agent.*entity_type/s)
    assert.match(code, /Autor \/ profesional/)
  }

  const publicClient = await source('lib/supabase/public.js')
  assert.match(publicClient, /@supabase\/supabase-js/)
  assert.doesNotMatch(publicClient, /@supabase\/ssr/)
  assert.doesNotMatch(publicClient, /next\/headers/)
  assert.match(publicClient, /persistSession:\s*false/)
  assert.match(publicClient, /autoRefreshToken:\s*false/)
  assert.match(publicClient, /detectSessionInUrl:\s*false/)
})

test('el autocompletado de Tira del hilo conserva el wrapper público y no inventa una ruta de persona', async () => {
  const route = await source('app/api/tira-del-hilo/search/route.js')
  const tiraPublic = await source('lib/supabase/tira-public.js')
  const liveSearch = await source('lib/supabase/search-live.js')

  assert.match(route, /searchPublicHiloEntities/)
  assert.match(tiraPublic, /runWithPublicSupabaseRead/)
  assert.match(tiraPublic, /searchHiloEntities/)
  assert.match(liveSearch, /agent:\s*'Autor \/ profesional'/)
  assert.match(liveSearch, /NAVIGABLE_TYPES = new Set\(\['brotherhood', 'image', 'step', 'band'\]\)/)
})

test('el historial conserva la migración inicial y la política final endurece todas las relaciones públicas de agentes', async () => {
  const initialMigration = await source('supabase/migrations/20260823211405_public_agent_relation_integrity.sql')
  const hardenedMigration = await source('supabase/migrations/20260823211610_harden_public_agent_relations.sql')

  assert.match(initialMigration, /on public\.heritage_update_agents/i)

  for (const relation of [
    'agent_roles',
    'image_authorships',
    'march_authors',
    'step_personnel_periods',
    'step_phase_agents',
    'heritage_interventions',
    'heritage_update_agents',
    'band_agents',
    'entity_relations',
  ]) {
    assert.match(hardenedMigration, new RegExp(`on public\\.${relation}`, 'i'))
  }

  const publicSelectPolicies = hardenedMigration.match(/for select\s+to anon,\s*authenticated/gi) || []
  assert.equal(publicSelectPolicies.length, 9)

  assert.match(hardenedMigration, /agent\.entity_type = 'agent'/)
  assert.match(hardenedMigration, /image\.entity_type = 'image'/)
  assert.match(hardenedMigration, /march\.entity_type = 'march'/)
  assert.match(hardenedMigration, /step\.entity_type = 'step'/)
  assert.match(hardenedMigration, /band\.entity_type = 'band'/)
  assert.match(hardenedMigration, /brotherhood\.entity_type = 'brotherhood'/)
  assert.match(hardenedMigration, /brotherhood\.status = 'published'/)
  assert.match(hardenedMigration, /heritage_update\.target_entity_id is null/)
  assert.match(hardenedMigration, /target\.status = 'published'/)
  assert.match(hardenedMigration, /source\.status = 'published'/)
  assert.match(hardenedMigration, /\bis_public\b/)
})
