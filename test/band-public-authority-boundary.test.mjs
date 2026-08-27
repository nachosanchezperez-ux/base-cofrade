import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const BAND_PUBLIC_MODULES = [
  'app/bandas/page.js',
  'app/bandas/[slug]/page.js',
  'lib/supabase/bands-directory-public.js',
  'lib/supabase/bands.js',
  'lib/supabase/bandDiscography.js',
  'lib/supabase/bandColors.js',
  'components/RelationalThread.js',
  'lib/supabase/relational-presence.js',
]

const BAND_PUBLIC_CLIENT_OWNERS = [
  'lib/supabase/bands-directory-public.js',
  'lib/supabase/bands.js',
  'lib/supabase/bandDiscography.js',
  'lib/supabase/bandColors.js',
  'lib/supabase/relational-presence.js',
]

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la superficie pública de Bandas no depende del cliente de sesión ni next/headers', async () => {
  for (const path of BAND_PUBLIC_MODULES) {
    const code = await source(path)
    assert.doesNotMatch(code, /@\/lib\/supabase\/server(?:['"]|\/)/, `${path} no debe depender del cliente cookie-aware`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
  }
})

test('los loaders públicos de Bandas que crean cliente usan el cliente público explícito', async () => {
  for (const path of BAND_PUBLIC_CLIENT_OWNERS) {
    const code = await source(path)
    assert.match(code, /@\/lib\/supabase\/public['"]/, `${path} debe usar @/lib/supabase/public`)
  }
})

test('el cliente público compartido de Bandas es stateless y no usa SSR ni cookies', async () => {
  const code = await source('lib/supabase/public.js')

  assert.match(code, /@supabase\/supabase-js/)
  assert.doesNotMatch(code, /@supabase\/ssr/)
  assert.doesNotMatch(code, /next\/headers/)
  assert.match(code, /persistSession:\s*false/)
  assert.match(code, /autoRefreshToken:\s*false/)
  assert.match(code, /detectSessionInUrl:\s*false/)
})

test('el directorio y la ficha pública de Bandas entran por loaders públicos explícitos', async () => {
  const directoryPage = await source('app/bandas/page.js')
  const detailPage = await source('app/bandas/[slug]/page.js')

  assert.match(directoryPage, /getPublicBandsDirectory/)
  assert.match(detailPage, /getBandBySlug/)
  assert.match(detailPage, /getBandDiscography/)
  assert.match(detailPage, /getPublishedBandColors/)
  assert.doesNotMatch(directoryPage, /@\/lib\/supabase\/(?:server|client)/)
  assert.doesNotMatch(detailPage, /@\/lib\/supabase\/(?:server|client)/)
})

test('discografía, colores y enriquecimiento relacional de Bandas permanecen en la frontera pública', async () => {
  const bands = await source('lib/supabase/bands.js')
  const discography = await source('lib/supabase/bandDiscography.js')
  const colors = await source('lib/supabase/bandColors.js')
  const thread = await source('components/RelationalThread.js')
  const presence = await source('lib/supabase/relational-presence.js')

  assert.match(bands, /createPublicClient/)
  assert.match(bands, /isPublicEntityPageReady\(brotherhood, brotherhoodProfile\)/)
  assert.match(discography, /createPublicClient/)
  assert.match(colors, /createPublicClient/)
  assert.doesNotMatch(bands, /@\/lib\/supabase\/server(?:['"]|\/)/)
  assert.doesNotMatch(discography, /@\/lib\/supabase\/server(?:['"]|\/)/)
  assert.doesNotMatch(colors, /@\/lib\/supabase\/server(?:['"]|\/)/)
  assert.match(thread, /enrichRelationalPresence/)
  assert.match(presence, /createPublicClient/)
  assert.doesNotMatch(presence, /@\/lib\/supabase\/server(?:['"]|\/)/)
})
