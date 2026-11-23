import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20261123090000_publica_cruceta_caridad_baratillo_carmen_salteras_2026.sql', import.meta.url),
  'utf8',
)

test('publica las nueve marchas de la Caridad en el orden de la lámina', () => {
  assert.match(migration, /nueve obras y nueve interpretaciones/i)
  assert.match(migration, /\(1,'marcha-la-caridad-del-arenal','La Caridad del Arenal'/i)
  assert.match(migration, /\(9,'coronacion-en-el-rocio-rafael-gonzalez-serna','Coronación en el Rocío'/i)
  assert.match(migration, /display_order=1 and march\.slug='marcha-la-caridad-del-arenal'/i)
  assert.match(migration, /display_order=9 and march\.slug='coronacion-en-el-rocio-rafael-gonzalez-serna'/i)
  assert.match(migration, /performance_count<>1/i)
})

test('vincula la cruceta con el traslado celebrado, el paso y Carmen de Salteras', () => {
  assert.match(migration, /'baratillo-caridad-regreso-funcion-solemne-2026'/i)
  assert.match(migration, /date '2026-11-22'/i)
  assert.match(migration, /set event_status='held'/i)
  assert.match(migration, /'paso-de-palio-de-maria-santisima-de-la-caridad'/i)
  assert.match(migration, /'carmen-de-salteras'/i)
  assert.match(migration, /assignment\.participation_mode='full_route'/i)
})

test('incorpora Coronación en el Rocío con composición y arreglo', () => {
  assert.match(migration, /'Rafael González-Serna Bono','rafael-gonzalez-serna-bono'/i)
  assert.match(migration, /'rafael-gonzalez-serna-bono','composer'/i)
  assert.match(migration, /'jesus-joaquin-espinosa-de-los-monteros-perez','arranger'/i)
  assert.match(migration, /'Spotify · Coronación en el Rocío'/i)
})

test('conserva la fuente, la paleta y la idempotencia', () => {
  assert.match(migration, /'Repertorio interpretado · Caridad del Baratillo 2026'/i)
  assert.match(migration, /'#2E1B12','#C79A24','published'/i)
  assert.match(migration, /on conflict\(slug\) do update/i)
  assert.match(migration, /on conflict\(repertoire_id,march_entity_id\) do update/i)
  assert.doesNotMatch(migration, /\bdelete\s+from\b/i)
})
