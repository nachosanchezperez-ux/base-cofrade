import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260914154000_cierra_jueves_santo_sevilla.sql', import.meta.url), 'utf8')

test('Jueves Santo queda archivado como DML gobernado', () => {
  assert.match(migration, /c0160019-0000-4000-8000-000000000001: 223\/223/)
  assert.match(migration, /0 inválidas, 0 fallos/)
  assert.doesNotMatch(migration, /\b(create|alter|drop|truncate)\s+(table|policy|schema)\b/i)
})
test('el macrolote cubre las siete corporaciones y preserva dos cierres', () => {
  for (const value of ['Los Negritos', 'La Exaltación', 'Hermandad de Las Cigarreras', 'Hermandad de Monte-Sión', 'La Quinta Angustia', 'El Valle', 'Pasión']) assert.match(migration, new RegExp(value))
  assert.match(migration, /preserva Los Negritos y El Valle/i)
  assert.equal((migration.match(/'2026-04-02'/g) || []).length, 5)
})

test('la receta blinda homónimos y respeta el silencio del Señor de Pasión', () => {
  assert.match(migration, /Pasión no reutiliza Pasión y Muerte/)
  assert.match(migration, /Virgen del Valle no reutiliza la patrona de Écija/)
  assert.match(migration, /Cristo de la Salud propio/)
  assert.match(migration, /El paso del Señor realiza la estación sin acompañamiento musical/)
})

test('la actualidad queda limitada a 2026 y no fabrica multimedia', () => {
  assert.match(migration, /Vigente en 2026/)
  assert.doesNotMatch(migration, /2027/)
  assert.doesNotMatch(migration, /hero_image_path|crest_path|public_image_path/)
})
