'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { sourceUrlVariants } from '@/lib/sources/source-url'
import {
  attachResolutionSuggestions,
  buildExistingEntityEnrichmentRecords,
  buildNewEntityRecords,
  extractSourceAnalysis,
  fetchSourceDocument,
  normalizeAssistedBatchUrls,
  normalizeComparableName,
  STAGEABLE_RELATION_TYPES,
} from '@/lib/panel/assisted-ingestion'
import {
  appendBulkImportItemsAction,
  createBulkImportAction,
  finalizeBulkImportAction,
} from '../importar/actions'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const ITEM_CHUNK_SIZE = 60

function assertUuid(value, label = 'Identificador') {
  const normalized = String(value || '')
  if (!UUID_PATTERN.test(normalized)) throw new Error(`${label} no válido.`)
  return normalized
}

function cleanText(value, maxLength = 500) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function assertResult(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function audit(supabase, user, input) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: input.actionType || 'create',
    object_type: input.objectType,
    object_id: input.objectId,
    summary: input.summary,
    changed_fields: input.changedFields || {},
  })
  if (error) console.error('[Hilo Cofrade] No se pudo auditar la ingestión asistida', error)
}

async function loadTargetBrotherhood(supabase, targetEntityId) {
  const result = await supabase
    .from('entities')
    .select('id, name, slug, status, entity_type')
    .eq('id', targetEntityId)
    .eq('entity_type', 'brotherhood')
    .maybeSingle()
  const target = assertResult(result, 'No se pudo cargar la Hermandad objetivo')
  if (!target) throw new Error('La Hermandad objetivo no existe.')
  return target
}

function analysisWithBatchMembership(analysisInput, batchId) {
  const analysis = analysisInput && typeof analysisInput === 'object' && !Array.isArray(analysisInput)
    ? { ...analysisInput }
    : {}
  const capture = analysis.capture && typeof analysis.capture === 'object' && !Array.isArray(analysis.capture)
    ? { ...analysis.capture }
    : {}
  const batchIds = Array.isArray(capture.batch_ids)
    ? capture.batch_ids.filter((value) => UUID_PATTERN.test(String(value || '')))
    : []
  if (batchId && !batchIds.includes(batchId)) batchIds.push(batchId)
  analysis.capture = { ...capture, batch_ids: batchIds }
  return analysis
}

export async function prepareAssistedBatchAction(input) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const targetEntityId = assertUuid(input?.targetEntityId, 'Hermandad objetivo')
  const target = await loadTargetBrotherhood(supabase, targetEntityId)
  const urls = normalizeAssistedBatchUrls(input?.sourceUrls || [])
  const batchId = randomUUID()

  await audit(supabase, user, {
    objectType: 'assisted_ingestion_batch',
    objectId: batchId,
    summary: `Tanda HC-AUTO-01 iniciada para ${target.name}`,
    changedFields: { target_entity_id: target.id, source_count: urls.length },
  })

  return { batchId, targetEntityId: target.id, targetName: target.name, urls }
}

