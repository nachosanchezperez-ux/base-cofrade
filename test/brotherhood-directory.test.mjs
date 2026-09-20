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



test('una Hermandad mixta conserva su jornada penitencial y usa un mes propio para Gloria', () => {
  const macarena = {
    localidad: 'Sevilla',
    diaSalida: 'Madrugada',
    gloriaMes: 10,
    gloriaFecha: 'Octubre',
  }

  assert.equal(gloryMonth(macarena), 'Octubre')
  assert.equal(directoryPath(macarena, 'gloria'), '/hermandades/gloria/sevilla-capital/octubre')
  assert.equal(directoryContextLabel(macarena, 'gloria'), 'Octubre')
})

test('el mes estructurado de Gloria tiene prioridad sobre otros cultos externos de la Hermandad', () => {
  const sanJose = {
    localidad: 'Sevilla',
    diaSalida: 'Sábado de Pasión',
    gloriaMes: 5,
    gloriaFecha: 'Domingo de los cultos en honor a San José Obrero',
  }

  assert.equal(gloryMonth(sanJose), 'Mayo')
  assert.equal(directoryPath(sanJose, 'gloria'), '/hermandades/gloria/sevilla-capital/mayo')
})

test('no crea un enlace circular cuando falta el mes propio de Gloria', () => {
  const cena = {
    localidad: 'Sevilla',
    diaSalida: 'Domingo de Ramos',
  }

  assert.equal(gloryMonth(cena), '')
  assert.equal(directoryPath(cena, 'gloria'), '')
  assert.equal(directoryContextLabel(cena, 'gloria'), '')
})

test('las Sacramentales se organizan por localidad sin inventar un periodo', () => {
  const sacramental = {
    localidad: 'Sevilla',
  }

  assert.equal(directoryPath(sacramental, 'sacramentales'), '/hermandades/sacramentales/sevilla-capital')
  assert.equal(directoryContextLabel(sacramental, 'sacramentales'), 'Sacramental')
})

test('las Agrupaciones Parroquiales se organizan por localidad sin mezclar su carácter con la salida', () => {
  const grouping = {
    localidad: 'La Rinconada',
    tipos: ['Agrupación Parroquial', 'Penitencia'],
    diaSalida: 'Sábado de Pasión',
  }

  assert.equal(
    directoryPath(grouping, 'agrupaciones-parroquiales'),
    '/hermandades/agrupaciones-parroquiales/la-rinconada'
  )
  assert.equal(directoryContextLabel(grouping, 'agrupaciones-parroquiales'), 'Agrupación Parroquial')
})
