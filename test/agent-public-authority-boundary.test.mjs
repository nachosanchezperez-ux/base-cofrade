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
    assert.doesNotMatch(code, /@supabase\/ssr/, `${path} no debe crear una sesión SSR pública`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
    assert.doesNotMatch(code, /\bcookies\s*\(/, `${path} no debe consultar cookies`)
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

test('la primera migración pública exige endpoints publicados en las relaciones de agentes', async () => {
  const migration = await source('supabase/migrations/20260823211405_public_agent_relation_integrity.sql')

  for (const relation of [
    'image_authorships',
    'heritage_interventions',
    'step_personnel_periods',
    'step_phase_agents',
    'heritage_update_agents',
    'march_authors',
    'entity_relations',
  ]) {
    assert.match(migration, new RegExp(`ON public\\.${relation}`, 'i'))
  }

  assert.match(migration, /agent_entity\.status = 'published'/)
  assert.match(migration, /step_entity\.status = 'published'/)
  assert.match(migration, /source_entity\.status = 'published'/)
  assert.match(migration, /target_entity\.status = 'published'/)
})

test('el endurecimiento final de Personas cubre roles, bandas y extremos publicables', async () => {
  const migration = await source('supabase/migrations/20260823211610_harden_public_agent_relations.sql')

  for (const policy of [
    'Public agent roles',
    'Published image authorships',
    'Published march authors',
    'Published step personnel periods',
    'Public step phase agents',
    'Published heritage interventions',
    'Public heritage update agents',
    'Public band agents',
    'Published entity relations',
  ]) {
    assert.match(migration, new RegExp(`create policy "${policy}"`, 'i'), `falta proteger ${policy}`)
  }

  assert.match(migration, /to anon, authenticated/)
  assert.match(migration, /agent\.entity_type = 'agent'/)
  assert.match(migration, /agent\.status = 'published'/)
  assert.match(migration, /image\.status = 'published'/)
  assert.match(migration, /march\.status = 'published'/)
  assert.match(migration, /step\.status = 'published'/)
  assert.match(migration, /band\.status = 'published'/)
  assert.match(migration, /source\.status = 'published'/)
  assert.match(migration, /target\.status = 'published'/)
  assert.doesNotMatch(migration, /\binsert\s+into\b/i)
  assert.doesNotMatch(migration, /\bupdate\s+public\./i)
  assert.doesNotMatch(migration, /\bdelete\s+from\b/i)
})
