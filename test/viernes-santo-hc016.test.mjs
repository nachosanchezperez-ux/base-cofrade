import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260914233000_cierra_viernes_santo_sevilla.sql', import.meta.url), 'utf8')

test('Viernes Santo queda archivado como DML gobernado', () => {
  assert.match(migration, /c0160018-0000-4000-8000-000000000001: 270\/270/)
  assert.match(migration, /0 inválidas, 0 fallos/)
  assert.doesNotMatch(migration, /\b(create|alter|drop|truncate)\s+(table|policy|schema)\b/i)
})

test('el macrolote cubre las siete corporaciones y preserva La Carretería', () => {
  for (const value of ['La Carretería', 'Hermandad del Cachorro', 'Hermandad de La O', 'Hermandad de San Isidoro', 'Montserrat', 'La Sagrada Mortaja', 'Soledad de San Buenaventura']) assert.match(migration, new RegExp(value))
  assert.equal((migration.match(/'2026-04-03'/g) || []).length, 6)
  assert.match(migration, /preserva La Carretería/i)
})

test('San Isidoro penitencial no reutiliza el nodo letífico de la Salud', () => {
  assert.match(migration, /hermandad-san-isidoro-sevilla/)
  assert.doesNotMatch(migration, /hermandad-salud-san-isidoro-sevilla/)
  assert.match(migration, /Estación de penitencia sin acompañamiento musical/)
})

test('la receta reutiliza relaciones canónicas preexistentes', () => {
  for (const id of ['ec160000-0000-4000-8000-000000000001', 'da662e1a-9b2b-47fa-b58e-82f0b03f180f', '4b8fd019-ae5f-4c11-9735-fc2a1554b759', '6cc00a3f-ae21-4cd6-a4c3-081a595728a1']) assert.match(migration, new RegExp(id))
})

test('el lote mantiene actualidad 2026 y no fabrica multimedia', () => {
  assert.match(migration, /Vigente en 2026/)
  assert.doesNotMatch(migration, /2027/)
  assert.doesNotMatch(migration, /hero_image_path|crest_path|image_path/)
})
