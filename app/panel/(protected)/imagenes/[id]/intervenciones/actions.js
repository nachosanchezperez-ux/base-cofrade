'use server'

import { revalidatePath } from 'next/cache'
import { PUBLIC_CACHE_TAGS, revalidatePublicData } from '@/lib/cache/public-cache'
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
const EDITABLE_STATUSES = new Set(['draft', 'review', 'published'])

function optionalUuid(formData, name) {
  const candidate = formValue(formData, name)
  if (!candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function editableStatus(formData) {
  const candidate = formValue(formData, 'status') || 'draft'
  if (!EDITABLE_STATUSES.has(candidate)) throw new Error('El estado editorial no es válido.')
  return candidate
}

function refresh(imageId) {
  revalidatePath(`/panel/imagenes/${imageId}`)
  revalidatePath(`/panel/imagenes/${imageId}/intervenciones`)
  revalidatePublicData(PUBLIC_CACHE_TAGS.IMAGES)
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

function validatePublication(requestedStatus, image, agent) {
  if (requestedStatus !== 'published') return
  if (image.status !== 'published') {
    throw new Error('La Imagen debe estar publicada antes de publicar la intervención.')
  }
  if (agent && agent.status !== 'published') {
    throw new Error('El Agente debe estar publicado antes de asociarlo a una intervención publicada.')
  }
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

  validatePublication(requestedStatus, image, agent)

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

export async function updateImageInterventionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuidValue(formData, 'image_id')
  const interventionId = uuidValue(formData, 'intervention_id')
  const agentId = optionalUuid(formData, 'agent_entity_id')
  const discipline = requiredValue(formData, 'discipline', 'La disciplina')
  const requestedStatus = editableStatus(formData)

  const intervention = assertRow(
    await supabase
      .from('heritage_interventions')
      .select('id, target_entity_id, agent_entity_id, discipline, intervention_type, date_from_text, date_to_text, description, status')
      .eq('id', interventionId)
      .eq('target_entity_id', imageId)
      .maybeSingle(),
    'La intervención no existe o no pertenece a esta Imagen.'
  )

  const [image, agent] = await Promise.all([
    loadImage(supabase, imageId),
    loadAgent(supabase, agentId),
  ])

  validatePublication(requestedStatus, image, agent)

  const payload = {
    agent_entity_id: agent?.id || null,
    discipline,
    intervention_type: formValue(formData, 'intervention_type') || null,
    date_from_text: formValue(formData, 'date_from_text') || null,
    date_to_text: formValue(formData, 'date_to_text') || null,
    description: formValue(formData, 'description') || null,
    status: requestedStatus,
  }

  assertRow(
    await supabase
      .from('heritage_interventions')
      .update(payload)
      .eq('id', intervention.id)
      .eq('target_entity_id', imageId)
      .select('id')
      .single(),
    'No se pudo actualizar la intervención'
  )

  await writeAudit(supabase, user, {
    action_type: 'update',
    object_type: 'heritage_intervention',
    object_id: intervention.id,
    entity_id: image.id,
    summary: `Intervención actualizada en ${image.name}${agent ? ` · ${agent.name}` : ' · responsable desconocido'}`,
    changed_fields: {
      previous: {
        agent_entity_id: intervention.agent_entity_id,
        discipline: intervention.discipline,
        intervention_type: intervention.intervention_type,
        date_from_text: intervention.date_from_text,
        date_to_text: intervention.date_to_text,
        description: intervention.description,
        status: intervention.status,
      },
      next: payload,
    },
  }, 'la intervención')

  refresh(image.id)
  redirect(`/panel/imagenes/${image.id}/intervenciones?saved=updated`)
}
