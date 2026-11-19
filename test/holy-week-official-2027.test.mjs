import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { campanaTime, madridOffset, outingYear, pickProgrammeOuting } from '../lib/holy-week-programme.js'
import { programmeEventDates, programmeEventDescription } from '../lib/holy-week-programme-jsonld.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la salida oficial de 2027 manda sobre la referencia de 2026', () => {
  const outings = [
    { id: 'a', brotherhood_entity_id: 'res', outing_date: '2027-03-28', departure_time: '08:30:00' },
    { id: 'b', brotherhood_entity_id: 'res', outing_date: '2026-04-05', departure_time: '08:15:00' },
    { id: 'c', brotherhood_entity_id: 'otra', outing_date: '2026-04-05' },
  ]
  assert.equal(pickProgrammeOuting(outings, 'res').id, 'a')
  assert.equal(pickProgrammeOuting(outings, 'otra').id, 'c')
  assert.equal(pickProgrammeOuting(outings, 'nadie'), null)
  assert.equal(outingYear(outings[0]), 2027)
})

test('la venia en la Campana sale de los hitos de horario', () => {
  assert.equal(campanaTime([{ label: 'Salida', item_time: '08:30:00' }, { label: 'Venia en la Campana', item_time: '10:55:00' }]), '10:55')
  assert.equal(campanaTime([{ label: 'Salida', item_time: '08:30:00' }]), '')
})

test('Event con hora de Madrid solo cuando el horario es oficial', () => {
  assert.equal(madridOffset('2027-03-28', '10:55'), '+02:00')
  assert.equal(madridOffset('2027-03-21', '10:55'), '+01:00')
  const day = { date: '2027-03-28', name: 'Domingo de Resurrección', status: 'approved' }
  const official = { timesSource: 'oficial', departure: '08:30', arrival: '16:30', campana: '10:55', name: 'La Resurrección' }
  assert.deepEqual(programmeEventDates(day, official), { startDate: '2027-03-28T08:30:00+02:00', endDate: '2027-03-28T16:30:00+02:00' })
  assert.match(programmeEventDescription(day, official), /Horario oficial de 2027: salida a las 08:30, venia en la Campana a las 10:55 y entrada a las 16:30\./)
  assert.doesNotMatch(programmeEventDescription(day, official), /pendiente/)
  assert.deepEqual(programmeEventDates(day, { timesSource: 'hilo', departure: '08:15' }), { startDate: '2027-03-28' })
})

test('el programa etiqueta lo oficial y la Campana', () => {
  const component = read('components/HolyWeekProgramme.js')
  assert.match(component, /Oficial \$\{item\.year\}/)
  assert.match(component, /Campana <strong>\{item\.campana\}<\/strong>/)
  const loader = read('lib/supabase/holy-week-programme.js')
  assert.match(loader, /pickProgrammeOuting\(outings, entity\.id\)/)
  assert.match(loader, /programme-v2-oficial/)
})
