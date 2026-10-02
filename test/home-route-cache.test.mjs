import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la Home vuelve a usar ISR sin desactivar el Full Route Cache', () => {
  const page = read('app/page.js')
  const snapshot = read('lib/supabase/home-snapshot.js')

  assert.match(page, /export const revalidate = 60/)
  assert.match(page, /export const revalidate = 60/)
  assert.match(page, /function hasPublicSupabaseConfig\(\)/)
  assert.match(page, /NEXT_PUBLIC_SUPABASE_URL/)
  assert.match(page, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/)
  assert.match(page, /if \(!hasPublicSupabaseConfig\(\)\) await connection\(\)/)
  assert.ok(page.indexOf('if (!hasPublicSupabaseConfig()) await connection()') < page.indexOf('await getHomeSnapshot()'))
  assert.match(snapshot, /unstable_cache/)
  assert.match(snapshot, /revalidate:\s*60/)
  assert.match(snapshot, /tags:\s*\['home-public'\]/)
})

test('la corrección queda acotada a la Home y conserva la protección P0 de Agenda', () => {
  const home = read('app/page.js')
  const agenda = read('app/agenda-cofrade/page.js')

  assert.doesNotMatch(home, /^\s*await connection\(\)/m)
  assert.match(home, /if \(!hasPublicSupabaseConfig\(\)\) await connection\(\)/)
  assert.match(agenda, /^\s*await connection\(\)/m)
})
