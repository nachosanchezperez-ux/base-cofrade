import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const PERSON_PUBLIC_MODULES = [
  'lib/supabase/public-entity-pages.js',
  'lib/supabase/directories.js',
  'lib/supabase/step-heritage.js',
  'lib/supabase/bands.js',
  'lib/supabase/relational-presence.js',
  'components/BrotherhoodRelationalExtras.js',
]

const PERSON_PUBLIC_CLIENT_OWNERS = [
  'lib/supabase/public-entity-pages.js',
  'lib/supabase/directories.js',
  'lib/supabase/step-heritage.js',
  'lib/supabase/bands.js',
  'lib/supabase/relational-presence.js',
  'components/BrotherhoodRelationalExtras.js',
]

const PERSON_RLS_MIGRATION = 'supabase/migrations/20260823220500_harden_public_agent_relations.sql'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las superficies públicas que muestran Personas no dependen de cookies ni sesión editorial', async () => {
  for (const path of PERSON_PUBLIC_MODULES) {
    const code = await source(path)
    assert.doesNotMatch(code, /@\/lib\/supabase\/server(?:['"]|\/)/, `${path} no debe usar el cliente cookie-aware`)
    assert.doesNotMatch(code, /@supabase\/ssr/, `${path} no debe crear una sesión SSR`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
    assert.doesNotMatch(code, /\bcookies\s*\(/, `${path} no debe leer cookies`)
  }
})

test('los loaders públicos que consumen agentes usan createPublicClient de forma explícita', async () => {
  for (const path of PERSON_PUBLIC_CLIENT_OWNERS) {
    const code = await source(path)
    assert.match(code, /@\/lib\/supabase\/public['"]/, `${path} debe importar el cliente público`)
    assert.match(code, /createPublicClient/, `${path} debe crear una lectura anon stateless`)
  }
})

test('autorías, compositores, capataces, artesanos y dirección filtran Personas publicables', async () => {
  const entityPages = await source('lib/supabase/public-entity-pages.js')
  const directories = await source('lib/supabase/directories.js')
  const stepHeritage = await source('lib/supabase/step-heritage.js')
  const bands = await source('lib/supabase/bands.js')

  assert.match(entityPages, /image_authorships/)
  assert.match(entityPages, /entity_type['"],?\s*['"]agent['"]/)
  assert.match(entityPages, /status['"],?\s*['"]published['"]/)

  assert.match(directories, /image_authorship_details/)
  assert.match(directories, /step_phase_details/)
  assert.match(directories, /entity_type['"],?\s*['"]agent['"]/)
  assert.match(directories, /status['"],?\s*['"]published['"]/)

  assert.match(stepHeritage, /step_phase_agents/)
  assert.match(stepHeritage, /entity_type['"],?\s*['"]agent['"]/)
  assert.match(stepHeritage, /status['"],?\s*['"]published['"]/)

  assert.match(bands, /band_agents/)
  assert.match(bands, /march_authors/)
  assert.match(bands, /heritage_interventions/)
  assert.match(bands, /entity_type, status/)
})

test('el buscador público de Personas conserva la frontera anon de Tira del hilo', async () => {
  const searchRoute = await source('app/api/tira-del-hilo/search/route.js')
  const publicBoundary = await source('lib/supabase/tira-public.js')
  const server = await source('lib/supabase/server.js')
  const guardIndex = server.indexOf('isPublicSupabaseRead()')
  const cookieIndex = server.indexOf('await cookies()')

  assert.match(searchRoute, /@\/lib\/supabase\/tira-public/)
  assert.doesNotMatch(searchRoute, /@\/lib\/supabase\/search-live/)
  assert.doesNotMatch(searchRoute, /@\/lib\/supabase\/server/)
  assert.match(publicBoundary, /runWithPublicSupabaseRead/)
  assert.match(publicBoundary, /searchHiloEntities/)
  assert.ok(guardIndex >= 0, 'server.js debe detectar el contexto público')
  assert.ok(cookieIndex >= 0, 'server.js debe conservar cookies para el Panel')
  assert.ok(guardIndex < cookieIndex, 'la lectura pública debe resolverse antes de consultar cookies')
})

test('las políticas públicas de Personas exigen extremos publicados sin alterar datos', async () => {
  const migration = await source(PERSON_RLS_MIGRATION)

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
    assert.match(migration, new RegExp(`create policy "${policy}"`), `falta proteger ${policy}`)
  }

  assert.match(migration, /to anon, authenticated/g)
  assert.match(migration, /agent\.entity_type = 'agent'/)
  assert.match(migration, /agent\.status = 'published'/)
  assert.match(migration, /image\.status = 'published'/)
  assert.match(migration, /march\.status = 'published'/)
  assert.match(migration, /step\.status = 'published'/)
  assert.match(migration, /band\.status = 'published'/)
  assert.match(migration, /source\.status = 'published'/)
  assert.match(migration, /target\.status = 'published'/)
  assert.match(migration, /agent_entity_id is null/)

  assert.doesNotMatch(migration, /\binsert\s+into\b/i)
  assert.doesNotMatch(migration, /\bupdate\s+public\./i)
  assert.doesNotMatch(migration, /\bdelete\s+from\b/i)
})

test('el cliente público compartido continúa siendo stateless', async () => {
  const publicClient = await source('lib/supabase/public.js')

  assert.match(publicClient, /@supabase\/supabase-js/)
  assert.doesNotMatch(publicClient, /@supabase\/ssr/)
  assert.doesNotMatch(publicClient, /next\/headers/)
  assert.match(publicClient, /persistSession:\s*false/)
  assert.match(publicClient, /autoRefreshToken:\s*false/)
  assert.match(publicClient, /detectSessionInUrl:\s*false/)
})