export async function analyseSourceAction(input) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const targetEntityId = assertUuid(input?.targetEntityId, 'Hermandad objetivo')
  const batchId = input?.batchId ? assertUuid(input.batchId, 'Lote de ingestión') : null
  const sourceUrl = cleanText(input?.sourceUrl, 2000)
  if (!sourceUrl) throw new Error('Indica la URL oficial que quieres analizar.')

  const target = await loadTargetBrotherhood(supabase, targetEntityId)
  const source = await fetchSourceDocument(sourceUrl)

  const duplicateResult = await supabase
    .from('document_imports')
    .select('id, status, created_at, application_summary, analysis')
    .eq('target_entity_id', targetEntityId)
    .eq('content_sha256', source.contentSha256)
    .in('status', ['review', 'applied'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const duplicate = assertResult(duplicateResult, 'No se pudo comprobar si la Fuente ya estaba analizada')
  if (duplicate) {
    const alreadyConsumed = duplicate.status === 'applied' || Boolean(duplicate.application_summary?.bulk_import_id)
    if (batchId && alreadyConsumed) {
      return {
        id: duplicate.id,
        reused: true,
        skipped: true,
        skipReason: 'already_processed',
        batchId,
      }
    }
    if (batchId) {
      const analysis = analysisWithBatchMembership(duplicate.analysis, batchId)
      assertResult(
        await supabase.from('document_imports').update({ analysis, updated_at: new Date().toISOString() }).eq('id', duplicate.id),
        'No se pudo vincular la propuesta existente con la tanda',
      )
    }
    revalidatePath('/panel/datos/ingestion')
    if (batchId) revalidatePath(`/panel/datos/ingestion/lotes/${batchId}`)
    return { id: duplicate.id, reused: true, skipped: false, batchId }
  }

  const extracted = await extractSourceAnalysis({ source, targetName: target.name })
  const analysis = await attachResolutionSuggestions(supabase, {
    ...extracted.analysis,
    capture: {
      canonical_url: source.url,
      html_title: source.title || null,
      content_type: source.contentType,
      bytes: source.bytes,
      truncated_for_model: source.truncated,
      content_sha256: source.contentSha256,
      fetched_at: source.fetchedAt,
      batch_ids: batchId ? [batchId] : [],
    },
  })

  const insertResult = await supabase.from('document_imports').insert({
    target_entity_id: targetEntityId,
    source_url: source.url,
    source_title: analysis.source.title || source.title || source.url,
    status: 'review',
    analysis_version: 3,
    analysis,
    model_name: extracted.model,
    content_sha256: source.contentSha256,
    fetched_at: source.fetchedAt,
    created_by: user.id,
  }).select('id').single()
  const created = assertResult(insertResult, 'No se pudo guardar la propuesta de ingestión')

  await audit(supabase, user, {
    objectType: 'document_import',
    objectId: created.id,
    summary: `Ingestión asistida preparada para ${target.name}`,
    changedFields: {
      source_url: source.url,
      entities: analysis.entities.length,
      relations: analysis.relations.length,
      model: extracted.model,
      batch_id: batchId,
    },
  })

  revalidatePath('/panel/datos/ingestion')
  if (batchId) revalidatePath(`/panel/datos/ingestion/lotes/${batchId}`)
  return { id: created.id, reused: false, batchId }
}

function entityTypeForLocalRef(analysis, ref) {
  if (ref === '$target') return 'brotherhood'
  return analysis.entities.find((entity) => entity.local_id === ref)?.entity_type || null
}

function assertRelationShape(analysis, relation) {
  const sourceType = entityTypeForLocalRef(analysis, relation.source_ref)
  const targetType = entityTypeForLocalRef(analysis, relation.target_ref)
  const expected = {
    has_titular: ['brotherhood', 'advocation'],
    titular: ['brotherhood', 'image'],
    processional_step: ['brotherhood', 'step'],
    processes_on: ['image', 'step'],
    belongs_to_brotherhood: ['band', 'brotherhood'],
    authored_by: ['march', 'agent'],
    dedicated_to: ['march', '*'],
  }[relation.relation_type]
  if (!expected) throw new Error(`Relación ${relation.relation_type} no soportada.`)
  if (sourceType !== expected[0] || (expected[1] !== '*' && targetType !== expected[1])) {
    throw new Error(`La relación ${relation.relation_type} no coincide con los tipos de entidad esperados.`)
  }
}

async function verifyExistingChoices(supabase, analysis, decisions) {
  const requested = []
  for (const entity of analysis.entities) {
    const choice = String(decisions[entity.local_id] || 'ignore')
    if (!choice.startsWith('existing:')) continue
    requested.push({ entity, id: assertUuid(choice.slice(9), `Entidad existente para ${entity.name}`) })
  }
  if (!requested.length) return

  const ids = [...new Set(requested.map((item) => item.id))]
  const result = await supabase.from('entities').select('id, entity_type, name').in('id', ids)
  const rows = assertResult(result, 'No se pudieron validar las entidades existentes') || []
  const byId = new Map(rows.map((row) => [row.id, row]))

  for (const item of requested) {
    const row = byId.get(item.id)
    if (!row || row.entity_type !== item.entity.entity_type) {
      throw new Error(`La resolución elegida para «${item.entity.name}» ya no es válida.`)
    }
    const candidates = item.entity.resolution?.candidates || []
    if (!candidates.some((candidate) => candidate.id === item.id)) {
      throw new Error(`La entidad existente elegida para «${item.entity.name}» no estaba entre las coincidencias revisadas.`)
    }
  }
}

async function existingSource(supabase, url) {
  const variants = sourceUrlVariants(url)
  if (!variants.length) return null
  const result = await supabase
    .from('sources')
    .select('id, url')
    .in('url', variants)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  return assertResult(result, 'No se pudo comprobar la Fuente existente')
}

async function hasSourceLink(supabase, sourceId, filters) {
  if (!sourceId) return false
  let query = supabase.from('source_links').select('id').eq('source_id', sourceId)
  for (const [column, value] of Object.entries(filters)) query = query.eq(column, value)
  const result = await query.limit(1).maybeSingle()
  return Boolean(assertResult(result, 'No se pudo comprobar un vínculo de Fuente'))
}

function sourceRef(url) {
  return { table: 'sources', match: { url }, column: 'id' }
}

function makeSourceLink(url, data) {
  return {
    table: 'source_links',
    operation: 'insert',
    data,
    refs: { source_id: sourceRef(url) },
  }
}

async function materializeRelation(supabase, analysis, relation, endpointIds, source, sourceId, batchContext = null) {
  assertRelationShape(analysis, relation)
  const sourceEntityId = relation.source_ref === '$target' ? endpointIds.$target : endpointIds[relation.source_ref]
  const targetEntityId = relation.target_ref === '$target' ? endpointIds.$target : endpointIds[relation.target_ref]
  if (!sourceEntityId || !targetEntityId) return []

  const evidence = cleanText(relation.evidence || relation.notes, 700) || null
  const notes = cleanText(relation.notes, 700) || null
  let table
  let filters
  let data
  let linkColumn

  if (relation.relation_type === 'has_titular' || relation.relation_type === 'belongs_to_brotherhood') {
    table = 'entity_relations'
    filters = {
      source_entity_id: sourceEntityId,
      relation_type: relation.relation_type,
      target_entity_id: targetEntityId,
    }
    data = { ...filters, notes, status: 'draft' }
    linkColumn = 'entity_relation_id'
  } else if (relation.relation_type === 'titular') {
    table = 'brotherhood_images'
    filters = { brotherhood_entity_id: sourceEntityId, image_entity_id: targetEntityId, relation_type: 'titular' }
    data = { ...filters, notes, status: 'draft' }
    linkColumn = 'brotherhood_image_id'
  } else if (relation.relation_type === 'processional_step') {
    table = 'brotherhood_steps'
    filters = { brotherhood_entity_id: sourceEntityId, step_entity_id: targetEntityId, relation_type: 'processional_step' }
    data = { ...filters, notes, status: 'draft' }
    linkColumn = 'brotherhood_step_id'
  } else if (relation.relation_type === 'processes_on') {
    table = 'image_steps'
    filters = { image_entity_id: sourceEntityId, step_entity_id: targetEntityId, relation_type: 'processes_on' }
    data = { ...filters, notes, status: 'draft' }
    linkColumn = 'image_step_id'
  } else if (relation.relation_type === 'authored_by') {
    table = 'march_authors'
    filters = { march_entity_id: sourceEntityId, agent_entity_id: targetEntityId, author_role: 'composer' }
    data = { ...filters, notes, status: 'draft' }
    linkColumn = null
  } else {
    throw new Error(`La relación ${relation.relation_type} todavía no puede entrar en el lote gobernado.`)
  }

  let query = supabase.from(table).select('id').limit(1)
  for (const [column, value] of Object.entries(filters)) query = query.eq(column, value)
  const existing = (assertResult(await query.maybeSingle(), `No se pudo comprobar ${table}`)) || null
  const records = []
  const relationKey = `${table}:${JSON.stringify(Object.entries(filters).sort(([a], [b]) => a.localeCompare(b)))}`

  if (existing) {
    if (linkColumn && !(await hasSourceLink(supabase, sourceId, { [linkColumn]: existing.id }))) {
      records.push(makeSourceLink(source.url, { [linkColumn]: existing.id, scope: 'relation', notes: evidence }))
    }
    return records
  }

  if (table === 'march_authors') {
    if (!batchContext?.relationSeen?.has(relationKey)) {
      records.push({
        table,
        operation: 'upsert',
        on_conflict: 'march_entity_id,agent_entity_id,author_role',
        data,
      })
      batchContext?.relationSeen?.add(relationKey)
    }
    return records
  }

  let id = batchContext?.relationIds?.get(relationKey) || null
  const relationAlreadyPlanned = Boolean(id)
  if (!id) {
    id = randomUUID()
    batchContext?.relationIds?.set(relationKey, id)
  }

  if (!relationAlreadyPlanned) records.push({ table, operation: 'insert', data: { id, ...data } })
  if (linkColumn) records.push(makeSourceLink(source.url, { [linkColumn]: id, scope: 'relation', notes: evidence }))
  return records
}

function relationEndpointsAccepted(relation, decisions) {
  for (const ref of [relation.source_ref, relation.target_ref]) {
    if (ref === '$target') continue
    if (!decisions[ref] || decisions[ref] === 'ignore') return false
  }
  return true
}

async function normalizeReviewInput(supabase, analysis, reviewInput) {
  const incoming = reviewInput?.decisions && typeof reviewInput.decisions === 'object' && !Array.isArray(reviewInput.decisions)
    ? reviewInput.decisions
    : {}
  const decisions = {}

  for (const entity of analysis.entities || []) {
    const raw = String(incoming[entity.local_id] || 'ignore')
    if (raw === 'ignore' || raw === 'new' || raw.startsWith('existing:')) decisions[entity.local_id] = raw
    else decisions[entity.local_id] = 'ignore'
  }

  await verifyExistingChoices(supabase, analysis, decisions)

  const selectedRelations = [...new Set((Array.isArray(reviewInput?.selectedRelations) ? reviewInput.selectedRelations : [])
    .map((value) => Number.parseInt(value, 10))
    .filter(Number.isInteger))]
    .sort((a, b) => a - b)

  for (const index of selectedRelations) {
    const relation = analysis.relations?.[index]
    if (!relation) throw new Error(`La relación seleccionada #${index + 1} ya no existe en la propuesta.`)
    assertRelationShape(analysis, relation)
    if (!STAGEABLE_RELATION_TYPES.has(relation.relation_type)) {
      throw new Error(`La relación ${relation.relation_type} se conserva como propuesta, pero todavía no tiene un contrato de escritura seguro en el importador.`)
    }
    if (!relationEndpointsAccepted(relation, decisions)) {
      throw new Error(`La relación ${relation.relation_type} necesita aceptar primero las entidades de ambos extremos.`)
    }
  }

  return { decisions, selectedRelations }
}

export async function saveAssistedReviewAction(importIdInput, reviewInput) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const importId = assertUuid(importIdInput, 'Propuesta de ingestión')
  const result = await supabase
    .from('document_imports')
    .select('id, status, analysis, application_summary')
    .eq('id', importId)
    .maybeSingle()
  const documentImport = assertResult(result, 'No se pudo cargar la propuesta')
  if (!documentImport || documentImport.status !== 'review') throw new Error('La propuesta ya no está disponible para revisión.')
  if (documentImport.application_summary?.bulk_import_id) {
    throw new Error('Esta propuesta ya está vinculada a un lote gobernado y no admite una segunda revisión operativa.')
  }

  const normalized = await normalizeReviewInput(supabase, documentImport.analysis || {}, reviewInput)
  const applicationSummary = documentImport.application_summary && typeof documentImport.application_summary === 'object'
    ? { ...documentImport.application_summary }
    : {}
  applicationSummary.review = {
    decisions: normalized.decisions,
    selected_relation_indexes: normalized.selectedRelations,
    saved_at: new Date().toISOString(),
    saved_by: user.id,
  }

  assertResult(
    await supabase.from('document_imports').update({ application_summary: applicationSummary, updated_at: new Date().toISOString() }).eq('id', importId),
    'No se pudo guardar la revisión editorial',
  )

  await audit(supabase, user, {
    actionType: 'update',
    objectType: 'document_import',
    objectId: importId,
    summary: 'Revisión editorial guardada para una tanda HC-AUTO-01',
    changedFields: {
      accepted_entities: Object.values(normalized.decisions).filter((value) => value !== 'ignore').length,
      selected_relations: normalized.selectedRelations.length,
    },
  })

  revalidatePath(`/panel/datos/ingestion/${importId}`)
  return { saved: true }
}

