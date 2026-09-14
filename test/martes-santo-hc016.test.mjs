import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260914190000_cierra_martes_santo_sevilla.sql', import.meta.url), 'utf8')

test('el Martes Santo queda archivado como DML gobernado y completo', () => {
  assert.match(migration, /c0160015-0000-4000-8000-000000000001: 224\/224/)
  assert.match(migration, /0 inválidas, 0 fallos/)
  assert.doesNotMatch(migration, /\b(create|alter|drop|truncate)\s+(table|policy|schema)\b/i)
})

test('el cierre publica las tres fichas pendientes y preserva la jornada', () => {
  for (const name of ['La Candelaria', 'Los Javieres', 'Los Estudiantes']) assert.match(migration, new RegExp(name))
  assert.match(migration, /'Martes Santo'/)
  assert.match(migration, /2026-03-31/)
})

test('silencio, sedes y atribuciones conservan sus matices', () => {
  assert.match(migration, /el paso del Cristo procesiona en silencio/i)
  assert.match(migration, /Iglesia del Sagrado Corazón de Jesús y Capilla de los Luises/)
  assert.match(migration, /Capilla de la Universidad de Sevilla/)
  assert.match(migration, /traslado temporal/i)
  assert.match(migration, /'attributed_to'/)
})

test('el lote no fabrica multimedia sin derechos', () => {
  assert.match(migration, /Sin fotografías nuevas mientras no conste licencia reutilizable/)
  assert.doesNotMatch(migration, /hero_image_path|crest_path|image_path/)
})
