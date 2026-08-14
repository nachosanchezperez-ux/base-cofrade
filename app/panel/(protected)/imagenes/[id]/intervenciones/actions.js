'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function value(formData, name) { return String(formData.get(name) || '').trim() }
function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}
function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la intervención', error)
}

function refresh(imageId) {
  revalidatePath(`/panel/imagenes/${imageId}`)
  revalidatePath(`/panel/imagenes/${imageId}/intervenciones`)
  revalidatePath('/panel/fuentes')
}

export async function createImageInterventionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuid(formData, 'image_id')
  const agentRaw = value(formData, 'agent_entity_id')
  if (agentRaw && !UUID_PATTERN.test(agentRaw)) throw new Error('El Agente seleccionado no es válido.')
  const discipline = value(formData, 'discipline')
  if (!discipline) throw new Error('La disciplina es obligatoria.')

  const image = assertRow(
    await supabase.from('entities').select('id, name, status').eq('id', imageId).eq('entity_type', 'image').maybeSingle(),
    'La Imagen no existe.'
  )
  let agent = null
  if (agentRaw) {
    agent = assertRow(
      await supabase.from('entities').select('id, name, status').eq('id', agentRaw).eq('entity_type', 'agent').maybeSingle(),
      'El Agente no existe.'
    )
  }

  const requestedStatus = value(formData, 'status') === 'published' ? 'published' : 'draft'
  if (requestedStatus === 'published') {
    if (user.role !== 'admin') throw new Error('Solo un administrador puede publicar una intervención.')
    if (image.status !== 'published') throw new Error('La Imagen debe estar publicada antes de publicar la intervención.')
    if (agent && agent.status !== 'published') throw new Error('El Agente debe estar publicado antes de publicar la intervención.')
  }

  const payload = {
    target_entity_id: image.id,
    agent_entity_id: agent?.id || null,
    discipline,
    element_name: value(formData, 'element_name') || null,
    intervention_type: value(formData, 'intervention_type') || null,
    phase: value(formData, 'phase') || null,
    date_from_text: value(formData, 'date_from_text') || null,
    date_to_text: value(formData, 'date_to_text') || null,
    description: value(formData, 'description') || null,
    status: requestedStatus,
  }
  const created = assertRow(
    await supabase.from('heritage_interventions').insert(payload).select('id').single(),
    'No se pudo crear la intervención'
  )

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'heritage_intervention',
    object_id: created.id,
    entity_id: image.id,
    summary: `Intervención documentada en ${image.name}${agent ? ` · ${agent.name}` : ' · responsable no identificado'}`,
    changed_fields: payload,
  })

  refresh(image.id)
  redirect(`/panel/imagenes/${image.id}/intervenciones?saved=created`)
}

export async function archiveImageInterventionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuid(formData, 'image_id')
  const interventionId = uuid(formData, 'intervention_id')
  const current = assertRow(
    await supabase
      .from('heritage_interventions')
      .select('id, target_entity_id, status')
      .eq('id', interventionId)
      .eq('target_entity_id', imageId)
      .maybeSingle(),
    'La intervención ya no existe.'
  )
  if (current.status === 'published' && user.role !== 'admin') throw new Error('Solo un administrador puede archivar una intervención publicada.')

  assertRow(
    await supabase.from('heritage_interventions').update({ status: 'archived' }).eq('id', current.id).select('id').single(),
    'No se pudo archivar la intervención'
  )
  await audit(supabase, user, {
    action_type: 'archive',
    object_type: 'heritage_intervention',
    object_id: current.id,
    entity_id: imageId,
    summary: 'Intervención archivada',
    changed_fields: { status: 'archived' },
  })

  refresh(imageId)
  redirect(`/panel/imagenes/${imageId}/intervenciones?saved=archived`)
}
