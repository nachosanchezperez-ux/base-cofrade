import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const BROTHERHOOD_PUBLIC_MODULES = [
  'app/hermandades/page.js',
  'app/hermandades/[slug]/page.js',
  'app/hermandades/semana-santa/page.js',
  'app/hermandades/semana-santa/[localidad]/[jornada]/page.js',
  'app/hermandades/gloria/page.js',
  'app/hermandades/sacramentales/page.js',
  'lib/supabase/brotherhood-directory.js',
  'lib/supabase/brotherhoods.js',
  'lib/supabase/brotherhood-display.js',
  'lib/supabase/brotherhood-page.js',
  'lib/supabase/brotherhood-visual-sections.js',
  'lib/supabase/cult-media.js',
  'lib/supabase/brotherhood-musical-heritage.js',
  'lib/supabase/brotherhood-public-authority.js',
  'lib/supabase/brotherhood-authority.js',
  'lib/supabase/entity-media.js',
  'components/BrotherhoodRelationalExtras.js',
  'components/RelationalThread.js',
  'lib/supabase/relational-presence.js',
]

const BROTHERHOOD_CLIENT_OWNERS = [
  'lib/supabase/brotherhood-directory.js',
  'lib/supabase/brotherhoods.js',
  'lib/supabase/brotherhood-display.js',
  'lib/supabase/cult-media.js',
  'lib/supabase/brotherhood-musical-heritage.js',
  'lib/supabase/brotherhood-public-authority.js',
  'lib/supabase/brotherhood-authority.js',
  'lib/supabase/entity-media.js',
  'components/BrotherhoodRelationalExtras.js',
  'lib/supabase/relational-presence.js',
]

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la superficie pública de Hermandades no depende del cliente de sesión ni next/headers', async () => {
  for (const path of BROTHERHOOD_PUBLIC_MODULES) {
    const code = await source(path)
    assert.doesNotMatch(code, /@\/lib\/supabase\/server(?:['"]|\/)/, `${path} no debe depender del cliente cookie-aware`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
  }
})

test('los loaders públicos de Hermandades que crean cliente usan el cliente público explícito', async () => {
  for (const path of BROTHERHOOD_CLIENT_OWNERS) {
    const code = await source(path)
    assert.match(code, /@\/lib\/supabase\/public['"]/, `${path} debe usar @/lib/supabase/public`)
  }
})

test('el cliente público compartido es stateless y no usa SSR ni cookies', async () => {
  const code = await source('lib/supabase/public.js')

  assert.match(code, /@supabase\/supabase-js/)
  assert.doesNotMatch(code, /@supabase\/ssr/)
  assert.doesNotMatch(code, /next\/headers/)
  assert.match(code, /persistSession:\s*false/)
  assert.match(code, /autoRefreshToken:\s*false/)
  assert.match(code, /detectSessionInUrl:\s*false/)
})

test('el directorio y la ficha pública entran por loaders públicos de Hermandades', async () => {
  const directoryPage = await source('app/hermandades/page.js')
  const detailPage = await source('app/hermandades/[slug]/page.js')
  const directoryLoader = await source('lib/supabase/brotherhood-directory.js')

  assert.match(directoryPage, /getHermandadesDirectory/)
  assert.match(detailPage, /getHermandadPageBySlug/)
  assert.match(directoryLoader, /filterPublicPageEntities\(entities, brotherhoodRows\)/)
  assert.doesNotMatch(directoryPage, /@\/lib\/supabase\/(?:server|client)/)
  assert.doesNotMatch(detailPage, /@\/lib\/supabase\/(?:server|client)/)
})
