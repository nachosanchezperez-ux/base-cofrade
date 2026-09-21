import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260921053535_actualiza_discografias_gerena_rosario_d02c.sql', import.meta.url),
  'utf8',
)

test('D-02C conserva una entidad por banda y carga sus catálogos propios', () => {
  assert.match(migration, /banda-municipal-musica-gerena/)
  assert.match(migration, /banda-musica-rosario-sanlucar-la-mayor/)
  assert.match(migration, /Gerena no cierra en 14 ediciones \/ 73 pistas/)
  assert.match(migration, /Rosario no cierra en 4 ediciones \/ 43 pistas/)
  assert.match(migration, /el lote no cierra en 18 ediciones \/ 116 pistas/)
})

test('D-02C documenta la reconciliación de perfiles de Rosario sin duplicar recopilatorios', () => {
  assert.match(migration, /42adDBkCNRNr3natyIjrNt/)
  assert.match(migration, /7jpxg8y1TvdhvjFL33EGOr/)
  assert.match(migration, /sus dos pistas visibles pertenecen a una recopilación de varios artistas/)
  assert.doesNotMatch(migration, /5b01xgN4IxSbneBo6SQnAf/)
})

test('D-02C es DML editorial y deja trazabilidad y carátulas completas', () => {
  assert.doesNotMatch(migration, /\b(?:create|alter|drop|truncate|grant|revoke)\s+(?:table|policy|index|schema|view|function)\b/i)
  assert.match(migration, /on conflict \(band_entity_id, title, release_year\) do update/)
  assert.match(migration, /on conflict \(release_id, sequence_no\) do update/)
  assert.match(migration, /existe una edición sin carátula/)
  assert.match(migration, /2026-09-21/)
})
