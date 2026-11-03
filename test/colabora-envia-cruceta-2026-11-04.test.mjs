import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { composeRepertoireContribution } from '../lib/contributions/repertoire-submission.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const form = (values) => (name) => values[name] ?? ''
const ok = { rep_brotherhood: 'Hermandad de San Gonzalo', rep_band: 'Santa Ana de Dos Hermanas', rep_date: '2026-03-30', rep_kind: 'Estación de Penitencia', rep_municipality: 'Sevilla', rep_details: 'Tras el palio.' }

test('la cruceta se convierte en una aportación con título y explicación estructurados', () => {
  const result = composeRepertoireContribution(form({ ...ok, rep_source: 'https://banda.es/cruceta' }), { today: '2026-11-04' })
  assert.equal(result.title, 'Cruceta musical: Hermandad de San Gonzalo · Santa Ana de Dos Hermanas')
  assert.match(result.description, /^Propuesta de cruceta musical \(repertorio interpretado\)\.\nHermandad: Hermandad de San Gonzalo\nBanda: Santa Ana de Dos Hermanas\nFecha: lunes, 30 de marzo de 2026\nSalida: Estación de Penitencia\nLocalidad: Sevilla\nDetalles: Tras el palio\.$/)
  assert.equal(result.source, 'https://banda.es/cruceta')
})

test('rechaza lo que no sirve para una cruceta', () => {
  assert.match(composeRepertoireContribution(form({ ...ok, rep_brotherhood: '' })).error, /Hermandad/)
  assert.match(composeRepertoireContribution(form({ ...ok, rep_band: 'X' })).error, /banda/)
  assert.match(composeRepertoireContribution(form({ ...ok, rep_date: '30/03' })).error, /fecha/)
  assert.match(composeRepertoireContribution(form({ ...ok, rep_date: '2026-12-01' }), { today: '2026-11-04' }).error, /todavía no se ha celebrado/)
  assert.match(composeRepertoireContribution(form({ ...ok, rep_kind: 'Fiesta' })).error, /tipo de salida/)
})

test('usa el mismo envío seguro de Colabora y solo se enlaza con los envíos abiertos', () => {
  const action = read('app/colabora/cruceta/actions.js')
  assert.match(action, /return submitContributionAction\(previousState, formData\)/)
  assert.match(action, /formData\.set\('contribution_type', 'new_record'\)/)
  const formSource = read('app/colabora/cruceta/RepertoireContributionForm.js')
  assert.match(formSource, /name="website"/)
  assert.match(formSource, /data-action="public_contribution"/)
  assert.match(formSource, /name="form_ticket"/)
  assert.match(read('app/colabora/cruceta/page.js'), /robots: \{ index: contributionReadiness\(\)\.enabled/)
  assert.match(read('app/crucetas-musicales/page.js'), /contributionReadiness\(\)\.enabled \? \(/)
})
