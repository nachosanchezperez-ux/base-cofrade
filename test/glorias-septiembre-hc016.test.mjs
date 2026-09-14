import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260914210000_cierra_glorias_septiembre_sevilla.sql', import.meta.url), 'utf8')

test('Glorias de septiembre queda archivado como DML gobernado', () => {
  assert.match(migration, /c0160020-0000-4000-8000-000000000001: 114\/114/)
  assert.match(migration, /0 inválidas, 0 fallos/)
  assert.doesNotMatch(migration, /\b(create|alter|drop|truncate)\s+(table|policy|schema)\b/i)
})

test('el macrolote cubre las once corporaciones y preserva cinco cierres', () => {
  for (const value of ['Guadalupe', 'Juncal', 'Luz', 'Santa Marina', 'Mercedes', 'Pastora de Triana', 'Valvanera', 'Santa Lucía', 'Sastres', 'Inmaculado Corazón de María', 'Padre Pío']) assert.match(migration, new RegExp(value))
  assert.match(migration, /preserva Guadalupe, Juncal, Luz, Santa Marina y Mercedes/i)
})

test('Torreblanca queda separada de sus homónimos y conserva la Romería', () => {
  assert.match(migration, /no reutiliza Torreblanca penitencial ni la titular de la Misión/i)
  assert.match(migration, /'Romería'/)
  assert.match(migration, /Romería, no como Procesión de Gloria/)
  assert.match(migration, /no se clasifica como Procesión de Gloria/)
})

test('la actualidad queda limitada a 2026 y no fabrica datos volátiles', () => {
  assert.match(migration, /Vigente en 2026/)
  assert.match(migration, /'announced'/)
  assert.doesNotMatch(migration, /\b2027\b/)
  assert.doesNotMatch(migration, /hero_image_path|crest_path|public_image_path/)
})
