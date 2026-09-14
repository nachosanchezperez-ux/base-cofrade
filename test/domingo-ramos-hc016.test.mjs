import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260914230000_cierra_domingo_ramos_sevilla.sql', import.meta.url), 'utf8')

test('Domingo de Ramos queda archivado como DML gobernado', () => {
  assert.match(migration, /c0160017-0000-4000-8000-000000000001: 261\/261/)
  assert.match(migration, /0 inválidas, 0 fallos/)
  assert.doesNotMatch(migration, /\b(create|alter|drop|truncate)\s+(table|policy|schema)\b/i)
})

test('el macrolote cubre ocho corporaciones y nueve cortejos de 2026', () => {
  for (const value of ['La Cena', 'Hermandad de la Hiniesta', 'Hermandad de San Roque', 'Hermandad de la Estrella', 'Hermandad de la Amargura', 'Hermandad del Amor', 'La Borriquita']) assert.match(migration, new RegExp(value))
  assert.equal((migration.match(/'2026-03-29'/g) || []).length, 7)
  assert.match(migration, /ocho corporaciones y sus nueve cortejos/i)
})

test('La Borriquita permanece dentro del Amor y no nace como Hermandad', () => {
  assert.match(migration, /La Borriquita es la primera parte de la Hermandad del Amor/i)
  assert.match(migration, /Señor de la Sagrada Entrada en Jerusalén/)
  assert.doesNotMatch(migration, /entity_type[^\n]+brotherhood[^\n]+Borriquita/i)
})

test('los homónimos y la temporalidad quedan acotados', () => {
  assert.match(migration, /787b3ca0-6f34-47df-9943-3d40277ec21c/)
  assert.match(migration, /45e4a9be-7ff3-4c6a-a1ee-64526e978ae2/)
  assert.match(migration, /no presupone continuidad posterior/i)
  assert.doesNotMatch(migration, /2027/)
})

test('el lote no fabrica multimedia sin derechos', () => {
  assert.doesNotMatch(migration, /hero_image_path|crest_path|image_path/)
})
