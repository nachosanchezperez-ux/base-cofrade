import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const migration = await readFile(
  new URL('../supabase/migrations/20260902115047_certifica_centuria_romana_macarena.sql', import.meta.url),
  'utf8',
)

test('Centuria separa la reorganización de 1897 del acompañamiento actual', () => {
  assert.match(migration, /Vigente en 2026; inicio del acompañamiento actual por documentar/)
  assert.match(migration, /is_current and year_from=1897/)
  assert.doesNotMatch(migration, /Desde 1897/)
})

test('Centuria documenta diez posiciones actuales y dos periodos históricos', () => {
  for (const slug of [
    'hermandad-de-pino-montano',
    'hermandad-de-la-paz',
    'hermandad-transporte-jerez',
    'hermandad-candelaria-sevilla',
    'hermandad-cerro-del-aguila-sevilla',
    'hermandad-buen-fin-sevilla',
    'hermandad-de-la-macarena',
    'hermandad-sentencia-cordoba',
    'hermandad-san-roque-sevilla',
  ]) assert.match(migration, new RegExp(slug))

  assert.match(migration, /count\(\*\).*is_current.*published'\) <> 10/s)
  assert.match(migration, /1962,2015/)
  assert.match(migration, /2024,2025/)
})

test('Centuria convierte las novedades 2025-2026 en obras relacionadas', () => {
  for (const slug of [
    'marcha-a-morir-por-ti',
    'marcha-cerca-de-ti-senor-centuria',
    'marcha-desprecio-centuria',
    'marcha-tambor-de-sevilla',
    'marcha-dios-en-la-tierra',
  ]) assert.match(migration, new RegExp(slug))

  assert.match(migration, /Tipo de novedad: adaptacion\./)
  assert.match(migration, /march_authors/)
  assert.match(migration, /march_dedications/)
  assert.match(migration, /premiere_year in \(2025,2026\).*march_entity_id is not null\) <> 5/s)
})

test('Centuria consolida identidad, paleta y relación sin alterar la discografía', () => {
  assert.match(migration, /hex_value = '#0F6848'/)
  assert.match(migration, /primary_color = '#006400'/)
  assert.match(migration, /relation_type='belongs_to_brotherhood'/)
  assert.match(migration, /band_releases.*<> 38/s)
  assert.match(migration, /band_release_tracks.*<> 119/s)
})