function selectedExistingCandidate(entity, entityId) {
  return (entity.resolution?.candidates || []).find((candidate) => candidate.id === entityId) || null
}

function enrichmentRecordKey(record) {
  const identity = record.data?.id || record.data?.entity_id
  return identity ? `${record.table}:${identity}` : null
}

function mergeEnrichmentRecord(batchContext, record) {
  if (!batchContext?.enrichmentRecords) return false
  const key = enrichmentRecordKey(record)
  if (!key) return false
  const existing = batchContext.enrichmentRecords.get(key)
  if (!existing) {
    batchContext.enrichmentRecords.set(key, record)
    return true
  }
  const merged = { ...existing.data }
  for (const [column, value] of Object.entries(record.data || {})) {
    if (column === 'id' || column === 'entity_id') continue
    if (merged[column] == null || merged[column] === '') {
      merged[column] = value
      continue
    }
    if (normalizeComparableName(merged[column]) !== normalizeComparableName(value)) {
      throw new Error(`CONFLICTO_DE_ENRIQUECIMIENTO: varias Fuentes proponen valores distintos para ${record.table}.${column}.`)
    }
  }
  existing.data = merged
  return true
}

async function buildAssistedRecords(supabase, documentImport, reviewInput, options = {}) {
  const analysis = documentImport.analysis || {}
  const normalized = await normalizeReviewInput(supabase, analysis, reviewInput)
  const target = options.target || await loadTargetBrotherhood(supabase, documentImport.target_entity_id)
  const endpointIds = { $target: target.id }
  const accepted = []
  const createdNewEntityIds = options.createdNewEntityIds || null
  const forcedNewEntityIds = options.forcedNewEntityIds || {}

  for (const entity of analysis.entities || []) {
    const choice = String(normalized.decisions[entity.local_id] || 'ignore')
    if (choice === 'ignore') continue
    const forcedKey = `${documentImport.id}:${entity.local_id}`
    const id = choice === 'new'
      ? (forcedNewEntityIds[forcedKey] || randomUUID())
      : assertUuid(choice.replace(/^existing:/, ''), `Resolución para ${entity.name}`)
    endpointIds[entity.local_id] = id
    accepted.push({ entity, choice, id })
  }

  const source = {
    url: documentImport.source_url,
    title: analysis.source?.title || documentImport.source_title || documentImport.source_url,
    sourceType: analysis.source?.source_type || 'Web oficial',
    publisher: analysis.source?.publisher || null,
    publicationDate: analysis.source?.publication_date || null,
  }
  const sourceRow = await existingSource(supabase, source.url)
  const records = [{
    table: 'sources',
    operation: 'insert',
    data: {
      name: cleanText(source.title, 500) || source.url,
      url: source.url,
      source_type: cleanText(source.sourceType, 120) || 'Web oficial',
      author_or_publisher: cleanText(source.publisher, 320) || null,
      publication_date: /^\d{4}-\d{2}-\d{2}$/.test(String(source.publicationDate || '')) ? source.publicationDate : null,
      accessed_at: new Date().toISOString().slice(0, 10),
      notes: options.batchId
        ? 'Fuente capturada mediante HC-AUTO-01; revisión editorial guardada antes del preflight conjunto.'
        : 'Fuente capturada mediante Ingestión asistida v1; revisión editorial obligatoria antes de Apply.',
    },
  }]

  if (!(await hasSourceLink(supabase, sourceRow?.id, { entity_id: target.id }))) {
    records.push(makeSourceLink(source.url, {
      entity_id: target.id,
      scope: 'ingestion_target',
      notes: options.batchId
        ? 'Fuente incluida en una tanda HC-AUTO-01 para revisar y ampliar esta Hermandad.'
        : 'Fuente utilizada para revisar y ampliar esta Hermandad mediante Ingestión asistida v1.',
    }))
  }

  for (const item of accepted) {
    if (item.choice === 'new') {
      const alreadyPlanned = createdNewEntityIds?.has(item.id)
      if (!alreadyPlanned) {
        const mergedEntity = options.mergedNewEntitiesById?.[item.id] || item.entity
        records.push(...buildNewEntityRecords(mergedEntity, item.id, target.id))
        createdNewEntityIds?.add(item.id)
      }
    } else {
      const candidate = selectedExistingCandidate(item.entity, item.id)
      for (const enrichmentRecord of buildExistingEntityEnrichmentRecords(item.entity, candidate)) {
        if (!mergeEnrichmentRecord(options.batchContext, enrichmentRecord)) records.push(enrichmentRecord)
      }
    }
    if (!(await hasSourceLink(supabase, sourceRow?.id, { entity_id: item.id }))) {
      records.push(makeSourceLink(source.url, {
        entity_id: item.id,
        scope: 'entity',
        notes: cleanText(item.entity.evidence, 700) || `Evidencia para ${item.entity.name}`,
      }))
    }
  }

  for (const index of normalized.selectedRelations) {
    const relation = analysis.relations[index]
    records.push(...await materializeRelation(
      supabase,
      analysis,
      relation,
      endpointIds,
      source,
      sourceRow?.id || null,
      options.batchContext || null,
    ))
  }

  return {
    records,
    target,
    accepted,
    selectedRelations: normalized.selectedRelations,
    decisions: normalized.decisions,
    source,
  }
}

