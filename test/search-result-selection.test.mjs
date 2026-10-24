import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { selectHiloSearchResults } from '../lib/search-result-selection.js'

const titles = (items) => items.map((item) => `${item.type}:${item.title}`)

test('una tarjeta por destino, prefiriendo la ficha de la entidad', () => {
  // Caso real de «Cachorro» en producción (24-10-2026).
  const results = selectHiloSearchResults([
    { entityId: 'h', type: 'Hermandad', title: 'El Cachorro', href: '/hermandades/hermandad-del-cachorro', score: 3060 },
    { entityId: '', type: 'Estreno musical', title: 'Cachorro Eterno', href: '/marchas/marcha-cachorro-eterno', score: 1070 },
    { entityId: '', type: 'Estreno musical', title: 'Cachorro Eterno', href: '/marchas/marcha-cachorro-eterno', score: 1070 },
    { entityId: 'm', type: 'Marcha', title: 'Cachorro Eterno', href: '/marchas/marcha-cachorro-eterno', score: 1000 },
    { entityId: 'm2', type: 'Marcha', title: 'Cachorro Mío', href: '/marchas/marcha-cachorro-mio', score: 1000 },
  ])
  assert.deepEqual(titles(results), [
    'Hermandad:El Cachorro',
    'Marcha:Cachorro Eterno',
    'Marcha:Cachorro Mío',
  ])
  assert.equal('score' in results[0], false)
})

test('enlaces con distinto ancla no se agrupan', () => {
  const results = selectHiloSearchResults([
    { entityId: 'o', type: 'Hermandad', title: 'La O', href: '/hermandades/hermandad-de-la-o', score: 3070 },
    { entityId: '', type: 'Estación de Penitencia', title: 'La O · 2026', href: '/hermandades/hermandad-de-la-o#salidas', score: 900 },
  ])
  assert.equal(results.length, 2)
})

test('con fichas navegables, como mucho un resultado sin página', () => {
  const results = selectHiloSearchResults([
    { entityId: 'h', type: 'Hermandad', title: 'La O', href: '/hermandades/hermandad-de-la-o', score: 3000 },
    { entityId: 'a', type: 'Autor / profesional', title: 'Jorge Águila Ordóñez', href: '', score: 900 },
    { entityId: 'e', type: 'Acontecimiento', title: 'Primera estación de Triana a la Catedral', href: '', score: 880 },
    { entityId: 'b', type: 'Banda', title: 'Oliva de Salteras', href: '/bandas/x', score: 820 },
  ])
  assert.deepEqual(titles(results), [
    'Hermandad:La O',
    'Autor / profesional:Jorge Águila Ordóñez',
    'Banda:Oliva de Salteras',
  ])
})

test('si nada tiene página, se muestran los resultados sin página', () => {
  const results = selectHiloSearchResults([
    { entityId: 'a', type: 'Autor / profesional', title: 'Autor A', href: '', score: 900 },
    { entityId: 'b', type: 'Autor / profesional', title: 'Autor B', href: '', score: 800 },
  ])
  assert.equal(results.length, 2)
})

test('respeta el límite y el orden por puntuación', () => {
  const items = Array.from({ length: 12 }, (_, index) => ({
    entityId: String(index), type: 'Marcha', title: `M${index}`, href: `/marchas/m${index}`, score: index,
  }))
  const results = selectHiloSearchResults(items, 8)
  assert.equal(results.length, 8)
  assert.equal(results[0].title, 'M11')
})

test('search-live usa la selección final y rebaja el nombre oficial', () => {
  const source = readFileSync(new URL('../lib/supabase/search-live.js', import.meta.url), 'utf8')
  assert.equal((source.match(/selectHiloSearchResults\(/g) || []).length, 2)
  assert.doesNotMatch(source, /\.sort\(\(a, b\) => b\.score - a\.score/)
  assert.match(source, /value: row\.official_name, penalty: OFFICIAL_NAME_PENALTY/)
  assert.match(source, /rankText\(value, term\) \+ 80 - penalty/)
})
