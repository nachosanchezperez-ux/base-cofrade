import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildHomeCrewCalls, compactCrewEvent, homeCrewUrgency } from '../lib/home-crew-calls.js'

const base = {
  brotherhoodName: 'Hermandad de la Salud',
  municipality: 'Sevilla',
  eventStatus: 'announced',
  agents: [{ name: 'Capataz Uno', roleName: 'Capataz', isPrimary: true }],
}
const event = (overrides) => compactCrewEvent({ ...base, ...overrides })

const events = [
  event({ id: 'pasada', title: 'Igualá pasada', date: '2026-10-15', startTime: '21:00', eventTypeLabel: 'Igualá', brotherhoodId: 'g', detailHref: '/igualas-y-ensayos#convocatoria-pasada' }),
  event({ id: 'muda', title: 'Mudá del paso', date: '2026-10-20', timeText: 'A continuación de la igualá', eventTypeLabel: 'Mudá', brotherhoodId: 'c', detailHref: '/igualas-y-ensayos#convocatoria-muda' }),
  event({ id: 'iguala', title: 'Igualá del paso', date: '2026-10-20', startTime: '21:00', eventTypeLabel: 'Igualá', brotherhoodId: 'c', detailHref: '/igualas-y-ensayos#convocatoria-iguala' }),
  event({ id: 'salud', title: 'Primera igualá de la Salud', date: '2026-10-17', startTime: '21:00', eventTypeLabel: 'Igualá', brotherhoodId: 's', detailHref: '/igualas-y-ensayos#convocatoria-salud' }),
  event({ id: 'anulada', title: 'Ensayo anulado', date: '2026-10-18', eventTypeLabel: 'Ensayo', brotherhoodId: 'x', eventStatus: 'cancelled' }),
  event({ id: 'prado', title: 'Igualá del Prado', date: '2026-11-12', startTime: '21:00', eventTypeLabel: 'Igualá', brotherhoodId: 'p' }),
]

test('la portada muestra las próximas igualás por orden, sin pasadas ni anuladas', () => {
  const calls = buildHomeCrewCalls(events, { today: '2026-10-16' })
  assert.deepEqual(calls.cards.map((card) => card.key), ['salud', 'iguala', 'prado'])
  assert.equal(calls.total, 3)
  assert.equal(calls.href, '/igualas-y-ensayos')
  const [first] = calls.cards
  assert.equal(first.urgency, 'Mañana')
  assert.deepEqual(first.time, { main: '21:00', detail: '' })
  assert.equal(first.dateParts.weekday, 'SÁB')
  assert.equal(first.agent, 'Capataz: Capataz Uno')
  assert.equal(first.href, '/igualas-y-ensayos#convocatoria-salud')
})

test('la igualá y su mudá «a continuación» son una sola fila', () => {
  const card = buildHomeCrewCalls(events, { today: '2026-10-16' }).cards[1]
  assert.equal(card.title, 'Igualá del paso')
  assert.equal(card.type, 'Igualá y mudá')
  assert.equal(card.urgency, 'En 4 días')
})

test('respeta el límite y oculta el bloque si no hay convocatorias', () => {
  assert.equal(buildHomeCrewCalls(events, { today: '2026-10-16', limit: 1 }).cards.length, 1)
  assert.equal(buildHomeCrewCalls(events, { today: '2026-12-01' }), null)
  assert.equal(buildHomeCrewCalls([], { today: '2026-10-16' }), null)
})

test('urgencia solo para la semana próxima', () => {
  assert.equal(homeCrewUrgency('2026-10-16', '2026-10-16'), 'Hoy')
  assert.equal(homeCrewUrgency('2026-10-23', '2026-10-16'), 'En 7 días')
  assert.equal(homeCrewUrgency('2026-10-30', '2026-10-16'), '')
})

test('la portada enlaza al calendario y no crea URLs nuevas', () => {
  const home = readFileSync(new URL('../components/HomePageV2.js', import.meta.url), 'utf8')
  assert.match(home, /<HomeCrewCalls calls=\{crewCalls\} \/>/)
  assert.ok(home.indexOf('HomeAgendaNow agenda') < home.indexOf('HomeCrewCalls calls'))
  const snapshot = readFileSync(new URL('../lib/supabase/home-snapshot.js', import.meta.url), 'utf8')
  assert.match(snapshot, /buildHomeCrewCalls\(snapshot\.crewEvents/)
  assert.equal(compactCrewEvent({ id: 'x' }).href, '/igualas-y-ensayos')
})