function entityAttributeMap(entity) {
  return Object.fromEntries((entity.attributes || []).map((item) => [item.key, cleanText(item.value, 500)]))
}

function criticalEntityConflict(left, right) {
  const keysByType = {
    advocation: ['advocation_type'],
    image: ['image_type', 'execution_date_text', 'current_condition'],
    step: ['step_type', 'execution_date_text'],
    agent: ['agent_kind'],
    band: ['band_type', 'foundation_text'],
    march: ['composition_year', 'composition_date_text'],
    heritage_asset: ['asset_type'],
  }
  const leftAttributes = entityAttributeMap(left)
  const rightAttributes = entityAttributeMap(right)
  for (const key of keysByType[left.entity_type] || []) {
    if (!leftAttributes[key] || !rightAttributes[key]) continue
    if (normalizeComparableName(leftAttributes[key]) !== normalizeComparableName(rightAttributes[key])) return key
  }
  return null
}

function mergeEntityProposal(base, incoming) {
  const attributes = new Map()
  for (const item of [...(base.attributes || []), ...(incoming.attributes || [])]) {
    const key = cleanText(item?.key, 80)
    const value = cleanText(item?.value, 1600)
    if (!key || !value) continue
    const current = attributes.get(key)
    if (!current || value.length > current.length) attributes.set(key, value)
  }

  const baseSummary = cleanText(base.summary, 1400)
  const incomingSummary = cleanText(incoming.summary, 1400)
  const baseEvidence = cleanText(base.evidence, 700)
  const incomingEvidence = cleanText(incoming.evidence, 700)

  return {
    ...base,
    summary: incomingSummary.length > baseSummary.length ? incomingSummary : (baseSummary || null),
    attributes: [...attributes.entries()].map(([key, value]) => ({ key, value })),
    evidence: incomingEvidence.length > baseEvidence.length ? incomingEvidence : baseEvidence,
    confidence: Math.max(Number(base.confidence) || 0, Number(incoming.confidence) || 0),
  }
}

