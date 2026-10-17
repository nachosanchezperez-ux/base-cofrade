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
  assert.deepEqual(landing.items.map((entry) => entry.key), ['today', 'multi'])
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


test('Hoy proyecta un acto multidia sobre hoy y no sobre su fecha de inicio', () => {
  const landing = buildAgendaTemporalLanding({
    period: 'today',
    today: '2026-09-26',
    items: [
      item('multi-friday', {
        date: '2026-09-25',
        endDate: '2026-09-27',
        category: 'devotions',
        categoryHref: '/agenda-cofrade',
        daySchedules: [
          { celebrationDate: '2026-09-25', startTime: '20:00', timeText: '20:00' },
          { celebrationDate: '2026-09-26', startTime: '09:00', timeText: '09:00–14:00 y 17:00–21:00' },
        ],
      }),
      item('saturday', { date: '2026-09-26', startTime: '18:30' }),
    ],
  })

  assert.deepEqual(landing.items.map((entry) => entry.temporalDate), ['2026-09-26', '2026-09-26'])
  const multi = landing.items.find((entry) => entry.key === 'multi-friday')
  assert.equal(multi.temporalDateInfo.weekdayLabel, 'Sábado, 26 de septiembre')
  assert.equal(multi.timeText, '09:00–14:00 y 17:00–21:00')
})

test('cada periodo resume en una frase cuántos actos hay, de qué tipo y dónde', async () => {
  const { agendaTemporalSummary, agendaTemporalCoverage } = await import('../lib/agenda-temporal-landing.js')
  const landing = buildAgendaTemporalLanding({
    period: 'today',
    today: '2026-10-17',
    items: [
      item('a', { date: '2026-10-17' }),
      item('b', { date: '2026-10-17', category: 'devotions', categoryHref: '/agenda-cofrade' }),
      item('c', { date: '2026-10-17', category: 'rosaries', categoryHref: '/agenda-cofrade', municipality: 'Dos Hermanas', scope: 'province' }),
    ],
  })
  assert.equal(landing.summary, 'Hoy, sábado 17 de octubre de 2026, hay 3 actos cofrades documentados en Sevilla y su provincia: 1 procesión, 1 rosario público y 1 besamanos o besapiés.')
  assert.equal(landing.summaryWithPlaces, `${landing.summary} Con actividad en Sevilla capital y Dos Hermanas.`)
  assert.equal(landing.temporalCoverage, '2026-10-17')
  assert.equal(agendaTemporalCoverage('weekend', '2026-10-15'), '2026-10-17/2026-10-18')
  assert.equal(agendaTemporalSummary({ count: 0 }), '')
  assert.equal(
    agendaTemporalSummary({ period: 'tomorrow', count: 1, categories: [{ key: 'concerts', count: 1 }], municipalities: [{ label: 'Olivares' }], today: '2026-10-17', withPlaces: false }),
    'Mañana, domingo 18 de octubre de 2026, hay 1 acto cofrade documentado en Sevilla y su provincia.'
  )
  assert.equal(
    agendaTemporalSummary({ period: 'weekend', count: 2, categories: [{ key: 'processions', count: 2 }], today: '2026-10-17', withPlaces: false }),
    'Este fin de semana, sábado 17 y domingo 18 de octubre de 2026, hay 2 actos cofrades documentados en Sevilla y su provincia.'
  )
  assert.match(
    agendaTemporalSummary({ period: 'weekend', count: 1, today: '2026-10-30', withPlaces: false }),
    /^Este fin de semana, sábado 31 de octubre y domingo 1 de noviembre de 2026, hay/
  )
})

test('los títulos de los periodos empiezan por «Procesiones y actos cofrades»', () => {
  assert.equal(TEMPORAL_AGENDA_PAGES.today.title, 'Procesiones y actos cofrades de hoy en Sevilla')
  assert.equal(TEMPORAL_AGENDA_PAGES.tomorrow.title, 'Procesiones y actos cofrades de mañana en Sevilla')
  assert.equal(TEMPORAL_AGENDA_PAGES.weekend.title, 'Procesiones y actos cofrades del fin de semana en Sevilla')
})
