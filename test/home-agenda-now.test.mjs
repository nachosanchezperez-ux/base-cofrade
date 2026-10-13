import test from 'node:test'
import assert from 'node:assert/strict'
import { buildHomeTemporalAgenda } from '../lib/home-temporal-agenda.js'
import {
  buildHomeAgendaNow,
  HOME_AGENDA_CARD_LIMIT,
  homeAgendaDateLabel,
  homeAgendaMoreLabel,
  homeAgendaTimeLabel,
  selectHomeFeaturedOuting,
} from '../lib/home-agenda-now.js'

// Lunes 12/10/2026, 10:30 en Madrid (08:30 UTC).
const NOW = new Date('2026-10-12T08:30:00.000Z')

function item(id, date, extra = {}) {
  return {
    id, key: id, title: 'Acto ' + id, date, isUpcoming: true, isCancelled: false,
    category: 'devotions', categoryLabel: 'Besamanos', municipality: 'Sevilla',
    organizer: 'Hermandad ' + id, href: '/hermandades/' + id, ...extra,
  }
}

function agendaFor(items) {
  return buildHomeAgendaNow(buildHomeTemporalAgenda({ items, today: '2026-10-12', now: NOW }))
}

test('una sola agenda con Hoy, Mañana y Fin de semana enlazados a sus rutas existentes', () => {
  const agenda = agendaFor([
    item('a', '2026-10-12', { startTime: '12:00' }),
    item('b', '2026-10-13'),
    item('c', '2026-10-17'),
  ])
  assert.deepEqual(agenda.tabs.map((tab) => [tab.key, tab.href, tab.count]), [
    ['today', '/agenda-cofrade/hoy', 1],
    ['tomorrow', '/agenda-cofrade/manana', 1],
    ['weekend', '/agenda-cofrade/fin-de-semana', 1],
  ])
  assert.equal(agenda.defaultTab, 'today')
})

test('«Ahora» solo aparece con procesiones en la calle y pasa a ser la pestaña inicial', () => {
  const agenda = agendaFor([
    item('rosario', '2026-10-12', { category: 'rosaries', categoryLabel: 'Rosario', startTime: '09:30', endTime: '13:00' }),
    item('culto', '2026-10-12', { startTime: '19:00' }),
  ])
  assert.equal(agenda.tabs[0].key, 'now')
  assert.equal(agenda.defaultTab, 'now')
  assert.equal(agenda.tabs[0].cards[0].isLive, true)
})

test('el contador de Hoy coincide con lo que queda del día, no con lo ya celebrado', () => {
  const agenda = agendaFor([
    item('pasado', '2026-10-12', { startTime: '08:00', endTime: '09:00' }),
    item('tarde', '2026-10-12', { startTime: '18:00' }),
  ])
  const today = agenda.tabs.find((tab) => tab.key === 'today')
  assert.equal(today.count, 1)
  assert.equal(today.cards[0].title, 'Acto tarde')
})

test('máximo cuatro tarjetas y enlace con el total cuando hay más', () => {
  const many = Array.from({ length: 6 }, (_, i) => item('d' + i, '2026-10-13', { startTime: '1' + i + ':00' }))
  const agenda = agendaFor(many)
  const tomorrow = agenda.tabs.find((tab) => tab.key === 'tomorrow')
  assert.equal(tomorrow.cards.length, HOME_AGENDA_CARD_LIMIT)
  assert.equal(homeAgendaMoreLabel(tomorrow), 'Ver las 6 citas de mañana')
  assert.equal(agenda.defaultTab, 'tomorrow')
})

test('la tarjeta lleva fecha y hora primero, nombre, Hermandad, municipio y tipo', () => {
  const agenda = agendaFor([item('x', '2026-10-13', { startTime: '20:30', endTime: '23:00', municipality: 'Camas' })])
  const card = agenda.tabs.find((tab) => tab.key === 'tomorrow').cards[0]
  assert.equal(card.dateLabel, 'MAR 13 oct')
  assert.equal(card.timeLabel, '20:30–23:00')
  assert.equal(card.organizer, 'Hermandad x')
  assert.equal(card.municipality, 'Camas')
  assert.equal(card.type, 'Besamanos')
  assert.equal(card.href, '/hermandades/x')
  assert.equal(homeAgendaDateLabel('2026-10-17'), 'SÁB 17 oct')
  assert.equal(homeAgendaDateLabel(''), 'Fecha por confirmar')
  assert.equal(homeAgendaTimeLabel({ timeText: 'Mañana y tarde' }), 'Mañana y tarde')
})

test('sin citas próximas en ningún periodo se muestran las siguientes de la Agenda', () => {
  const agenda = agendaFor([item('lejos', '2026-10-28', { startTime: '19:00' })])
  assert.ok(agenda.tabs.every((tab) => tab.count === 0))
  assert.equal(agenda.upcoming[0].title, 'Acto lejos')
  assert.equal(buildHomeAgendaNow(null), null)
  assert.equal(agendaFor([]), null)
})

