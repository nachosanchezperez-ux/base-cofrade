import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const recipe = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260916150000_cierra_gerena_macrolote_municipal.sql', import.meta.url),
  'utf8',
)

test('Gerena se cierra con DML exclusivamente y lote gobernado', () => {
  assert.doesNotMatch(recipe, /\b(create|alter|drop)\s+(table|policy|function|trigger|type|index)\b/i)
  assert.match(recipe, /c0160026-0000-4000-8000-000000000001/)
  assert.match(recipe, /Operaciones editoriales: 83 \(77 insert\/upsert, 6 update\)/)
  assert.match(recipe, /'completed',83,83,83,0,83,0/)
})

test('el universo canónico de Gerena conserva tres corporaciones', () => {
  assert.match(recipe, /Gran Poder de Gerena/)
  assert.match(recipe, /Hermandad de la Vera-Cruz de Gerena/)
  assert.match(recipe, /Hermandad de la Soledad Coronada de Gerena/)
  assert.match(recipe, /Documentada en 1560 y con visitas pastorales desde 1604/)
})

test('titulares y pasos quedan relacionados sin homónimos territoriales', () => {
  for (const expected of [
    'Nuestro Padre Jesús del Gran Poder de Gerena',
    'María Santísima del Rosario en sus Misterios Dolorosos de Gerena',
    'Santísimo Cristo de la Vera Cruz de Gerena',
    'Nuestro Señor de la Paz en su Resurrección Gloriosa',
    'Nuestra Señora de la Soledad Coronada de Gerena',
    'Cristo Yacente de la Soledad de Gerena',
  ]) assert.match(recipe, new RegExp(expected))
  assert.match(recipe, /Paso de palio canónico de María Santísima de la Sangre/)
})

test('la Banda Municipal queda vinculada por el grafo y no por hardcode de búsqueda', () => {
  assert.match(recipe, /Banda Municipal de Música de Gerena/)
  assert.match(recipe, /public_municipality_slug.*gerena/)
  assert.match(recipe, /Tras el paso de palio/)
  assert.doesNotMatch(recipe, /search_override|hardcode|municipality_exception/i)
})

test('la receta preserva los huecos legítimos y no fabrica Agenda pasada', () => {
  assert.match(recipe, /No se crea una salida 2026 sin evidencia posterior suficiente/)
  assert.doesNotMatch(recipe, /insert into public\."events"/i)
  assert.doesNotMatch(recipe, /insert into public\."outings"/i)
  assert.doesNotMatch(recipe, /insert into public\."cults"/i)
})
