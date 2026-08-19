'use server'

import { revalidatePath } from 'next/cache'
import { PUBLIC_CACHE_TAGS, revalidatePublicData } from '@/lib/cache/public-cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function optionalDate(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) {
    throw new Error(`${label} no es válida.`)
  }
  return candidate
}

function normalizedRelationType(formData) {
  const candidate = value(formData, 'relation_type') || 'titular'
  const normalized = candidate
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  if (!normalized) throw new Error('El tipo de relación es obligatorio.')
  if (normalized.length > 80) throw new Error('El tipo de relación es demasiado largo.')
  return normalized
}

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}

function validateDateOrder(dateFrom, dateTo) {
  if (dateFrom && dateTo && dateTo < dateFrom) {
    throw new Error('La fecha final no puede ser anterior a la fecha inicial.')
  }
}

async function loadEndpoints(supabase, brotherhoodId, imageId) {
  const [brotherhoodResult, imageResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .maybeSingle(),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .maybeSingle(),
  ])

  return {
    brotherhood: assertRow(brotherhoodResult, 'La Hermandad no existe o no está disponible.'),
    image: assertRow(imageResult, 'La Imagen seleccionada no existe o no está disponible.'),
  }
}

function relationStatus(brotherhood, image) {
  return brotherhood.status === 'published' && image.status === 'published'
    ? 'published'
    : 'draft'
}

async function relationConflict(supabase, {
  brotherhoodId,
  imageId,
  relationType,
  dateFrom,
  dateTo,
  excludeId = null,
}) {
  let query = supabase
    .from('brotherhood_images')
    .select('id, date_from, date_to, status')
    .eq('brotherhood_entity_id', brotherhoodId)
    .eq('image_entity_id', imageId)
    .eq('relation_type', relationType)
    .neq('status', 'archived')

  if (excludeId) query = query.neq('id', excludeId)
  const existing = assertRows(await query, 'No se pudieron comprobar las relaciones existentes')

  const equivalent = existing.find((item) => (item.date_from || null) === (dateFrom || null))
  if (equivalent) return { relation: equivalent, reason: 'equivalent' }

  if (!dateTo) {
    const openRelation = existing.find((item) => !item.date_to)
    if (openRelation) return { relation: openRelation, reason: 'open' }
  }

  return null
}

function assertNoRelationConflict(conflict) {
  if (!conflict) return
  if (conflict.reason === 'equivalent') {
    throw new Error('Esta Imagen ya tiene una relación equivalente con la Hermandad.')
  }
  throw new Error('Ya existe una relación abierta del mismo tipo para esta Imagen.')
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la relación Hermandad-Imagen', error)
}

