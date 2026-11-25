import test from 'node:test'
import assert from 'node:assert/strict'
import { programmeMusicPeriods } from '../lib/holy-week-programme.js'

const p = (band, extra = {}) => ({ brotherhood_entity_id: 'h', step_entity_id: 'misterio', position: 'Tras el paso', band_entity_id: band, ...extra })
const bands = (list) => list.map((item) => item.band_entity_id).sort()

test('El Carmen: Virgen de los Reyes entra en 2027 y Pasión de Linares (2022–2026) sale', () => {
  const result = programmeMusicPeriods([
    p('linares', { year_from: 2022, year_to: 2026, is_current: false }),
    p('reyes', { year_from: 2027, is_current: false }),
    p('cantillana', { step_entity_id: 'palio', year_from: 2020, is_current: true }),
    p('reyes-juvenil', { step_entity_id: null, position: 'Cruz de Guía', year_from: 2027, is_current: false }),
  ], 2027)
  assert.deepEqual(bands(result), ['cantillana', 'reyes', 'reyes-juvenil'])
})

test('un cambio de 2027 sustituye a la vigente sin final documentado del mismo paso', () => {
  const result = programmeMusicPeriods([
    p('antigua', { year_from: 2015, is_current: true }),
    p('nueva', { year_from: 2027, is_current: false }),
    p('otro-paso', { step_entity_id: 'palio', year_from: 2015, is_current: true }),
  ], 2027)
  assert.deepEqual(bands(result), ['nueva', 'otro-paso'])
})

test('se mantiene la que consta hasta 2027 o después junto a la nueva (ida y regreso)', () => {
  const result = programmeMusicPeriods([
    p('ida', { year_from: 2003, year_to: 2027, is_current: true }),
    p('regreso', { year_from: 2027, is_current: false }),
  ], 2027)
  assert.deepEqual(bands(result), ['ida', 'regreso'])
})

test('fuera lo que termina antes del año, lo de años posteriores y lo histórico no vigente', () => {
  const result = programmeMusicPeriods([
    p('termino-2025', { year_to: 2025, is_current: false, step_entity_id: 'a' }),
    p('empieza-2028', { year_from: 2028, is_current: false, step_entity_id: 'b' }),
    p('historica', { year_from: 1990, year_to: 2000, is_current: false, step_entity_id: 'c' }),
    p('vigente-sin-anos', { is_current: true, step_entity_id: 'd' }),
    p('solo-2026', { year_from: 2026, year_to: 2026, is_current: true, step_entity_id: 'e' }),
  ], 2027)
  assert.deepEqual(bands(result), ['vigente-sin-anos'])
})

test('las fechas exactas cuentan como años', () => {
  const result = programmeMusicPeriods([
    p('fecha-2027', { date_from: '2027-03-24', is_current: false }),
    p('vieja', { date_from: '2010-04-01', is_current: true }),
  ], 2027)
  assert.deepEqual(bands(result), ['fecha-2027'])
})
