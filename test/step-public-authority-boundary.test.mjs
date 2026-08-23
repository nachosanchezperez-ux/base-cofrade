import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const STEP_PUBLIC_MODULES = [
  'app/pasos/page.js',
  'app/pasos/[slug]/page.js',
  'lib/supabase/directories.js',
  'lib/supabase/public-entity-pages.js',
  'lib/supabase/entity-media.js',
  'lib/supabase/step-heritage.js',
  'lib/supabase/brotherhoods.js',
  'components/RelationalThread.js',
  'lib/supabase/relational-presence.js',
]

const STEP_PUBLIC_CLIENT_OWNERS = [
  'lib/supabase/directories.js',
  'lib/supabase/public-entity-pages.js',
  'lib/supabase/entity-media.js',
  'lib/supabase/step-heritage.js',
  'lib/supabase/brotherhoods.js',
  'lib/supabase/relational-presence.js',
]

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la superficie pública de Pasos no depende del cliente de sesión ni next/headers', async () => {
  for (const path of STEP_PUBLIC_MODULES) {
    const code = await source(path)
    assert.doesNotMatch(code, /@\/lib\/supabase\/server(?:['"]|\/)/, `${path} no debe depender del cliente cookie-aware`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
  }
})

test('los loaders públicos de Pasos que crean cliente usan el cliente público explícito', async () => {
  for (const path of STEP_PUBLIC_CLIENT_OWNERS) {
    const code = await source(path)
    assert.match(code, /@\/lib\/supabase\/public['"]/, `${path} debe usar @/lib/supabase/public`)
  }
})

test('el cliente público compartido de Pasos es stateless y no usa SSR ni cookies', async () => {
  const code = await source('lib/supabase/public.js')

  assert.match(code, /@supabase\/supabase-js/)
  assert.doesNotMatch(code, /@supabase\/ssr/)
  assert.doesNotMatch(code, /next\/headers/)
  assert.match(code, /persistSession:\s*false/)
  assert.match(code, /autoRefreshToken:\s*false/)
  assert.match(code, /detectSessionInUrl:\s*false/)
})

test('el directorio y la ficha pública de Pasos entran por loaders públicos explícitos', async () => {
  const directoryPage = await source('app/pasos/page.js')
  const detailPage = await source('app/pasos/[slug]/page.js')

  assert.match(directoryPage, /getStepsDirectory/)
  assert.match(detailPage, /getPasoPageBySlug/)
  assert.match(detailPage, /getPublishedEntityCoverMedia/)
  assert.match(detailPage, /getPublishedStepHeritage/)
  assert.doesNotMatch(directoryPage, /@\/lib\/supabase\/(?:server|client)/)
  assert.doesNotMatch(detailPage, /@\/lib\/supabase\/(?:server|client)/)
})

test('patrimonio y enriquecimiento relacional de Pasos permanecen en la frontera pública', async () => {
  const heritage = await source('lib/supabase/step-heritage.js')
  const thread = await source('components/RelationalThread.js')
  const presence = await source('lib/supabase/relational-presence.js')

  assert.match(heritage, /createPublicClient/)
  assert.doesNotMatch(heritage, /@\/lib\/supabase\/server(?:['"]|\/)/)
  assert.match(thread, /enrichRelationalPresence/)
  assert.match(presence, /createPublicClient/)
  assert.doesNotMatch(presence, /@\/lib\/supabase\/server(?:['"]|\/)/)
})
