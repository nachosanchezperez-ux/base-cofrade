import test from 'node:test'
import assert from 'node:assert/strict'
import { readUtreraModel, validateUtreraModel } from '../scripts/validate-utrera-model.mjs'

test('Utrera: modelo candidato consistente sin certificar Apply', () => {
  const result = validateUtreraModel(...readUtreraModel())
  assert.equal(result.corporations_in_institutional_review, 14)
  assert.equal(result.outings_in_model, 18)
  assert.equal(result.identified_images, 38)
  assert.equal(result.source_records, 51)
  assert.equal(result.held_with_linked_evidence, 6)
  assert.equal(result.announced_historical, 12)
  assert.equal(result.step_profiles_reviewed, 22)
  assert.equal(result.corporate_profiles_reviewed, 13)
  assert.equal(result.scope_decisions_recorded, 7)
  assert.equal(result.municipal_scope_exhaustive, false)
  assert.equal(result.model_frozen, false)
})

const invalidCases = [
  ['tipo vacío', (base) => { base.municipal_census_review[1].brotherhood_types = [] }],
  ['relación procesional no probada', (base, refinement) => { refinement.processional_relation_decision.include_image_step_relation = true }],
  ['held sin fuente', (base, refinement) => { refinement.outings[0].held_sources = [] }],
  ['hora de Fátima elegida arbitrariamente', (base, refinement) => { refinement.outings[2].departure_time = '09:30' }],
  ['fuente inexistente', (base, refinement) => { refinement.images[0].sources.push('F999') }],
  ['clave duplicada', (base, refinement) => { refinement.images.push({...refinement.images[0]}) }],
  ['UUID de Angustias cambiado', (base, refinement) => { refinement.step_refinements[0].id = '00000000-0000-4000-8000-000000000000' }],
  ['estado temporal duplicado', (base, refinement) => { refinement.temporal_decisions[0].outings.push('O10') }],
  ['certificación anticipada', (base) => { base.meta.model_frozen = true }],
  ['Paso sin perfil', (base, refinement, completion) => { completion.step_refinements.pop() }],
  ['Paso con dos perfiles', (base, refinement, completion) => { completion.step_refinements.push({...refinement.step_refinements[0]}) }],
  ['nueva crónica sin fuente', (base, refinement, completion) => { completion.temporal_overrides[0].sources = [] }],
  ['misma salida corregida dos veces', (base, refinement, completion) => { completion.temporal_overrides.push({...completion.temporal_overrides[0]}) }],
  ['Pinzón descartado del municipio', (base, refinement, completion) => { completion.scope_decisions[2].municipality_in_scope = false }],
  ['salida de Pinzón recreada', (base, refinement, completion) => { completion.scope_decisions[2].preserve_outing_id = null }],
  ['Palmar incluido en Utrera', (base, refinement, completion) => { completion.scope_decisions[5].municipality_in_scope = true }],
  ['censo exhaustivo sin evidencia', (base, refinement, completion) => { completion.meta.scope_exhaustive = true }],
]
for (const [label, mutate] of invalidCases) test(`Utrera rechaza ${label}`, () => {
  const models = readUtreraModel()
  mutate(...models)
  assert.throws(() => validateUtreraModel(...models), /UTRERA_MODEL/)
})
