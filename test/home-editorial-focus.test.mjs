import test from 'node:test'
import assert from 'node:assert/strict'

import {
  HOME_EDITORIAL_FOCUSES,
  getHomeEditorialFocus,
  getHomeEditorialFocuses,
} from '../lib/home-editorial-focus.js'

const regla = {
  id: 'f56e21cf-098f-4fc8-a956-bec1b6ec1ac9',
  title: 'María Santísima de Regla Coronada',
}

test('Regla queda activa como foco editorial del 2 al 4 de octubre', () => {
  assert.equal(HOME_EDITORIAL_FOCUSES[0].outingId, regla.id)
  assert.equal(getHomeEditorialFocus([regla], '2026-10-02')?.outing?.id, regla.id)
  assert.equal(getHomeEditorialFocus([regla], '2026-10-03')?.outing?.id, regla.id)
  assert.equal(getHomeEditorialFocus([regla], '2026-10-04')?.outing?.id, regla.id)
})

test('el foco de Regla caduca automáticamente después de la jornada extraordinaria', () => {
  assert.equal(getHomeEditorialFocus([regla], '2026-10-05'), null)
  assert.equal(getHomeEditorialFocus([regla], '2026-10-01'), null)
})

test('no se fabrica un foco si la salida ya no forma parte de la agenda pública', () => {
  assert.equal(getHomeEditorialFocus([], '2026-10-03'), null)
})

const sunday = [
  { id: '38e2190f-b777-4f80-bcf4-1b81f7a73a8b', liveState: { state: 'upcoming' } },
  { id: 'e96dbd17-b00f-4f66-9c01-8e75b5b95c57', liveState: { state: 'live' } },
]

test('Montellano y Padre Pío conviven aunque una procesión ya esté en la calle', () => {
  assert.deepEqual(getHomeEditorialFocuses(sunday, '2026-10-11').map(x => x.outing.id), sunday.map(x => x.id))
})

test('el destacado nocturno se conserva hasta la entrada, sin resucitar salidas terminadas', () => {
  const remaining = [sunday[0], { ...sunday[1], liveState: { state: 'done' } }]
  assert.deepEqual(getHomeEditorialFocuses(remaining, '2026-10-12').map(x => x.outing.id), [sunday[0].id])
  assert.deepEqual(getHomeEditorialFocuses(sunday, '2026-10-13'), [])
  assert.deepEqual(getHomeEditorialFocuses(sunday, '2026-10-10'), [])
})
