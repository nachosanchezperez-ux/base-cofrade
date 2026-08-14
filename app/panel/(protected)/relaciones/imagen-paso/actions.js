'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import {
  assertRow,
  assertRows,
  normalizedToken,
  optionalDate,
  relationalStatus,
  uuidValue,
  validateDateOrder,
  writeAudit,
} from '@/lib/panel/relation-actions'

async function loadEndpoints(supabase, imageId, stepId) {
  const [imageResult, stepResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .maybeSingle(),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', stepId)
      .eq('entity_type', 'step')
      .maybeSingle(),
  ])

  return {
    image: assertRow(imageResult, 'La Imagen seleccionada no existe o no está disponible.'),
    step: assertRow(stepResult, 'El Paso seleccionado no existe o no está disponible.'),
  }
}

async function relationConflicts(supabase, {
  imageId,
  stepId,
  relationType,
  dateFrom,
  dateTo,
  excludeId = null,
}) {
  let query = supabase
    .from('image_steps')
    .select('id, date_from, date_to, status')
    .eq('image_entity_id', imageId)
    .eq('step_entity_id', stepId)
    .eq('relation_type', relationType)

  if (excludeId) query = query.neq('id', excludeId)
  const existing = assertRows(await query, 'No se pudieron comprobar las relaciones existentes')
  const sameStart = existing.find((item) => (item.date_from || null) === (dateFrom || null))
  const openActive = existing.find((item) => item.status !== 'archived' && !item.date_to)

  if (!excludeId && sameStart?.status === 'archived') return { restorable: sameStart }
  if (sameStart) throw new Error('La Imagen y el Paso ya tienen una relación equivalente.')
  if (!dateTo && openActive) throw new Error('Ya existe una relación abierta del mismo tipo entre la Imagen y el Paso.')
  return { restorable: null }
}

async function refreshRelation(supabase, imageId, stepId) {
  const [imageResult, stepResult] = await Promise.all([
    supabase.from('entities').select('slug').eq('id', imageId).maybeSingle(),
    supabase.from('entities').select('slug').eq('id', stepId).maybeSingle(),
  ])

  revalidatePath('/panel')
  revalidatePath('/panel/relaciones')
  revalidatePath('/panel/relaciones/imagen-paso')
  revalidatePath('/panel/imagenes')
  revalidatePath(`/panel/imagenes/${imageId}`)
  revalidatePath('/panel/pasos')
  revalidatePath(`/panel/pasos/${stepId}`)
  revalidatePath('/imagenes')
  revalidatePath('/pasos')
  if (imageResult.data?.slug) revalidatePath(`/imagenes/${imageResult.data.slug}`)
  if (stepResult.data?.slug) revalidatePath(`/pasos/${stepResult.data.slug}`)
}

function redirectSaved(result) {
  redirect(`/panel/relaciones/imagen-paso?saved=${result}`)
}

export async function addImageStepRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuidValue(formData, 'image_entity_id')
  const stepId = uuidValue(formData, 'step_entity_id')
  const relationType = normalizedToken(formData, 'relation_type', {
    fallback: 'processes_on',
    label: 'El tipo de relación',
  })
  const dateFrom = optionalDate(formData, 'date_from', 'La fecha inicial')
  const dateTo = optionalDate(formData, 'date_to', 'La fecha final')
  validateDateOrder(dateFrom, dateTo)

  const { image, step } = await loadEndpoints(supabase, imageId, stepId)
  const { restorable } = await relationConflicts(supabase, {
    imageId,
    stepId,
    relationType,
    dateFrom,
    dateTo,
  })
  const payload = {
    image_entity_id: imageId,
    step_entity_id: stepId,
    relation_type: relationType,
    date_from: dateFrom,
    date_to: dateTo,
    status: relationalStatus(image, step),
  }

  const saved = restorable
    ? assertRow(
        await supabase
          .from('image_steps')
          .update(payload)
          .eq('id', restorable.id)
          .select('id')
          .single(),
        'No se pudo restaurar la relación Imagen-Paso'
      )
    : assertRow(
        await supabase
          .from('image_steps')
          .insert(payload)
          .select('id')
          .single(),
        'No se pudo crear la relación Imagen-Paso'
      )

  await writeAudit(supabase, user, {
    action_type: 'link',
    object_type: 'image_step',
    object_id: saved.id,
    entity_id: imageId,
    summary: `Imagen relacionada con Paso: ${image.name} → ${step.name}`,
    changed_fields: payload,
  }, 'la relación Imagen-Paso')
  await refreshRelation(supabase, imageId, stepId)
  redirectSaved(restorable ? 'restored' : 'linked')
}

export async function updateImageStepRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const relationId = uuidValue(formData, 'relation_id')
  const relationType = normalizedToken(formData, 'relation_type', {
    fallback: 'processes_on',
    label: 'El tipo de relación',
  })
  const dateFrom = optionalDate(formData, 'date_from', 'La fecha inicial')
  const dateTo = optionalDate(formData, 'date_to', 'La fecha final')
  validateDateOrder(dateFrom, dateTo)

  const relation = assertRow(
    await supabase
      .from('image_steps')
      .select('id, image_entity_id, step_entity_id, status')
      .eq('id', relationId)
      .maybeSingle(),
    'La relación Imagen-Paso no existe.'
  )
  if (relation.status === 'archived') throw new Error('Una relación retirada no puede modificarse.')

  const { image, step } = await loadEndpoints(supabase, relation.image_entity_id, relation.step_entity_id)
  await relationConflicts(supabase, {
    imageId: relation.image_entity_id,
    stepId: relation.step_entity_id,
    relationType,
    dateFrom,
    dateTo,
    excludeId: relationId,
  })

  const payload = {
    relation_type: relationType,
    date_from: dateFrom,
    date_to: dateTo,
    status: relation.status === 'review' ? 'review' : relationalStatus(image, step),
  }
  assertRow(
    await supabase
      .from('image_steps')
      .update(payload)
      .eq('id', relationId)
      .select('id')
      .single(),
    'No se pudo actualizar la relación Imagen-Paso'
  )

  await writeAudit(supabase, user, {
    action_type: 'update',
    object_type: 'image_step',
    object_id: relationId,
    entity_id: relation.image_entity_id,
    summary: `Relación Imagen-Paso actualizada: ${image.name} → ${step.name}`,
    changed_fields: payload,
  }, 'la relación Imagen-Paso')
  await refreshRelation(supabase, relation.image_entity_id, relation.step_entity_id)
  redirectSaved(dateTo ? 'closed' : 'updated')
}

export async function archiveImageStepRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const relationId = uuidValue(formData, 'relation_id')

  const relation = assertRow(
    await supabase
      .from('image_steps')
      .select('id, image_entity_id, step_entity_id, relation_type, status')
      .eq('id', relationId)
      .maybeSingle(),
    'La relación Imagen-Paso no existe.'
  )

  if (relation.status !== 'archived') {
    assertRow(
      await supabase
        .from('image_steps')
        .update({ status: 'archived' })
        .eq('id', relationId)
        .select('id')
        .single(),
      'No se pudo retirar la relación Imagen-Paso'
    )

    await writeAudit(supabase, user, {
      action_type: 'unlink',
      object_type: 'image_step',
      object_id: relationId,
      entity_id: relation.image_entity_id,
      summary: `Relación Imagen-Paso retirada sin borrar entidades · ${relation.relation_type}`,
      changed_fields: { status: 'archived' },
    }, 'la relación Imagen-Paso')
  }

  await refreshRelation(supabase, relation.image_entity_id, relation.step_entity_id)
  redirectSaved('archived')
}