function planSharedNewEntities(documentImports) {
  const groups = new Map()
  const forcedNewEntityIds = {}
  let reusedAcrossSources = 0

  for (const documentImport of documentImports) {
    const analysis = documentImport.analysis || {}
    const review = documentImport.application_summary?.review
    const decisions = review?.decisions || {}
    for (const entity of analysis.entities || []) {
      if (decisions[entity.local_id] !== 'new') continue
      const identity = `${entity.entity_type}:${normalizeComparableName(entity.name)}`
      const existing = groups.get(identity)
      if (existing) {
        const conflictKey = criticalEntityConflict(existing.entity, entity)
        if (conflictKey) {
          throw new Error(`CONFLICTO_DE_LOTE: «${entity.name}» aparece como entidad nueva en varias Fuentes con valores incompatibles para ${conflictKey}. Revisa las propuestas antes de generar el lote.`)
        }
        existing.entity = mergeEntityProposal(existing.entity, entity)
        forcedNewEntityIds[`${documentImport.id}:${entity.local_id}`] = existing.id
        reusedAcrossSources += 1
      } else {
        const id = randomUUID()
        groups.set(identity, { id, entity: mergeEntityProposal(entity, entity) })
        forcedNewEntityIds[`${documentImport.id}:${entity.local_id}`] = id
      }
    }
  }

  const mergedNewEntitiesById = Object.fromEntries(
    [...groups.values()].map((group) => [group.id, group.entity]),
  )

  return {
    forcedNewEntityIds,
    mergedNewEntitiesById,
    uniqueNewEntities: groups.size,
    reusedAcrossSources,
  }
}

