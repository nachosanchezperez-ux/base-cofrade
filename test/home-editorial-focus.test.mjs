import test from 'node:test'
import assert from 'node:assert/strict'

import {
  HOME_EDITORIAL_FOCUSES,
  getHomeEditorialFocus,
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
