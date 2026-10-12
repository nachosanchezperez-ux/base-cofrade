import assert from 'node:assert/strict'
import test from 'node:test'
import {
  accompanimentStartLabel,
  findDocumentedPredecessor,
  predecessorLabel,
  resolvePredecessor,
} from '../lib/music-lineage.js'

const brotherhood = 'h-1'
const step = 'paso-palio'

function period(overrides = {}) {
  return {
    id: 'p-actual',
    brotherhood_entity_id: brotherhood,
    step_entity_id: step,
    band_entity_id: 'banda-actual',
    year_from: 2016,
    year_to: null,
    is_current: true,
    status: 'published',
    ...overrides,
  }
}

test('el inicio documentado se muestra como «Desde»', () => {
  assert.equal(accompanimentStartLabel(period({ year_from: 1999 })), 'Desde 1999')
  assert.equal(accompanimentStartLabel(period({ year_from: null, date_from_text: 'Desde 1987 tras el palio' })), 'Desde 1987')
})

test('un texto de fecha sin inicio explícito no se convierte en «Desde»', () => {
  assert.equal(accompanimentStartLabel(period({ year_from: 2026, date_from_text: 'Confirmado para la estación de penitencia de 2026' })), '')
  assert.equal(accompanimentStartLabel(period({ year_from: 2026, date_from_text: 'Vigente en la Semana Santa de 2026; inicio no acreditado' })), '')
  assert.equal(accompanimentStartLabel(period({ year_from: 1998, date_from_text: 'Desde el año 1998' })), 'Desde 1998')
  assert.equal(accompanimentStartLabel(period({ year_from: 2022, date_from_text: 'Relación iniciada en 2020; acompañamiento procesional desde 2022' })), 'Desde 2022')
})

test('«al menos desde» conserva el matiz y no se presenta como inicio cierto', () => {
  assert.equal(accompanimentStartLabel(period({ year_from: 2007, date_from_text: 'Documentada al menos desde 2007' })), 'Al menos desde 2007')
  assert.equal(accompanimentStartLabel(period({ year_from: null, date_from_text: 'Presencia documentada al menos desde 2012 · vigente en 2026' })), 'Al menos desde 2012')
})

test('una instantánea técnica de 2026 no se presenta como inicio', () => {
  const snapshot = period({ year_from: 2026, date_from_text: 'Vigente en 2026', notes: 'Vigencia constatada para 2026; no presupone continuidad posterior.' })
  assert.equal(accompanimentStartLabel(snapshot), '')
  assert.equal(accompanimentStartLabel(period({ year_from: 2026, notes: 'Inició esta etapa en 2026.' })), 'Desde 2026')
  assert.equal(accompanimentStartLabel(period({ year_from: null })), '')
})

test('la formación anterior es el último periodo cerrado de otra banda en el mismo paso', () => {
  const current = period()
  const periods = [
    current,
    period({ id: 'p-1', band_entity_id: 'banda-antigua', year_from: 1990, year_to: 2001, is_current: false }),
    period({ id: 'p-2', band_entity_id: 'banda-previa', year_from: 2002, year_to: 2015, is_current: false, public_band_name: 'Banda Previa' }),
  ]
  const predecessor = findDocumentedPredecessor(current, periods)
  assert.equal(predecessor.periodId, 'p-2')
  assert.equal(predecessor.bandEntityId, 'banda-previa')
  assert.equal(predecessorLabel(predecessor), 'Antes: Banda Previa (hasta 2015)')
})

test('no infiere sucesión sin paso, en otro paso, en otra Hermandad o con la misma banda', () => {
  const closed = { is_current: false, year_from: 2000, year_to: 2010 }
  assert.equal(findDocumentedPredecessor(period({ step_entity_id: null }), [period({ id: 'x', band_entity_id: 'b', step_entity_id: null, ...closed })]), null)
  assert.equal(findDocumentedPredecessor(period(), [period({ id: 'x', band_entity_id: 'b', step_entity_id: 'otro-paso', ...closed })]), null)
  assert.equal(findDocumentedPredecessor(period(), [period({ id: 'x', band_entity_id: 'b', brotherhood_entity_id: 'otra', ...closed })]), null)
  assert.equal(findDocumentedPredecessor(period(), [period({ id: 'x', band_entity_id: 'banda-actual', ...closed })]), null)
})

test('ignora periodos vigentes, sin fin, no publicados o que terminan después del inicio actual', () => {
  const current = period({ year_from: 2016 })
  const noise = [
    period({ id: 'vigente', band_entity_id: 'b1', is_current: true, year_to: 2010 }),
    period({ id: 'sin-fin', band_entity_id: 'b2', is_current: false, year_to: null }),
    period({ id: 'borrador', band_entity_id: 'b3', is_current: false, year_to: 2010, status: 'draft' }),
    period({ id: 'solapa', band_entity_id: 'b4', is_current: false, year_to: 2019 }),
  ]
  assert.equal(findDocumentedPredecessor(current, noise), null)
})

test('el nombre se resuelve con la banda publicada ya cargada y, si falta, con la instantánea', () => {
  const predecessor = { periodId: 'p', bandEntityId: 'b', name: '', slug: '', yearTo: 2012 }
  const bands = new Map([['b', { name: 'Banda Publicada', slug: 'banda-publicada' }]])
  assert.deepEqual(resolvePredecessor(predecessor, bands), { ...predecessor, name: 'Banda Publicada', slug: 'banda-publicada' })
  assert.equal(resolvePredecessor({ ...predecessor, name: 'Banda Archivada' }, new Map()).name, 'Banda Archivada')
  assert.equal(resolvePredecessor(predecessor, new Map()), null)
  assert.equal(predecessorLabel(null), '')
})
