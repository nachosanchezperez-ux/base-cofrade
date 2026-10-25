import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20261022133000_publica_cruceta_montemayor_liceo_2026.sql', import.meta.url), 'utf8')

test('Montemayor conserva Hermandad, fecha, Banda, paso y paleta de la fuente', () => {
  assert.match(migration, /'montemayor-sevilla'/)
  assert.match(migration, /date '2026-10-10'/)
  assert.match(migration, /'banda-musica-liceo-sevilla'/)
  assert.match(migration, /'paso-montemayor-sevilla'/)
  assert.match(migration, /'#174F68','#F8B77D'/)
})

test('la identidad pública prima Hermandad, fecha y Banda', () => {
  assert.match(migration, /Montemayor · 10 de octubre de 2026 · Liceo de Sevilla/)
  assert.doesNotMatch(migration, /Estación de penitencia/)
})

test('la lámina conserva 24 obras, 24 interpretaciones y ninguna multiplicidad', () => {
  assert.match(migration, /debe contener 24 obras/)
  assert.match(migration, /debe sumar 24 interpretaciones/)
  assert.match(migration, /performance_count<>1/)
  assert.match(migration, /no se presenta como orden procesional/)
})

test('las dos Macarena se vinculan a obras diferentes', () => {
  assert.match(migration, /'macarena-abel-moreno','Macarena','Abel Moreno Gómez'/)
  assert.match(migration, /'macarena-emilio-cebrian','¡¡Macarena!!','Emilio Cebrián Ruiz'/)
})

test('las obras nuevas conservan autoría, dedicatorias y audiciones verificadas', () => {
  assert.match(migration, /insert into public\.march_authors/)
  assert.match(migration, /insert into public\.march_dedications/)
  assert.match(migration, /insert into public\.march_recordings/)
  assert.match(migration, /'por-ti-montemayor-manuel-marvizon'/)
  assert.match(migration, /'virgen-de-los-reyes-abel-moreno'/)
})
