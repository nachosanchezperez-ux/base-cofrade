import assert from 'node:assert/strict'
import test from 'node:test'
import { calendarSelection, calendarSections, localityAnchor, localityFromHash, visibleLocalityBrotherhoods } from '../lib/brotherhood-locality-calendar.js'
import { groupBrotherhoodsByLocality } from '../lib/brotherhood-public-index.js'

const row = (id, extra = {}) => ({ id, slug: id, nombrePopular: id, localidad: 'Sevilla', tipos: [], ...extra })
const rowsOf = (sections) => sections.flatMap((section) => section.periods.flatMap((period) => period.items))
const ids = (items) => items.map((item) => item.id).sort()

test('Semana Santa conserva el orden litúrgico y la Madrugá independiente', () => {
  const items = [row('viernes', { diaSalida: 'Viernes Santo' }), row('madrugada', { diaSalida: 'Madrugá' }), row('lunes', { diaSalida: 'Lunes Santo' }), row('domingo', { diaSalida: 'Domingo de Ramos' })]
  const result = calendarSections(items, 'semana-santa')
  assert.deepEqual(result[0].periods.map((period) => period.label), ['Domingo de Ramos', 'Lunes Santo', 'Madrugá', 'Viernes Santo'])
  assert.deepEqual(ids(rowsOf(result)), ids(items))
})

test('Glorias usa el mes estructurado, ordena enero-diciembre y conserva las no fechadas', () => {
  const items = [row('sin-fecha', { tipos: ['Gloria'] }), row('septiembre', { tipos: ['Gloria'], gloriaMes: 9 }), row('mayo', { tipos: ['Gloria'], gloriaMes: 5, diaSalida: 'Octubre' }), row('diciembre', { tipos: ['Gloria'], gloriaFecha: '8 de diciembre' })]
  const result = calendarSections(items, 'gloria')
  assert.deepEqual(result[0].periods.map((period) => period.label), ['Mayo', 'Septiembre', 'Diciembre', 'Sin fecha documentada'])
  assert.deepEqual(ids(rowsOf(result)), ids(items))
})

test('una corporación mixta conserva la misma identidad en dos calendarios y cuenta una sola vez', () => {
  const mixed = row('mixta', { tipos: ['Penitencia', 'Gloria', 'Sacramental'], diaSalida: 'Jueves Santo', gloriaMes: 10 })
  const result = calendarSections([mixed, mixed])
  assert.equal(calendarSelection([mixed, mixed]).length, 1)
  assert.deepEqual(result.map((section) => section.key), ['semana-santa', 'gloria'])
  assert.deepEqual(rowsOf(result).map((item) => item.id), ['mixta', 'mixta'])
})

test('los caracteres son filtros cruzados y no sustituyen el calendario', () => {
  const items = [row('sacramental', { tipos: ['Penitencia', 'Sacramental'], diaSalida: 'Martes Santo' }), row('agrupacion', { tipos: ['Agrupación Parroquial'], diaSalida: 'Sábado de Pasión' }), row('gloria', { tipos: ['Gloria', 'Sacramental'], gloriaMes: 6 })]
  assert.deepEqual(ids(rowsOf(calendarSections(items, 'semana-santa', 'sacramentales'))), ['sacramental'])
  assert.deepEqual(ids(rowsOf(calendarSections(items, 'semana-santa', 'agrupaciones-parroquiales'))), ['agrupacion'])
  assert.deepEqual(ids(rowsOf(calendarSections(items, 'gloria', 'sacramentales'))), ['gloria'])
  assert.deepEqual(calendarSections(items, 'gloria', 'agrupaciones-parroquiales'), [])
})

test('sin calendario no desaparecen Sacramentales ni Agrupaciones ni perfiles sin clasificación', () => {
  const items = [row('sacramental', { tipos: ['Sacramental'] }), row('agrupacion', { tipos: ['Agrupación Parroquial'] }), row('sin-tipo'), row('penitencia', { tipos: ['Penitencia'] })]
  const result = calendarSections(items)
  assert.deepEqual(ids(rowsOf(result)), ids(items))
  assert.equal(result[0].periods[0].label, 'Sin fecha documentada')
  assert.equal(result[1].key, 'otras')
})

test('dentro de una jornada se ordena por nombre y no se mutan las filas', () => {
  const items = [row('z', { nombrePopular: 'Zeta', diaSalida: 'Lunes Santo' }), row('a', { nombrePopular: 'Ánimas', diaSalida: 'Lunes Santo' })]
  const before = structuredClone(items)
  assert.deepEqual(rowsOf(calendarSections(items)).map((item) => item.id), ['a', 'z'])
  assert.deepEqual(items, before)
})

test('el índice inicial conserva su frontera; nombre, templo y municipio encuentran todas las públicas', () => {
  const items = [row('indexada'), row('publica', { nombrePopular: 'Ánimas', sede: 'Espíritu Santo', localidad: 'Carmona' })]
  assert.deepEqual(ids(visibleLocalityBrotherhoods(items, ['indexada'])), ['indexada'])
  assert.deepEqual(ids(visibleLocalityBrotherhoods(items, ['indexada'], { query: 'animas' })), ['publica'])
  assert.deepEqual(ids(visibleLocalityBrotherhoods(items, ['indexada'], { query: 'espiritu' })), ['publica'])
  assert.deepEqual(ids(visibleLocalityBrotherhoods(items, ['indexada'], { municipality: 'carmona' })), ['publica'])
  assert.deepEqual(visibleLocalityBrotherhoods(items, ['indexada'], { territory: 'provincia' }), [])
})

test('vacíos y filtros combinados no fabrican localidades ni meses', () => {
  assert.deepEqual(calendarSections([]), [])
  const items = [row('sevilla', { tipos: ['Gloria'], gloriaMes: 13 }), row('provincia', { localidad: 'Carmona', tipos: ['Gloria'] })]
  assert.equal(calendarSections(items, 'gloria')[0].periods.length, 1)
  assert.equal(calendarSections(items, 'gloria')[0].periods[0].label, 'Sin fecha documentada')
  assert.deepEqual(visibleLocalityBrotherhoods(items, ['sevilla', 'provincia'], { query: 'sevilla', territory: 'provincia' }), [])
})

test('localidades capital primero y resto A-Z; anclas limpias y compatibilidad con las antiguas', () => {
  const groups = groupBrotherhoodsByLocality([row('z', { localidad: 'Utrera' }), row('d', { localidad: 'Dos Hermanas' }), row('s'), row('a', { localidad: 'Alcalá de Guadaíra' })])
  assert.deepEqual(groups.map((group) => group.locality), ['Sevilla', 'Alcalá de Guadaíra', 'Dos Hermanas', 'Utrera'])
  assert.equal(localityAnchor(groups[2]), 'hermandades-dos-hermanas')
  assert.equal(localityFromHash(groups, '#hermandades-dos%20hermanas')?.key, 'dos hermanas')
  assert.equal(localityFromHash(groups, '#hermandades-dos-hermanas-titulo')?.key, 'dos hermanas')
  assert.equal(localityFromHash(groups, '#%invalid'), null)
  assert.equal(localityFromHash(groups, '#hermandades-inexistente'), null)
})
