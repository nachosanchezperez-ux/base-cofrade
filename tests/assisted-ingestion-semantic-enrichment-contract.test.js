import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const engine = readFileSync(new URL('../lib/panel/assisted-ingestion.js', import.meta.url), 'utf8')
const actions = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/actions.js', import.meta.url), 'utf8')
const review = readFileSync(new URL('../app/panel/(protected)/datos/ingestion/[id]/IngestionReview.js', import.meta.url), 'utf8')

test('HC-AUTO-02 normaliza abreviaturas cofrades antes de comparar nombres', () => {
  assert.match(engine, /\['stmo', 'santisimo'\]/)
  assert.match(engine, /\['stma', 'santisima'\]/)
  assert.match(engine, /\['ntra', 'nuestra'\]/)
  assert.match(engine, /\['sra', 'senora'\]/)
  assert.match(engine, /semanticNameScore/)
  assert.match(engine, /score >= 0\.82/)
})

test('las coincidencias de Imágenes, Pasos y Patrimonio usan el contexto de la Hermandad', () => {
  assert.match(engine, /loadTargetResolutionContext/)
  assert.match(engine, /brotherhood_images/)
  assert.match(engine, /brotherhood_steps/)
  assert.match(engine, /parent_entity_id/)
  assert.match(actions, /\{ targetEntityId \}/)
  assert.match(engine, /context_match/)
})

test('el enriquecimiento diferencia huecos, iguales y contradicciones', () => {
  assert.match(engine, /enrichmentDiff/)
  assert.match(engine, /state: !current \? 'fill'/)
  assert.match(engine, /'same'/)
  assert.match(engine, /'conflict'/)
  assert.match(engine, /buildExistingEntityEnrichmentRecords/)
  assert.match(engine, /candidate\?\.enrichment\?\.fills/)
})

test('solo los huecos seguros generan upsert parcial', () => {
  assert.match(engine, /operation: 'upsert'/)
  assert.match(engine, /on_conflict: 'entity_id'/)
  assert.match(actions, /enrichment_fills/)
  assert.match(actions, /enrichment_conflicts_review_only/)
  assert.match(review, /No se sobrescribirá automáticamente/)
})

test('dos Fuentes no pueden enriquecer el mismo campo con valores incompatibles', () => {
  assert.match(actions, /enrichmentRecords: new Map\(\)/)
  assert.match(actions, /mergeEnrichmentRecord/)
  assert.match(actions, /CONFLICTO_DE_ENRIQUECIMIENTO/)
})

test('relaciones procesionales históricas equivalentes no se duplican', () => {
  assert.match(actions, /RELATION_TYPE_EQUIVALENTS/)
  assert.match(actions, /processional_step/)
  assert.match(actions, /'current'/)
  assert.match(actions, /current_processional_step/)
  assert.match(actions, /query\.in\(column, equivalentTypes\)/)
})

test('la revisión distingue resolución exacta, semántica, ambigua y nueva', () => {
  assert.match(engine, /state === 'semantic'/)
  assert.match(review, /Coincidencia semántica única/)
  assert.match(review, /Hay varias coincidencias posibles/)
  assert.match(review, /Enriquecimiento diferencial/)
})

test('los huecos se revalidan contra la base viva antes del preflight', () => {
  assert.match(actions, /refreshSafeEnrichmentRecord/)
  assert.match(actions, /ENRICHMENT_STALE/)
  assert.match(actions, /blankValue\(current\)/)
  assert.match(actions, /if \(!refreshed\.record\) continue/)
})
