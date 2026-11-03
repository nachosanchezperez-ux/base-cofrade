import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('las fichas de salida enlazan con su cruceta musical', () => {
  for (const page of [
    '../app/extraordinarias/[slug]/page.js',
    '../app/procesiones-de-gloria/[slug]/page.js',
    '../app/agenda-cofrade/rosarios/[slug]/page.js',
  ]) {
    assert.match(read(page), /<OutingRepertoireLinks outingId=\{item\.id\} \/>/, page)
  }
})

test('la lectura es ligera, solo de lo publicado y nunca tumba la página', () => {
  const loader = read('../lib/supabase/outing-repertoires.js')
  assert.match(loader, /\.select\('slug, band_entity_id'\)/)
  assert.match(loader, /\.eq\('status', 'published'\)/)
  assert.match(loader, /\.eq\('repertoire_kind', 'performed'\)/)
  assert.match(loader, /return \[\]\n  \}\n\}\)/)
  const component = read('../components/OutingRepertoireLinks.js')
  assert.match(component, /if \(!links\.length\) return null/)
  assert.match(component, /Lo que sonó/)
})
