import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const HOME_PUBLIC_MODULES = [
  'app/page.js',
  'lib/supabase/home-snapshot.js',
  'lib/supabase/home.js',
  'lib/supabase/home-v2.js',
  'lib/supabase/home-effective-editorial.js',
  'lib/supabase/home-effective-visual.js',
  'lib/supabase/home-extraordinary-links.js',
  'lib/supabase/home-discovery-diverse.js',
  'lib/supabase/home-thread-visual.js',
  'lib/supabase/home-visuals.js',
  'lib/supabase/outing-briefing.js',
]

const HOME_CLIENT_OWNERS = [
  'lib/supabase/home.js',
  'lib/supabase/home-v2.js',
  'lib/supabase/home-effective-editorial.js',
  'lib/supabase/home-effective-visual.js',
  'lib/supabase/home-extraordinary-links.js',
  'lib/supabase/home-discovery-diverse.js',
  'lib/supabase/home-thread-visual.js',
  'lib/supabase/outing-briefing.js',
]

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la cadena pública de Home no importa el cliente de sesión ni next/headers', async () => {
  for (const path of HOME_PUBLIC_MODULES) {
    const code = await source(path)
    assert.doesNotMatch(code, /@\/lib\/supabase\/server(?:['"]|\/)/, `${path} no debe depender del cliente cookie-aware`)
    assert.doesNotMatch(code, /from\s+['"]next\/headers['"]/, `${path} no debe leer cookies o headers editoriales`)
  }
})

test('los loaders de Home que crean cliente usan exclusivamente public-server', async () => {
  for (const path of HOME_CLIENT_OWNERS) {
    const code = await source(path)
    assert.match(code, /@\/lib\/supabase\/public-server/, `${path} debe usar el cliente público explícito`)
  }
})

test('public-server es un cliente Supabase sin persistencia de sesión', async () => {
  const code = await source('lib/supabase/public-server.js')

  assert.match(code, /@supabase\/supabase-js/)
  assert.doesNotMatch(code, /@supabase\/ssr/)
  assert.doesNotMatch(code, /next\/headers/)
  assert.match(code, /persistSession:\s*false/)
  assert.match(code, /autoRefreshToken:\s*false/)
  assert.match(code, /detectSessionInUrl:\s*false/)
})

test('app/page.js entra a datos únicamente por el snapshot público de Home', async () => {
  const code = await source('app/page.js')

  assert.match(code, /getHomeSnapshot/)
  assert.doesNotMatch(code, /@\/lib\/supabase\/(?:server|client)/)
  assert.doesNotMatch(code, /createClient\s*\(/)
})
