'use server'

import { revalidatePath } from 'next/cache'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { bulkImportPriority, validateBulkImportRecord } from '@/lib/panel/bulk-import-config'
import { applyBulkImportRecord, refreshBulkImportCounts } from '@/lib/panel/bulk-import'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const SOURCE_FORMATS = new Set(['json', 'jsonl', 'csv'])
const ITEM_CHUNK_SIZE = 20

function assertImportId(importId) {
  const value = String(importId || '')
  if (!UUID_PATTERN.test(value)) throw new Error('Identificador de lote no válido.')
  return value
}

function assertResult(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function cleanText(value, maxLength = 180) {
  return String(value || '').trim().slice(0, maxLength)
}

function batchCounts(batch) {
  return {
    staged_items: batch.staged_items || 0,
    valid_items: batch.valid_items || 0,
    invalid_items: batch.invalid_items || 0,
    applied_items: batch.applied_items || 0,
    failed_items: batch.failed_items || 0,
    pending_valid_items: Math.max(0, (batch.valid_items || 0) - (batch.applied_items || 0) - (batch.failed_items || 0)),
  }
}

async function loadBatch(supabase, importId) {
  return assertResult(
    await supabase.from('bulk_imports').select('*').eq('id', importId).single(),
    'No se pudo cargar el lote',
  )
}

export async function createBulkImportAction(input) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const expectedItems = Number.parseInt(input?.expectedItems, 10)
  if (!Number.isInteger(expectedItems) || expectedItems < 1 || expectedItems > 250_000) {
    throw new Error('El lote debe contener entre 1 y 250.000 registros.')
  }

  const sourceFormat = cleanText(input?.sourceFormat, 16).toLowerCase()
  if (!SOURCE_FORMATS.has(sourceFormat)) throw new Error('Formato de importación no válido.')

  const label = cleanText(input?.label || input?.sourceName || 'Importación masiva')
  if (!label) throw new Error('El lote necesita un nombre.')

  const result = await supabase.from('bulk_imports').insert({
    label,
    source_name: cleanText(input?.sourceName, 220) || null,
    source_format: sourceFormat,
    expected_items: expectedItems,
    created_by: user.id,
    metadata: input?.metadata && typeof input.metadata === 'object' && !Array.isArray(input.metadata) ? input.metadata : {},
  }).select('*').single()

  const batch = assertResult(result, 'No se pudo crear el lote')
  revalidatePath('/panel/datos/importar')
  return batch
}

export async function appendBulkImportItemsAction(importIdInput, startPositionInput, inputRecords) {
  await requirePanelEditor()
  const supabase = await createClient()
  const importId = assertImportId(importIdInput)
  const startPosition = Number.parseInt(startPositionInput, 10)
  if (!Number.isInteger(startPosition) || startPosition < 0) throw new Error('Posición inicial de lote no válida.')
  if (!Array.isArray(inputRecords) || inputRecords.length < 1 || inputRecords.length > 75) throw new Error('Cada bloque debe contener entre 1 y 75 registros.')

  const batch = await loadBatch(supabase, importId)
  if (batch.status !== 'staging') throw new Error('Este lote ya no admite nuevos registros.')
  if (startPosition + inputRecords.length > batch.expected_items) throw new Error('El bloque supera el tamaño declarado del lote.')

  const now = new Date().toISOString()
  const rows = inputRecords.map((inputRecord, index) => {
    const validation = validateBulkImportRecord(inputRecord)
    const record = validation.record && typeof validation.record === 'object' && !Array.isArray(validation.record)
      ? validation.record
      : (inputRecord ?? {})
    const tableName = typeof record?.table === 'string' && record.table ? record.table : '__invalid__'
    const operation = record?.operation === 'upsert' ? 'upsert' : 'insert'

    return {
      import_id: importId,
      position: startPosition + index,
      table_name: tableName,
      operation,
      priority: bulkImportPriority(tableName),
      record,
      status: validation.errors.length ? 'invalid' : 'valid',
      validation_errors: validation.errors,
      error_text: null,
      result: null,
      applied_at: null,
      updated_at: now,
    }
  })

  assertResult(
    await supabase.from('bulk_import_items').upsert(rows, { onConflict: 'import_id,position' }),
    'No se pudo preparar el bloque',
  )

  return refreshBulkImportCounts(supabase, importId)
}

