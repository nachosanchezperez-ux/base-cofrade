import test from 'node:test'
import assert from 'node:assert/strict'
import { agendaEventAnchor, schedulePrecision, agendaDirectionsHref, scheduleTimeHint } from '../lib/agenda-event-presentation.js'
import { homeAgendaTimeParts } from '../lib/home-agenda-now.js'

test('un acto se comparte con un fragmento estable de agenda sin generar una página', () => {
  assert.equal(agendaEventAnchor({ key: 'rosaries:2575623e' }), 'acto-rosaries-2575623e')
})

test('no convierte horas publicadas en exactas ni inventa precisión', () => {
  const schedule = [{ label: 'Salida', notes: 'Hora aproximada publicada' }, { label: 'Entrada', notes: 'Entrada prevista' }]
  assert.equal(schedulePrecision(schedule, 'departure'), 'Aprox.')
  assert.equal(schedulePrecision(schedule, 'arrival'), 'Prevista')
  assert.equal(schedulePrecision([], 'departure'), '')
})

test('cómo llegar necesita lugar y municipio y conserva los caracteres del nombre', () => {
  assert.equal(agendaDirectionsHref('', 'Dos Hermanas'), '')
  const href = new URL(agendaDirectionsHref('Parroquia del Rocío', 'Dos Hermanas'))
  assert.equal(href.searchParams.get('query'), 'Parroquia del Rocío, Dos Hermanas, Sevilla, España')
})

test('sin hora exacta, la tarjeta muestra la franja publicada y nunca una inventada', () => {
  const sanlucar = [{ label: 'Traslado a San Pedro', time: '', timeText: 'Por la tarde' }]
  assert.equal(scheduleTimeHint(sanlucar), 'Por la tarde')
  const olivares = [{ label: 'Santa Misa', time: '10:00', timeText: '10:00 h' }, { label: 'Inicio de la procesión de regreso', time: '', timeText: 'Tras la Misa de 10:00' }]
  assert.equal(scheduleTimeHint(olivares), 'Tras la Misa de 10:00')
  assert.equal(scheduleTimeHint([{ label: 'Salida', time: '18:30', timeText: '' }]), '18:30')
  assert.equal(scheduleTimeHint([{ label: 'Entrada', time: '', timeText: 'Sobre las 13:00 h' }], 'arrival'), 'Sobre las 13:00 h')
  assert.equal(scheduleTimeHint([{ label: 'Entrada', time: '', timeText: 'Sobre las 13:00 h' }]), '')
  assert.equal(scheduleTimeHint([{ label: 'Traslado', time: '', timeText: 'Horario pendiente de publicación' }]), '')
  assert.equal(scheduleTimeHint([]), '')
  assert.deepEqual(homeAgendaTimeParts({ schedule: sanlucar }), { main: '', detail: 'Por la tarde' })
  assert.deepEqual(homeAgendaTimeParts({ startTime: '17:00', schedule: sanlucar }), { main: '17:00', detail: '' })
})
