import test from 'node:test'
import assert from 'node:assert/strict'
import { buildAgendaTemporalLanding, TEMPORAL_AGENDA_PAGES } from '../lib/agenda-temporal-landing.js'

function item(key, overrides = {}) {
  return {
    key,
    id: key,
    title: key,
    category: 'processions',
    categoryHref: '/procesiones-de-gloria',
    municipality: 'Sevilla',
    scope: 'capital',
    date: '2026-09-25',
    endDate: '',
    startTime: '18:00',
    isUpcoming: true,
    isCancelled: false,
    ...overrides,
  }
}

test('las tres landings temporales tienen rutas canónicas estables', () => {
  assert.equal(TEMPORAL_AGENDA_PAGES.today.slug, 'hoy')
  assert.equal(TEMPORAL_AGENDA_PAGES.tomorrow.slug, 'manana')
  assert.equal(TEMPORAL_AGENDA_PAGES.weekend.slug, 'fin-de-semana')
})

test('Hoy filtra actos del día e incluye actos de varios días', () => {
  const landing = buildAgendaTemporalLanding({
    period: 'today',
    today: '2026-09-25',
    items: [
      item('today'),
      item('multi', { date: '2026-09-24', endDate: '2026-09-26', category: 'devotions', categoryHref: '/agenda-cofrade' }),
      item('tomorrow', { date: '2026-09-26' }),
    ],
  })
  assert.deepEqual(landing.items.map((entry) => entry.key), ['multi', 'today'])
  assert.equal(landing.capitalCount, 2)
})

test('Mañana y fin de semana filtran por fechas estructuradas', () => {
  const items = [
    item('friday'),
    item('saturday', { date: '2026-09-26', municipality: 'Pilas', scope: 'province' }),
    item('sunday', { date: '2026-09-27', municipality: 'Dos Hermanas', scope: 'province' }),
    item('monday', { date: '2026-09-28', municipality: 'Carmona', scope: 'province' }),
  ]
  const tomorrow = buildAgendaTemporalLanding({ period: 'tomorrow', today: '2026-09-25', items })
  const weekend = buildAgendaTemporalLanding({ period: 'weekend', today: '2026-09-25', items })

  assert.deepEqual(tomorrow.items.map((entry) => entry.key), ['saturday'])
  assert.deepEqual(weekend.items.map((entry) => entry.key), ['saturday', 'sunday'])
  assert.equal(weekend.provinceCount, 2)
})

test('resume tipos y municipios activos con enlace territorial canónico', () => {
  const landing = buildAgendaTemporalLanding({
    period: 'today',
    today: '2026-09-25',
    items: [
      item('capital'),
      item('pilas', { municipality: 'Pilas', scope: 'province', category: 'devotions', categoryHref: '/agenda-cofrade' }),
    ],
  })

  assert.deepEqual(landing.municipalities.map((entry) => entry.href), [
    '/agenda-cofrade/localidad/sevilla-capital',
    '/agenda-cofrade/localidad/pilas',
  ])
  assert.deepEqual(landing.categories.map((entry) => [entry.key, entry.count]), [
    ['processions', 1],
    ['devotions', 1],
  ])
})
