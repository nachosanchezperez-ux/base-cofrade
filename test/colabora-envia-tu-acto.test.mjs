import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { composeActContribution } from '../lib/contributions/act-submission.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const form = (values) => (name) => values[name] ?? ''
const ok = { act_kind: 'Triduo', act_brotherhood: 'Hermandad del Amor', act_date: '2026-10-22', act_end_date: '2026-10-24', act_time: '20:00', act_municipality: 'Sevilla', act_place: 'Parroquia de San Isidro', act_details: 'Predica el párroco.\nFunción el domingo.' }

test('el acto se convierte en una aportación con título y explicación estructurados', () => {
  const result = composeActContribution(form({ ...ok, act_source: 'https://hermandad.es/triduo' }), { today: '2026-10-21' })
  assert.equal(result.title, 'Acto para la Agenda: Triduo · Hermandad del Amor')
  assert.match(result.description, /^Propuesta de acto para la Agenda Cofrade\.\nTipo: Triduo\nOrganiza: Hermandad del Amor\nFecha: jueves, 22 de octubre de 2026 al sábado, 24 de octubre de 2026 · 20:00 h\nLugar: Parroquia de San Isidro, Sevilla\nDetalles: Predica el párroco\.\nFunción el domingo\.$/)
  assert.ok(result.description.length >= 30)
  assert.equal(result.source, 'https://hermandad.es/triduo')
})

test('rechaza lo que no sirve para la Agenda', () => {
  assert.match(composeActContribution(form({ ...ok, act_kind: 'Fiesta' })).error, /tipo de acto/)
  assert.match(composeActContribution(form({ ...ok, act_date: '2026-10-01' }), { today: '2026-10-21' }).error, /ya ha pasado/)
  assert.match(composeActContribution(form({ ...ok, act_end_date: '2026-10-01' })).error, /anterior/)
  assert.match(composeActContribution(form({ ...ok, act_time: '8pm' })).error, /20:30/)
  assert.match(composeActContribution(form({ ...ok, act_municipality: '' })).error, /localidad/)
})

test('usa el mismo envío seguro de Colabora y solo se enlaza con los envíos abiertos', () => {
  const action = read('app/colabora/acto/actions.js')
  assert.match(action, /return submitContributionAction\(previousState, formData\)/)
  assert.match(action, /formData\.set\('contribution_type', 'new_record'\)/)
  const formSource = read('app/colabora/acto/ActContributionForm.js')
  assert.match(formSource, /name="website"/)
  assert.match(formSource, /data-action="public_contribution"/)
  assert.match(formSource, /name="form_ticket"/)
  assert.match(read('components/AgendaTemporalEventList.js'), /contributionReadiness\(\)\.enabled \? <Link href="\/colabora\/acto">/)
  assert.match(read('app/agenda-cofrade/page.js'), /contributionReadiness\(\)\.enabled \? <Link href="\/colabora\/acto">/)
  assert.match(read('app/colabora/acto/page.js'), /robots: \{ index: contributionReadiness\(\)\.enabled/)
})
