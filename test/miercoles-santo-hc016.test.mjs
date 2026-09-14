import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260914210000_cierra_miercoles_santo_sevilla.sql', import.meta.url), 'utf8')

test('el Miércoles Santo queda archivado como DML gobernado', () => {
  assert.match(migration, /c0160016-0000-4000-8000-000000000001: 153\/153/)
  assert.match(migration, /0 inválidas, 0 fallos/)
  assert.doesNotMatch(migration, /\b(create|alter|drop|truncate)\s+(table|policy|schema)\b/i)
})

test('el Buen Fin publica identidad, titulares, pasos, cultos y salida de 2026', () => {
  for (const value of ['Hermandad del Buen Fin', 'Santísimo Cristo del Buen Fin', 'Nuestra Señora de la Palma Coronada', 'Paso de misterio', 'Paso de palio']) assert.match(migration, new RegExp(value))
  assert.match(migration, /2026-04-01/)
  assert.match(migration, /'Miércoles Santo'/)
})

test('el misterio recuperado en 2024 conserva sus cuatro figuras y autor', () => {
  for (const value of ['Santa María Magdalena', 'José de Arimatea', 'Nicodemo', 'Centurión romano', 'Darío Fernández']) assert.match(migration, new RegExp(value))
  assert.match(migration, /misterio recuperado en 2024/i)
})

test('la dolorosa del Buen Fin no se confunde con la homónima de la Lanzada', () => {
  assert.match(migration, /No confundir esta corporación/i)
  assert.match(migration, /María Santísima del Buen Fin, titular de la Hermandad de la Sagrada Lanzada/)
  assert.doesNotMatch(migration, /22c16c5b-d572-4a60-9d9f-29aa5e957cd8/)
  assert.doesNotMatch(migration, /paso-palio-buen-fin-sagrada-lanzada/)
})

test('el lote no fabrica multimedia sin derechos', () => {
  assert.match(migration, /Sin multimedia nueva mientras no conste licencia reutilizable/)
  assert.doesNotMatch(migration, /hero_image_path|crest_path|image_path/)
})
