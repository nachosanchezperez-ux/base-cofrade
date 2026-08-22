import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { validateBulkImportRecord } from '@/lib/panel/bulk-import-config'

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
  let query = supabase.from(ref.table).select(selectedColumn).limit(2)

  for (const [column, expected] of Object.entries(ref.match)) {
    query = expected === null ? query.is(column, null) : query.eq(column, expected)
  }

  const result = await query
  if (result.error) throw new Error(`No se pudo resolver ${targetColumn}: ${result.error.message}`)
  if (!result.data?.length) throw new Error(`No se pudo resolver ${targetColumn} en ${ref.table}.`)
  if (result.data.length > 1) throw new Error(`La referencia ${targetColumn} no es unívoca en ${ref.table}.`)

  const value = result.data[0]?.[selectedColumn]
  if (value == null) throw new Error(`La referencia ${targetColumn} no contiene ${selectedColumn}.`)
  return value
}

export async function applyBulkImportRecord(supabase, input) {
  const { record, errors } = validateBulkImportRecord(input)
  if (errors.length) throw new Error(errors.join(' '))

  const payload = { ...record.data }
  for (const [targetColumn, ref] of Object.entries(record.refs || {})) {
    payload[targetColumn] = await resolveReference(supabase, targetColumn, ref)
  }

  const options = record.on_conflict ? { onConflict: record.on_conflict } : undefined
  const result = record.operation === 'upsert'
    ? await supabase.from(record.table).upsert(payload, options)
    : await supabase.from(record.table).insert(payload)

  if (result.error) throw new Error(`${record.table}: ${result.error.message}`)
  return { table: record.table, operation: record.operation, on_conflict: record.on_conflict || null }
}

export async function getBulkImports(limit = 20) {
  const supabase = await createClient()
  const result = await supabase
    .from('bulk_imports')
    .select('id, label, source_name, source_format, status, expected_items, staged_items, valid_items, invalid_items, applied_items, failed_items, created_at, updated_at, completed_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (result.error) throw new Error(`No se pudo cargar el historial de importaciones: ${result.error.message}`)
  return result.data || []
}
