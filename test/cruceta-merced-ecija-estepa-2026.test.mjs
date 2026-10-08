import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20261008061516_publica_cruceta_merced_ecija_estepa_2026.sql', import.meta.url), 'utf8')

test('vincula La Piedad, la Merced de Écija y la Banda de Música de Estepa', () => {
  assert.match(sql, /'hermandad-piedad-merced-ecija'/)
  assert.match(sql, /'nuestra-senora-merced-ecija'/)
  assert.match(sql, /'paso-procesional-nuestra-senora-merced-ecija'/)
  assert.match(sql, /'banda-musica-estepa'/)
  assert.match(sql, /date '2026-09-26'/)
})

test('la identidad pública prima Hermandad, fecha y Banda', () => {
  assert.match(sql, /La Piedad · 26 de septiembre de 2026 · Banda de Música de Estepa/)
  assert.doesNotMatch(sql, /Estación de penitencia/)
})

test('reproduce la paleta negra, blanca y dorada de las láminas', () => {
  assert.match(sql, /'#050505'/)
  assert.match(sql, /'#FFFFFF'/)
  assert.match(sql, /'#C6A24A'/)
  assert.match(sql, /primary_color, accent_color/)
})

test('conserva 22 obras, 22 interpretaciones y ninguna multiplicidad inferida', () => {
  assert.match(sql, /debe contener 22 obras/)
  assert.match(sql, /debe sumar 22 interpretaciones/)
  assert.match(sql, /La fuente no declara multiplicidades/)
  assert.match(sql, /performance_count <> 1/)
})

test('enlaza las obras canónicas sin crear marchas duplicadas', () => {
  assert.doesNotMatch(sql, /insert into public\.entities \([^;]+?\)\s*select\s*'march'/)
  assert.match(sql, /'macarena-abel-moreno'/)
  assert.match(sql, /'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda'/)
  assert.match(sql, /join public\.entities march on march\.entity_type = 'march' and march\.slug = seed\.march_slug/)
})

test('mantiene separadas la imagen gloriosa de la Merced y la Virgen de la Piedad', () => {
  assert.match(sql, /'Nuestra Señora de la Merced'/)
  assert.match(sql, /'Gloria'/)
  assert.doesNotMatch(sql, /'virgen-piedad-merced-ecija'/)
})

test('exige autoría publicada para todas las obras enlazadas', () => {
  assert.match(sql, /left join public\.march_authors author/)
  assert.match(sql, /Todas las obras deben conservar al menos una autoría publicada/)
})