export async function stageAssistedImportAction(importIdInput, reviewInput) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const importId = assertUuid(importIdInput, 'Propuesta de ingestión')

  const importResult = await supabase
    .from('document_imports')
    .select('id, target_entity_id, source_url, source_title, status, analysis, model_name, content_sha256, application_summary')
    .eq('id', importId)
    .maybeSingle()
  const documentImport = assertResult(importResult, 'No se pudo cargar la propuesta')
  if (!documentImport || documentImport.status !== 'review') throw new Error('La propuesta ya no está disponible para revisión.')
  if (documentImport.application_summary?.bulk_import_id) {
    return { bulkImportId: documentImport.application_summary.bulk_import_id, reused: true }
  }

  const built = await buildAssistedRecords(supabase, documentImport, reviewInput)
  const batch = await createBulkImportAction({
    label: `Ingestión asistida · ${built.target.name}`,
    sourceName: built.source.url,
    sourceFormat: 'json',
    expectedItems: built.records.length,
    metadata: {
      assisted_ingestion: true,
      document_import_id: importId,
      target_entity_id: built.target.id,
      source_sha256: documentImport.content_sha256,
      model_name: documentImport.model_name,
      accepted_entities: built.accepted.length,
      selected_relations: built.selectedRelations.length,
      human_review_required: true,
      publication_mode: 'draft',
    },
  })

  for (let start = 0; start < built.records.length; start += ITEM_CHUNK_SIZE) {
    await appendBulkImportItemsAction(batch.id, start, built.records.slice(start, start + ITEM_CHUNK_SIZE))
  }
  const final = await finalizeBulkImportAction(batch.id)

  const applicationSummary = {
    ...(documentImport.application_summary || {}),
    bulk_import_id: batch.id,
    staged_at: new Date().toISOString(),
    blocked: Boolean(final.blocked),
    counts: final.counts,
    accepted_entities: built.accepted.map((item) => ({ local_id: item.entity.local_id, entity_id: item.id, choice: item.choice })),
    selected_relation_indexes: built.selectedRelations,
  }
  assertResult(
    await supabase.from('document_imports').update({ application_summary: applicationSummary, updated_at: new Date().toISOString() }).eq('id', importId),
    'No se pudo vincular la propuesta con el lote gobernado',
  )

  await audit(supabase, user, {
    objectType: 'document_import',
    objectId: importId,
    summary: `Ingestión asistida convertida en lote gobernado para ${built.target.name}`,
    changedFields: {
      bulk_import_id: batch.id,
      records: built.records.length,
      blocked: Boolean(final.blocked),
      accepted_entities: built.accepted.length,
      selected_relations: built.selectedRelations.length,
    },
  })

  revalidatePath('/panel/datos/ingestion')
  revalidatePath(`/panel/datos/ingestion/${importId}`)
  revalidatePath('/panel/datos/importar')
  return { bulkImportId: batch.id, blocked: Boolean(final.blocked), counts: final.counts, reused: false }
}

