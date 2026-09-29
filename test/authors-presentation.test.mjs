import test from 'node:test'
import assert from 'node:assert/strict'

import {
  authorCategoryFor,
  authorProfileLabel,
  authorWorkOrder,
} from '../lib/authors-presentation.js'

test('clasifica disciplinas explícitas sin depender de mayúsculas ni tildes', () => {
  assert.equal(authorCategoryFor({ primaryDiscipline: 'Composición' }).key, 'music')
  assert.equal(authorCategoryFor({ primaryDiscipline: 'imaginería' }).key, 'imagery')
  assert.equal(authorCategoryFor({ primaryDiscipline: 'Restauración textil' }).key, 'restoration')
  assert.equal(authorCategoryFor({ primaryDiscipline: 'Bordado' }).key, 'textile')
  assert.equal(authorCategoryFor({ primaryDiscipline: 'Vestidor' }).key, 'dressing')
})

test('usa la descripción editorial para oficios todavía no normalizados', () => {
  assert.equal(authorCategoryFor({ description: 'Vestidor de imágenes sagradas.' }).key, 'dressing')
  assert.equal(authorCategoryFor({ description: 'Orfebre autor de piezas del paso de palio.' }).key, 'goldsmith')
  assert.equal(authorCategoryFor({ description: 'Conservadora-restauradora de bienes culturales.' }).key, 'restoration')
})

test('usa relaciones públicas como fallback cuando falta la disciplina', () => {
  assert.equal(authorCategoryFor({ relationBreakdown: { dressings: 2 } }).key, 'dressing')
  assert.equal(authorCategoryFor({ relationBreakdown: { marches: 3 } }).key, 'music')
  assert.equal(authorCategoryFor({ relationBreakdown: { images: 2 } }).key, 'imagery')
  assert.equal(authorCategoryFor({ relationBreakdown: { heritage: 2 } }).key, 'patrimony')
})

test('el rótulo del perfil respeta la naturaleza del agente', () => {
  assert.equal(authorProfileLabel({ kind: 'person', primaryDiscipline: 'Composición' }), 'Compositor')
  assert.equal(authorProfileLabel({ kind: 'workshop', primaryDiscipline: 'Bordado' }), 'Taller de bordado')
})

test('el orden de contenidos cambia con la idiosincrasia del oficio', () => {
  assert.deepEqual(authorWorkOrder('music').slice(0, 2), ['marches', 'heritage'])
  assert.deepEqual(authorWorkOrder('imagery').slice(0, 2), ['images', 'heritage'])
  assert.deepEqual(authorWorkOrder('restoration').slice(0, 2), ['heritage', 'images'])
  assert.deepEqual(authorWorkOrder('dressing').slice(0, 2), ['dressings', 'images'])
  assert.deepEqual(authorWorkOrder('carving').slice(0, 2), ['steps', 'heritage'])
})
