import test from 'node:test'
import assert from 'node:assert/strict'

import { buildHealthImportProposal } from '../lib/panel/data-health-import.js'
import { validateBulkImportRecord } from '../lib/panel/bulk-import-config.js'

test('prepara una Hermandad publicada sin ficha especializada como upsert revisable', () => {
  const proposal = buildHealthImportProposal({
    id: '00000000-0000-0000-0000-000000000001',
    entity_type: 'brotherhood',
    name: 'Hermandad de prueba',
    status: 'published',
  })
  assert.equal(proposal.records.length, 1)
  assert.equal(proposal.records[0].table, 'brotherhoods')
  assert.equal(proposal.records[0].data.official_name, 'Hermandad de prueba')
  assert.deepEqual(validateBulkImportRecord(proposal.records[0]).errors, [])
})

test('prepara un Paso publicado sin ficha especializada sin inventar datos opcionales', () => {
  const proposal = buildHealthImportProposal({
    id: '00000000-0000-0000-0000-000000000002',
    entity_type: 'step',
    name: 'Paso de prueba',
    status: 'published',
  })
  assert.deepEqual(proposal.records[0].data, { entity_id: '00000000-0000-0000-0000-000000000002' })
  assert.deepEqual(validateBulkImportRecord(proposal.records[0]).errors, [])
})

test('no automatiza incidencias que exigen criterio editorial', () => {
  for (const entity_type of ['agent', 'image', 'band', 'march', 'event']) {
    assert.equal(buildHealthImportProposal({ id: 'x', entity_type, name: 'X', status: 'published' }), null)
  }
  assert.equal(buildHealthImportProposal({ id: 'x', entity_type: 'step', name: 'X', status: 'draft' }), null)
})
