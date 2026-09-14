import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const engine = readFileSync(new URL('../lib/panel/assisted-ingestion.js', import.meta.url), 'utf8')
const actions = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/actions.js', import.meta.url), 'utf8')
const review = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/[id]/IngestionReview.js', import.meta.url), 'utf8')

test('la captura de Fuentes mantiene límites, URL canónica y defensa SSRF', () => {
  assert.match(engine, /normalizeSourceUrl/)
  assert.match(engine, /MAX_SOURCE_BYTES = 2_000_000/)
  assert.match(engine, /redirect: 'manual'/)
  assert.match(engine, /lookup\(hostname/)
  assert.match(engine, /red privada o reservada/)
  assert.match(engine, /contentSha256: createHash\('sha256'\)/)
})

test('la extracción es estructurada, stateless y no publica automáticamente', () => {
  assert.match(engine, /store: false/)
  assert.match(engine, /type: 'json_schema'/)
  assert.match(engine, /strict: true/)
  assert.match(engine, /status: 'draft'/)
  assert.match(engine, /OPENAI_API_KEY/)
})

test('la revisión desemboca en el importador gobernado existente', () => {
  assert.match(actions, /createBulkImportAction/)
  assert.match(actions, /appendBulkImportItemsAction/)
  assert.match(actions, /finalizeBulkImportAction/)
  assert.match(actions, /document_import_id: importId/)
  assert.match(actions, /human_review_required: true/)
  assert.match(actions, /publication_mode: 'draft'/)
})

test('las relaciones sin contrato seguro permanecen visibles pero no seleccionables', () => {
  assert.match(engine, /dedicated_to/)
  assert.doesNotMatch(engine.match(/STAGEABLE_RELATION_TYPES = new Set\(\[([\s\S]*?)\]\)/)?.[1] || '', /dedicated_to/)
  assert.match(review, /Conservada como propuesta; todavía no tiene contrato de escritura seguro/)
})
