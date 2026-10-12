import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getHomeEditorialFocus,
  getHomeEditorialFocuses,
  homeEditorialFocusesFromRows,
} from '../lib/home-editorial-focus.js'

// Filas tal como llegan de public.outings (gestionadas desde el Panel).
const reglaRow = {
  id: 'f56e21cf-098f-4fc8-a956-bec1b6ec1ac9',
  home_featured_starts_on: '2026-10-02',
  home_featured_ends_on: '2026-10-04',
  home_featured_priority: 100,
}
const regla = { id: reglaRow.id, title: 'María Santísima de Regla Coronada' }
const reglaFocuses = homeEditorialFocusesFromRows([reglaRow])

test('las filas del Panel se convierten en focos con su ventana y prioridad', () => {
  assert.deepEqual(reglaFocuses, [{
    id: `outing:${reglaRow.id}`,
    outingId: reglaRow.id,
    startsOn: '2026-10-02',
    endsOn: '2026-10-04',
    priority: 100,
  }])
})

test('se descartan filas sin ventana completa o con fin anterior al inicio', () => {
  assert.deepEqual(homeEditorialFocusesFromRows([
    { id: 'a', home_featured_starts_on: '2026-10-02', home_featured_ends_on: null },
    { id: 'b', home_featured_starts_on: '2026-10-05', home_featured_ends_on: '2026-10-04' },
    { id: '', home_featured_starts_on: '2026-10-02', home_featured_ends_on: '2026-10-04' },
  ]), [])
  assert.deepEqual(homeEditorialFocusesFromRows(null), [])
})

test('el foco está activo dentro de su ventana, ambos extremos incluidos', () => {
  for (const day of ['2026-10-02', '2026-10-03', '2026-10-04']) {
    assert.equal(getHomeEditorialFocus([regla], day, reglaFocuses)?.outing?.id, regla.id)
  }
})

test('el foco caduca automáticamente fuera de su ventana', () => {
  assert.equal(getHomeEditorialFocus([regla], '2026-10-05', reglaFocuses), null)
  assert.equal(getHomeEditorialFocus([regla], '2026-10-01', reglaFocuses), null)
})

test('sin configuración o sin fecha no hay destacado', () => {
  assert.equal(getHomeEditorialFocus([regla], '2026-10-03'), null)
  assert.equal(getHomeEditorialFocus([regla], '', reglaFocuses), null)
})

test('no se fabrica un foco si la salida ya no forma parte de la agenda pública', () => {
  assert.equal(getHomeEditorialFocus([], '2026-10-03', reglaFocuses), null)
})

const sundayRows = [
  { id: '38e2190f-b777-4f80-bcf4-1b81f7a73a8b', home_featured_starts_on: '2026-10-11', home_featured_ends_on: '2026-10-12', home_featured_priority: 100 },
  { id: 'e96dbd17-b00f-4f66-9c01-8e75b5b95c57', home_featured_starts_on: '2026-10-11', home_featured_ends_on: '2026-10-12', home_featured_priority: 90 },
]
const sundayFocuses = homeEditorialFocusesFromRows(sundayRows)
const sunday = [
  { id: sundayRows[0].id, liveState: { state: 'upcoming' } },
  { id: sundayRows[1].id, liveState: { state: 'live' } },
]

test('dos destacados conviven, ordenados por prioridad, aunque uno esté en la calle', () => {
  assert.deepEqual(getHomeEditorialFocuses(sunday, '2026-10-11', sundayFocuses).map((x) => x.outing.id), sunday.map((x) => x.id))
  const reversed = homeEditorialFocusesFromRows(sundayRows.map((row, index) => ({ ...row, home_featured_priority: index ? 100 : 10 })))
  assert.deepEqual(getHomeEditorialFocuses(sunday, '2026-10-11', reversed).map((x) => x.outing.id), [sunday[1].id, sunday[0].id])
})

test('el destacado se conserva hasta la entrada, sin resucitar salidas terminadas', () => {
  const remaining = [sunday[0], { ...sunday[1], liveState: { state: 'done' } }]
  assert.deepEqual(getHomeEditorialFocuses(remaining, '2026-10-12', sundayFocuses).map((x) => x.outing.id), [sunday[0].id])
  assert.deepEqual(getHomeEditorialFocuses(sunday, '2026-10-13', sundayFocuses), [])
  assert.deepEqual(getHomeEditorialFocuses(sunday, '2026-10-10', sundayFocuses), [])
})

test('una salida no se destaca dos veces aunque tenga focos repetidos', () => {
  const duplicated = [...reglaFocuses, ...reglaFocuses]
  assert.equal(getHomeEditorialFocuses([regla], '2026-10-03', duplicated).length, 1)
})
