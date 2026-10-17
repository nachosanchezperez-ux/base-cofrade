import test from 'node:test'
import assert from 'node:assert/strict'
import { agendaSortTime, isAgendaItemOver, temporalUrgencyLabel } from '../lib/agenda-clock.js'

// 17/10/2026 22:00 en Madrid (UTC+2).
const night = new Date('2026-10-17T20:00:00Z')

test('un besamanos de 09:00 a 21:00 ya terminó a las 22:00', () => {
  assert.equal(isAgendaItemOver({ date: '2026-10-17', timeText: '09:00–21:00' }, night), true)
  assert.equal(isAgendaItemOver({ date: '2026-10-17', startTime: '21:00' }, night), false)
  assert.equal(isAgendaItemOver({ date: '2026-10-17', startTime: '19:00', endTime: '01:30' }, night), false)
  assert.equal(isAgendaItemOver({ date: '2026-10-17', endDate: '2026-10-18', timeText: '09:00–21:00' }, night), false)
  assert.equal(isAgendaItemOver({ date: '2026-10-17' }, night), false)
  assert.equal(isAgendaItemOver({ date: '2026-10-16' }, night), true)
  assert.equal(isAgendaItemOver({ date: '2026-10-17', daySchedules: [{ celebrationDate: '2026-10-17', timeText: '10:00–13:00' }] }, night), true)
})

test('la cuenta atrás es la misma en toda la web', () => {
  assert.equal(temporalUrgencyLabel('2026-10-17', '2026-10-17'), 'HOY')
  assert.equal(temporalUrgencyLabel('2026-10-18', '2026-10-17'), 'MAÑANA')
  assert.equal(temporalUrgencyLabel('2026-10-23', '2026-10-17'), 'ESTE VIERNES')
  assert.equal(temporalUrgencyLabel('2026-10-24', '2026-10-17'), 'EN 7 DÍAS')
  assert.equal(temporalUrgencyLabel('2026-11-28', '2026-10-17'), 'EN NOVIEMBRE')
  assert.equal(temporalUrgencyLabel('2027-05-09', '2026-10-17'), 'EN MAYO DE 2027')
  assert.equal(temporalUrgencyLabel('2026-10-16', '2026-10-17'), '')
})

test('el orden por hora usa la franja publicada', () => {
  assert.equal(agendaSortTime({ date: '2026-10-18', timeText: 'Tras la Misa de 10:00' }), '10:00')
  assert.equal(agendaSortTime({ date: '2026-10-18', timeText: '12:30' }), '12:30')
  assert.equal(agendaSortTime({ date: '2026-10-18', startTime: '18:30' }), '18:30')
  assert.equal(agendaSortTime({ date: '2026-10-18', schedule: [{ label: 'Inicio', time: '', timeText: 'Tras la Misa de 10:00' }] }), '10:00')
  assert.equal(agendaSortTime({ date: '2026-10-18' }), '23:59')
})

test('Hoy y Fin de semana: sin actos terminados, por hora real y un acto de dos días en ambos días', async () => {
  const { buildAgendaTemporalLanding } = await import('../lib/agenda-temporal-landing.js')
  const base = { isUpcoming: true, municipality: 'Sevilla', scope: 'capital', category: 'devotions' }
  const items = [
    { ...base, key: 'devotions:valme', date: '2026-10-17', timeText: '09:00–21:00', title: 'Besamanos Valme' },
    { ...base, key: 'devotions:alcala', date: '2026-10-17', endDate: '2026-10-18', title: 'Besamanos Alcalá',
      daySchedules: [{ celebrationDate: '2026-10-17', timeText: '10:00–13:00' }, { celebrationDate: '2026-10-18', timeText: '10:00–13:00' }] },
    { ...base, key: 'processions:tarde', category: 'processions', date: '2026-10-18', startTime: '18:30', title: 'Procesión' },
    { ...base, key: 'processions:misa', category: 'processions', date: '2026-10-18', timeText: 'Tras la Misa de 10:00', title: 'Regreso' },
  ]
  const today = buildAgendaTemporalLanding({ period: 'today', items, today: '2026-10-17', now: night })
  assert.deepEqual(today.items.map((item) => item.key), [])
  const weekend = buildAgendaTemporalLanding({ period: 'weekend', items, today: '2026-10-17', now: night })
  assert.deepEqual(weekend.items.map((item) => item.displayKey), ['devotions:alcala@2026-10-18', 'processions:misa@2026-10-18', 'processions:tarde@2026-10-18'])
  assert.match(weekend.summary, /hay 3 actos/)
})
