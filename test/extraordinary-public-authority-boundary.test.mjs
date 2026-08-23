import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const EXTRAORDINARY_PUBLIC_MODULES = [
  'app/extraordinarias/page.js',
  'app/extraordinarias/[slug]/page.js',
  'components/ExtraordinaryDirectory.js',
  'lib/supabase/extraordinary-directory.js',
  'lib/supabase/extraordinary-detail.js',
]

const EXTRAORDINARY_PUBLIC_CLIENT_OWNERS = [
  'lib/supabase/extraordinary-directory.js',
  'lib/supabase/extraordinary-detail.js',
]

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la superficie pública de Extraordinarias no depende del cliente de sesión ni next/headers', async () => {
  for (const path of EXTRAORDINARY_PUBLIC_MODULES) {
    const code = await source(path)
    assert.doesNotMatch(code, /@\/lib\/supabase\/server(?:['"]|\/)/, `${path} no debe depender del cliente cookie-aware`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
  }
})

test('los loaders públicos de Extraordinarias usan el cliente público explícito', async () => {
  for (const path of EXTRAORDINARY_PUBLIC_CLIENT_OWNERS) {
    const code = await source(path)
    assert.match(code, /@\/lib\/supabase\/public['"]/, `${path} debe usar @/lib/supabase/public`)
    assert.match(code, /createPublicClient\(\)/, `${path} debe crear un cliente público stateless`)
  }
})

test('el cliente público compartido de Extraordinarias es stateless y no usa SSR ni cookies', async () => {
  const code = await source('lib/supabase/public.js')

  assert.match(code, /@supabase\/supabase-js/)
  assert.doesNotMatch(code, /@supabase\/ssr/)
  assert.doesNotMatch(code, /next\/headers/)
  assert.match(code, /persistSession:\s*false/)
  assert.match(code, /autoRefreshToken:\s*false/)
  assert.match(code, /detectSessionInUrl:\s*false/)
})

test('el directorio y la ficha pública de Extraordinarias entran por loaders públicos explícitos', async () => {
  const directoryPage = await source('app/extraordinarias/page.js')
  const detailPage = await source('app/extraordinarias/[slug]/page.js')

  assert.match(directoryPage, /getExtraordinaryDirectory/)
  assert.match(detailPage, /getExtraordinaryDetail/)
  assert.doesNotMatch(directoryPage, /@\/lib\/supabase\/(?:server|client)/)
  assert.doesNotMatch(detailPage, /@\/lib\/supabase\/(?:server|client)/)
})

test('directorio y detalle conservan filtros de publicación y alcance de Sevilla', async () => {
  const directory = await source('lib/supabase/extraordinary-directory.js')
  const detail = await source('lib/supabase/extraordinary-detail.js')

  assert.match(directory, /from\('extraordinary_outings_directory'\)/)
  assert.match(directory, /\.eq\('province', 'Sevilla'\)/)
  assert.match(detail, /from\('extraordinary_outings_directory'\)/)
  assert.match(detail, /\.eq\('slug', slug\)/)
  assert.match(detail, /\.eq\('province', 'Sevilla'\)/)
  assert.doesNotMatch(directory, /@\/lib\/supabase\/server(?:['"]|\/)/)
  assert.doesNotMatch(detail, /@\/lib\/supabase\/server(?:['"]|\/)/)
})
