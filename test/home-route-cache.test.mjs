import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('el reloj de Home se renderiza por petición también con Supabase configurado', () => {
  const page = read('app/page.js')
  assert.match(page, /^  await connection\(\)/m)
  assert.doesNotMatch(page, /hasPublicSupabaseConfig/)
  assert.ok(page.indexOf('await connection()') < page.indexOf('const now = new Date()'))
  assert.match(page, /getTodayLabel\(now\)/)
  assert.match(page, /await getHomeSnapshot\(now\)/)
})

test('Panel puede invalidar datos de portada, agenda y briefing con home-public', () => {
  for (const path of ['lib/supabase/home-snapshot.js', 'lib/supabase/agenda-cofrade.js']) {
    assert.match(read(path), /tags: \['home-public'\]/)
  }
  assert.match(read('app/panel/(protected)/hoy/actions.js'), /updateTag\('home-public'\)/)
  assert.match(read('app/agenda-cofrade/page.js'), /^\s*await connection\(\)/m)
})
