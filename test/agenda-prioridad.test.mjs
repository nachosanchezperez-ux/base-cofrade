import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { agendaPriorityTier, isSecondaryCult } from '../lib/agenda-priority.js'
import { buildAgendaTemporalLanding } from '../lib/agenda-temporal-landing.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('besamanos, certámenes y salidas van antes que el resto de cultos', () => {
  assert.equal(agendaPriorityTier({ category: 'processions' }), 0)
  assert.equal(agendaPriorityTier({ category: 'concerts', categoryLabel: 'Certamen' }), 0)
  assert.equal(agendaPriorityTier({ category: 'rosaries' }), 0)
  assert.equal(agendaPriorityTier({ category: 'devotions', categoryLabel: 'Besamanos' }), 0)
  assert.equal(agendaPriorityTier({ category: 'devotions', categoryLabel: 'Besapiés' }), 0)
  assert.equal(agendaPriorityTier({ category: 'devotions', categoryLabel: 'Veneración' }), 0)
  assert.equal(agendaPriorityTier({ category: 'devotions', categoryLabel: 'Triduo' }), 1)
  assert.equal(isSecondaryCult({ category: 'devotions', categoryLabel: 'Función Principal' }), true)
})

test('dentro de cada día manda la prioridad y luego la hora; los días no se mezclan', () => {
  const base = { isUpcoming: true, municipality: 'Sevilla', scope: 'capital' }
  const items = [
    { ...base, key: 'a', id: 'a', category: 'devotions', categoryLabel: 'Triduo', title: 'Triduo', date: '2026-10-24', startTime: '10:00' },
    { ...base, key: 'b', id: 'b', category: 'processions', categoryLabel: 'Procesión', title: 'Procesión', date: '2026-10-24', startTime: '19:00' },
    { ...base, key: 'c', id: 'c', category: 'devotions', categoryLabel: 'Besamanos', title: 'Besamanos', date: '2026-10-24', startTime: '11:00' },
    { ...base, key: 'd', id: 'd', category: 'devotions', categoryLabel: 'Novena', title: 'Novena', date: '2026-10-25', startTime: '09:00' },
    { ...base, key: 'e', id: 'e', category: 'concerts', categoryLabel: 'Certamen', title: 'Certamen', date: '2026-10-25', startTime: '18:00' },
  ]
  const landing = buildAgendaTemporalLanding({ period: 'weekend', items, today: '2026-10-24', now: new Date('2026-10-24T06:00:00Z') })
  assert.deepEqual(landing.items.map((item) => item.title), ['Besamanos', 'Procesión', 'Triduo', 'Certamen', 'Novena'])
})

test('una coronación canónica va la primera de su día, por delante de besamanos y salidas', () => {
  const base = { isUpcoming: true, municipality: 'Sevilla', scope: 'capital', date: '2026-11-08' }
  const items = [
    { ...base, key: 'r', id: 'r', category: 'rosaries', categoryLabel: 'Rosario de la Aurora', title: 'Rosario de la Aurora', startTime: '07:30' },
    { ...base, key: 'p', id: 'p', category: 'processions', categoryLabel: 'Procesión de Gloria', title: 'Salida procesional', startTime: '18:00' },
    { ...base, key: 'b', id: 'b', category: 'devotions', categoryLabel: 'Besamanos', title: 'Besamanos a Nuestra Señora del Amparo', startTime: '' },
    { ...base, key: 'c', id: 'c', category: 'devotions', categoryLabel: 'Función Principal de Instituto', title: 'Función Principal de Instituto y Coronación Canónica de Nuestra Señora del Amparo', startTime: '', timeText: '10:00' },
    { ...base, key: 'f', id: 'f', category: 'devotions', categoryLabel: 'Función', title: 'Función de Nuestra Señora del Patrocinio', startTime: '' },
  ]
  assert.equal(agendaPriorityTier(items[3]), -1)
  assert.equal(isSecondaryCult(items[3]), false)
  const landing = buildAgendaTemporalLanding({ period: 'today', items, today: '2026-11-08', now: new Date('2026-11-08T06:30:00Z') })
  assert.equal(landing.items[0].key, 'c')
  assert.deepEqual(landing.items.map((item) => item.key), ['c', 'r', 'p', 'b', 'f'])
})

test('las listas muestran los cultos del día aparte y la Agenda completa ordena igual', () => {
  const list = read('components/AgendaTemporalEventList.js')
  assert.match(list, /group\.items\.filter\(\(item\) => !isSecondaryCult\(item\)\)/)
  assert.match(list, /<DayCults items=\{group\.items\.filter\(isSecondaryCult\)\} \/>/)
  assert.match(read('components/AgendaCofradeDirectoryV4.js'), /\|\$\{agendaPriorityTier\(first\)\}\|/)
})

test('la portada pone la coronación la primera en Hoy y en Lo que queda de hoy', async () => {
  const { buildHomeTemporalAgenda } = await import('../lib/home-temporal-agenda.js')
  const base = { isUpcoming: true, municipality: 'Sevilla', scope: 'capital', date: '2026-11-08' }
  const items = [
    { ...base, key: 'r', id: 'r', category: 'rosaries', title: 'Rosario de la Aurora', startTime: '07:30', endTime: '13:00' },
    { ...base, key: 'p', id: 'p', category: 'processions', title: 'Salida procesional', startTime: '18:00', endTime: '22:30' },
    { ...base, key: 'b', id: 'b', category: 'devotions', categoryLabel: 'Besamanos', title: 'Besamanos a Nuestra Señora del Amparo', startTime: '' },
    { ...base, key: 'c', id: 'c', category: 'devotions', categoryLabel: 'Función Principal de Instituto', title: 'Función Principal de Instituto y Coronación Canónica de Nuestra Señora del Amparo', startTime: '', timeText: '10:00' },
  ]
  const home = buildHomeTemporalAgenda({ items, today: '2026-11-08', now: new Date('2026-11-08T06:30:00Z') })
  assert.equal(home.todayItems[0].key, 'c')
  assert.equal(home.remainingTodayItems[0].key, 'c')
})