export async function stageAssistedBatchAction(batchIdInput, importIdsInput) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const batchId = assertUuid(batchIdInput, 'Tanda de ingestión')
  const importIds = [...new Set((Array.isArray(importIdsInput) ? importIdsInput : []).map((value) => assertUuid(value, 'Propuesta de ingestión')))]
  if (!importIds.length || importIds.length > 30) throw new Error('La tanda debe contener entre 1 y 30 propuestas revisadas.')

  const result = await supabase
    .from('document_imports')
    .select('id, target_entity_id, source_url, source_title, status, analysis, model_name, content_sha256, application_summary, created_at')
    .in('id', importIds)
  const rows = assertResult(result, 'No se pudieron cargar las propuestas de la tanda') || []
  if (rows.length !== importIds.length) throw new Error('Alguna propuesta de la tanda ya no existe.')

  const byId = new Map(rows.map((row) => [row.id, row]))
  const documentImports = importIds.map((id) => byId.get(id))
  const targetIds = new Set(documentImports.map((item) => item.target_entity_id))
  if (targetIds.size !== 1) throw new Error('Una tanda HC-AUTO-01 solo puede agrupar Fuentes de una misma Hermandad.')
  const target = await loadTargetBrotherhood(supabase, documentImports[0].target_entity_id)

  for (const documentImport of documentImports) {
    const memberships = documentImport.analysis?.capture?.batch_ids || []
    if (!memberships.includes(batchId)) throw new Error('Una propuesta no pertenece a esta tanda HC-AUTO-01.')
    if (documentImport.status !== 'review') throw new Error('Todas las propuestas deben seguir disponibles para revisión.')
    if (documentImport.application_summary?.bulk_import_id) {
      throw new Error(`La Fuente «${documentImport.source_title || documentImport.source_url}» ya está vinculada a otro lote gobernado.`)
    }
    if (!documentImport.application_summary?.review?.saved_at) {
      throw new Error(`La Fuente «${documentImport.source_title || documentImport.source_url}» todavía no tiene una revisión editorial guardada.`)
    }
  }

  const sharing = planSharedNewEntities(documentImports)
  const createdNewEntityIds = new Set()
  const batchContext = { relationIds: new Map(), relationSeen: new Set(), enrichmentRecords: new Map() }
  const records = []
  let acceptedEntities = 0
  let selectedRelations = 0

  for (const documentImport of documentImports) {
    const review = documentImport.application_summary.review
    const built = await buildAssistedRecords(supabase, documentImport, {
      decisions: review.decisions,
      selectedRelations: review.selected_relation_indexes,
    }, {
      target,
      batchId,
      forcedNewEntityIds: sharing.forcedNewEntityIds,
      mergedNewEntitiesById: sharing.mergedNewEntitiesById,
      createdNewEntityIds,
      batchContext,
    })
    records.push(...built.records)
    acceptedEntities += built.accepted.length
    selectedRelations += built.selectedRelations.length
  }

  records.push(...batchContext.enrichmentRecords.values())

  const bulkBatch = await createBulkImportAction({
    label: `HC-AUTO-01 · ${target.name} · ${documentImports.length} Fuentes`,
    sourceName: `${documentImports.length} Fuentes revisadas`,
    sourceFormat: 'json',
    expectedItems: records.length,
    metadata: {
      assisted_ingestion: true,
      assisted_ingestion_batch: true,
      assisted_batch_id: batchId,
      document_import_ids: documentImports.map((item) => item.id),
      target_entity_id: target.id,
      source_count: documentImports.length,
      accepted_entities: acceptedEntities,
      selected_relations: selectedRelations,
      unique_new_entities: sharing.uniqueNewEntities,
      reused_new_entities_across_sources: sharing.reusedAcrossSources,
      human_review_required: true,
      publication_mode: 'draft',
    },
  })

  for (let start = 0; start < records.length; start += ITEM_CHUNK_SIZE) {
    await appendBulkImportItemsAction(bulkBatch.id, start, records.slice(start, start + ITEM_CHUNK_SIZE))
  }
  const final = await finalizeBulkImportAction(bulkBatch.id)
  const now = new Date().toISOString()

  for (const documentImport of documentImports) {
    const applicationSummary = {
      ...(documentImport.application_summary || {}),
      bulk_import_id: bulkBatch.id,
      batch_id: batchId,
      batch_staged_at: now,
      blocked: Boolean(final.blocked),
      counts: final.counts,
    }
    assertResult(
      await supabase.from('document_imports').update({ application_summary: applicationSummary, updated_at: now }).eq('id', documentImport.id),
      'No se pudo vincular una propuesta con el lote conjunto',
    )
  }

  await audit(supabase, user, {
    objectType: 'assisted_ingestion_batch',
    objectId: batchId,
    summary: `HC-AUTO-01 convertido en lote gobernado para ${target.name}`,
    changedFields: {
      bulk_import_id: bulkBatch.id,
      source_count: documentImports.length,
      records: records.length,
      blocked: Boolean(final.blocked),
      accepted_entities: acceptedEntities,
      selected_relations: selectedRelations,
      unique_new_entities: sharing.uniqueNewEntities,
      reused_across_sources: sharing.reusedAcrossSources,
    },
  })

  revalidatePath('/panel/datos/ingestion')
  revalidatePath(`/panel/datos/ingestion/lotes/${batchId}`)
  revalidatePath('/panel/datos/importar')
  return {
    bulkImportId: bulkBatch.id,
    blocked: Boolean(final.blocked),
    counts: final.counts,
    sourceCount: documentImports.length,
    reusedAcrossSources: sharing.reusedAcrossSources,
  }
}
