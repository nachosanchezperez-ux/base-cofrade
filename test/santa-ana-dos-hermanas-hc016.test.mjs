import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const recipe = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260915113000_cierra_santa_ana_dos_hermanas.sql', import.meta.url),
  'utf8',
)

test('Santa Ana se cierra como contexto HC-016 con DML exclusivamente', () => {
  assert.doesNotMatch(recipe, /\b(create|alter|drop)\s+(table|policy|function|trigger|type|index)\b/i)
  assert.match(recipe, /c0160023-0000-4000-8000-000000000001/)
  assert.match(recipe, /49 operaciones/)
  assert.match(recipe, /'completed'/)
})

test('la ficha relaciona titular gótica, autoría prudente y paso de tumbilla', () => {
  assert.match(recipe, /Nuestra Señora Santa Ana/)
  assert.match(recipe, /Principios del siglo XIV/)
  assert.match(recipe, /'anonymous'/)
  assert.match(recipe, /Paso de tumbilla de Santa Ana/)
  assert.match(recipe, /dieciocho placas repujadas/)
  assert.match(recipe, /José Jiménez/)
})

test('la agenda de julio separa cultos, procesión y traslado', () => {
  assert.match(recipe, /'2026-07-20', '2026-07-21'/)
  assert.match(recipe, /'2026-07-23', '2026-07-25'/)
  assert.match(recipe, /'2026-07-26', '2026-07-26'/)
  assert.match(recipe, /'Procesión de Santa Ana 2026', '2026-07-26', 2026, '20:30'/)
  assert.match(recipe, /'Traslado de Santa Ana a su capilla 2026', '2026-07-27', 2026, '21:00'/)
  assert.equal((recipe.match(/'held', 'published'/g) || []).length, 5)
})

test('la música conserva formación, posición y alcance temporal', () => {
  assert.match(recipe, /Presentación al Pueblo abrió el cortejo/)
  assert.match(recipe, /Banda de Música Santa Ana tras el paso/)
  assert.match(recipe, /Vigente en 2026; inicio no documentado/)
  assert.match(recipe, /No se fija un año inicial sin fuente/)
})

test('la fotografía abierta conserva el contrato de procedencia', () => {
  assert.match(recipe, /Santa_Ana,_Patrona_de_Dos_Hermanas\.jpg/)
  assert.match(recipe, /Daniel Jiménez/)
  assert.match(recipe, /'public_domain'/)
  assert.match(recipe, /'CC0 1\.0'/)
  assert.match(recipe, /solo se optimizó a WebP/)
})
