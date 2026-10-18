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
