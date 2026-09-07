'use server'

import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { buildHealthImportProposal } from '@/lib/panel/data-health-import'
import {
  appendBulkImportItemsAction,
  cancelBulkImportAction,
  createBulkImportAction,
  finalizeBulkImportAction,
} from '../importar/actions'

const SPECIALIZED_TABLES = {
  brotherhood: 'brotherhoods',
  step: 'steps',
}

export async function prepareHealthImportProposalAction(formData) {
  await requirePanelEditor()
  const entityId = String(formData.get('entity_id') || '').trim()
  const expectedType = String(formData.get('entity_type') || '').trim()
  const table = SPECIALIZED_TABLES[expectedType]
  if (!table || !entityId) throw new Error('Esta incidencia no admite una propuesta automática segura.')

  const supabase = await createClient()
  const entityResult = await supabase
    .from('entities')
    .select('id, entity_type, name, status')
    .eq('id', entityId)
    .eq('entity_type', expectedType)
    .eq('status', 'published')
    .maybeSingle()
  if (entityResult.error) throw new Error(`No se pudo comprobar la entidad: ${entityResult.error.message}`)
  if (!entityResult.data) throw new Error('La entidad ya no coincide con la incidencia detectada.')

  const existing = await supabase.from(table).select('entity_id').eq('entity_id', entityId).maybeSingle()
  if (existing.error) throw new Error(`No se pudo comprobar la ficha especializada: ${existing.error.message}`)
  if (existing.data) throw new Error('La incidencia ya está resuelta: la ficha especializada existe.')

  const proposal = buildHealthImportProposal(entityResult.data)
  if (!proposal?.records?.length) throw new Error('No existe una propuesta determinista para esta incidencia.')

  const batch = await createBulkImportAction({
    label: proposal.label,
    sourceName: 'Salud del grafo',
    sourceFormat: 'json',
    expectedItems: proposal.records.length,
    metadata: {
      origin: 'data-health',
      health_issue: 'reference-node',
      entity_id: entityId,
      entity_type: expectedType,
      proposal_mode: 'deterministic',
    },
  })

  try {
    await appendBulkImportItemsAction(batch.id, 0, proposal.records)
    await finalizeBulkImportAction(batch.id)
  } catch (error) {
    try {
      await cancelBulkImportAction(batch.id, 'Propuesta de Salud interrumpida antes de completar el staging.')
    } catch (cancelError) {
      console.error('[Hilo Cofrade] No se pudo autocancelar la propuesta de Salud', cancelError)
    }
    throw error
  }

  redirect(`/panel/datos/importar/${batch.id}`)
}
