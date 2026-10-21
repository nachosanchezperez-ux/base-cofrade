import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { agendaScheduleSteps, madridMinutes, nextScheduleStep } from '../lib/agenda-schedule-steps.js'

const item = {
  date: '2026-10-24',
  schedule: [
    { label: 'Salida', time: '18:00' },
    { label: 'Carrera oficial', timeText: 'Sobre las 19.30' },
    { label: 'Misa', timeText: 'Al terminar' },
    { label: 'Salida', time: '18:05' },
    { label: 'Entrada', time: '00:30', date: '2026-10-25' },
    { label: 'Entrada', time: '23:15' },
  ],
}

test('los tramos salen con hora, en orden, sin repetir ni mezclar el día siguiente', () => {
  assert.deepEqual(agendaScheduleSteps(item), [
    { label: 'Salida', time: '18:00' },
    { label: 'Carrera oficial', time: '19:30' },
    { label: 'Entrada', time: '23:15' },
  ])
  assert.deepEqual(agendaScheduleSteps({}), [])
})

test('el próximo tramo depende de la hora de Madrid', () => {
  assert.deepEqual(nextScheduleStep(item, 19 * 60), { label: 'Carrera oficial', time: '19:30' })
  assert.equal(nextScheduleStep(item, 23 * 60 + 30), null)
  // 20/10/2026 22:00 UTC = 00:00 en Madrid (+02:00).
  assert.equal(madridMinutes(new Date('2026-10-20T22:00:00Z')), 0)
})

test('Hoy muestra «Ahora en la calle» y cada cita sus tramos', () => {
  const list = readFileSync(new URL('../components/AgendaTemporalEventList.js', import.meta.url), 'utf8')
  assert.match(list, /landing\.period === 'today' \? <LiveNow items=\{landing\.items\} \/> : null/)
  assert.match(list, /agendaScheduleSteps\(item\)\.length > 1/)
  const css = readFileSync(new URL('../components/AgendaTemporalEventList.module.css', import.meta.url), 'utf8')
  assert.match(css, /prefers-reduced-motion:reduce\)\{\.livePulse\{animation:none\}/)
})
