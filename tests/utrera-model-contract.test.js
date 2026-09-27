import test from 'node:test'
import assert from 'node:assert/strict'
import { readUtreraModel, validateUtreraModel } from '../scripts/validate-utrera-model.mjs'

test('Utrera: modelo candidato consistente sin certificar Apply', () => {
  const result = validateUtreraModel(...readUtreraModel())
  assert.equal(result.corporations_in_institutional_review, 14)
  assert.equal(result.outings_in_model, 18)
  assert.equal(result.identified_images, 36)
  assert.equal(result.source_records, 40)
  assert.equal(result.held_with_linked_evidence, 4)
  assert.equal(result.announced_historical, 14)
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
]
for (const [label, mutate] of invalidCases) test(`Utrera rechaza ${label}`, () => {
  const [base, refinement] = readUtreraModel()
  mutate(base, refinement)
  assert.throws(() => validateUtreraModel(base, refinement), /UTRERA_MODEL/)
})
