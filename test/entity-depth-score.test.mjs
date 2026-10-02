import test from 'node:test'
import assert from 'node:assert/strict'

import {
  ENTITY_DEPTH_DIMENSIONS,
  entityDepthLevel,
  scoreEntityDepth,
} from '../lib/entity-depth.js'

function present(key, label = key) {
  return { key, label, present: true }
}

function missing(key, label = key) {
  return { key, label, present: false }
}

test('las siete dimensiones suman 100 puntos', () => {
  const total = Object.values(ENTITY_DEPTH_DIMENSIONS).reduce((sum, item) => sum + item.weight, 0)
  assert.equal(total, 100)
})

test('una entidad documentalmente profunda puede alcanzar 100 sin reglas SEO', () => {
  const result = scoreEntityDepth({
    entityType: 'brotherhood',
    identity: [present('name'), present('type'), present('place')],
    summary: 'x'.repeat(120),
    detail: 'x'.repeat(300),
    chronology: [present('foundation'), present('history')],
    relationCount: 8,
    keyRelations: [present('images'), present('steps'), present('music')],
    sourceCount: 3,
    activityStrength: 2,
    supportStrength: 1,
  })

  assert.equal(result.score, 100)
  assert.equal(result.level, 'deep')
  assert.equal(result.gaps.length, 0)
})

test('la puntuación distingue deuda real sin inventar datos ausentes', () => {
  const result = scoreEntityDepth({
    entityType: 'march',
    identity: [present('slug'), present('work-type'), missing('music-type', 'Documentar tipología musical')],
    summary: 'Marcha documentada.',
    detail: '',
    chronology: [present('composition'), missing('premiere', 'Documentar estreno')],
    relationCount: 2,
    keyRelations: [
      missing('authors', 'Documentar autoría'),
      missing('dedication', 'Documentar dedicatoria'),
      present('recordings'),
      missing('performances', 'Relacionar crucetas'),
    ],
    sourceCount: 1,
    activityStrength: 1,
    supportStrength: 1,
  })

  assert.ok(result.score < 65)
  assert.ok(result.gaps.some((item) => item.label === 'Documentar autoría'))
  assert.ok(result.gaps.some((item) => item.label === 'Documentar estreno'))
  assert.ok(result.gaps.some((item) => item.key === 'sources:coverage'))
})

test('los niveles son estables y no deciden publicación ni indexación', () => {
  assert.equal(entityDepthLevel(80), 'deep')
  assert.equal(entityDepthLevel(65), 'solid')
  assert.equal(entityDepthLevel(45), 'developing')
  assert.equal(entityDepthLevel(44), 'priority')

  const result = scoreEntityDepth({ entityType: 'agent' })
  assert.equal(result.level, 'priority')
  assert.equal('indexable' in result, false)
  assert.equal('robots' in result, false)
})
