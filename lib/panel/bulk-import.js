import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  bulkImportConflictColumns,
  validateBulkImportRecord,
  validateBulkImportTableContract,
} from '@/lib/panel/bulk-import-config'
import { sourceUrlVariants } from '@/lib/sources/source-url'

function assertResult(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function countByStatus(supabase, importId, status = null) {
  let query = supabase.from('bulk_import_items').select('id', { count: 'exact', head: true }).eq('import_id', importId)
  if (status) query = query.eq('status', status)
  const result = await query
  if (result.error) throw new Error(`No se pudo calcular el progreso del lote: ${result.error.message}`)
  return result.count || 0
}

export async function refreshBulkImportCounts(supabase, importId) {
  const [staged, pendingValid, invalid, applied, failed] = await Promise.all([
    countByStatus(supabase, importId),
    countByStatus(supabase, importId, 'valid'),
    countByStatus(supabase, importId, 'invalid'),
    countByStatus(supabase, importId, 'applied'),
    countByStatus(supabase, importId, 'failed'),
  ])

  const counts = {
    staged_items: staged,
    valid_items: pendingValid + applied + failed,
    invalid_items: invalid,
    applied_items: applied,
    failed_items: failed,
  }

  assertResult(
    await supabase.from('bulk_imports').update({ ...counts, updated_at: new Date().toISOString() }).eq('id', importId),
    'No se pudo actualizar el progreso del lote',
  )

  return { ...counts, pending_valid_items: pendingValid }
}

async function resolveReference(supabase, targetColumn, ref) {
  const selectedColumn = ref.column || 'id'
  const sourceUrlMatch = ref.table === 'sources' && typeof ref.match?.url === 'string'
  let query = supabase.from(ref.table).select(selectedColumn)

  for (const [column, expected] of Object.entries(ref.match)) {
    if (sourceUrlMatch && column === 'url') {
      const variants = sourceUrlVariants(expected)
      query = variants.length ? query.in('url', variants) : query.eq('url', expected)
    } else {
      query = expected === null ? query.is(column, null) : query.eq(column, expected)
    }
  }

  if (sourceUrlMatch) query = query.order('created_at', { ascending: true }).limit(1)
  else query = query.limit(2)

  const result = await query
  if (result.error) throw new Error(`UNRESOLVED_REFERENCE: no se pudo resolver ${targetColumn}: ${result.error.message}`)
  if (!result.data?.length) throw new Error(`UNRESOLVED_REFERENCE: no se pudo resolver ${targetColumn} en ${ref.table}.`)
  if (!sourceUrlMatch && result.data.length > 1) throw new Error(`AMBIGUOUS_REFERENCE: la referencia ${targetColumn} no es unívoca en ${ref.table}.`)

  const value = result.data[0]?.[selectedColumn]
  if (value == null) throw new Error(`UNRESOLVED_REFERENCE: la referencia ${targetColumn} no contiene ${selectedColumn}.`)
  return value
}

async function materializePayload(supabase, record) {
  const payload = { ...record.data }
  for (const [targetColumn, ref] of Object.entries(record.refs || {})) {
    payload[targetColumn] = await resolveReference(supabase, targetColumn, ref)
  }
  return payload
}

async function findReusableSource(supabase, url) {
  const variants = sourceUrlVariants(url)
  if (!variants.length) return null

  const result = await supabase
    .from('sources')
    .select('id, url, created_at')
    .in('url', variants)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (result.error) throw new Error(`CONFLICT: no se pudo comprobar si la Fuente ya existe: ${result.error.message}`)
  return result.data || null
}

async function resolveEffectiveOperation(supabase, record, payload) {
  if (record.operation !== 'upsert') return 'insert'
  const columns = bulkImportConflictColumns(record)
  if (!columns.length) return 'insert'
  if (columns.some((column) => payload[column] == null)) return 'insert'

  let query = supabase.from(record.table).select(columns.join(',')).limit(1)
  for (const column of columns) query = query.eq(column, payload[column])
  const result = await query
  if (result.error) throw new Error(`CONFLICT: no se pudo comprobar si ${record.table} requiere INSERT o UPDATE: ${result.error.message}`)
  return result.data?.length ? 'update' : 'insert'
}

export async function preflightBulkImportRecord(supabase, input) {
  const validation = validateBulkImportRecord(input)
  const errors = [...validation.errors]
  const record = validation.record
  if (errors.length || !record || typeof record !== 'object') {
    return { record, errors, effectiveOperation: null, payload: null, reusedSourceId: null }
  }

  let payload = null
  try {
    payload = await materializePayload(supabase, record)
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'UNRESOLVED_REFERENCE: error desconocido al resolver referencias.')
    return { record, errors, effectiveOperation: null, payload: null, reusedSourceId: null }
  }

  let effectiveOperation = null
  let reusedSourceId = null
  try {
    if (record.table === 'sources' && record.operation === 'insert' && payload.url) {
      const reusable = await findReusableSource(supabase, payload.url)
      if (reusable) {
        effectiveOperation = 'reuse'
        reusedSourceId = reusable.id
      }
    }
    if (!effectiveOperation) effectiveOperation = await resolveEffectiveOperation(supabase, record, payload)
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'CONFLICT: no se pudo determinar INSERT/UPDATE/REUSE.')
    return { record, errors, effectiveOperation: null, payload, reusedSourceId: null }
  }

  errors.push(...validateBulkImportTableContract({ ...record, data: payload, refs: {} }, effectiveOperation))
  return { record, errors, effectiveOperation, payload, reusedSourceId }
}

