import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const engine = readFileSync(new URL('../lib/panel/assisted-ingestion.js', import.meta.url), 'utf8')
const actions = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/actions.js', import.meta.url), 'utf8')
const start = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/AssistedBatchStart.js', import.meta.url), 'utf8')
const batchPage = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/lotes/[batchId]/page.js', import.meta.url), 'utf8')
const batchReview = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/lotes/[batchId]/BatchIngestionReview.js', import.meta.url), 'utf8')
const singleReview = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/[id]/IngestionReview.js', import.meta.url), 'utf8')

test('HC-AUTO-01 limita y normaliza tandas antes de analizar', () => {
  assert.match(engine, /normalizeAssistedBatchUrls/)
  assert.match(engine, /al menos dos URLs distintas/)
  assert.match(engine, /máximo de 30 URLs/)
  assert.match(start, /prepareAssistedBatchAction/)
  assert.match(start, /for \(const sourceUrl of prepared\.urls\)/)
  assert.match(start, /batchId: prepared\.batchId/)
})

test('la pertenencia a una tanda queda trazada sin añadir tablas nuevas', () => {
  assert.match(actions, /batch_ids/)
  assert.match(actions, /analysis_version: 3/)
  assert.match(batchPage, /contains\('analysis', \{ capture: \{ batch_ids: \[batchId\] \} \}\)/)
})

test('las decisiones humanas se guardan antes del preflight conjunto', () => {
  assert.match(actions, /saveAssistedReviewAction/)
  assert.match(actions, /applicationSummary\.review/)
  assert.match(singleReview, /Guardar revisión y volver a la tanda/)
  assert.match(batchReview, /reviewed === imports\.length/)
})

test('el lote conjunto reutiliza el importador gobernado y permanece en draft', () => {
  assert.match(actions, /stageAssistedBatchAction/)
  assert.match(actions, /assisted_ingestion_batch: true/)
  assert.match(actions, /createBulkImportAction/)
  assert.match(actions, /appendBulkImportItemsAction/)
  assert.match(actions, /finalizeBulkImportAction/)
  assert.match(actions, /publication_mode: 'draft'/)
  assert.match(batchReview, /Generar lote conjunto y ejecutar preflight/)
})

test('las entidades nuevas repetidas entre Fuentes se comparten y los conflictos críticos bloquean', () => {
  assert.match(actions, /planSharedNewEntities/)
  assert.match(actions, /reused_new_entities_across_sources/)
  assert.match(actions, /CONFLICTO_DE_LOTE/)
  assert.match(actions, /createdNewEntityIds/)
  assert.match(actions, /relationIds: new Map\(\)/)
})

test('la resolución automática aprovecha nombres alternativos existentes', () => {
  assert.match(engine, /agent_names/)
  assert.match(engine, /band_names/)
  assert.match(engine, /image_names/)
  assert.match(engine, /matched_by/)
})
