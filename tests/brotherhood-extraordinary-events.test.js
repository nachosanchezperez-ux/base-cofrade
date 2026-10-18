import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyBrotherhoodOutings } from '../lib/brotherhood-extraordinary-events.js'
import { nextBrotherhoodAppointment } from '../lib/brotherhood-reading.js'

test('ordinary processions and transfers stay in outings; extraordinary glory belongs to events', () => {
  const ordinary = {id:'a',tipo:'Procesión de Gloria',caracter:'Anual'}
  const transfer = {id:'b',tipo:'Traslado',caracter:'Ordinaria'}
  const extra = {id:'c',tipo:'Procesión de Gloria',caracter:'Extraordinaria',nombre:'Coronación',fecha:'2026-11-08',slug:'coronacion',estado:'announced'}
  const result = classifyBrotherhoodOutings([ordinary,transfer,extra])
  assert.deepEqual(result.salidas,[ordinary,transfer])
  assert.deepEqual(result.acontecimientosSalidas,[extra])
  assert.equal(result.cronologia[0].href,'/extraordinarias/coronacion')
  assert.equal(result.cronologia[0].estado,'Acontecimiento anunciado')
  assert.equal(nextBrotherhoodAppointment([], [...result.salidas,...result.acontecimientosSalidas], '2026-10-18').date,'2026-11-08')
})

test('merges an existing event without losing its text or duplicating it on repeated classification', () => {
  const outings = [{id:'c',caracter:'Extraordinaria',nombre:'Salida extraordinaria',fecha:'2000-01-01',slug:'jubileo'}]
  const chronology = [{fecha:'2000',titulo:'Salida extraordinaria',texto:'Descripción documentada'}]
  const first = classifyBrotherhoodOutings(outings,chronology)
  assert.equal(first.cronologia.length,1)
  assert.equal(first.cronologia[0].texto,chronology[0].texto)
  assert.equal(chronology[0].href,undefined)
  assert.equal(classifyBrotherhoodOutings(outings,first.cronologia).cronologia.length,1)
})

test('different events in the same year remain distinct; no URL is fabricated', () => {
  const result = classifyBrotherhoodOutings([{id:'c',caracter:'Extraordinaria',nombre:'Otra procesión',fecha:'2000-01-01'}],[{fecha:'2000',titulo:'Coronación'}])
  assert.equal(result.cronologia.length,2)
  assert.equal(result.cronologia[1].href,'')
})
