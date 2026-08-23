import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const IMAGE_PUBLIC_MODULES = [
  'app/imagenes/page.js',
  'app/imagenes/[slug]/page.js',
  'lib/supabase/directories.js',
  'lib/supabase/public-entity-pages.js',
  'lib/supabase/entity-media.js',
  'lib/supabase/brotherhoods.js',
  'components/RelationalThread.js',
  'lib/supabase/relational-presence.js',
]

const IMAGE_PUBLIC_CLIENT_OWNERS = [
  'lib/supabase/directories.js',
  'lib/supabase/public-entity-pages.js',
  'lib/supabase/entity-media.js',
  'lib/supabase/brotherhoods.js',
  'lib/supabase/relational-presence.js',
]

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la superficie pública de Imágenes no depende del cliente de sesión ni next/headers', async () => {
  for (const path of IMAGE_PUBLIC_MODULES) {
    const code = await source(path)
    assert.doesNotMatch(code, /@\/lib\/supabase\/server(?:['"]|\/)/, `${path} no debe depender del cliente cookie-aware`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
  }
})

test('los loaders públicos de Imágenes que crean cliente usan el cliente público explícito', async () => {
  for (const path of IMAGE_PUBLIC_CLIENT_OWNERS) {
    const code = await source(path)
    assert.match(code, /@\/lib\/supabase\/public['"]/, `${path} debe usar @/lib/supabase/public`)
  }
})

test('el cliente público compartido de Imágenes es stateless y no usa SSR ni cookies', async () => {
  const code = await source('lib/supabase/public.js')

  assert.match(code, /@supabase\/supabase-js/)
  assert.doesNotMatch(code, /@supabase\/ssr/)
  assert.doesNotMatch(code, /next\/headers/)
  assert.match(code, /persistSession:\s*false/)
  assert.match(code, /autoRefreshToken:\s*false/)
  assert.match(code, /detectSessionInUrl:\s*false/)
})

test('el directorio y la ficha pública de Imágenes entran por loaders públicos explícitos', async () => {
  const directoryPage = await source('app/imagenes/page.js')
  const detailPage = await source('app/imagenes/[slug]/page.js')

  assert.match(directoryPage, /getImagesDirectory/)
  assert.match(detailPage, /getImagenPageBySlug/)
  assert.match(detailPage, /getPublishedEntityMedia/)
  assert.doesNotMatch(directoryPage, /@\/lib\/supabase\/(?:server|client)/)
  assert.doesNotMatch(detailPage, /@\/lib\/supabase\/(?:server|client)/)
})

test('el enriquecimiento relacional usado por fichas de Imágenes permanece en la frontera pública', async () => {
  const thread = await source('components/RelationalThread.js')
  const presence = await source('lib/supabase/relational-presence.js')

  assert.match(thread, /enrichRelationalPresence/)
  assert.match(presence, /createPublicClient/)
  assert.doesNotMatch(presence, /@\/lib\/supabase\/server(?:['"]|\/)/)
})
