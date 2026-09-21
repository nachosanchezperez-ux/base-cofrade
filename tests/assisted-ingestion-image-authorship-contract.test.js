import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const engine = readFileSync(new URL('../lib/panel/assisted-ingestion.js', import.meta.url), 'utf8')
const actions = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/actions.js', import.meta.url), 'utf8')
const review = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/[id]/IngestionReview.js', import.meta.url), 'utf8')

test('HC-AUTO-03 distingue autoría documentada de atribución', () => {
  assert.match(engine, /image_authored_by/)
  assert.match(engine, /image_attributed_to/)
  assert.match(engine, /autoría documentada/)
  assert.match(engine, /atribución no documental/)
  assert.match(review, /Imagen → autor documentado/)
  assert.match(review, /Imagen → autor atribuido/)
})

test('las dos relaciones de Imagen son stageable y exigen image→agent', () => {
  const stageable = engine.match(/STAGEABLE_RELATION_TYPES = new Set\(\[([\s\S]*?)\]\)/)?.[1] || ''
  assert.match(stageable, /image_authored_by/)
  assert.match(stageable, /image_attributed_to/)
  assert.match(actions, /image_authored_by: \['image', 'agent'\]/)
  assert.match(actions, /image_attributed_to: \['image', 'agent'\]/)
})

test('una autoría documentada existente absorbe una nueva atribución', () => {
  assert.match(actions, /const documented = existingRows\.find/)
  assert.match(actions, /const attributed = existingRows\.find/)
  assert.match(actions, /existing = documented \|\| attributed/)
  assert.match(actions, /image_authorship_id/)
})

test('una atribución existente nunca se eleva automáticamente a autoría', () => {
  assert.match(actions, /AUTHORSHIP_CONFLICT/)
  assert.match(actions, /Requiere revisión editorial/)
})

test('una autoría nueva nace draft, con certeza coherente y Fuente directa', () => {
  assert.match(actions, /table: 'image_authorships'/)
  assert.match(actions, /authorship_type: proposedType/)
  assert.match(actions, /certainty: proposedCertainty/)
  assert.match(actions, /status: 'draft'/)
  assert.match(actions, /image_authorship_id: id/)
})
