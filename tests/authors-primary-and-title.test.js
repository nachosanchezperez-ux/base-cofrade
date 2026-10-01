import assert from 'node:assert/strict'
import test from 'node:test'
import { authorCategoryFor, authorSeoTitle } from '../lib/authors-presentation.js'

test('el oficio principal prevalece sobre un secundario de categoría anterior', () => {
  assert.equal(authorCategoryFor({
    primaryDiscipline: 'Bordado', disciplines: ['Vestidor', 'Bordado'],
    description: 'Restaurador textil', relationBreakdown: { dressings: 4 },
  }).key, 'textile')
  assert.equal(authorCategoryFor({
    primaryDiscipline: 'Restauración', disciplines: ['Imaginería', 'Restauración'],
  }).key, 'restoration')
})

test('un principal desconocido permite resolver por secundarios o fallback', () => {
  assert.equal(authorCategoryFor({primaryDiscipline: 'Oficio documental', disciplines: ['Vestidor']}).key, 'dressing')
  assert.equal(authorCategoryFor({name: 'Taller de bordado'}).key, 'textile')
  assert.equal(authorCategoryFor({relationBreakdown: {dressings: 1}}).key, 'dressing')
})

test('no decide un oficio principal ante dos principales o sin principal explícito', () => {
  assert.equal(authorCategoryFor({primaryDiscipline: 'Diseño', primaryDisciplineCount: 2,
    disciplines: ['Diseño', 'Imaginería']}).key, 'imagery')
  assert.equal(authorCategoryFor({primaryDiscipline: 'Bordado', primaryDisciplineCount: 0,
    disciplines: ['Bordado', 'Restauración']}).key, 'restoration')
})

test('el título de autor mantiene identidad y oficio completos en nombres largos', () => {
  assert.equal(authorSeoTitle({name: 'Antonio Jesús del Castillo Fernández', primaryDiscipline: 'Vestidor'}),
    'Antonio Jesús del Castillo Fernández · Vestidor')
  assert.equal(authorSeoTitle({name: 'José Antonio Grande de León', primaryDiscipline: 'Bordado', disciplines: ['Vestidor']}),
    'José Antonio Grande de León · Bordado')
  assert.equal(authorSeoTitle({name: 'Taller de bordado', kind: 'workshop'}),
    'Taller de bordado · Taller de bordado')
})
