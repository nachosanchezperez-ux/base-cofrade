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

async function loadEndpoints(supabase, brotherhoodId, stepId) {
  const [brotherhoodResult, stepResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .maybeSingle(),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', stepId)
      .eq('entity_type', 'step')
      .maybeSingle(),
  ])

  return {
    brotherhood: assertRow(brotherhoodResult, 'La Hermandad no existe o no está disponible.'),
    step: assertRow(stepResult, 'El Paso seleccionado no existe o no está disponible.'),
  }
}

async function relationConflicts(supabase, {
  brotherhoodId,
  stepId,
  relationType,
  dateFrom,
  dateTo,
  excludeId = null,
}) {
  let query = supabase
    .from('brotherhood_steps')
    .select('id, date_from, date_to, status')
    .eq('brotherhood_entity_id', brotherhoodId)
    .eq('step_entity_id', stepId)
    .eq('relation_type', relationType)

  if (excludeId) query = query.neq('id', excludeId)
  const existing = assertRows(await query, 'No se pudieron comprobar las relaciones existentes')
  const sameStart = existing.find((item) => (item.date_from || null) === (dateFrom || null))
  const openActive = existing.find((item) => item.status !== 'archived' && !item.date_to)

  if (!excludeId && sameStart?.status === 'archived') return { restorable: sameStart }
  if (sameStart) throw new Error('Este Paso ya tiene una relación equivalente con la Hermandad.')
  if (!dateTo && openActive) throw new Error('Ya existe una relación abierta del mismo tipo para este Paso.')
  return { restorable: null }
}

async function refreshRelation(supabase, brotherhoodId, stepId) {
  const [brotherhoodResult, stepResult] = await Promise.all([
    supabase.from('entities').select('slug').eq('id', brotherhoodId).maybeSingle(),
    supabase.from('entities').select('slug').eq('id', stepId).maybeSingle(),
  ])

  revalidatePath('/panel')
  revalidatePath('/panel/hermandades')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/pasos`)
  revalidatePath('/panel/pasos')
  revalidatePath(`/panel/pasos/${stepId}`)
  revalidatePath('/hermandades')
  revalidatePath('/pasos')
  if (brotherhoodResult.data?.slug) revalidatePath(`/hermandades/${brotherhoodResult.data.slug}`)
  if (stepResult.data?.slug) revalidatePath(`/pasos/${stepResult.data.slug}`)
}

function redirectSaved(brotherhoodId, result) {
  redirect(`/panel/hermandades/${brotherhoodId}/pasos?saved=${result}`)
}

export async function addBrotherhoodStepRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuidValue(formData, 'brotherhood_id')
  const stepId = uuidValue(formData, 'step_entity_id')
  const relationType = normalizedToken(formData, 'relation_type', {
    fallback: 'processional_step',
    label: 'El tipo de relación',
  })
  const dateFrom = optionalDate(formData, 'date_from', 'La fecha inicial')
  const dateTo = optionalDate(formData, 'date_to', 'La fecha final')
  validateDateOrder(dateFrom, dateTo)

  const { brotherhood, step } = await loadEndpoints(supabase, brotherhoodId, stepId)
  const { restorable } = await relationConflicts(supabase, {
    brotherhoodId,
    stepId,
    relationType,
    dateFrom,
    dateTo,
  })
  const status = relationalStatus(brotherhood, step)
  const payload = {
    brotherhood_entity_id: brotherhoodId,
    step_entity_id: stepId,
    relation_type: relationType,
    date_from: dateFrom,
    date_to: dateTo,
    status,
  }

  const saved = restorable
    ? assertRow(
        await supabase
          .from('brotherhood_steps')
          .update(payload)
          .eq('id', restorable.id)
          .select('id')
          .single(),
        'No se pudo restaurar la relación con el Paso'
      )
    : assertRow(
        await supabase
          .from('brotherhood_steps')
          .insert(payload)
          .select('id')
          .single(),
        'No se pudo crear la relación con el Paso'
      )

  await writeAudit(supabase, user, {
    action_type: 'link',
    object_type: 'brotherhood_step',
    object_id: saved.id,
    entity_id: brotherhoodId,
    summary: `Paso relacionado: ${step.name} · ${relationType}`,
    changed_fields: payload,
  }, 'la relación Hermandad-Paso')
  await refreshRelation(supabase, brotherhoodId, stepId)
  redirectSaved(brotherhoodId, restorable ? 'restored' : 'linked')
}

export async function updateBrotherhoodStepRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuidValue(formData, 'brotherhood_id')
  const relationId = uuidValue(formData, 'relation_id')
  const relationType = normalizedToken(formData, 'relation_type', {
    fallback: 'processional_step',
    label: 'El tipo de relación',
  })
  const dateFrom = optionalDate(formData, 'date_from', 'La fecha inicial')
  const dateTo = optionalDate(formData, 'date_to', 'La fecha final')
  validateDateOrder(dateFrom, dateTo)

  const relation = assertRow(
    await supabase
      .from('brotherhood_steps')
      .select('id, step_entity_id, status')
      .eq('id', relationId)
      .eq('brotherhood_entity_id', brotherhoodId)
      .maybeSingle(),
    'La relación no existe o no pertenece a esta Hermandad.'
  )
  if (relation.status === 'archived') throw new Error('Una relación retirada no puede modificarse.')

  const { brotherhood, step } = await loadEndpoints(supabase, brotherhoodId, relation.step_entity_id)
  await relationConflicts(supabase, {
    brotherhoodId,
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
    status: relation.status === 'review' ? 'review' : relationalStatus(brotherhood, step),
  }
  assertRow(
    await supabase
      .from('brotherhood_steps')
      .update(payload)
      .eq('id', relationId)
      .select('id')
      .single(),
    'No se pudo actualizar la relación'
  )

  await writeAudit(supabase, user, {
    action_type: 'update',
    object_type: 'brotherhood_step',
    object_id: relationId,
    entity_id: brotherhoodId,
    summary: `Relación de Paso actualizada: ${step.name} · ${relationType}`,
    changed_fields: payload,
  }, 'la relación Hermandad-Paso')
  await refreshRelation(supabase, brotherhoodId, relation.step_entity_id)
  redirectSaved(brotherhoodId, dateTo ? 'closed' : 'updated')
}

export async function archiveBrotherhoodStepRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuidValue(formData, 'brotherhood_id')
  const relationId = uuidValue(formData, 'relation_id')

  const relation = assertRow(
    await supabase
      .from('brotherhood_steps')
      .select('id, step_entity_id, relation_type, status')
      .eq('id', relationId)
      .eq('brotherhood_entity_id', brotherhoodId)
      .maybeSingle(),
    'La relación no existe o no pertenece a esta Hermandad.'
  )

  if (relation.status !== 'archived') {
    assertRow(
      await supabase
        .from('brotherhood_steps')
        .update({ status: 'archived' })
        .eq('id', relationId)
        .select('id')
        .single(),
      'No se pudo retirar la relación'
    )

    await writeAudit(supabase, user, {
      action_type: 'unlink',
      object_type: 'brotherhood_step',
      object_id: relationId,
      entity_id: brotherhoodId,
      summary: `Relación con Paso retirada sin borrar la entidad · ${relation.relation_type}`,
      changed_fields: { status: 'archived' },
    }, 'la relación Hermandad-Paso')
  }

  await refreshRelation(supabase, brotherhoodId, relation.step_entity_id)
  redirectSaved(brotherhoodId, 'archived')
}
