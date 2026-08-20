import test from 'node:test'
import assert from 'node:assert/strict'

import { mergeEditableEntities } from '../lib/panel/reference-nodes.js'

test('marca como editable una entidad con ficha especializada', () => {
  const [item] = mergeEditableEntities(
    [{ id: 'paso-1', name: 'Paso completo' }],
    [{ entity_id: 'paso-1', step_type: 'Misterio' }],
    'paso',
    { step_type: 'Tipo por documentar' }
  )

  assert.equal(item.isEditable, true)
  assert.equal(item.step_type, 'Misterio')
  assert.equal(item.referenceReason, '')
})

test('conserva el nodo relacional pero impide enlazarlo a un editor inexistente', () => {
  const [item] = mergeEditableEntities(
    [{ id: 'paso-2', name: 'Nodo histórico' }],
    [],
    'paso',
    { step_type: 'Tipo por documentar' }
  )

  assert.equal(item.isEditable, false)
  assert.equal(item.step_type, 'Tipo por documentar')
  assert.equal(item.referenceReason, 'Falta la ficha especializada de paso')
})
