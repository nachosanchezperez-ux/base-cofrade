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

async function stageProposal({ label, records, metadata }) {
  const batch = await createBulkImportAction({
    label,
    sourceName: 'Salud del grafo',
    sourceFormat: 'json',
    expectedItems: records.length,
    metadata,
  })

  try {
    await appendBulkImportItemsAction(batch.id, 0, records)
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

  await stageProposal({
    label: proposal.label,
    records: proposal.records,
    metadata: {
      origin: 'data-health',
      health_issue: 'reference-node',
      entity_id: entityId,
      entity_type: expectedType,
      proposal_mode: 'deterministic',
    },
  })
}

export async function prepareSourceReuseProposalAction(formData) {
  await requirePanelEditor()
  const entityId = String(formData.get('entity_id') || '').trim()
  const expectedType = String(formData.get('entity_type') || '').trim()
  const sourceId = String(formData.get('source_id') || '').trim()
  if (!entityId || !expectedType || !sourceId) throw new Error('Selecciona una Fuente existente para reutilizar.')

  const supabase = await createClient()
  const [entityResult, directResult, candidateResult, sourceResult] = await Promise.all([
    supabase.from('entities').select('id, entity_type, name, status').eq('id', entityId).eq('entity_type', expectedType).eq('status', 'published').maybeSingle(),
    supabase.from('source_links').select('id').eq('entity_id', entityId).not('scope', 'like', 'relation:%').limit(1),
    supabase.from('source_links').select('id, source_id, scope').eq('entity_id', entityId).eq('source_id', sourceId).like('scope', 'relation:%').limit(1),
    supabase.from('sources').select('id, name, url, source_type').eq('id', sourceId).maybeSingle(),
  ])

  if (entityResult.error) throw new Error(`No se pudo comprobar la entidad: ${entityResult.error.message}`)
  if (!entityResult.data) throw new Error('La entidad ya no coincide con la incidencia detectada.')
  if (directResult.error) throw new Error(`No se pudo comprobar la documentación directa: ${directResult.error.message}`)
  if ((directResult.data || []).length) throw new Error('La incidencia ya está resuelta: la entidad ya tiene una Fuente directa.')
  if (candidateResult.error) throw new Error(`No se pudo verificar la Fuente candidata: ${candidateResult.error.message}`)
  if (!(candidateResult.data || []).length) throw new Error('La Fuente seleccionada ya no está vinculada a una relación de esta entidad.')
  if (sourceResult.error) throw new Error(`No se pudo cargar la Fuente: ${sourceResult.error.message}`)
  if (!sourceResult.data) throw new Error('La Fuente seleccionada ya no existe.')

  const records = [{
    table: 'source_links',
    operation: 'insert',
    data: {
      source_id: sourceId,
      entity_id: entityId,
      scope: 'entity',
      notes: 'Fuente existente reutilizada desde Salud del grafo; requiere revisión editorial antes de Apply.',
    },
  }]

  await stageProposal({
    label: `Reutilizar Fuente · ${entityResult.data.name}`,
    records,
    metadata: {
      origin: 'data-health',
      health_issue: 'missing-source',
      entity_id: entityId,
      entity_type: expectedType,
      source_id: sourceId,
      source_name: sourceResult.data.name,
      proposal_mode: 'assisted-reuse',
    },
  })
}
