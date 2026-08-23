import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las APIs públicas de Tira del hilo entran por la frontera pública', async () => {
  const askRoute = await source('app/api/tira-del-hilo/route.js')
  const searchRoute = await source('app/api/tira-del-hilo/search/route.js')

  assert.match(askRoute, /@\/lib\/supabase\/tira-public/)
  assert.match(askRoute, /askPublicHiloCofrade/)
  assert.doesNotMatch(askRoute, /tira-del-hilo-v\d+/)
  assert.doesNotMatch(askRoute, /@\/lib\/supabase\/server/)

  assert.match(searchRoute, /@\/lib\/supabase\/tira-public/)
  assert.match(searchRoute, /searchPublicHiloEntities/)
  assert.doesNotMatch(searchRoute, /@\/lib\/supabase\/search-live/)
  assert.doesNotMatch(searchRoute, /@\/lib\/supabase\/server/)
})

test('la frontera pública envuelve buscador y motor completo en el mismo contexto anon', async () => {
  const runtime = await source('lib/supabase/tira-public.js')

  assert.match(runtime, /runWithPublicSupabaseRead/)
  assert.match(runtime, /searchHiloEntities/)
  assert.match(runtime, /askHiloCofradeV12/)
  assert.match(runtime, /runWithPublicSupabaseRead\(\(\) => searchHiloEntities/)
  assert.match(runtime, /runWithPublicSupabaseRead\(\(\) => askHiloCofradeV12/)
})

test('el contexto de lectura pública está aislado por ejecución asíncrona', async () => {
  const context = await source('lib/supabase/public-read-context.js')

  assert.match(context, /AsyncLocalStorage/)
  assert.match(context, /publicReadStorage\.run\(true, callback\)/)
  assert.match(context, /publicReadStorage\.getStore\(\) === true/)
})

test('server.js usa el cliente anon antes de consultar cookies cuando la lectura es pública', async () => {
  const server = await source('lib/supabase/server.js')
  const guardIndex = server.indexOf('isPublicSupabaseRead()')
  const cookieIndex = server.indexOf('await cookies()')

  assert.match(server, /@\/lib\/supabase\/public/)
  assert.match(server, /@\/lib\/supabase\/public-read-context/)
  assert.ok(guardIndex >= 0, 'server.js debe comprobar el contexto público')
  assert.ok(cookieIndex >= 0, 'server.js debe conservar el cliente autenticado para Panel')
  assert.ok(guardIndex < cookieIndex, 'la salida pública debe ocurrir antes de leer cookies')
})

test('el cliente anon compartido sigue siendo stateless', async () => {
  const publicClient = await source('lib/supabase/public.js')

  assert.match(publicClient, /@supabase\/supabase-js/)
  assert.doesNotMatch(publicClient, /@supabase\/ssr/)
  assert.doesNotMatch(publicClient, /next\/headers/)
  assert.match(publicClient, /persistSession:\s*false/)
  assert.match(publicClient, /autoRefreshToken:\s*false/)
  assert.match(publicClient, /detectSessionInUrl:\s*false/)
})
