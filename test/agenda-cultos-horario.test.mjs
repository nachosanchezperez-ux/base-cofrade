import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { cultTimeParts } from '../lib/agenda-cult-time.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('una hora sola va en la columna, sin «h» y sin línea extra', () => {
  assert.deepEqual(cultTimeParts('12:00 h'), { lead: '12:00', detail: '' })
  assert.deepEqual(cultTimeParts('20:00'), { lead: '20:00', detail: '' })
  assert.deepEqual(cultTimeParts('9:30'), { lead: '09:30', detail: '' })
})

test('los horarios compuestos dejan la primera hora y el texto completo debajo', () => {
  assert.deepEqual(cultTimeParts('Jubileo 10:30–13:30 y 17:30–20:00 · Triduo 20:00'), {
    lead: '10:30',
    detail: 'Jubileo 10:30–13:30 y 17:30–20:00 · Triduo 20:00',
  })
  assert.deepEqual(cultTimeParts('Rosario 19:00 · Santa Misa 19:30'), { lead: '19:00', detail: 'Rosario 19:00 · Santa Misa 19:30' })
  assert.deepEqual(cultTimeParts('17:00–20:00'), { lead: '17:00', detail: '17:00–20:00' })
  assert.deepEqual(cultTimeParts('Desde las 10:00 h · sin hora de cierre confirmada'), { lead: '10:00', detail: 'Desde las 10:00 · sin hora de cierre confirmada' })
})

test('sin hora: guion en la columna', () => {
  assert.deepEqual(cultTimeParts(''), { lead: '—', detail: '' })
  assert.deepEqual(cultTimeParts('Hora por confirmar'), { lead: '—', detail: '' })
  assert.deepEqual(cultTimeParts('Por la tarde'), { lead: '—', detail: 'Por la tarde' })
})

test('la lista de cultos usa la columna corta y el horario bajo el título', () => {
  const list = read('components/AgendaTemporalEventList.js')
  assert.match(list, /<time>\{time\.lead\}<\/time>/)
  assert.match(list, /time\.detail \? <span className=\{styles\.cultSchedule\}>/)
  assert.match(read('components/AgendaTemporalEventList.module.css'), /\.cults time\{[^}]*white-space:nowrap/)
})
