'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import {
  assertRow,
  assertRows,
  formValue,
  optionalDate,
  relationalStatus,
  requiredValue,
  uuidValue,
  validateDateOrder,
  writeAudit,
} from '@/lib/panel/relation-actions'

const AUTHORSHIP_TYPES = new Set([
  'author',
  'attributed_to',
  'workshop_of',
  'circle_of',
  'school_of',
])
const CERTAINTIES = new Set(['documented', 'attributed', 'traditional', 'unknown'])

function authorshipType(formData) {
  const candidate = formValue(formData, 'authorship_type') || 'author'
  if (!AUTHORSHIP_TYPES.has(candidate)) throw new Error('El tipo de autoría no es válido.')
  return candidate
}

function certainty(formData, type) {
  const candidate = formValue(formData, 'certainty')
    || (type === 'author' ? 'documented' : 'attributed')
  if (!CERTAINTIES.has(candidate)) throw new Error('El grado de certeza no es válido.')
  if (type === 'author' && candidate !== 'documented') {
    throw new Error('Una autoría no documentada debe registrarse como atribución, taller, círculo o escuela.')
  }
  return candidate
}

function roleName(formData) {
  const candidate = requiredValue(formData, 'role_name', 'El rol')
  if (candidate.length > 120) throw new Error('El rol es demasiado largo.')
  return candidate
}

async function loadEndpoints(supabase, imageId, agentId) {
  const [imageResult, agentResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .maybeSingle(),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', agentId)
      .eq('entity_type', 'agent')
      .maybeSingle(),
  ])

  return {
    image: assertRow(imageResult, 'La Imagen no existe o no está disponible.'),
    agent: assertRow(agentResult, 'El Agente seleccionado no existe o no está disponible.'),
  }
}

async function findEquivalent(supabase, {
  imageId,
  agentId,
  type,
  role,
  excludeId = null,
}) {
  let query = supabase
    .from('image_authorships')
    .select('id, status')
    .eq('image_entity_id', imageId)
    .eq('agent_entity_id', agentId)
    .eq('authorship_type', type)
    .eq('role_name', role)

  if (excludeId) query = query.neq('id', excludeId)
  const rows = assertRows(await query, 'No se pudieron comprobar las autorías existentes')
  return rows[0] || null
}

async function refreshRelation(supabase, imageId, agentId) {
  const imageResult = await supabase.from('entities').select('slug').eq('id', imageId).maybeSingle()

  revalidatePath('/panel')
  revalidatePath('/panel/imagenes')
  revalidatePath(`/panel/imagenes/${imageId}`)
  revalidatePath(`/panel/imagenes/${imageId}/autorias`)
  revalidatePath('/panel/agentes')
  revalidatePath(`/panel/agentes/${agentId}`)
  revalidatePath('/imagenes')
  if (imageResult.data?.slug) revalidatePath(`/imagenes/${imageResult.data.slug}`)
}

function redirectSaved(imageId, result) {
  redirect(`/panel/imagenes/${imageId}/autorias?saved=${result}`)
}

export async function addImageAuthorshipAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuidValue(formData, 'image_id')
  const agentId = uuidValue(formData, 'agent_entity_id')
  const type = authorshipType(formData)
  const role = roleName(formData)
  const certaintyValue = certainty(formData, type)
  const dateFrom = optionalDate(formData, 'date_from', 'La fecha inicial')
  const dateTo = optionalDate(formData, 'date_to', 'La fecha final')
  validateDateOrder(dateFrom, dateTo)

  const { image, agent } = await loadEndpoints(supabase, imageId, agentId)
  const equivalent = await findEquivalent(supabase, {
    imageId,
    agentId,
    type,
    role,
  })
  if (equivalent && equivalent.status !== 'archived') {
    throw new Error('Ya existe una autoría o atribución equivalente para esta Imagen.')
  }

  const payload = {
    image_entity_id: imageId,
    agent_entity_id: agentId,
    authorship_type: type,
    role_name: role,
    certainty: certaintyValue,
    date_from: dateFrom,
    date_to: dateTo,
    status: relationalStatus(image, agent),
  }
  const saved = equivalent
    ? assertRow(
        await supabase
          .from('image_authorships')
          .update(payload)
          .eq('id', equivalent.id)
          .select('id')
          .single(),
        'No se pudo restaurar la autoría'
      )
    : assertRow(
        await supabase
          .from('image_authorships')
          .insert(payload)
          .select('id')
          .single(),
        'No se pudo crear la autoría'
      )

  await writeAudit(supabase, user, {
    action_type: 'link',
    object_type: 'image_authorship',
    object_id: saved.id,
    entity_id: imageId,
    summary: `${type === 'author' ? 'Autoría' : 'Atribución'} vinculada: ${agent.name} → ${image.name}`,
    changed_fields: payload,
  }, 'la autoría de la Imagen')
  await refreshRelation(supabase, imageId, agentId)
  redirectSaved(imageId, equivalent ? 'restored' : 'linked')
}

