import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  applyBulkImportRecord,
  preflightBulkImportRecord,
} from '@/lib/panel/bulk-import-preflight'

export { applyBulkImportRecord, preflightBulkImportRecord } from '@/lib/panel/bulk-import-preflight'

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

  const itemsResult = await supabase
    .from('bulk_import_items')
    .select('id, position, table_name, operation, status, validation_errors, error_text, record, result, updated_at')
    .eq('import_id', importId)
    .order('position', { ascending: true })
    .limit(500)

  if (itemsResult.error) throw new Error(`No se pudo cargar el plan del lote: ${itemsResult.error.message}`)
  const items = itemsResult.data || []
  return { batch: batchResult.data, items, issues: items.filter((item) => ['invalid', 'failed'].includes(item.status)) }
}
