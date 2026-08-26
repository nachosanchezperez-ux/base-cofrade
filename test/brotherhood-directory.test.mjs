import assert from 'node:assert/strict'
import test from 'node:test'

import {
  directoryContextLabel,
  directoryPath,
  gloryMonth,
} from '../lib/brotherhood-directory.js'

test('ubica una Gloria por el mes documentado en su salida principal', () => {
  const asuncion = {
    localidad: 'Cantillana',
    diaSalida: '15 de agosto',
  }

  assert.equal(gloryMonth(asuncion), 'Agosto')
  assert.equal(directoryPath(asuncion, 'gloria'), '/hermandades/gloria/cantillana/agosto')
  assert.equal(directoryContextLabel(asuncion, 'gloria'), 'Agosto')
})

test('no crea un enlace circular cuando falta el mes propio de Gloria', () => {
  const cena = {
    localidad: 'Sevilla',
    diaSalida: 'Domingo de Ramos',
  }

  assert.equal(gloryMonth(cena), '')
  assert.equal(directoryPath(cena, 'gloria'), '')
  assert.equal(directoryContextLabel(cena, 'gloria'), 'Mes principal por documentar')
})

test('las Sacramentales se organizan por localidad sin inventar un periodo', () => {
  const sacramental = {
    localidad: 'Sevilla',
  }

  assert.equal(directoryPath(sacramental, 'sacramentales'), '/hermandades/sacramentales/sevilla-capital')
  assert.equal(directoryContextLabel(sacramental, 'sacramentales'), 'Sacramental')
})
