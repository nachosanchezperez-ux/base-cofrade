import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el lector público incorpora dresser_of sin mezclar cargos de gobierno', () => {
  const source = read('lib/supabase/public-agents.js')

  assert.match(source, /\.from\('entity_relations'\)/)
  assert.match(source, /\.eq\('relation_type', 'dresser_of'\)/)
  assert.match(source, /increment\(dressingCounts, row\.source_entity_id\)/)
  assert.match(source, /dressings: dressingCounts\.get\(entity\.id\) \|\| 0/)
  assert.doesNotMatch(source, /hermano_mayor_of/)
})

test('la ficha del autor muestra las imágenes vestidas como relación propia', () => {
  const source = read('app/autores/[slug]/page.js')
  const reader = read('lib/supabase/public-agents.js')

  assert.match(reader, /const dressings = dresserRelations\.map/)
  assert.match(reader, /relationCount = marches\.length \+ images\.length \+ heritage\.length \+ steps\.length \+ dressings\.length/)
  assert.match(source, /title: 'Imágenes vestidas'/)
  assert.match(source, /items: agent\.dressings/)
})
