import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { dayRange, parseQuickAct, quickActTitle, quickCultPayloads, quickOutingPayload, QUICK_ACT_TYPES } from '../lib/panel/quick-act-core.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const form = (values) => (name) => values[name] ?? ''
const B = '11111111-1111-4111-8111-111111111111'
const M = '22222222-2222-4222-8222-222222222222'

test('valida lo imprescindible y explica qué falta', () => {
  const { errors } = parseQuickAct(form({}))
  assert.deepEqual(errors, ['Elige el tipo de acto.', 'Elige la Hermandad.', 'Indica la fecha.'])
  assert.match(parseQuickAct(form({ act_type: 'triduo', brotherhood_id: B, start_date: '2026-10-24', end_date: '2026-10-20' })).errors[0], /anterior/)
  assert.match(parseQuickAct(form({ act_type: 'triduo', brotherhood_id: B, start_date: '2026-10-01', end_date: '2026-10-30' })).errors[0], /15 días/)
  assert.match(parseQuickAct(form({ act_type: 'triduo', brotherhood_id: B, start_date: '2026-10-24', start_time: '25:00' })).errors[0], /20:30/)
})

test('una salida va a outings con el tipo y el carácter que lee la Agenda', () => {
  const { act } = parseQuickAct(form({ act_type: 'rosario-aurora', brotherhood_id: B, start_date: '2026-10-24', start_time: '07:30', municipality_id: M, place_text: 'Capilla', publish: 'on' }))
  const payload = quickOutingPayload(act, { brotherhoodName: 'Hermandad de Pino Montano', slug: 'rosario-2026' })
  assert.equal(payload.outing_type, 'Rosario de la Aurora')
  assert.equal(payload.character, 'ordinary')
  assert.equal(payload.title, 'Rosario de la Aurora · Hermandad de Pino Montano')
  assert.equal(payload.departure_time, '07:30')
  assert.equal(payload.origin_text, 'Capilla')
  assert.equal(payload.status, 'published')
  const extra = quickOutingPayload(parseQuickAct(form({ act_type: 'traslado-extraordinario', brotherhood_id: B, start_date: '2026-10-24' })).act)
  assert.equal(extra.character, 'extraordinary')
  assert.equal(extra.status, 'draft')
})

test('un culto crea su convocatoria con un día por fecha y reutiliza el culto existente', () => {
  const { act } = parseQuickAct(form({ act_type: 'triduo', brotherhood_id: B, start_date: '2026-10-22', end_date: '2026-10-24', start_time: '20:00', publish: '1' }))
  const fresh = quickCultPayloads(act, { brotherhoodName: 'Hermandad del Amor' })
  assert.equal(fresh.cult.cult_type, 'Triduo')
  assert.equal(fresh.occurrence.title_override, 'Triduo · Hermandad del Amor')
  assert.equal(fresh.occurrence.year, 2026)
  assert.deepEqual(fresh.days.map((day) => [day.day_number, day.celebration_date, day.start_time]), [[1, '2026-10-22', '20:00'], [2, '2026-10-23', '20:00'], [3, '2026-10-24', '20:00']])
  assert.equal(quickCultPayloads(act, { existingCultId: 'x' }).cult, null)
  assert.deepEqual(dayRange('2026-10-24', ''), ['2026-10-24'])
  assert.equal(quickActTitle({ title: 'Propio', type: QUICK_ACT_TYPES[0] }), 'Propio')
})

test('la acción comprueba duplicados, derechos de la imagen y deja auditoría', () => {
  const actions = read('app/panel/(protected)/agenda/nuevo/actions.js')
  assert.match(actions, /requirePanelEditor\(\)/)
  assert.match(actions, /Ya existe esa salida de la Hermandad en esa fecha/)
  assert.match(actions, /Ese culto ya tiene una convocatoria en esa fecha/)
  assert.match(actions, /const RIGHTS = new Set\(\['owned', 'authorized'\]\)/)
  assert.match(actions, /hero_image_fit: image\.fit/)
  assert.match(actions, /fit_mode: image\.fit/)
  assert.match(actions, /from\('audit_log'\)\.insert/)
  assert.match(actions, /revalidateAgendaPhotos\(\)/)
  assert.match(read('lib/panel/navigation.js'), /href: '\/panel\/agenda\/nuevo'/)
  assert.match(read('app/panel/(protected)/aportaciones/page.js'), /\/panel\/agenda\/nuevo\?aportacion=/)
})
