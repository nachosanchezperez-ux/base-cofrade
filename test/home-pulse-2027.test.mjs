// «Semana Santa 2027 en datos» (23/11/2026): cifras vivas en la cabecera de la
// portada para reforzar la identidad de central de datos.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { addDays, buildHomePulse, countUpcomingWeek, holyWeekCountdown } from '../lib/home-pulse.js'

test('cuenta atrás hasta el Domingo de Ramos de 2027', () => {
  assert.deepEqual(holyWeekCountdown('2026-11-23'), {
    key: 'countdown', figure: '118', label: 'días para el Domingo de Ramos', href: '/semana-santa-sevilla-2027',
  })
  assert.equal(holyWeekCountdown('2027-03-20').label, 'día para el Domingo de Ramos')
  assert.equal(holyWeekCountdown('2027-03-24').figure, 'Hoy')
  assert.equal(holyWeekCountdown('2027-03-29'), null)
})

test('la semana va de hoy a dentro de 6 días y excluye lo ya celebrado', () => {
  assert.equal(addDays('2026-11-28', 6), '2026-12-04')
  const items = [
    { date: '2026-11-22' },
    { date: '2026-11-23', isPast: true },
    { date: '2026-11-23' },
    { date: '2026-11-29' },
    { date: '2026-11-30' },
    { date: '' },
  ]
  assert.equal(countUpcomingWeek(items, '2026-11-23'), 2)
})

test('sin dato no hay cifra: nunca se muestra un cero', () => {
  const pulse = buildHomePulse({ today: '2026-11-23', agendaItems: [], crewDates: [], musicChanges: null })
  assert.deepEqual(pulse.map((item) => item.key), ['countdown'])
  const full = buildHomePulse({
    today: '2026-11-23',
    agendaItems: [{ date: '2026-11-24' }],
    crewDates: ['2026-11-25', '2026-11-26'],
    musicChanges: 1234,
  })
  assert.deepEqual(full.map((item) => [item.key, item.figure, item.label]), [
    ['countdown', '118', 'días para el Domingo de Ramos'],
    ['agenda', '1', 'acto en la agenda esta semana'],
    ['crew', '2', 'igualás y ensayos esta semana'],
    ['music', '1234', 'cambios de banda para 2027'],
  ])
  assert.equal(buildHomePulse({}).length, 0)
})

test('la cabecera conserva la marca en el H1 y pinta las cifras bajo el buscador', () => {
  const hero = readFileSync(new URL('../components/HomeHero.js', import.meta.url), 'utf8')
  assert.match(hero, /Hilo Cofrade · Sevilla y su provincia/)
  assert.match(hero, /La central de datos de las cofradías/)
  assert.ok(hero.indexOf('<HiloSearch') < hero.indexOf('<HomePulse'))
  const css = readFileSync(new URL('../components/HomePulse.module.css', import.meta.url), 'utf8')
  assert.doesNotMatch(css, /color:\s*(var\(--home-red\)|#b01b32|#b71f37)/i)
})

test('horarios oficiales 2027: una Hermandad cuenta una vez y sin ninguno no hay cifra', async () => {
  const { countOfficialSchedules } = await import('../lib/home-pulse.js')
  const programme = { days: [
    { items: [{ slug: 'amor', timesSource: 'consejo' }, { slug: 'amor', timesSource: 'consejo' }, { slug: 'resurreccion', timesSource: 'oficial' }] },
    { items: [{ slug: 'baratillo', timesSource: 'hilo' }] },
  ] }
  assert.deepEqual(countOfficialSchedules(programme), { official: 1, total: 3 })
  const pulse = buildHomePulse({ today: '2026-11-23', schedules: { official: 1, total: 3 } })
  assert.deepEqual(pulse.find((item) => item.key === 'schedules'), {
    key: 'schedules', figure: '1 de 3', label: 'horarios oficiales de 2027 publicados', href: '/semana-santa-sevilla-2027',
  })
  assert.equal(buildHomePulse({ today: '2026-11-23', schedules: { official: 0, total: 3 } }).some((item) => item.key === 'schedules'), false)
})
