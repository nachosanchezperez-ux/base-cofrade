import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la Home vuelve a usar ISR sin desactivar el Full Route Cache', () => {
  const page = read('app/page.js')
  const snapshot = read('lib/supabase/home-snapshot.js')

  assert.match(page, /export const revalidate = 60/)
  assert.doesNotMatch(page, /connection\s*\(|from ['"]next\/server['"]/)
  assert.match(snapshot, /unstable_cache/)
  assert.match(snapshot, /revalidate:\s*60/)
  assert.match(snapshot, /tags:\s*\['home-public'\]/)
})

test('la corrección queda acotada a la Home y conserva la protección P0 de Agenda', () => {
  const home = read('app/page.js')
  const agenda = read('app/agenda-cofrade/page.js')

  assert.doesNotMatch(home, /await connection\(\)/)
  assert.match(agenda, /await connection\(\)/)
})
