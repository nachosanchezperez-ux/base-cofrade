import test from 'node:test'
import assert from 'node:assert/strict'
import { buildHomeLatestThreads, latestFromUpdate, latestThreadsByDay, listNames } from '../lib/home-latest-threads.js'

const now = new Date('2026-10-24T10:00:00Z')
const update = (id, kind, title, metric, dateTime, extra = {}) => ({ id, activityKind: kind, title, metric, href: `/hermandades/${id}`, dateTime, summary: 'x', rootEntityId: `root-${id}`, ...extra })

test('cada novedad dice qué ha pasado, sin etiquetas internas', () => {
  const line = latestFromUpdate(update('milagrosa', 'musical_heritage', 'La Milagrosa', '22 marchas documentadas', '2026-10-24T08:00:00Z', { activityStatus: 'AMPLIADO', label: 'Hermandad → patrimonio musical' }))
  assert.equal(line.tag, 'Patrimonio musical')
  assert.equal(line.title, 'La Milagrosa')
  assert.equal(line.detail, '22 marchas documentadas')
  assert.ok(!JSON.stringify(line).includes('AMPLIADO'))
})

test('cambio musical: manda la Hermandad y quién entra', () => {
  const line = latestFromUpdate({ id: 'mc', activityKind: 'music_change', title: 'Cambio musical en Sevilla', metric: 'La Sed · Miércoles Santo 2027', summary: 'Las Cigarreras sustituye a Tres Caídas. Paso de Cristo.', href: '/semana-santa/2027/cambios-musicales#cambio-1', dateTime: '2026-10-24T08:00:00Z' })
  assert.equal(line.title, 'La Sed')
  assert.equal(line.detail, 'Las Cigarreras sustituye a Tres Caídas')
})

test('las fichas nuevas entran, con su titular, y tapan las novedades de sí mismas', () => {
  const items = buildHomeLatestThreads({
    now,
    updates: [update('rosario', 'titularity', 'Rosario de Écija', '1 titular relacionado', '2026-10-23T06:09:00Z', { rootEntityId: 'b-rosario' })],
    newEntities: [{ id: 'new:brotherhood:b-rosario', entityType: 'brotherhood', rootEntityId: 'b-rosario', title: 'Rosario de Écija', href: '/hermandades/rosario-ecija', dateTime: '2026-10-23T06:09:00Z', titulares: ['Nuestra Señora del Rosario'] }],
  })
  assert.equal(items.length, 1)
  assert.equal(items[0].tag, 'Nueva hermandad')
  assert.equal(items[0].detail, 'Con su titular, Nuestra Señora del Rosario')
  assert.equal(items[0].isNew, true)
  assert.equal(items[0].dateLabel, 'Ayer')
})

test('tres o más del mismo tipo el mismo día van en una línea con un enlace a cada ficha', () => {
  const items = buildHomeLatestThreads({
    now,
    updates: ['sanbenito', 'cena', 'sed', 'sol'].map((id, i) => update(id, 'step_personnel', id, '2 pasos · 2 capataces', `2026-10-23T0${9 - i}:00:00Z`)),
  })
  assert.equal(items.length, 1)
  assert.equal(items[0].grouped, true)
  assert.equal(items[0].tag, 'Capataces al día')
  assert.equal(items[0].links.length, 4)
  assert.equal(items[0].detail, '4 fichas actualizadas')
})

test('como mucho cinco líneas, de la más reciente a la más antigua, agrupadas por día', () => {
  const updates = ['a', 'b', 'c', 'd', 'e', 'f'].map((id, i) => update(id, ['posters', 'discography', 'titularity', 'step_phases', 'musical_heritage', 'posters'][i], id.toUpperCase(), 'dato', `2026-10-2${i < 3 ? 4 : 3}T0${8 - i}:00:00Z`))
  const items = buildHomeLatestThreads({ updates, now })
  assert.equal(items.length, 5)
  assert.deepEqual(items.map((item) => item.title), ['A', 'B', 'C', 'D', 'E'])
  assert.deepEqual(latestThreadsByDay(items).map((day) => [day.label, day.items.length]), [['Hoy', 3], ['Ayer', 2]])
})

test('una novedad futura o sin enlace no se pinta', () => {
  assert.equal(buildHomeLatestThreads({ now, updates: [update('x', 'posters', 'X', 'd', '2026-10-25T08:00:00Z')] }).length, 0)
  assert.equal(latestFromUpdate({ id: 'y', title: 'Y', href: '' }), null)
})

test('listas de nombres en español', () => {
  assert.equal(listNames(['A']), 'A')
  assert.equal(listNames(['A', 'B']), 'A y B')
  assert.equal(listNames(['A', 'B', 'C', 'D']), 'A, B, C y 1 más')
})
