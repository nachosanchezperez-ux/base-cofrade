import assert from 'node:assert/strict'
import test from 'node:test'

import { crossFilterDay, crossFiltersV6Intent } from '../lib/tira-cross-filters-v6.js'

test('detecta Hermandades por jornada y Banda', () => {
  const intent = crossFiltersV6Intent('Hermandades del Lunes Santo con Santa Ana')
  assert.equal(intent?.kind, 'brotherhoods_by_day_band')
  assert.equal(intent?.day, 'Lunes Santo')
})

test('detecta Imágenes por autor y jornada', () => {
  const intent = crossFiltersV6Intent('Imágenes de Castillo Lastrucci que procesionan el Miércoles Santo')
  assert.equal(intent?.kind, 'images_by_agent_day')
  assert.equal(intent?.day, 'Miércoles Santo')
})

test('detecta Marchas por compositor y Banda intérprete', () => {
  assert.equal(
    crossFiltersV6Intent('Marchas de Manuel Marvizón interpretadas por Santa Ana')?.kind,
    'marches_by_agent_band'
  )
})

test('no secuestra consultas simples ya resueltas', () => {
  assert.equal(crossFiltersV6Intent('Hermandades del Lunes Santo en Sevilla'), null)
  assert.equal(crossFiltersV6Intent('¿Qué imágenes hizo Luis Ortega Bru?'), null)
  assert.equal(crossFiltersV6Intent('¿Qué marchas compuso Manuel Marvizón?'), null)
})

test('normaliza las jornadas de Semana Santa', () => {
  assert.equal(crossFilterDay('MIÉRCOLES SANTO'), 'Miércoles Santo')
  assert.equal(crossFilterDay('madrugada'), 'Madrugada')
  assert.equal(crossFilterDay('Sábado de Pasión'), 'Sábado de Pasión')
})