export async function applyBulkImportRecord(supabase, input) {
  const preflight = await preflightBulkImportRecord(supabase, input)
  if (preflight.errors.length) throw new Error(preflight.errors.join(' '))

  const record = preflight.record
  const payload = preflight.payload

  if (preflight.effectiveOperation === 'reuse') {
    return {
      table: record.table,
      operation: record.operation,
      effective_operation: 'reuse',
      reused_source_id: preflight.reusedSourceId,
      on_conflict: record.on_conflict || null,
    }
  }

  const options = record.on_conflict ? { onConflict: record.on_conflict } : undefined
  const result = record.operation === 'upsert'
    ? await supabase.from(record.table).upsert(payload, options)
    : await supabase.from(record.table).insert(payload)

  if (result.error) throw new Error(`${record.table}: ${result.error.message}`)
  return {
    table: record.table,
    operation: record.operation,
    effective_operation: preflight.effectiveOperation,
    on_conflict: record.on_conflict || null,
  }
}

export async function getBulkImports(limit = 20) {
  const supabase = await createClient()
  const result = await supabase
    .from('bulk_imports')
    .select('id, label, source_name, source_format, status, expected_items, staged_items, valid_items, invalid_items, applied_items, failed_items, metadata, created_at, updated_at, completed_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (result.error) throw new Error(`No se pudo cargar el historial de importaciones: ${result.error.message}`)
  return result.data || []
}

export async function getBulkImportDetail(importId) {
  const supabase = await createClient()
  const batchResult = await supabase
    .from('bulk_imports')
    .select('id, label, source_name, source_format, status, expected_items, staged_items, valid_items, invalid_items, applied_items, failed_items, metadata, created_at, updated_at, completed_at')
    .eq('id', importId)
    .maybeSingle()

  if (batchResult.error) throw new Error(`No se pudo cargar el lote: ${batchResult.error.message}`)
  if (!batchResult.data) return null

  const issuesResult = await supabase
    .from('bulk_import_items')
    .select('id, position, table_name, operation, status, validation_errors, error_text, record, updated_at')
    .eq('import_id', importId)
    .in('status', ['invalid', 'failed'])
    .order('position', { ascending: true })
    .limit(500)

  if (issuesResult.error) throw new Error(`No se pudieron cargar las incidencias del lote: ${issuesResult.error.message}`)
  return { batch: batchResult.data, issues: issuesResult.data || [] }
}
