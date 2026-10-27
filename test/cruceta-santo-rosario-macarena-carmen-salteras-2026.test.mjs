import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20261026213000_publica_cruceta_santo_rosario_macarena_carmen_salteras_2026.sql', import.meta.url), 'utf8')

test('la cruceta conserva Hermandad, fecha, Banda, paso y paleta de la fuente', () => {
  assert.match(migration, /'hermandad-de-la-macarena'/)
  assert.match(migration, /date '2026-10-25'/)
  assert.match(migration, /'carmen-de-salteras'/)
  assert.match(migration, /'paso-santo-rosario-macarena'/)
  assert.match(migration, /'#2B1D15','#B48A2B'/)
})

test('la identidad pública prima Hermandad, fecha y Banda', () => {
  assert.match(migration, /La Macarena · 25 de octubre de 2026 · Carmen de Salteras/)
})

test('las dos láminas conservan 22 obras, 37 interpretaciones y ocho multiplicidades', () => {
  assert.match(migration, /debe contener 22 obras/)
  assert.match(migration, /debe sumar 37 interpretaciones/)
  assert.match(migration, /exactamente ocho multiplicidades/)
  assert.match(migration, /'coronacion-de-la-macarena-pedro-brana','Coronación de la Macarena','Pedro Braña Martínez',5/)
  assert.match(migration, /'macarena-abel-moreno','Macarena','Abel Moreno Gómez',4/)
})

test('las dos Macarena permanecen separadas por autor', () => {
  assert.match(migration, /'macarena-abel-moreno'/)
  assert.match(migration, /'macarena-emilio-cebrian'/)
})

test('Rosario de la Macarena se incorpora y Rocío completa su coautoría', () => {
  assert.match(migration, /'rosario-de-la-macarena-pedro-morales'/)
  assert.match(migration, /'rocio-manuel-ruiz-vidriet','manuel-perez-tejera'/)
  assert.match(migration, /Manuel Ruiz Vidriet y Manuel Pérez Tejera/)
})

test('la carga es idempotente y no reconstruye un orden procesional', () => {
  assert.match(migration, /on conflict \(repertoire_id,march_entity_id\) do update/)
  assert.match(migration, /no se presenta como orden procesional/)
  assert.doesNotMatch(migration, /delete from public\.musical_repertoire_entries/)
})
