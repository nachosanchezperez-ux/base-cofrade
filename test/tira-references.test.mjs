import test from 'node:test'
import assert from 'node:assert/strict'

import { rankTiraReferences, safeSourceUrl, sourcePriority } from '../lib/tira-references.js'

test('solo admite URLs http y https', () => {
  assert.equal(safeSourceUrl('javascript:alert(1)'), '')
  assert.equal(safeSourceUrl('nota interna'), '')
  assert.match(safeSourceUrl('https://example.com/a'), /^https:\/\/example\.com/)
})

test('prioriza fuentes oficiales sobre bases de datos genéricas', () => {
  assert.ok(
    sourcePriority({ source_type: 'Web oficial', url: 'https://example.com' })
      > sourcePriority({ source_type: 'Base de datos', url: 'https://example.org' })
  )
})

test('agrega ámbitos y entidades por fuente', () => {
  const references = rankTiraReferences([
    { id: 's1', name: 'Web oficial', source_type: 'Web oficial', url: 'https://a.test' },
    { id: 's2', name: 'BD', source_type: 'Base de datos', url: 'https://b.test' },
  ], [
    { source_id: 's1', entity_id: 'e1', scope: 'Ficha general' },
    { source_id: 's1', entity_id: 'e2', scope: 'Historia' },
    { source_id: 's1', entity_id: 'e1', scope: 'Ficha general' },
    { source_id: 's2', entity_id: 'e1', scope: 'Estadísticas' },
  ])

  assert.equal(references[0].id, 's1')
  assert.equal(references[0].linkedEntityCount, 2)
  assert.deepEqual(references[0].scopes, ['Ficha general', 'Historia'])
})
