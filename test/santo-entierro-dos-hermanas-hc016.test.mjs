import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const recipe = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260913224245_cierra_santo_entierro_dos_hermanas.sql', import.meta.url),
  'utf8'
)

test('Santo Entierro se archiva como duodécimo contexto con DML exclusivamente', () => {
  assert.doesNotMatch(recipe, /\b(create|alter|drop)\s+(table|policy|function|trigger|type|index)\b/i)
  assert.match(recipe, /9b527bb5-f011-497c-92ca-d2071e3aeb49/)
  assert.match(recipe, /Santo Entierro de Dos Hermanas/)
})

test('la titularidad distingue Yacente, Soledad y Resucitado con autorías prudentes', () => {
  assert.match(recipe, /Santísimo Cristo Yacente/)
  assert.match(recipe, /Nuestra Señora de la Soledad/)
  assert.match(recipe, /Cristo Resucitado/)
  assert.match(recipe, /Juan Manuel Miñarro López/)
  assert.equal((recipe.match(/'anonymous'/g) || []).length, 2)
})

test('las salidas de Sábado Santo y Resurrección permanecen separadas', () => {
  assert.match(recipe, /'2026-04-04'/)
  assert.match(recipe, /'18:30'/)
  assert.match(recipe, /'22:30'/)
  assert.match(recipe, /'2026-04-05'/)
  assert.match(recipe, /'12:30'/)
  assert.match(recipe, /'14:00'/)
  assert.match(recipe, /No se mezcla con la procesión del Resucitado/)
})

test('la música conserva formación, posición y edición documentadas', () => {
  assert.match(recipe, /Música de capilla/)
  assert.match(recipe, /Maestro Tejera/)
  assert.match(recipe, /Banda Juvenil de Música Santa Ana de Dos Hermanas/)
  assert.match(recipe, /no se generaliza a otros años/i)
})

test('los huecos legítimos no se rellenan con precisión inventada', () => {
  assert.match(recipe, /fecha anual por confirmar/i)
  assert.match(recipe, /no se fija una fecha de 2026/i)
  assert.doesNotMatch(recipe, /Banda de Música Santa Ana de Dos Hermanas'\s*,\s*'full_route'/)
})
