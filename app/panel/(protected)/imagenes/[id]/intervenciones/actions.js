'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import {
  assertRow,
  formValue,
  requiredValue,
  uuidValue,
  writeAudit,
} from '@/lib/panel/relation-actions'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function optionalUuid(formData, name) {
  const candidate = formValue(formData, name)
  if (!candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function refresh(imageId) {
  revalidatePath(`/panel/imagenes/${imageId}`)
  revalidatePath(`/panel/imagenes/${imageId}/intervenciones`)
}

async function loadImage(supabase, imageId) {
  return assertRow(
    await supabase
      .from('entities')
      .select('id, name, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .maybeSingle(),
    'La Imagen no existe.'
  )
}

async function loadAgent(supabase, agentId) {
  if (!agentId) return null
  return assertRow(
    await supabase
      .from('entities')
      .select('id, name, status')
      .eq('id', agentId)
      .eq('entity_type', 'agent')
      .maybeSingle(),
    'El Agente seleccionado no existe.'
  )
}

export async function createImageInterventionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuidValue(formData, 'image_id')
  const agentId = optionalUuid(formData, 'agent_entity_id')
  const discipline = requiredValue(formData, 'discipline', 'La disciplina')
  const requestedStatus = formValue(formData, 'status') === 'published' ? 'published' : 'draft'

  const [image, agent] = await Promise.all([
    loadImage(supabase, imageId),
    loadAgent(supabase, agentId),
  ])

  if (requestedStatus === 'published') {
    if (image.status !== 'published') {
      throw new Error('La Imagen debe estar publicada antes de publicar la intervención.')
    }
    if (agent && agent.status !== 'published') {
      throw new Error('El Agente debe estar publicado antes de asociarlo a una intervención publicada.')
    }
  }

  const payload = {
    target_entity_id: image.id,
    agent_entity_id: agent?.id || null,
    discipline,
    intervention_type: formValue(formData, 'intervention_type') || null,
    date_from_text: formValue(formData, 'date_from_text') || null,
    date_to_text: formValue(formData, 'date_to_text') || null,
    description: formValue(formData, 'description') || null,
    status: requestedStatus,
  }

  const intervention = assertRow(
    await supabase
      .from('heritage_interventions')
      .insert(payload)
      .select('id')
      .single(),
    'No se pudo crear la intervención'
  )

  await writeAudit(supabase, user, {
    action_type: 'create',
    object_type: 'heritage_intervention',
    object_id: intervention.id,
    entity_id: image.id,
    summary: `Intervención documentada en ${image.name}${agent ? ` · ${agent.name}` : ' · responsable desconocido'}`,
    changed_fields: payload,
  }, 'la intervención')

  refresh(image.id)
  redirect(`/panel/imagenes/${image.id}/intervenciones?saved=created`)
}

export async function updateInterventionAgentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuidValue(formData, 'image_id')
  const interventionId = uuidValue(formData, 'intervention_id')
  const agentId = optionalUuid(formData, 'agent_entity_id')

  const intervention = assertRow(
    await supabase
      .from('heritage_interventions')
      .select('id, target_entity_id, agent_entity_id, status')
      .eq('id', interventionId)
      .eq('target_entity_id', imageId)
      .maybeSingle(),
    'La intervención no existe o no pertenece a esta Imagen.'
  )
  const agent = await loadAgent(supabase, agentId)

  if (intervention.status === 'published' && agent && agent.status !== 'published') {
    throw new Error('Una intervención publicada solo puede asociarse a un Agente publicado.')
  }

  assertRow(
    await supabase
      .from('heritage_interventions')
      .update({ agent_entity_id: agent?.id || null })
      .eq('id', intervention.id)
      .select('id')
      .single(),
    'No se pudo actualizar el responsable de la intervención'
  )

  await writeAudit(supabase, user, {
    action_type: 'update',
    object_type: 'heritage_intervention',
    object_id: intervention.id,
    entity_id: imageId,
    summary: agent
      ? `Responsable identificado para intervención: ${agent.name}`
      : 'Responsable de intervención marcado como desconocido',
    changed_fields: {
      agent_entity_id: agent?.id || null,
      previous_agent_entity_id: intervention.agent_entity_id,
    },
  }, 'la intervención')

  refresh(imageId)
  redirect(`/panel/imagenes/${imageId}/intervenciones?saved=agent`)
}