async function refreshRelation(supabase, brotherhoodId, imageId) {
  const [brotherhoodResult, imageResult] = await Promise.all([
    supabase.from('entities').select('slug').eq('id', brotherhoodId).maybeSingle(),
    supabase.from('entities').select('slug').eq('id', imageId).maybeSingle(),
  ])

  revalidatePath('/panel')
  revalidatePath('/panel/hermandades')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/titulares`)
  revalidatePath('/hermandades')
  revalidatePath('/imagenes')
  if (brotherhoodResult.data?.slug) revalidatePath(`/hermandades/${brotherhoodResult.data.slug}`)
  if (imageResult.data?.slug) revalidatePath(`/imagenes/${imageResult.data.slug}`)
  revalidatePublicData(PUBLIC_CACHE_TAGS.BROTHERHOODS, PUBLIC_CACHE_TAGS.IMAGES)
}

function redirectSaved(brotherhoodId, result) {
  redirect(`/panel/hermandades/${brotherhoodId}/titulares?saved=${result}`)
}

export async function addBrotherhoodImageRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const imageId = uuid(formData, 'image_entity_id')
  const relationType = normalizedRelationType(formData)
  const dateFrom = optionalDate(formData, 'date_from', 'La fecha inicial')
  const dateTo = optionalDate(formData, 'date_to', 'La fecha final')
  validateDateOrder(dateFrom, dateTo)

  const { brotherhood, image } = await loadEndpoints(supabase, brotherhoodId, imageId)
  const conflict = await relationConflict(supabase, {
    brotherhoodId,
    imageId,
    relationType,
    dateFrom,
    dateTo,
  })

  if (conflict) {
    await refreshRelation(supabase, brotherhoodId, imageId)
    redirectSaved(brotherhoodId, 'existing')
  }

  const payload = {
    brotherhood_entity_id: brotherhoodId,
    image_entity_id: imageId,
    relation_type: relationType,
    date_from: dateFrom,
    date_to: dateTo,
    status: relationStatus(brotherhood, image),
  }
  const saved = assertRow(
    await supabase.from('brotherhood_images').insert(payload).select('id').single(),
    'No se pudo crear la relación con la Imagen'
  )

  await audit(supabase, user, {
    action_type: 'link',
    object_type: 'brotherhood_image',
    object_id: saved.id,
    entity_id: brotherhoodId,
    summary: `Imagen relacionada: ${image.name} · ${relationType}`,
    changed_fields: payload,
  })
  await refreshRelation(supabase, brotherhoodId, imageId)
  redirectSaved(brotherhoodId, 'linked')
}

export async function updateBrotherhoodImageRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const relationId = uuid(formData, 'relation_id')
  const relationType = normalizedRelationType(formData)
  const dateFrom = optionalDate(formData, 'date_from', 'La fecha inicial')
  const dateTo = optionalDate(formData, 'date_to', 'La fecha final')
  validateDateOrder(dateFrom, dateTo)

  const relation = assertRow(
    await supabase
      .from('brotherhood_images')
      .select('id, image_entity_id, status')
      .eq('id', relationId)
      .eq('brotherhood_entity_id', brotherhoodId)
      .maybeSingle(),
    'La relación no existe o no pertenece a esta Hermandad.'
  )
  if (relation.status === 'archived') throw new Error('Una relación retirada no puede modificarse.')

  const { brotherhood, image } = await loadEndpoints(supabase, brotherhoodId, relation.image_entity_id)
  const conflict = await relationConflict(supabase, {
    brotherhoodId,
    imageId: relation.image_entity_id,
    relationType,
    dateFrom,
    dateTo,
    excludeId: relationId,
  })
  assertNoRelationConflict(conflict)

  const payload = {
    relation_type: relationType,
    date_from: dateFrom,
    date_to: dateTo,
    status: relation.status === 'review'
      ? 'review'
      : relationStatus(brotherhood, image),
  }
  assertRow(
    await supabase
      .from('brotherhood_images')
      .update(payload)
      .eq('id', relationId)
      .eq('brotherhood_entity_id', brotherhoodId)
      .select('id')
      .single(),
    'No se pudo actualizar la relación'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'brotherhood_image',
    object_id: relationId,
    entity_id: brotherhoodId,
    summary: `Relación actualizada: ${image.name} · ${relationType}`,
    changed_fields: payload,
  })
  await refreshRelation(supabase, brotherhoodId, relation.image_entity_id)
  redirectSaved(brotherhoodId, dateTo ? 'closed' : 'updated')
}

export async function archiveBrotherhoodImageRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const relationId = uuid(formData, 'relation_id')

  const relation = assertRow(
    await supabase
      .from('brotherhood_images')
      .select('id, image_entity_id, relation_type, status')
      .eq('id', relationId)
      .eq('brotherhood_entity_id', brotherhoodId)
      .maybeSingle(),
    'La relación no existe o no pertenece a esta Hermandad.'
  )

  if (relation.status !== 'archived') {
    assertRow(
      await supabase
        .from('brotherhood_images')
        .update({ status: 'archived' })
        .eq('id', relationId)
        .eq('brotherhood_entity_id', brotherhoodId)
        .select('id')
        .single(),
      'No se pudo retirar la relación'
    )

    await audit(supabase, user, {
      action_type: 'unlink',
      object_type: 'brotherhood_image',
      object_id: relationId,
      entity_id: brotherhoodId,
      summary: `Relación retirada sin borrar la Imagen · ${relation.relation_type}`,
      changed_fields: { status: 'archived' },
    })
  }

  await refreshRelation(supabase, brotherhoodId, relation.image_entity_id)
  redirectSaved(brotherhoodId, 'archived')
}
