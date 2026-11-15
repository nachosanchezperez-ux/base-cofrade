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

test('la marca del Panel pone primero cualquier acto extraordinario de su día', async () => {
  const { applyExtraordinaryMarks, normalizeExtraordinaryKind } = await import('../lib/agenda-extraordinary.js')
  assert.equal(normalizeExtraordinaryKind('anniversary'), 'anniversary')
  assert.equal(normalizeExtraordinaryKind('otra cosa'), '')
  assert.equal(agendaPriorityTier({ category: 'devotions', categoryLabel: 'Función', title: 'Función del 75 aniversario', extraordinaryKind: 'anniversary' }), -1)
  assert.equal(agendaPriorityTier({ category: 'processions', title: 'Salida', extraordinaryKind: 'nada' }), 0)

  const groups = [[{ id: 'o1' }], [], [], [], [{ id: 'c1' }, { id: 'c2' }], [{ id: 'o1' }]]
  const marked = applyExtraordinaryMarks(groups, { outings: new Map([['o1', 'extraordinary_outing']]), occurrences: new Map([['c2', 'anniversary']]) })
  assert.equal(marked[0][0].extraordinaryKind, 'extraordinary_outing')
  assert.equal(marked[4][0].extraordinaryKind, undefined)
  assert.equal(marked[4][1].extraordinaryKind, 'anniversary')
  assert.equal(marked[5][0].extraordinaryKind, undefined, 'los conciertos no comparten ids con las salidas')

  const base = { isUpcoming: true, municipality: 'Sevilla', scope: 'capital', date: '2026-11-15' }
  const items = [
    { ...base, key: 'b', id: 'b', category: 'devotions', categoryLabel: 'Besamanos', title: 'Besamanos', startTime: '10:00' },
    { ...base, key: 'p', id: 'p', category: 'processions', categoryLabel: 'Procesión', title: 'Procesión', startTime: '18:00', extraordinaryKind: 'extraordinary_outing' },
    { ...base, key: 't', id: 't', category: 'devotions', categoryLabel: 'Triduo', title: 'Triduo', startTime: '20:00' },
  ]
  const landing = buildAgendaTemporalLanding({ period: 'weekend', items, today: '2026-11-14', now: new Date('2026-11-14T06:00:00Z') })
  assert.deepEqual(landing.items.map((item) => item.key), ['p', 'b', 't'])
})

test('la ficha pone primero el acto extraordinario del día en Próximamente y en su agenda', async () => {
  const { upcomingBrotherhoodActs } = await import('../lib/brotherhood-reading.js')
  const agenda = [
    { key: 'a', date: '2026-11-15', startTime: '09:00', title: 'Misa' },
    { key: 'b', date: '2026-11-15', startTime: '18:00', title: 'Salida extraordinaria', extraordinaryKind: 'extraordinary_outing' },
    { key: 'c', date: '2026-11-14', startTime: '21:00', title: 'Vigilia' },
  ]
  assert.deepEqual(upcomingBrotherhoodActs(agenda, [], '2026-11-08', []).map((item) => item.key), ['c', 'b', 'a'])
  assert.match(read('lib/brotherhood-agenda.js'), /isExtraordinaryAct\(first\) \? 0 : 1/)
})

test('la lectura de marcas tolera la base sin migrar y el Panel guarda solo esa columna', () => {
  const reader = read('lib/supabase/agenda-extraordinary-marks.js')
  assert.match(reader, /MISSING_COLUMN = '42703'/)
  assert.match(reader, /return groups/)
  assert.match(read('lib/supabase/agenda-cofrade.js'), /withAgendaExtraordinaryMarks\(await withAgendaPhotos/)
  const action = read('app/panel/(protected)/agenda/extraordinarios/actions.js')
  assert.match(action, /requirePanelEditor\(\)/)
  assert.match(action, /update\(\{ extraordinary_kind: kind \|\| null \}\)/)
  assert.match(action, /audit_log/)
  assert.match(action, /revalidateAgendaPhotos\(\)/)
})
