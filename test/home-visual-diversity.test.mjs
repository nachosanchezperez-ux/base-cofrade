import test from 'node:test'
import assert from 'node:assert/strict'

import { selectDiverseHomeSpotlights } from '../lib/home-visual-diversity.js'

test('evita repetir una misma hermandad entre Hermandades, Imágenes y Pasos si hay alternativa', () => {
  const groups = {
    brotherhood: [{ id: 'san-benito' }, { id: 'cena' }],
    image: [{ id: 'cristo-sangre' }, { id: 'encarnacion' }],
    step: [{ id: 'presentacion' }, { id: 'palio-cena' }],
    band: [{ id: 'cigarreras' }],
  }
  const families = new Map([
    ['san-benito', '/hermandades/san-benito'],
    ['cena', '/hermandades/la-cena'],
    ['cristo-sangre', '/hermandades/san-benito'],
    ['encarnacion', '/hermandades/la-cena'],
    ['presentacion', '/hermandades/san-benito'],
    ['palio-cena', '/hermandades/la-cena'],
    ['cigarreras', '/bandas/cigarreras'],
  ])

  const selected = selectDiverseHomeSpotlights(groups, families, '2026-08-22')
  const picked = [selected.brotherhood, selected.image, selected.step]
  const pickedFamilies = picked.map((item) => families.get(item.id))

  assert.equal(new Set(pickedFamilies).size, 2)
  assert.notEqual(families.get(selected.brotherhood.id), families.get(selected.image.id))
})

test('repite universo solo cuando no quedan alternativas', () => {
  const groups = {
    brotherhood: [{ id: 'one' }],
    image: [{ id: 'one-image' }],
    step: [{ id: 'one-step' }],
  }
  const families = new Map([
    ['one', 'family:one'],
    ['one-image', 'family:one'],
    ['one-step', 'family:one'],
  ])

  const selected = selectDiverseHomeSpotlights(groups, families, '2026-08-22')
  assert.deepEqual(Object.keys(selected), ['brotherhood', 'image', 'step'])
})
