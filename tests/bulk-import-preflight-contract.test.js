import test from 'node:test'
import assert from 'node:assert/strict'

import {
  normalizeBulkImportRecord,
  validateBulkImportRecord,
  validateBulkImportTableContract,
} from '../lib/panel/bulk-import-config.js'

test('rechaza columnas inexistentes conocidas antes de Apply', () => {
  const cases = [
    { table: 'entities', data: { type: 'band', name: 'Ejemplo' } },
    { table: 'bands', data: { entity_id: '00000000-0000-0000-0000-000000000001', official_name: 'Banda' } },
    { table: 'bands', data: { entity_id: '00000000-0000-0000-0000-000000000001', summary: 'Resumen' } },
    { table: 'bands', data: { entity_id: '00000000-0000-0000-0000-000000000001', linked_brotherhood_entity_id: '00000000-0000-0000-0000-000000000002' } },
  ]

  for (const input of cases) {
    const validation = validateBulkImportRecord({ ...input, operation: 'insert' })
    assert.ok(validation.errors.some((error) => error.startsWith('INVALID_COLUMN:')), input.table)
  }
})

test('exige los NOT NULL sin default cuando la operación efectiva es INSERT', () => {
  const entity = normalizeBulkImportRecord({ table: 'entities', operation: 'upsert', on_conflict: 'id', data: { id: '00000000-0000-0000-0000-000000000001', name: 'Entidad' } })
  assert.deepEqual(
    validateBulkImportTableContract(entity, 'insert'),
    ['MISSING_REQUIRED_FIELD: entities.entity_type es obligatorio para INSERT.'],
  )

  const brotherhood = normalizeBulkImportRecord({ table: 'brotherhoods', operation: 'upsert', data: { entity_id: '00000000-0000-0000-0000-000000000001' } })
  assert.deepEqual(
    validateBulkImportTableContract(brotherhood, 'insert'),
    [
      'MISSING_REQUIRED_FIELD: brotherhoods.official_name es obligatorio para INSERT.',
      'MISSING_REQUIRED_FIELD: brotherhoods.popular_name es obligatorio para INSERT.',
    ],
  )
})

test('permite UPDATE parcial sin exigir campos que ya existen en la fila persistida', () => {
  const record = normalizeBulkImportRecord({
    table: 'brotherhoods',
    operation: 'upsert',
    data: { entity_id: '00000000-0000-0000-0000-000000000001', history_text: 'Historia actualizada' },
  })

  assert.deepEqual(validateBulkImportTableContract(record, 'update'), [])
})

test('acepta los campos reales usados por entities, brotherhoods y bands', () => {
  const inputs = [
    { table: 'entities', operation: 'insert', data: { entity_type: 'band', name: 'Banda ejemplo' } },
    { table: 'brotherhoods', operation: 'insert', data: { entity_id: '00000000-0000-0000-0000-000000000001', official_name: 'Hermandad', popular_name: 'Hermandad' } },
    { table: 'bands', operation: 'insert', data: { entity_id: '00000000-0000-0000-0000-000000000001', description: 'Descripción', linked_brotherhood_name: 'Hermandad' } },
  ]

  for (const input of inputs) assert.deepEqual(validateBulkImportRecord(input).errors, [])
})

test('bloquea valores ajenos al CHECK de image_authorships antes de Apply', () => {
  const invalid = validateBulkImportRecord({
    table: 'image_authorships',
    operation: 'insert',
    data: {
      image_entity_id: '00000000-0000-0000-0000-000000000001',
      agent_entity_id: '00000000-0000-0000-0000-000000000002',
      authorship_type: 'restoration',
    },
  })

  assert.ok(invalid.errors.some((error) => error.startsWith('INVALID_VALUE: image_authorships.authorship_type')))

  const valid = validateBulkImportRecord({
    table: 'image_authorships',
    operation: 'insert',
    data: {
      image_entity_id: '00000000-0000-0000-0000-000000000001',
      agent_entity_id: '00000000-0000-0000-0000-000000000002',
      authorship_type: 'author',
    },
  })

  assert.deepEqual(valid.errors, [])
})