test('el destacado prioriza la procesión en curso y no se duplica con los del Panel', () => {
  const live = { id: 'live', liveState: { state: 'live' } }
  const editorial = { id: 'ed', liveState: { state: 'upcoming' } }
  assert.equal(selectHomeFeaturedOuting({ upcomingAgenda: [editorial, live], editorialFeaturedOutingId: 'ed' }).outing.id, 'live')
  const onlyEditorial = selectHomeFeaturedOuting({ upcomingAgenda: [editorial], editorialFeaturedOutingId: 'ed' })
  assert.equal(onlyEditorial.outing.id, 'ed')
  assert.equal(onlyEditorial.isLive, false)
  assert.equal(selectHomeFeaturedOuting({ upcomingAgenda: [editorial], editorialFeaturedOutingId: 'ed', editorialHighlights: [{ outing: editorial }] }), null)
  assert.equal(selectHomeFeaturedOuting({ upcomingAgenda: [editorial] }), null)
})

test('la hoja de calendario usa la fecha de Madrid y la hora queda separada de su fin', async () => {
  const { homeAgendaDateParts, homeAgendaTimeParts } = await import('../lib/home-agenda-now.js')
  assert.deepEqual(homeAgendaDateParts('2026-10-17'), { day: '17', weekday: 'SÁB', month: 'oct', weekdayLong: 'sábado' })
  assert.deepEqual(homeAgendaDateParts(''), { day: '', weekday: '', month: '', weekdayLong: '' })
  assert.deepEqual(homeAgendaTimeParts({ startTime: '17:50:00', endTime: '22:00:00' }), { main: '17:50', detail: 'hasta 22:00' })
  assert.deepEqual(homeAgendaTimeParts({ timeText: '10:00–14:30 y 17:00–19:00' }), { main: '', detail: '10:00–14:30 y 17:00–19:00' })
  assert.deepEqual(homeAgendaTimeParts({}), { main: '', detail: '' })
})

test('el cambio de día se calcula en Madrid: a las 00:30 «Hoy» ya es el día siguiente', () => {
  // 13/10/2026 00:30 en Madrid = 12/10/2026 22:30 UTC.
  const lateNight = new Date('2026-10-12T22:30:00.000Z')
  const items = [
    item('lunes', '2026-10-12', { startTime: '20:00', endTime: '21:00' }),
    item('martes', '2026-10-13', { startTime: '19:00' }),
  ]
  const agenda = buildHomeAgendaNow(buildHomeTemporalAgenda({ items, today: '2026-10-13', now: lateNight }))
  const today = agenda.tabs.find((tab) => tab.key === 'today')
  assert.deepEqual(today.cards.map((card) => card.title), ['Acto martes'])
  assert.equal(today.cards[0].dateParts.day, '13')
})

test('los titulares de El Hilo se mueve en portada: los más recientes, uno por Hermandad', async () => {
  const { buildHomeNews } = await import('../lib/home-news.js')
  const item = (id, brotherhood, announcedOn) => ({
    id, href: `/el-hilo-se-mueve#${id}`, title: `Noticia ${id}`, summary: 'Resumen', kind: 'Cambio', topic: 'musica',
    brotherhood: { id: brotherhood, label: `Hermandad ${brotherhood}` }, municipality: 'Sevilla', announcedOn, crestPath: '',
  })
  const news = buildHomeNews([
    item('a', 'h1', '2026-10-12'),
    item('b', 'h1', '2026-10-11'),
    item('c', 'h2', '2026-10-10'),
    item('d', 'h3', '2026-10-09'),
    item('e', 'h4', '2026-10-08'),
  ])
  assert.deepEqual(news.map((n) => n.id), ['a', 'c', 'd'])
  assert.equal(news[0].topic, 'Música')
  assert.equal(news[0].dateLabel, '12 de octubre de 2026')
  assert.equal(news[0].href, '/el-hilo-se-mueve#a')
  assert.deepEqual(buildHomeNews(null), [])
})

test('titulares ágiles: fecha relativa en días de Madrid y enlace a las fichas', async () => {
  const { buildHomeNews, homeNewsDayLabel } = await import('../lib/home-news.js')
  assert.equal(homeNewsDayLabel('2026-10-13', '2026-10-13'), 'Hoy')
  assert.equal(homeNewsDayLabel('2026-10-12', '2026-10-13'), 'Ayer')
  assert.equal(homeNewsDayLabel('2026-10-09', '2026-10-13'), 'Hace 4 días')
  assert.equal(homeNewsDayLabel('2026-10-05', '2026-10-13'), '5 oct')
  assert.equal(homeNewsDayLabel('', '2026-10-13'), '')
  const [withLink, withoutLink] = buildHomeNews([
    { id: 'a', href: '/el-hilo-se-mueve#a', title: 'A', topic: 'musica', brotherhood: { id: 'h1', label: 'H1' }, announcedOn: '2026-10-12', discover: { label: 'Descubre', href: '/hermandades/h1' } },
    { id: 'b', href: '/el-hilo-se-mueve#b', title: 'B', topic: 'agenda', brotherhood: { id: 'h2', label: 'H2' }, announcedOn: '2026-10-11' },
  ])
  assert.deepEqual(withLink.discover, { label: 'Descubre', href: '/hermandades/h1' })
  assert.equal(withoutLink.discover, null)
})
