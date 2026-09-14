'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { sourceUrlVariants } from '@/lib/sources/source-url'
import {
  attachResolutionSuggestions,
  buildNewEntityRecords,
  extractSourceAnalysis,
  fetchSourceDocument,
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

export async function analyseSourceAction(input) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const targetEntityId = assertUuid(input?.targetEntityId, 'Hermandad objetivo')
  const sourceUrl = cleanText(input?.sourceUrl, 2000)
  if (!sourceUrl) throw new Error('Indica la URL oficial que quieres analizar.')

  const target = await loadTargetBrotherhood(supabase, targetEntityId)
  const source = await fetchSourceDocument(sourceUrl)

  const duplicateResult = await supabase
    .from('document_imports')
    .select('id, status, created_at, application_summary')
    .eq('target_entity_id', targetEntityId)
    .eq('content_sha256', source.contentSha256)
    .in('status', ['review', 'applied'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const duplicate = assertResult(duplicateResult, 'No se pudo comprobar si la Fuente ya estaba analizada')
  if (duplicate) return { id: duplicate.id, reused: true }

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
    },
  })

  const insertResult = await supabase.from('document_imports').insert({
    target_entity_id: targetEntityId,
    source_url: source.url,
    source_title: analysis.source.title || source.title || source.url,
    status: 'review',
    analysis_version: 2,
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
    },
  })

  revalidatePath('/panel/datos/ingestion')
  return { id: created.id, reused: false }
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

async function materializeRelation(supabase, analysis, relation, endpointIds, source, sourceId) {
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

  if (existing) {
    if (linkColumn && !(await hasSourceLink(supabase, sourceId, { [linkColumn]: existing.id }))) {
      records.push(makeSourceLink(source.url, { [linkColumn]: existing.id, scope: 'relation', notes: evidence }))
    }
    return records
  }

  const id = randomUUID()
  if (table === 'march_authors') {
    records.push({
      table,
      operation: 'upsert',
      on_conflict: 'march_entity_id,agent_entity_id,author_role',
      data,
    })
    return records
  }

  records.push({ table, operation: 'insert', data: { id, ...data } })
  if (linkColumn) records.push(makeSourceLink(source.url, { [linkColumn]: id, scope: 'relation', notes: evidence }))
  return records
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

  const analysis = documentImport.analysis || {}
  const decisions = reviewInput?.decisions && typeof reviewInput.decisions === 'object' ? reviewInput.decisions : {}
  const selectedRelations = new Set((Array.isArray(reviewInput?.selectedRelations) ? reviewInput.selectedRelations : [])
    .map((value) => Number.parseInt(value, 10))
    .filter(Number.isInteger))

  await verifyExistingChoices(supabase, analysis, decisions)
  const target = await loadTargetBrotherhood(supabase, documentImport.target_entity_id)
  const endpointIds = { $target: target.id }
  const accepted = []

  for (const entity of analysis.entities || []) {
    const choice = String(decisions[entity.local_id] || 'ignore')
    if (choice === 'ignore') continue
    const id = choice === 'new' ? randomUUID() : assertUuid(choice.replace(/^existing:/, ''), `Resolución para ${entity.name}`)
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
      notes: 'Fuente capturada mediante Ingestión asistida v1; revisión editorial obligatoria antes de Apply.',
    },
  }]

  if (!(await hasSourceLink(supabase, sourceRow?.id, { entity_id: target.id }))) {
    records.push(makeSourceLink(source.url, {
      entity_id: target.id,
      scope: 'ingestion_target',
      notes: 'Fuente utilizada para revisar y ampliar esta Hermandad mediante Ingestión asistida v1.',
    }))
  }

  for (const item of accepted) {
    if (item.choice === 'new') records.push(...buildNewEntityRecords(item.entity, item.id, target.id))
    if (!(await hasSourceLink(supabase, sourceRow?.id, { entity_id: item.id }))) {
      records.push(makeSourceLink(source.url, {
        entity_id: item.id,
        scope: 'entity',
        notes: cleanText(item.entity.evidence, 700) || `Evidencia para ${item.entity.name}`,
      }))
    }
  }

  for (let index = 0; index < (analysis.relations || []).length; index += 1) {
    if (!selectedRelations.has(index)) continue
    const relation = analysis.relations[index]
    if (!STAGEABLE_RELATION_TYPES.has(relation.relation_type)) {
      throw new Error(`La relación ${relation.relation_type} se conserva como propuesta, pero todavía no tiene un contrato de escritura seguro en el importador.`)
    }
    records.push(...await materializeRelation(supabase, analysis, relation, endpointIds, source, sourceRow?.id || null))
  }

  const batch = await createBulkImportAction({
    label: `Ingestión asistida · ${target.name}`,
    sourceName: source.url,
    sourceFormat: 'json',
    expectedItems: records.length,
    metadata: {
      assisted_ingestion: true,
      document_import_id: importId,
      target_entity_id: target.id,
      source_sha256: documentImport.content_sha256,
      model_name: documentImport.model_name,
      accepted_entities: accepted.length,
      selected_relations: selectedRelations.size,
      human_review_required: true,
      publication_mode: 'draft',
    },
  })

  for (let start = 0; start < records.length; start += ITEM_CHUNK_SIZE) {
    await appendBulkImportItemsAction(batch.id, start, records.slice(start, start + ITEM_CHUNK_SIZE))
  }
  const final = await finalizeBulkImportAction(batch.id)

  const applicationSummary = {
    bulk_import_id: batch.id,
    staged_at: new Date().toISOString(),
    blocked: Boolean(final.blocked),
    counts: final.counts,
    accepted_entities: accepted.map((item) => ({ local_id: item.entity.local_id, entity_id: item.id, choice: item.choice })),
    selected_relation_indexes: [...selectedRelations].sort((a, b) => a - b),
  }
  assertResult(
    await supabase.from('document_imports').update({ application_summary: applicationSummary, updated_at: new Date().toISOString() }).eq('id', importId),
    'No se pudo vincular la propuesta con el lote gobernado',
  )

  await audit(supabase, user, {
    objectType: 'document_import',
    objectId: importId,
    summary: `Ingestión asistida convertida en lote gobernado para ${target.name}`,
    changedFields: {
      bulk_import_id: batch.id,
      records: records.length,
      blocked: Boolean(final.blocked),
      accepted_entities: accepted.length,
      selected_relations: selectedRelations.size,
    },
  })

  revalidatePath('/panel/datos/ingestion')
  revalidatePath(`/panel/datos/ingestion/${importId}`)
  revalidatePath('/panel/datos/importar')
  return { bulkImportId: batch.id, blocked: Boolean(final.blocked), counts: final.counts, reused: false }
}
