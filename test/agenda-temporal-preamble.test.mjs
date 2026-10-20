import test from 'node:test'
import assert from 'node:assert/strict'
import { buildAgendaTemporalLanding } from '../lib/agenda-temporal-landing.js'

// #1264 · Recuentos y lista responden a la misma selección. En Fin de semana un
// acto de sábado y domingo se lista en los dos días; el recuento cuenta actos.
function item(key, overrides = {}) {
  return {
    key, id: key, title: key, category: 'devotions', categoryHref: '/agenda-cofrade', municipality: 'Sevilla',
    scope: 'capital', date: '2026-10-24', endDate: '', startTime: '19:00', isUpcoming: true, isCancelled: false, ...overrides,
  }
}

test('el recuento del periodo cuenta actos distintos, no filas por día', () => {
  const landing = buildAgendaTemporalLanding({
    period: 'weekend',
    today: '2026-10-19',
    items: [
      item('devotions:triduo', { date: '2026-10-23', endDate: '2026-10-25' }),
      item('processions:gloria', { category: 'processions', date: '2026-10-25', scope: 'province', municipality: 'Utrera' }),
    ],
  })
  assert.equal(landing.items.length, 3) // el triduo, sábado y domingo
  assert.equal(landing.count, 2)
  assert.equal(landing.capitalCount + landing.provinceCount, landing.count)
  assert.equal(landing.categories.reduce((total, category) => total + category.count, 0), landing.count)
})

test('un periodo sin citas no devuelve recuentos fantasma', () => {
  const landing = buildAgendaTemporalLanding({ period: 'tomorrow', today: '2026-10-19', items: [item('devotions:x', { date: '2026-10-24' })] })
  assert.equal(landing.count, 0)
  assert.deepEqual(landing.categories, [])
  assert.deepEqual(landing.municipalities, [])
  assert.match(landing.dateCaption, /20 de octubre/)
})
