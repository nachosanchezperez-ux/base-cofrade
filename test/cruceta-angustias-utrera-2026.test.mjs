import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20261006193000_publica_cruceta_angustias_utrera_2026.sql', import.meta.url), 'utf8')

test('vincula Hermandad, fecha, salida, paso y Banda canónicos', () => {
  assert.match(sql, /'hermandad-jesus-nazareno-utrera'/)
  assert.match(sql, /'utrera-angustias-2026'/)
  assert.match(sql, /date '2026-10-03'/)
  assert.match(sql, /'paso-palio-angustias-utrera'/)
  assert.match(sql, /'banda-musica-virgen-angustias-sanlucar-mayor'/)
  assert.match(sql, /'Procesión triunfal de regreso'/)
})

test('la identidad pública prima Hermandad, fecha y Banda', () => {
  assert.match(sql, /Jesús Nazareno de Utrera · 3 de octubre de 2026 · Banda de Música Virgen de las Angustias/)
  assert.doesNotMatch(sql, /Estación de penitencia/)
})

test('conserva 39 obras, 41 interpretaciones y las dos repeticiones', () => {
  assert.match(sql, /debe contener 39 obras/)
  assert.match(sql, /debe sumar 41 interpretaciones/)
  assert.match(sql, /'Regina Angustiarum Coronata', 'Rafael Romero Tortosa', 2/)
  assert.match(sql, /'Madre del Señor', 'Juan Manuel Miranda Fernández', 2/)
  assert.match(sql, /sin deducir consecutividad/)
})

test('enlaza autorías, dedicatorias y escuchas sin inventar relaciones', () => {
  assert.match(sql, /insert into public\.march_authors/)
  assert.match(sql, /insert into public\.march_dedications/)
  assert.match(sql, /Solo se incorporan dedicatorias documentadas; no se infieren las restantes/)
  assert.match(sql, /release\.title = 'La Gitana'/)
  assert.match(sql, /'Madre del Señor', 'single', 2026/)
  assert.match(sql, /uBViSM3aGig/)
})

test('resuelve variantes y homonimias mediante la obra canónica', () => {
  assert.match(sql, /'reina-la-esperanza-felix-de-carboneras', 'Reina de Esperanza'/)
  assert.match(sql, /'macarena-abel-moreno', 'Macarena', 'Abel Moreno Gómez'/)
  assert.match(sql, /no sus homónimas/)
  assert.match(sql, /'coronacion-puntas-marvizon'/)
  assert.match(sql, /'coronacion-de-la-macarena-pedro-brana'/)
})
