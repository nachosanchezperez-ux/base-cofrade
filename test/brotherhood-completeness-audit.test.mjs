import assert from 'node:assert/strict'
import test from 'node:test'

import {
  brotherhoodMissingSignals,
  prepareBrotherhoodCompletenessAudit,
} from '../lib/panel/brotherhood-completeness-audit.js'

test('enumera únicamente las señales oficiales que faltan', () => {
  const missing = brotherhoodMissingSignals({
    identity: true,
    crest: false,
    canonical_see: true,
    procession_day: false,
    images: true,
    steps: false,
    cults: false,
    outings: true,
    music: false,
    sources: true,
  })

  assert.deepEqual(missing.map((item) => item.key), [
    'crest',
    'procession_day',
    'steps',
    'cults',
    'music',
  ])
})

test('ordena por el porcentaje oficial y excluye borradores', () => {
  const rows = [
    { entity_id: 'b', completion_percentage: 57, identity: true, sources: true },
    { entity_id: 'a', completion_percentage: 14, sources: true },
    { entity_id: 'c', completion_percentage: 100, identity: true, crest: true, canonical_see: true, procession_day: true, images: true, steps: true, cults: true, outings: true, music: true, sources: true },
    { entity_id: 'draft', completion_percentage: 0 },
  ]
  const entities = [
    { id: 'a', name: 'A', slug: 'a', status: 'published' },
    { id: 'b', name: 'B', slug: 'b', status: 'published' },
    { id: 'c', name: 'C', slug: 'c', status: 'published' },
    { id: 'draft', name: 'D', slug: 'd', status: 'draft' },
  ]

  const audit = prepareBrotherhoodCompletenessAudit(rows, entities, 20)
  assert.equal(audit.total, 3)
  assert.equal(audit.incomplete, 2)
  assert.equal(audit.complete, 1)
  assert.deepEqual(audit.items.map((item) => item.name), ['A', 'B'])
  assert.equal(audit.minimumCompletion, 14)
})

test('el límite solo compacta la lista, no altera las métricas', () => {
  const rows = [
    { entity_id: 'a', completion_percentage: 14 },
    { entity_id: 'b', completion_percentage: 50 },
    { entity_id: 'c', completion_percentage: 100, identity: true, crest: true, canonical_see: true, procession_day: true, images: true, steps: true, cults: true, outings: true, music: true, sources: true },
  ]
  const entities = rows.map((row) => ({ id: row.entity_id, name: row.entity_id.toUpperCase(), slug: row.entity_id, status: 'published' }))
  const audit = prepareBrotherhoodCompletenessAudit(rows, entities, 1)

  assert.equal(audit.items.length, 1)
  assert.equal(audit.total, 3)
  assert.equal(audit.incomplete, 2)
  assert.equal(audit.complete, 1)
  assert.equal(audit.averageCompletion, 54.7)
})
