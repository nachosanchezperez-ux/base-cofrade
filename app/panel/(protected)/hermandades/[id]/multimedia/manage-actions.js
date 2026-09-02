'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const TARGET_KINDS = new Set(['entity', 'cult'])
const ENTITY_TARGET_TYPES = new Set(['step', 'image', 'heritage_asset'])
const RIGHTS_STATUSES = new Set(['pending', 'owned', 'authorized', 'licensed', 'public_domain', 'restricted'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function nullable(formData, name) {
  return value(formData, name) || null
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function normalizeAuthorName(input) {
  return String(input || '')
    .trim()
    .replace(/^fotograf(?:í|i)a\s*(?:[·•:|/–—-]\s*)?/i, '')
    .trim()
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}

function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function loadBrotherhood(supabase, brotherhoodId) {
  const brotherhood = assertRow(
    await supabase
      .from('entities')
      .select('id, name, slug, entity_type, status')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .neq('status', 'archived')
      .maybeSingle(),
    'La Hermandad no existe o está archivada.'
  )
  return brotherhood
}

async function assertEntityBelongsToBrotherhood(supabase, brotherhoodId, target) {
  if (target.entity_type === 'step') {
    const relation = await supabase
      .from('brotherhood_steps')
      .select('step_entity_id')
      .eq('brotherhood_entity_id', brotherhoodId)
      .eq('step_entity_id', target.id)
      .neq('status', 'archived')
      .limit(1)
      .maybeSingle()
    if (relation.error) throw new Error(`No se pudo comprobar la relación con el Paso: ${relation.error.message}`)
    if (relation.data) return
  }

  if (target.entity_type === 'image') {
    const relation = await supabase
      .from('brotherhood_images')
      .select('image_entity_id')
      .eq('brotherhood_entity_id', brotherhoodId)
      .eq('image_entity_id', target.id)
      .neq('status', 'archived')
      .limit(1)
      .maybeSingle()
    if (relation.error) throw new Error(`No se pudo comprobar la relación con el Titular: ${relation.error.message}`)
    if (relation.data) return
  }

  if (target.entity_type === 'heritage_asset') {
    const relation = await supabase
      .from('heritage_assets')
      .select('entity_id')
      .eq('parent_entity_id', brotherhoodId)
      .eq('entity_id', target.id)
      .limit(1)
      .maybeSingle()
    if (relation.error) throw new Error(`No se pudo comprobar la pieza patrimonial: ${relation.error.message}`)
    if (relation.data) return
  }

  throw new Error('El contenido seleccionado no pertenece a esta Hermandad.')
}

async function loadTarget(supabase, brotherhoodId, targetId, targetKind) {
  if (targetKind === 'cult') {
    const cult = assertRow(
      await supabase
        .from('cults')
        .select('id, title, brotherhood_entity_id, status')
        .eq('id', targetId)
        .eq('brotherhood_entity_id', brotherhoodId)
        .neq('status', 'archived')
        .maybeSingle(),
      'El Culto seleccionado no pertenece a esta Hermandad.'
    )
    return { id: cult.id, name: cult.title, entity_type: 'cult', slug: '' }
  }

  const target = assertRow(
    await supabase
      .from('entities')
      .select('id, name, slug, entity_type, status')
      .eq('id', targetId)
      .neq('status', 'archived')
      .maybeSingle(),
    'El contenido seleccionado no existe o está archivado.'
  )
  if (!ENTITY_TARGET_TYPES.has(target.entity_type)) throw new Error('Ese tipo de contenido no se gestiona desde Fotos y carteles.')
  await assertEntityBelongsToBrotherhood(supabase, brotherhoodId, target)
  return target
}

function relationSpec(targetKind) {
  return targetKind === 'cult'
    ? { table: 'cult_media', targetColumn: 'cult_id', relationColumn: 'role' }
    : { table: 'entity_media', targetColumn: 'entity_id', relationColumn: 'relation_type' }
}

async function loadContext(formData) {
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const targetId = uuid(formData, 'target_id')
  const targetKind = value(formData, 'target_kind') || 'entity'
  const linkId = uuid(formData, 'media_link_id')
  const mediaAssetId = uuid(formData, 'media_asset_id')
  if (!TARGET_KINDS.has(targetKind)) throw new Error('El tipo de destino multimedia no es válido.')

  const brotherhood = await loadBrotherhood(supabase, brotherhoodId)
  const target = await loadTarget(supabase, brotherhoodId, targetId, targetKind)
  const spec = relationSpec(targetKind)
  const link = assertRow(
    await supabase
      .from(spec.table)
      .select(`id, media_asset_id, is_cover, sort_order, ${spec.relationColumn}`)
      .eq('id', linkId)
      .eq(spec.targetColumn, targetId)
      .eq('media_asset_id', mediaAssetId)
      .maybeSingle(),
    'El vínculo multimedia no existe o ya no pertenece a este contenido.'
  )
  const asset = assertRow(
    await supabase
      .from('media_assets')
      .select('id, title, caption, alt_text, author_name, rights_status')
      .eq('id', mediaAssetId)
      .maybeSingle(),
    'El archivo multimedia ya no existe.'
  )

  return { supabase, brotherhoodId, targetId, targetKind, linkId, mediaAssetId, brotherhood, target, spec, link, asset }
}

async function audit(supabase, user, entry) {
  const result = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (result.error) console.error('[Hilo Cofrade] No se pudo registrar la operación multimedia local', result.error)
}

function fallbackManagedPath(context) {
  return `/panel/hermandades/${context.brotherhoodId}/multimedia#contenido-${context.targetId}`
}

function managedReturnPath(formData, context) {
  const candidate = value(formData, 'return_path')
  const allowedPrefix = `/panel/hermandades/${context.brotherhoodId}/`
  if (!candidate) return fallbackManagedPath(context)
  if (!candidate.startsWith(allowedPrefix) || candidate.startsWith('//') || candidate.includes('://')) {
    return fallbackManagedPath(context)
  }
  return candidate
}

function addSavedState(path, saved) {
  const hashIndex = path.indexOf('#')
  const pathname = hashIndex >= 0 ? path.slice(0, hashIndex) : path
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : ''
  const separator = pathname.includes('?') ? '&' : '?'
  return `${pathname}${separator}saved=${encodeURIComponent(saved)}${hash}`
}

function redirectManaged(context, saved, formData, contextualSaved = saved) {
  const destination = managedReturnPath(formData, context)
  const isContextual = destination !== fallbackManagedPath(context)
  redirect(addSavedState(destination, isContextual ? contextualSaved : saved))
}

function revalidateManagedMedia(context) {
  revalidatePath('/panel')
  revalidatePath('/panel/multimedia')
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}/multimedia`)
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}/patrimonio`)
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}/cultos`)
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}/pasos`)
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}/titulares`)
  if (context.brotherhood.slug) revalidatePath(`/hermandades/${context.brotherhood.slug}`)

  if (context.target.entity_type === 'step') {
    revalidatePath(`/panel/pasos/${context.targetId}`)
    if (context.target.slug) revalidatePath(`/pasos/${context.target.slug}`)
  }
  if (context.target.entity_type === 'image') {
    revalidatePath(`/panel/imagenes/${context.targetId}`)
    if (context.target.slug) revalidatePath(`/imagenes/${context.target.slug}`)
  }
}

async function clearOtherCovers(context) {
  const result = await context.supabase
    .from(context.spec.table)
    .update({ is_cover: false })
    .eq(context.spec.targetColumn, context.targetId)
    .neq('id', context.linkId)
  if (result.error) throw new Error(`No se pudo actualizar la fotografía principal anterior: ${result.error.message}`)
}

async function promoteNextCover(context) {
  const next = await context.supabase
    .from(context.spec.table)
    .select('id')
    .eq(context.spec.targetColumn, context.targetId)
    .order('sort_order')
    .limit(1)
    .maybeSingle()
  if (next.error) throw new Error(`No se pudo buscar una fotografía principal de reemplazo: ${next.error.message}`)
  if (!next.data) return

  const payload = { is_cover: true, sort_order: 0, [context.spec.relationColumn]: 'cover' }
  const promoted = await context.supabase.from(context.spec.table).update(payload).eq('id', next.data.id)
  if (promoted.error) throw new Error(`No se pudo activar la fotografía principal de reemplazo: ${promoted.error.message}`)
}

export async function updateBrotherhoodMediaAssetAction(formData) {
  const user = await requirePanelEditor()
  const context = await loadContext(formData)
  const rightsStatus = value(formData, 'rights_status') || context.asset.rights_status || 'authorized'
  if (!RIGHTS_STATUSES.has(rightsStatus)) throw new Error('Estado de derechos no válido.')
  const altText = value(formData, 'alt_text')
  if (!altText) throw new Error('La descripción accesible es obligatoria.')

  const payload = {
    title: nullable(formData, 'title') || context.target.name,
    caption: nullable(formData, 'caption'),
    alt_text: altText,
    author_name: normalizeAuthorName(value(formData, 'author_name')) || null,
    rights_status: rightsStatus,
  }
  assertMutation(
    await context.supabase.from('media_assets').update(payload).eq('id', context.mediaAssetId),
    'No se pudo actualizar el archivo'
  )

  await audit(context.supabase, user, {
    action_type: 'update',
    object_type: 'media_asset',
    object_id: context.mediaAssetId,
    entity_id: context.targetKind === 'cult' ? context.brotherhoodId : context.targetId,
    summary: `Archivo multimedia actualizado: ${context.target.name}`,
    changed_fields: payload,
  })
  revalidateManagedMedia(context)
  redirectManaged(context, 'updated', formData, 'media-updated')
}

export async function setBrotherhoodMediaCoverAction(formData) {
  const user = await requirePanelEditor()
  const context = await loadContext(formData)
  await clearOtherCovers(context)
  const payload = { is_cover: true, sort_order: 0, [context.spec.relationColumn]: 'cover' }
  assertMutation(
    await context.supabase.from(context.spec.table).update(payload).eq('id', context.linkId),
    'No se pudo establecer la fotografía principal'
  )

  await audit(context.supabase, user, {
    action_type: 'update',
    object_type: context.spec.table,
    object_id: context.linkId,
    entity_id: context.targetKind === 'cult' ? context.brotherhoodId : context.targetId,
    summary: `Fotografía principal actualizada: ${context.target.name}`,
    changed_fields: { media_asset_id: context.mediaAssetId, is_cover: true },
  })
  revalidateManagedMedia(context)
  redirectManaged(context, 'cover', formData, 'media-cover')
}

export async function unlinkBrotherhoodMediaAssetAction(formData) {
  const user = await requirePanelEditor()
  const context = await loadContext(formData)
  const wasCover = Boolean(context.link.is_cover)

  assertRow(
    await context.supabase.from(context.spec.table).delete().eq('id', context.linkId).select('id').single(),
    'No se pudo retirar el archivo de este contenido.'
  )
  if (wasCover) await promoteNextCover(context)

  await audit(context.supabase, user, {
    action_type: 'unlink',
    object_type: context.spec.table,
    object_id: context.linkId,
    entity_id: context.targetKind === 'cult' ? context.brotherhoodId : context.targetId,
    summary: `Archivo desvinculado: ${context.target.name}`,
    changed_fields: {
      media_asset_id: context.mediaAssetId,
      removed_asset: false,
      storage_preserved: true,
      cleanup_deferred: true,
    },
  })
  revalidateManagedMedia(context)
  redirectManaged(context, 'unlinked', formData, 'media-unlinked')
}