export async function updateImageAuthorshipAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuidValue(formData, 'image_id')
  const relationId = uuidValue(formData, 'relation_id')
  const type = authorshipType(formData)
  const role = roleName(formData)
  const certaintyValue = certainty(formData, type)
  const dateFrom = optionalDate(formData, 'date_from', 'La fecha inicial')
  const dateTo = optionalDate(formData, 'date_to', 'La fecha final')
  validateDateOrder(dateFrom, dateTo)

  const relation = assertRow(
    await supabase
      .from('image_authorships')
      .select('id, agent_entity_id, status')
      .eq('id', relationId)
      .eq('image_entity_id', imageId)
      .maybeSingle(),
    'La autoría no existe o no pertenece a esta Imagen.'
  )
  if (relation.status === 'archived') throw new Error('Una autoría retirada no puede modificarse.')

  const { image, agent } = await loadEndpoints(supabase, imageId, relation.agent_entity_id)
  const equivalent = await findEquivalent(supabase, {
    imageId,
    agentId: relation.agent_entity_id,
    type,
    role,
    excludeId: relationId,
  })
  if (equivalent) throw new Error('Ya existe otra autoría equivalente para esta Imagen y Agente.')

  const payload = {
    authorship_type: type,
    role_name: role,
    certainty: certaintyValue,
    date_from: dateFrom,
    date_to: dateTo,
    status: relation.status === 'review' ? 'review' : relationalStatus(image, agent),
  }
  assertRow(
    await supabase
      .from('image_authorships')
      .update(payload)
      .eq('id', relationId)
      .select('id')
      .single(),
    'No se pudo actualizar la autoría'
  )

  await writeAudit(supabase, user, {
    action_type: 'update',
    object_type: 'image_authorship',
    object_id: relationId,
    entity_id: imageId,
    summary: `Autoría actualizada: ${agent.name} → ${image.name}`,
    changed_fields: payload,
  }, 'la autoría de la Imagen')
  await refreshRelation(supabase, imageId, relation.agent_entity_id)
  redirectSaved(imageId, dateTo ? 'closed' : 'updated')
}

export async function archiveImageAuthorshipAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuidValue(formData, 'image_id')
  const relationId = uuidValue(formData, 'relation_id')

  const relation = assertRow(
    await supabase
      .from('image_authorships')
      .select('id, agent_entity_id, authorship_type, status')
      .eq('id', relationId)
      .eq('image_entity_id', imageId)
      .maybeSingle(),
    'La autoría no existe o no pertenece a esta Imagen.'
  )

  if (relation.status !== 'archived') {
    assertRow(
      await supabase
        .from('image_authorships')
        .update({ status: 'archived' })
        .eq('id', relationId)
        .select('id')
        .single(),
      'No se pudo retirar la autoría'
    )

    await writeAudit(supabase, user, {
      action_type: 'unlink',
      object_type: 'image_authorship',
      object_id: relationId,
      entity_id: imageId,
      summary: `Autoría retirada sin borrar la Imagen ni el Agente · ${relation.authorship_type}`,
      changed_fields: { status: 'archived' },
    }, 'la autoría de la Imagen')
  }

  await refreshRelation(supabase, imageId, relation.agent_entity_id)
  redirectSaved(imageId, 'archived')
}
