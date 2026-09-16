import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const recipe = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260916193000_cierra_pilas_macrolote_municipal.sql', import.meta.url),
  'utf8',
)

test('Pilas se cierra mediante DML y un lote gobernado', () => {
  assert.doesNotMatch(recipe, /\b(create|alter|drop)\s+(table|policy|function|trigger|type|index)\b/i)
  assert.match(recipe, /c0160029-0000-4000-8000-000000000001/)
  assert.match(recipe, /Operaciones editoriales: 118 \(104 insert\/upsert, 14 update\)/)
  assert.match(recipe, /'completed',118,118,118,0,118,0/)
})

test('el universo canónico de Pilas reúne cuatro corporaciones', () => {
  for (const expected of [
    'Borriquita de Pilas',
    'Cautivo y Dolores de Pilas',
    'Virgen de Belén',
    'Hermandad de la Soledad de Pilas',
  ]) assert.match(recipe, new RegExp(expected))
  assert.match(recipe, /Agrupación Parroquial/)
  assert.match(recipe, /Documentada desde 1591/)
})

test('titulares y pasos se conectan con identidad territorial', () => {
  for (const expected of [
    'Nuestro Padre Jesús Cautivo de Pilas',
    'Nuestra Señora de los Dolores de Pilas',
    'Santísimo Cristo de la Vera Cruz de Pilas',
    'María Santísima en su Soledad de Pilas',
    'Cristo Yacente de la Soledad de Pilas',
  ]) assert.match(recipe, new RegExp(expected))
  assert.match(recipe, /paso-cristo-vera-cruz-pilas/)
  assert.match(recipe, /paso-palio-soledad-pilas/)
})

test('las dos bandas locales y el acompañamiento externo conservan su identidad', () => {
  assert.match(recipe, /Sociedad Filarmónica de Pilas/)
  assert.match(recipe, /Formación juvenil de la Sociedad Filarmónica de Pilas/)
  assert.match(recipe, /Agrupación Musical San Miguel Arcángel de Puertollano/)
  assert.match(recipe, /public_municipality_slug.*pilas/)
  assert.doesNotMatch(recipe, /search_override|municipality_exception/i)
})

test('las convocatorias pasadas no se elevan a celebradas sin evidencia posterior', () => {
  assert.match(recipe, /2026-03-29/)
  assert.match(recipe, /2026-04-05/)
  assert.match(recipe, /ANUNCIADO no equivale a CELEBRADO/)
  assert.match(recipe, /Permanece announced hasta disponer de evidencia posterior inequívoca/)
  assert.doesNotMatch(recipe, /'held'/)
  assert.doesNotMatch(recipe, /insert into public\."events"/i)
  assert.doesNotMatch(recipe, /insert into public\."cults"/i)
})
