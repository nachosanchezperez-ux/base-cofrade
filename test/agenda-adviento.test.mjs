// Especial de Adviento y Navidad en la Agenda (24/11/2026).
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { adventSeason, firstSundayOfAdvent } from '../lib/advent-season.js'
import { agendaPeriodRange, buildAgendaTemporalLanding, TEMPORAL_AGENDA_PAGES } from '../lib/agenda-temporal-landing.js'

test('primer domingo de Adviento de cada año', () => {
  assert.equal(firstSundayOfAdvent(2026), '2026-11-29')
  assert.equal(firstSundayOfAdvent(2027), '2027-11-28')
  assert.equal(firstSundayOfAdvent(2025), '2025-11-30')
  assert.equal(firstSundayOfAdvent(2028), '2028-12-03')
})

test('temporada: de noviembre a la Epifanía; en enero, la del año anterior', () => {
  const season = adventSeason('2026-11-24')
  assert.deepEqual([season.year, season.start, season.end, season.visible], [2026, '2026-11-29', '2027-01-06', true])
  assert.equal(adventSeason('2027-01-03').year, 2026)
  assert.equal(adventSeason('2027-01-07').visible, false)
  assert.equal(adventSeason('2026-10-31').visible, false)
  assert.deepEqual(season.keyDays.map((day) => day.date), ['2026-12-08', '2026-12-18', '2026-12-25', '2027-01-06'])
  // Rango mostrado: desde hoy si ya empezó la temporada.
  assert.deepEqual(agendaPeriodRange('advent', '2026-11-24'), ['2026-11-29', '2027-01-06'])
  assert.deepEqual(agendaPeriodRange('advent', '2026-12-10'), ['2026-12-10', '2027-01-06'])
})

const item = (key, date, endDate = '', extra = {}) => ({
  key, id: key, title: key, date, endDate, isUpcoming: true, category: 'devotions', municipality: 'Sevilla', scope: 'capital', ...extra,
})

test('la página reúne los actos de la temporada, día a día, con sus días grandes', () => {
  const landing = buildAgendaTemporalLanding({
    period: 'advent',
    today: '2026-11-24',
    items: [
      item('fuera-antes', '2026-11-28'),
      item('inmaculada', '2026-12-08'),
      item('triduo', '2026-12-15', '2026-12-17'),
      item('novena', '2026-12-15', '2026-12-23'),
      item('esperanza', '2026-12-18'),
      item('cancelado', '2026-12-20', '', { isCancelled: true }),
      item('fuera-despues', '2027-01-07'),
    ],
  })
  assert.equal(landing.path, '/agenda-cofrade/adviento')
  assert.equal(landing.count, 4)
  // Triduo de 3 días: 3 entradas. Novena de 9: solo el primer día.
  assert.equal(landing.items.filter((entry) => entry.key === 'triduo').length, 3)
  assert.equal(landing.items.filter((entry) => entry.key === 'novena').length, 1)
  assert.deepEqual(landing.keyDays.map((day) => day.label), ['La Inmaculada', 'La Esperanza'])
  assert.match(landing.summary, /^Del domingo 29 de noviembre al miércoles 6 de enero de 2027 hay 4 actos cofrades documentados/)
  assert.equal(landing.queryPeriod, '')
  assert.equal(landing.temporalCoverage, '2026-11-29/2027-01-06')
  assert.equal(TEMPORAL_AGENDA_PAGES.advent.slug, 'adviento')
})

test('página, acceso en la agenda y sitemap', () => {
  const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
  assert.match(read('app/agenda-cofrade/adviento/page.js'), /period: 'advent'/)
  assert.match(read('components/AgendaTemporalNav.js'), /href: '\/agenda-cofrade\/adviento'/)
  assert.match(read('app/sitemap.js'), /\/agenda-cofrade\/adviento/)
  assert.match(read('components/AgendaTemporalLanding.js'), /#agenda-dia-\$\{day\.date\}/)
})
