import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const recipe = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260916230000_cierra_alcala_guadaira_macrolote_municipal.sql', import.meta.url),
  'utf8',
)

test('Alcalá de Guadaíra se cierra mediante DML y un lote gobernado', () => {
  assert.doesNotMatch(recipe, /\b(create|alter|drop)\s+(table|policy|function|trigger|type|index)\b/i)
  assert.match(recipe, /c0160028-0000-4000-8000-000000000001/)
  assert.match(recipe, /Operaciones editoriales: 309 \(307 insert\/upsert, 2 update, 10 reuse\)/)
  assert.match(recipe, /'completed',309,309,309,0,309,0/)
})

test('el universo canónico reúne catorce corporaciones únicas', () => {
  for (const expected of [
    'Hermandad de la Borriquita de Alcalá de Guadaíra',
    'Hermandad de la Tercera Palabra de Alcalá de Guadaíra',
    'Hermandad Servita de Jesús Cautivo de Alcalá de Guadaíra',
    'Hermandad del Santo Entierro de Alcalá de Guadaíra',
    'Hermandad del Dulce Nombre de María de Alcalá de Guadaíra',
    'Hermandad de la Virgen del Águila',
    'Hermandad de San Mateo de Alcalá de Guadaíra',
  ]) assert.match(recipe, new RegExp(expected))
  assert.match(recipe, /Divina Misericordia se preserva como contexto certificado/)
  assert.doesNotMatch(recipe, /insert into public\."brotherhoods"[^]*Hermandad de la Divina Misericordia · Rosario de Santiago/i)
})

test('la actualidad contiene diez estaciones celebradas sin fabricar recurrencias', () => {
  assert.match(recipe, /2026-03-29/)
  assert.match(recipe, /4 de abril de 2026/)
  assert.match(recipe, /4ff33303-55ae-4bfc-a81b-9d72a9e15722/)
  assert.match(recipe, /'held'/)
  assert.match(recipe, /No se crea una edición 2026 sin convocatoria fechada y verificable/)
  assert.doesNotMatch(recipe, /insert into public\."events"/i)
  assert.doesNotMatch(recipe, /insert into public\."cults"/i)
})

test('música y búsqueda municipal reutilizan el grafo común', () => {
  for (const id of [
    'e0575c52-0cd9-4a0b-b2ba-724b9f4c3378',
    '8e754023-a46a-4587-8952-4696c70d0bd0',
    '7d0aa85b-b657-4ca2-9846-1dc4f8f11c74',
    '4c0f1466-35b5-4287-9125-7ef8c534184b',
  ]) assert.match(recipe, new RegExp(id))
  assert.match(recipe, /public_municipality_slug.*alcala-de-guadaira/)
  assert.doesNotMatch(recipe, /search_override|municipality_exception/i)
})
