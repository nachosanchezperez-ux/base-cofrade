import test from 'node:test'
import assert from 'node:assert/strict'

import { relationSupportCandidate, splitGraphEdgeLabel } from '../lib/tira-relation-references.js'

const entity = (id, entityType) => ({ id, entityType })

test('identifica hermandad-paso y conserva orientación', () => {
  const candidate = relationSupportCandidate(entity('s', 'step'), entity('h', 'brotherhood'))
  assert.equal(candidate.kind, 'brotherhood_step')
  assert.equal(candidate.sourceLinkColumn, 'brotherhood_step_id')
  assert.deepEqual(candidate.values, { brotherhoodId: 'h', stepId: 's' })
})

test('identifica personal actual del paso', () => {
  const candidate = relationSupportCandidate(entity('a', 'agent'), entity('s', 'step'), 'Capataz')
  assert.equal(candidate.kind, 'step_personnel')
  assert.deepEqual(candidate.values, { stepId: 's', agentId: 'a' })
})

test('identifica acompañamiento por hermandad o paso', () => {
  assert.equal(
    relationSupportCandidate(entity('h', 'brotherhood'), entity('b', 'band')).kind,
    'music_period_brotherhood'
  )
  assert.equal(
    relationSupportCandidate(entity('s', 'step'), entity('b', 'band')).kind,
    'music_period_step'
  )
})

test('no confunde compositor con dedicatoria', () => {
  assert.equal(
    relationSupportCandidate(entity('m', 'march'), entity('a', 'agent'), 'Composición'),
    null
  )
  assert.equal(
    relationSupportCandidate(entity('m', 'march'), entity('a', 'agent'), 'Dedicatoria musical').kind,
    'march_dedication'
  )
})

test('descompone una arista visual', () => {
  assert.deepEqual(splitGraphEdgeLabel('El Baratillo → Paso de palio'), {
    fromName: 'El Baratillo',
    toName: 'Paso de palio',
  })
  assert.equal(splitGraphEdgeLabel('Sin flecha'), null)
})
