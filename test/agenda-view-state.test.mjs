import test from 'node:test'
import assert from 'node:assert/strict'
import {
  AGENDA_VIEW_STATE_KEY,
  agendaFilterSearch,
  agendaHashAfterFilterChange,
  agendaRestoreScrollTop,
  readAgendaView,
  serializeAgendaView,
} from '../lib/agenda-view-state.js'

// #1264 · Volver con contexto. Auditoría en producción (19/10/2026): tras elegir
// Fin de semana + Sevilla capital + Cultos (4 citas), abrir la ficha del Amparo y
// volver, la Agenda reaparecía en Próximos, toda la provincia y todos los tipos;
// tras «Ver 24 actos más» (48), volvía con 24 y sin el acto visitado.

test('la selección pública se escribe con los parámetros que ya lee la página', () => {
  assert.equal(
    agendaFilterSearch('', { period: 'weekend', category: 'devotions', territory: 'capital' }),
    '?periodo=weekend&categoria=devotions&territorio=capital',
  )
  assert.equal(
    agendaFilterSearch('', { period: 'today', territory: 'province', municipality: 'dos-hermanas' }),
    '?periodo=today&territorio=province&municipio=dos-hermanas',
  )
})

test('sin filtros la Agenda vuelve a ser /agenda-cofrade y se conservan otros parámetros', () => {
  assert.equal(agendaFilterSearch('?periodo=weekend&categoria=concerts', {}), '')
  assert.equal(agendaFilterSearch('?utm_source=x&periodo=today', { period: 'tomorrow' }), '?utm_source=x&periodo=tomorrow')
  // El municipio solo tiene sentido dentro de «Municipios».
  assert.equal(agendaFilterSearch('?municipio=utrera', { territory: 'capital', municipality: 'utrera' }), '?territorio=capital')
})

test('«Mis hermandades» nunca se añade a la URL; si se desactiva, se retira ?mis=1', () => {
  assert.equal(agendaFilterSearch('', { mineOnly: true }), '')
  assert.equal(agendaFilterSearch('?mis=1', { mineOnly: true }), '?mis=1')
  assert.equal(agendaFilterSearch('?mis=1', { mineOnly: false }), '')
})

test('el ancla de un acto se retira al cambiar la selección; otras anclas se conservan', () => {
  assert.equal(agendaHashAfterFilterChange('#acto-devotions-1'), '')
  assert.equal(agendaHashAfterFilterChange('#agenda'), '#agenda')
  assert.equal(agendaHashAfterFilterChange(''), '')
})

test('la vista guardada sobrevive a history.state (Infinity incluido) y descarta valores extraños', () => {
  const saved = serializeAgendaView({ visibleCount: 48, mineOnly: true, scrollY: 18640.4, anchorId: 'acto-devotions-4870e2c4', anchorTop: 120.6, openDetailId: 'acto-devotions-4870e2c4-detail' })
  const view = readAgendaView({ __NA: true, [AGENDA_VIEW_STATE_KEY]: JSON.parse(JSON.stringify(saved)) })
  assert.deepEqual(view, { visibleCount: 48, mineOnly: true, scrollY: 18640, anchorId: 'acto-devotions-4870e2c4', anchorTop: 121, openDetailId: 'acto-devotions-4870e2c4-detail' })

  const all = readAgendaView({ [AGENDA_VIEW_STATE_KEY]: serializeAgendaView({ visibleCount: Number.POSITIVE_INFINITY }) })
  assert.equal(all.visibleCount, Number.POSITIVE_INFINITY)

  const hostile = readAgendaView({ [AGENDA_VIEW_STATE_KEY]: { visibleCount: -5, anchorId: '"><img>', openDetailId: 'x' } })
  assert.equal(hostile.visibleCount, 24)
  assert.equal(hostile.anchorId, '')
  assert.equal(hostile.openDetailId, '')
  assert.equal(readAgendaView(null), null)
  assert.equal(readAgendaView({ __NA: true }), null)
})

test('la posición se recupera desde el acto de referencia y, si falta, desde el scroll', () => {
  const view = { anchorId: 'acto-x', anchorTop: 120, scrollY: 5000 }
  assert.equal(agendaRestoreScrollTop(view, 5300), 5180)
  assert.equal(agendaRestoreScrollTop(view, null), 5000)
  assert.equal(agendaRestoreScrollTop({ ...view, anchorId: '' }, 5300), 5000)
  assert.equal(agendaRestoreScrollTop(null, 10), null)
})
