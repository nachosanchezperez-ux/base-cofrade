// «Procesión en curso» dentro de la Agenda (#1253): un solo foco en la portada.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildHomeTemporalAgenda } from '../lib/home-temporal-agenda.js'
import { buildHomeAgendaNow, homeLiveFocus } from '../lib/home-agenda-now.js'

// Domingo 18/10/2026, 11:30 en Madrid (09:30 UTC).
const NOW = new Date('2026-10-18T09:30:00.000Z')
const valme = {
  id: 'valme', key: 'valme', title: 'Romería de Nuestra Señora de Valme 2026', date: '2026-10-18', isUpcoming: true, isCancelled: false,
  category: 'romeries', categoryLabel: 'Romería', municipality: 'Dos Hermanas', organizer: 'Hermandad de Valme',
  startTime: '08:00', endTime: '22:30', href: '/extraordinarias/valme-2026',
}
const rosario = { ...valme, id: 'rosario', key: 'rosario', title: 'Rosario de la Aurora', category: 'rosaries', categoryLabel: 'Rosario', startTime: '08:00', endTime: '12:00', href: '/rosario' }

test('las romerías cuentan como «en curso» en la Agenda', () => {
  const temporal = buildHomeTemporalAgenda({ items: [valme], today: '2026-10-18', now: NOW })
  assert.deepEqual(temporal.liveItems.map((item) => item.id), ['valme'])
})

test('la salida en curso pasa a ser la cita principal con su siguiente horario y la guía', () => {
  const focus = homeLiveFocus({
    outing: { date: '2026-10-18', href: '/extraordinarias/valme-2026', title: valme.title },
    briefing: {
      schedule: [
        { id: 's1', time: '08:00', label: 'Salida de la Virgen en su carreta', place: 'Santa María Magdalena', itemDate: '2026-10-18' },
        { id: 's2', time: '13:30', label: 'Llegada a la Ermita de Cuarto', place: 'Ermita de Cuarto', itemDate: '2026-10-18' },
      ],
      bands: [{ name: 'Banda de Valme' }],
    },
    now: NOW,
  })
  assert.equal(focus.next.time, '13:30')
  assert.deepEqual(focus.bands, ['Banda de Valme'])
  const agenda = buildHomeAgendaNow(buildHomeTemporalAgenda({ items: [rosario, valme], today: '2026-10-18', now: NOW }), { liveFocus: focus })
  const now = agenda.tabs.find((tab) => tab.key === 'now')
  assert.equal(now.cards[0].title, valme.title)
  assert.equal(now.cards[0].focus.guideHref, '/extraordinarias/valme-2026')
  assert.equal(agenda.liveFocusMatched, true)
  // Sin coincidencia en la Agenda, el bloque aparte se mantiene (red de seguridad).
  const other = buildHomeAgendaNow(buildHomeTemporalAgenda({ items: [rosario], today: '2026-10-18', now: NOW }), { liveFocus: focus })
  assert.equal(other.liveFocusMatched, false)
})

test('la portada ya no duplica el bloque cuando la Agenda muestra la salida', () => {
  const home = readFileSync(new URL('../components/HomePageV2.js', import.meta.url), 'utf8')
  assert.match(home, /const liveInAgenda = Boolean\(liveFocus && agendaNow\?\.liveFocusMatched\)/)
  assert.match(home, /live && featuredBriefing && !liveInAgenda \?/)
  const row = readFileSync(new URL('../components/HomeAgendaNow.js', import.meta.url), 'utf8')
  assert.match(row, /\{card\.focus \? <LiveFocus focus=\{card\.focus\} \/> : null\}/)
})

// #1264: el 18/10 la Romería de Valme salía en portada con «Horarios y guía
// completa» apuntando a la ficha de la Hermandad. La guía debe llevar al acto.
test('«Horarios y guía completa» lleva al acto en la Agenda cuando el enlace es la ficha de la Hermandad', () => {
  const romeria = {
    ...valme, id: 'b7e1', key: 'romeries:b7e1', href: '/hermandades/valme', organizerHref: '/hermandades/valme',
  }
  const focus = homeLiveFocus({
    outing: { id: 'b7e1', date: '2026-10-18', href: '/hermandades/valme', title: romeria.title },
    briefing: { schedule: [{ id: 's1', time: '08:00', label: 'Salida', itemDate: '2026-10-18' }], bands: [] },
    now: NOW,
  })
  const agenda = buildHomeAgendaNow(buildHomeTemporalAgenda({ items: [romeria], today: '2026-10-18', now: NOW }), { liveFocus: focus })
  const card = agenda.tabs.find((tab) => tab.key === 'now').cards[0]
  // Mismo identificador que la tarjeta de /agenda-cofrade (agendaEventAnchor de «romeries:b7e1»).
  assert.equal(card.focus.guideHref, '/agenda-cofrade#acto-romeries-b7e1')
  // La cita en sí conserva su enlace; solo cambia el destino de la guía.
  assert.equal(card.href, '/hermandades/valme')
})

test('«Horarios y guía completa» conserva la página propia del acto cuando existe', () => {
  const gloria = {
    ...valme, id: 'g1', key: 'processions:g1', category: 'processions', categoryLabel: 'Procesión de Gloria',
    href: '/procesiones-de-gloria/virgen-del-rosario-2026',
  }
  const focus = homeLiveFocus({
    outing: { id: 'g1', date: '2026-10-18', href: gloria.href, title: gloria.title },
    briefing: { schedule: [], bands: [] },
    now: NOW,
  })
  const agenda = buildHomeAgendaNow(buildHomeTemporalAgenda({ items: [gloria], today: '2026-10-18', now: NOW }), { liveFocus: focus })
  assert.equal(agenda.tabs.find((tab) => tab.key === 'now').cards[0].focus.guideHref, gloria.href)
})
