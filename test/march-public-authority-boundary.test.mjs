import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const MARCH_PUBLIC_MODULES = [
  'lib/supabase/home-v2.js',
  'lib/supabase/bandDiscography.js',
]

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las lecturas públicas de Marchas no dependen del cliente de sesión ni de next/headers', async () => {
  for (const path of MARCH_PUBLIC_MODULES) {
    const code = await source(path)
    assert.doesNotMatch(code, /@\/lib\/supabase\/server(?:['"]|\/)/, `${path} no debe depender del cliente cookie-aware`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
  }
})

test('la Marcha del día usa el cliente público stateless y parte de datos publicados', async () => {
  const home = await source('lib/supabase/home-v2.js')
  const publicServer = await source('lib/supabase/public-server.js')

  assert.match(home, /@\/lib\/supabase\/public-server['"]/)
  assert.match(home, /\.from\('daily_march_candidates'\)/)
  assert.match(home, /async function marchCard\(supabase, marchEntityId\)/)
  assert.match(home, /\.from\('marches'\)/)
  assert.match(home, /\.from\('march_recordings'\)/)
  assert.match(home, /\.eq\('status', 'published'\)/)

  assert.match(publicServer, /@supabase\/supabase-js/)
  assert.doesNotMatch(publicServer, /@supabase\/ssr/)
  assert.doesNotMatch(publicServer, /next\/headers/)
  assert.match(publicServer, /persistSession:\s*false/)
  assert.match(publicServer, /autoRefreshToken:\s*false/)
  assert.match(publicServer, /detectSessionInUrl:\s*false/)
})

test('la discografía resuelve Marchas, autorías y dedicatorias con cliente público explícito', async () => {
  const discography = await source('lib/supabase/bandDiscography.js')
  const publicClient = await source('lib/supabase/public.js')

  assert.match(discography, /@\/lib\/supabase\/public['"]/)
  assert.match(discography, /createPublicClient\(\)/)
  assert.match(discography, /\.from\('band_release_tracks'\)/)
  assert.match(discography, /\.from\('march_authors'\)/)
  assert.match(discography, /\.from\('march_dedications'\)/)
  assert.match(discography, /author_role === 'composer'/)
  assert.doesNotMatch(discography, /@\/lib\/supabase\/server(?:['"]|\/)/)

  assert.match(publicClient, /@supabase\/supabase-js/)
  assert.doesNotMatch(publicClient, /@supabase\/ssr/)
  assert.doesNotMatch(publicClient, /next\/headers/)
  assert.match(publicClient, /persistSession:\s*false/)
  assert.match(publicClient, /autoRefreshToken:\s*false/)
  assert.match(publicClient, /detectSessionInUrl:\s*false/)
})

test('Marchas permanece como entidad relacional sin requerir una ruta pública propia', async () => {
  const home = await source('lib/supabase/home-v2.js')
  const discography = await source('lib/supabase/bandDiscography.js')

  assert.match(home, /marchEntityId/)
  assert.match(discography, /march_entity_id/)
  assert.match(discography, /marchSlug:/)
})