export async function finalizeBulkImportAction(importIdInput) {
  await requirePanelEditor()
  const supabase = await createClient()
  const importId = assertImportId(importIdInput)
  const batch = await loadBatch(supabase, importId)
  if (batch.status !== 'staging') return { id: importId, status: batch.status, counts: batchCounts(batch) }

  const counts = await refreshBulkImportCounts(supabase, importId)
  if (counts.staged_items !== batch.expected_items) {
    throw new Error(`El lote declara ${batch.expected_items} registros, pero se han preparado ${counts.staged_items}.`)
  }

  assertResult(
    await supabase.from('bulk_imports').update({ status: 'ready', updated_at: new Date().toISOString() }).eq('id', importId),
    'No se pudo cerrar la preparación del lote',
  )
  revalidatePath('/panel/datos/importar')
  return { id: importId, status: 'ready', counts }
}

export async function applyBulkImportChunkAction(importIdInput) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const importId = assertImportId(importIdInput)
  const batch = await loadBatch(supabase, importId)

  if (batch.status === 'completed' || batch.status === 'completed_with_errors') {
    return { id: importId, status: batch.status, done: true, counts: batchCounts(batch), processed: 0 }
  }
  if (!['ready', 'processing'].includes(batch.status)) throw new Error('El lote debe estar preparado antes de aplicarlo.')

  if (batch.status === 'ready') {
    assertResult(
      await supabase.from('bulk_imports').update({ status: 'processing', updated_at: new Date().toISOString() }).eq('id', importId),
      'No se pudo iniciar el lote',
    )
  }

  const queue = assertResult(
    await supabase
      .from('bulk_import_items')
      .select('id, position, record')
      .eq('import_id', importId)
      .eq('status', 'valid')
      .order('priority', { ascending: true })
      .order('position', { ascending: true })
      .limit(ITEM_CHUNK_SIZE),
    'No se pudo leer la cola del lote',
  ) || []

  const now = new Date().toISOString()
  for (const item of queue) {
    try {
      const result = await applyBulkImportRecord(supabase, item.record)
      assertResult(
        await supabase.from('bulk_import_items').update({ status: 'applied', result, error_text: null, applied_at: now, updated_at: now }).eq('id', item.id),
        `No se pudo confirmar el registro ${item.position + 1}`,
      )
    } catch (error) {
      assertResult(
        await supabase.from('bulk_import_items').update({ status: 'failed', error_text: error instanceof Error ? error.message : 'Error desconocido', updated_at: now }).eq('id', item.id),
        `No se pudo registrar el error del elemento ${item.position + 1}`,
      )
    }
  }

  const counts = await refreshBulkImportCounts(supabase, importId)
  let status = 'processing'
  let done = false

  if (counts.pending_valid_items === 0) {
    done = true
    status = counts.invalid_items || counts.failed_items ? 'completed_with_errors' : 'completed'
    const completedAt = new Date().toISOString()
    assertResult(
      await supabase.from('bulk_imports').update({ status, completed_at: completedAt, updated_at: completedAt }).eq('id', importId),
      'No se pudo cerrar la importación',
    )

    const { error: auditError } = await supabase.from('audit_log').insert({
      actor_user_id: user.id,
      actor_label: user.name,
      action_type: 'update',
      object_type: 'bulk_import',
      object_id: importId,
      summary: `Importación masiva finalizada: ${batch.label}`,
      changed_fields: counts,
    })
    if (auditError) console.error('[Hilo Cofrade] No se pudo auditar la importación masiva', auditError)
  }

  revalidatePath('/panel/datos/importar')
  revalidatePath('/panel/datos')
  revalidatePath('/panel')
  revalidatePath('/')
  return { id: importId, status, done, counts, processed: queue.length }
}

export async function retryBulkImportFailuresAction(importIdInput) {
  await requirePanelEditor()
  const supabase = await createClient()
  const importId = assertImportId(importIdInput)
  const batch = await loadBatch(supabase, importId)
  if (!batch.failed_items) return { id: importId, status: batch.status, counts: batchCounts(batch) }
  if (!['ready', 'processing', 'completed_with_errors'].includes(batch.status)) throw new Error('Este lote no admite reintentos en su estado actual.')

  const now = new Date().toISOString()
  assertResult(
    await supabase
      .from('bulk_import_items')
      .update({ status: 'valid', error_text: null, result: null, applied_at: null, updated_at: now })
      .eq('import_id', importId)
      .eq('status', 'failed'),
    'No se pudieron reactivar los registros fallidos',
  )

  const counts = await refreshBulkImportCounts(supabase, importId)
  assertResult(
    await supabase.from('bulk_imports').update({ status: 'ready', completed_at: null, updated_at: now }).eq('id', importId),
    'No se pudo reabrir el lote',
  )
  revalidatePath('/panel/datos/importar')
  revalidatePath(`/panel/datos/importar/${importId}`)
  return { id: importId, status: 'ready', counts }
}
