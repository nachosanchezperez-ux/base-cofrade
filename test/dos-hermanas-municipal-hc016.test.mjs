import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const recipe = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260916210000_cierra_dos_hermanas_macrolote_municipal.sql', import.meta.url),
  'utf8',
)

test('Dos Hermanas se cierra mediante DML y un lote gobernado', () => {
  assert.doesNotMatch(recipe, /\b(create|alter|drop)\s+(table|policy|function|trigger|type|index)\b/i)
  assert.match(recipe, /c0160027-0000-4000-8000-000000000001/)
  assert.match(recipe, /Operaciones editoriales: 467 \(461 insert\/upsert, 6 update, 20 reuse\)/)
  assert.match(recipe, /'completed',467,467,467,0,467,0/)
})

test('el universo canónico municipal reúne veinte corporaciones y preserva los cierres previos', () => {
  for (const expected of [
    'Santa Cruz de Dos Hermanas',
    'Vera-Cruz de Dos Hermanas',
    'Hermandad del Cautivo de Dos Hermanas',
    'Hermandad Sacramental de Dos Hermanas',
    'Hermandad de Nuestra Señora de Valme',
    'Hermandad del Rocío de Montequinto',
  ]) assert.match(recipe, new RegExp(expected))
  assert.match(recipe, /Santa Ana y Santo Entierro se preservan como contextos certificados/)
  assert.doesNotMatch(recipe, /insert into public\."brotherhoods"[^]*Santa Ana de Dos Hermanas/i)
})

test('Santa Cruz conserva identidad territorial propia frente al homónimo de San Benito', () => {
  assert.match(recipe, /Paso de misterio de la Presentación al Pueblo de Dos Hermanas/)
  assert.match(recipe, /paso-misterio-presentacion-pueblo-dos-hermanas/)
  assert.doesNotMatch(recipe, /2c49d077-e377-492d-8e30-25fa823bdcd8/)
})

test('las siete bandas locales y la salida de 2026 se resuelven desde el grafo', () => {
  for (const expected of [
    'Agrupación Musical Nuestra Señora de la Estrella de Dos Hermanas',
    'Agrupación Musical Nuestro Padre Jesús Cautivo de Dos Hermanas',
    'Agrupación Musical Nuestra Señora de Valme de Dos Hermanas',
  ]) assert.match(recipe, new RegExp(expected))
  for (const existingBand of [
    '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1',
    '98c7b480-9917-439f-aea4-d26e474add78',
    '965eb1f8-0171-4282-9f27-2e65bf3c5cad',
  ]) assert.match(recipe, new RegExp(existingBand))
  assert.match(recipe, /296dfc62-374e-435b-acc0-6b0fd87d14b0/)
  assert.match(recipe, /public_municipality_slug.*dos-hermanas/)
  assert.doesNotMatch(recipe, /search_override|municipality_exception/i)
})

test('la actualidad no convierte recurrencias ni huecos legítimos en hechos', () => {
  assert.match(recipe, /'held'/)
  assert.match(recipe, /cultos, igualas, conciertos, crucetas, multimedia y autorias sin fuente suficiente/)
  assert.doesNotMatch(recipe, /insert into public\."events"/i)
  assert.doesNotMatch(recipe, /insert into public\."cults"/i)
})
