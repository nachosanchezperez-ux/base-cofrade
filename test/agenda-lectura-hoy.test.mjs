import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { agendaDisplayTitle, agendaRowStatus } from '../lib/agenda-event-presentation.js'
import { organizerIncludesPlace } from '../lib/agenda-event-relations.js'
import { getProcessionLiveState, lastScheduleStepTime, withProcessionLiveState } from '../lib/procession-live-status.js'
import { buildHomeTemporalAgenda } from '../lib/home-temporal-agenda.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
// 1/11/2026, 09:50 en Madrid (UTC+1).
const now = new Date('2026-11-01T08:50:00Z')

const viaCrucis = {
  key: 'outing:vc', id: 'vc', category: 'processions', date: '2026-11-01', startTime: '07:00', endTime: '',
  isUpcoming: true, title: 'Vía Crucis',
  schedule: [
    { label: 'Salida · Vía Crucis extraordinario', time: '07:00' },
    { label: 'Eucaristía en el Cementerio', time: '09:00' },
    { label: 'Regreso', time: '10:30' },
  ],
}

test('el título de lectura quita el año, el municipio y el templo repetidos', () => {
  assert.equal(agendaDisplayTitle({ title: 'Salida procesional de María Santísima del Rosario · Santa Catalina · Sevilla · 2026', date: '2026-11-01', municipality: 'Sevilla', place: 'Iglesia de Santa Catalina' }), 'Salida procesional de María Santísima del Rosario')
  assert.equal(agendaDisplayTitle({ title: 'Rosario de la Aurora de Monte-Sión · 2026', date: '2026-11-01' }), 'Rosario de la Aurora de Monte-Sión')
  // Lo que no repite nada se conserva.
  assert.equal(agendaDisplayTitle({ title: 'Santísimo Cristo del Descendimiento · Vía Crucis extraordinario al Cementerio de San José', date: '2026-11-01', municipality: 'Pilas' }), 'Santísimo Cristo del Descendimiento · Vía Crucis extraordinario al Cementerio de San José')
  assert.equal(agendaDisplayTitle({ title: 'Coronación · 2025', date: '2026-11-01' }), 'Coronación · 2025')
  assert.equal(agendaDisplayTitle({ title: '2026', date: '2026-11-01' }), '2026')
})

test('una salida sin entrada sigue en la calle mientras le quede un tramo publicado', () => {
  assert.equal(lastScheduleStepTime(viaCrucis), '10:30')
  assert.equal(withProcessionLiveState(viaCrucis, now).liveState.isLive, true)
  // Pasado el último tramo no se inventa la entrada: «ya empezó», no «finalizada».
  const later = withProcessionLiveState(viaCrucis, new Date('2026-11-01T10:00:00Z')).liveState
  assert.equal(later.isLive, false)
  assert.equal(later.label, 'Horario incompleto')
  // Sin tramos, como hasta ahora.
  assert.equal(getProcessionLiveState({ date: '2026-11-01', startTime: '07:30' }, now).isLive, false)
})

test('la tarjeta dice si el acto está en la calle o ya empezó', () => {
  assert.deepEqual(agendaRowStatus(withProcessionLiveState(viaCrucis, now)), { kind: 'live', label: 'En la calle ahora' })
  const aurora = withProcessionLiveState({ category: 'rosaries', date: '2026-11-01', startTime: '07:30' }, now)
  assert.deepEqual(agendaRowStatus({ ...aurora, startTime: '07:30' }), { kind: 'started', label: 'Empezó a las 07:30' })
  assert.equal(agendaRowStatus({ category: 'devotions' }), null)
})

test('la portada no pierde la salida que está en la calle', () => {
  const temporal = buildHomeTemporalAgenda({ items: [viaCrucis], today: '2026-11-01', now })
  assert.equal(temporal.mode, 'live')
  assert.deepEqual(temporal.remainingTodayItems.map((item) => item.key), ['outing:vc'])
})

test('la organizadora que empieza por el lugar sustituye al lugar', () => {
  assert.equal(organizerIncludesPlace('Parroquia de Nuestra Señora de la Granada y las cuatro hermandades de La Puebla del Río', 'Parroquia de Nuestra Señora de la Granada'), true)
  assert.equal(organizerIncludesPlace('Parroquia de la Granada', 'Parroquia de la Granada'), false)
  assert.equal(organizerIncludesPlace('Hermandad de la Soledad', 'Parroquia de Santa María'), false)
})

test('Hoy en móvil: lista antes, compartir en una línea y cultos sin hora explícitos', () => {
  const list = read('components/AgendaTemporalEventList.js')
  assert.match(list, /agendaDisplayTitle\(item\)/)
  assert.match(list, /data-status=\{status\?\.kind\}/)
  assert.match(list, /className=\{styles\.periodShareIcons\} compact iconsOnly/)
  assert.match(list, /data-single=\{groups\.length === 1/)
  assert.match(list, /Hora por confirmar<\/span>/)
  const css = read('components/AgendaTemporalEventList.module.css')
  assert.match(css, /\.periodShareFull\{display:none!important\}/)
  assert.match(css, /\.dayGroup\[data-single\] \.dayHeading\{position:absolute/)
  assert.match(read('lib/home-agenda-now.js'), /title: agendaDisplayTitle\(item\)/)
})
