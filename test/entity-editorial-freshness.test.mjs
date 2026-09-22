import test from 'node:test'
import assert from 'node:assert/strict'
import {
  editorialFreshnessStatus,
  editorialPriorityReasons,
  effectiveContentUpdatedAt,
  freshnessCutoffs,
  panelEntityHref,
  publicEntityHref,
} from '../lib/editorial-freshness.js'

const NOW = new Date('2026-09-22T00:00:00Z')

test('frescura editorial distingue sin revisar, al día, próxima y vencida', () => {
  assert.equal(editorialFreshnessStatus(null, NOW), 'unreviewed')
  assert.equal(editorialFreshnessStatus('2026-08-01T00:00:00Z', NOW), 'fresh')
  assert.equal(editorialFreshnessStatus('2026-05-01T00:00:00Z', NOW), 'due')
  assert.equal(editorialFreshnessStatus('2026-01-01T00:00:00Z', NOW), 'stale')
})

test('la fecha editorial de contenido prevalece sobre updated_at técnico', () => {
  assert.equal(
    effectiveContentUpdatedAt({
      content_updated_at: '2026-09-01T00:00:00Z',
      updated_at: '2026-09-21T00:00:00Z',
    }),
    '2026-09-01T00:00:00Z'
  )
  assert.equal(
    effectiveContentUpdatedAt({ updated_at: '2026-09-21T00:00:00Z' }),
    '2026-09-21T00:00:00Z'
  )
})

test('construye rutas públicas y de panel para los cinco tipos', () => {
  const entity = { id: 'abc', entity_type: 'band', slug: 'banda-prueba' }
  assert.equal(publicEntityHref(entity), '/bandas/banda-prueba')
  assert.equal(panelEntityHref(entity), '/panel/bandas/abc')
})

test('los cortes de frescura son deterministas', () => {
  const cutoffs = freshnessCutoffs(NOW)
  assert.equal(cutoffs.fresh.slice(0, 10), '2026-06-24')
  assert.equal(cutoffs.stale.slice(0, 10), '2026-03-26')
})


test('explica la prioridad con señales visibles y ordenadas', () => {
  const reasons = editorialPriorityReasons({
    editorial_reviewed_at: null,
    next_activity_date: '2026-09-26',
    update_age_days: 4,
    relation_count: 18,
    source_count: 7,
  }, NOW)

  assert.deepEqual(reasons, [
    'Actividad en 4 días',
    'Sin revisión',
    'Cambio reciente',
    '18 conexiones',
  ])
})

test('limita la explicación a cuatro motivos para no sobrecargar la fila', () => {
  const reasons = editorialPriorityReasons({
    editorial_reviewed_at: '2026-01-01T00:00:00Z',
    next_activity_date: '2026-09-23',
    update_age_days: 2,
    relation_count: 30,
    source_count: 12,
  }, NOW)

  assert.equal(reasons.length, 4)
  assert.equal(reasons[0], 'Actividad mañana')
  assert.equal(reasons[1], 'Revisión vencida')
})
