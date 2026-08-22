'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const RIGHTS_STATUSES = new Set(['pending', 'owned', 'authorized', 'licensed', 'public_domain', 'restricted'])
const PUBLICATION_RIGHTS = new Set(['owned', 'authorized', 'licensed', 'public_domain'])
const FIT_MODES = new Set(['auto', 'cover', 'contain'])
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const PANEL_ROUTES = {
  brotherhood: 'hermandades',
  image: 'imagenes',
  step: 'pasos',
  band: 'bandas',
  agent: 'agentes',
}
const PUBLIC_ROUTES = {
  brotherhood: 'hermandades',
  image: 'imagenes',
  step: 'pasos',
  band: 'bandas',
}

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function nullable(formData, name) {
  return value(formData, name) || null
}

function uuid(formData, name, { optional = false } = {}) {
  const candidate = value(formData, name)
  if (optional && !candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function integer(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return 0
  const parsed = Number.parseInt(candidate, 10)
  if (!Number.isFinite(parsed)) throw new Error(`${name} debe ser un número entero.`)
  return parsed
}

function percentage(formData, name, fallback = null) {
  const candidate = value(formData, name)
  if (!candidate) return fallback
  const parsed = Number.parseFloat(candidate.replace(',', '.'))
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`${name} debe estar entre 0 y 100.`)
  }
  return parsed
}

function optionalDate(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) {
    throw new Error('La fecha del recurso no es válida.')
  }
  return candidate
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

async function loadEntity(supabase, entityId) {
  return assertRow(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('id', entityId)
      .neq('status', 'archived')
      .maybeSingle(),
    'La entidad seleccionada no existe o está archivada.'
  )
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la operación multimedia', error)
}

async function clearPreviousCover(supabase, entityId, exceptLinkId = null) {
  let query = supabase
    .from('entity_media')
    .update({ is_cover: false })
    .eq('entity_id', entityId)
    .eq('is_cover', true)
  if (exceptLinkId) query = query.neq('id', exceptLinkId)
  const result = await query
  if (result.error) throw new Error(`No se pudo actualizar la portada anterior: ${result.error.message}`)
}

async function refreshEntity(supabase, entityId) {
  revalidatePath('/panel')
  revalidatePath('/panel/multimedia')
  revalidatePath('/')

  const result = await supabase
    .from('entities')
    .select('entity_type, slug')
    .eq('id', entityId)
    .maybeSingle()
  if (!result.data) return

  const panelRoute = PANEL_ROUTES[result.data.entity_type]
  if (panelRoute) revalidatePath(`/panel/${panelRoute}/${entityId}`)

  const publicRoute = PUBLIC_ROUTES[result.data.entity_type]
  if (publicRoute && result.data.slug) revalidatePath(`/${publicRoute}/${result.data.slug}`)
}

function redirectSaved(entityId, saved) {
  const params = new URLSearchParams({ saved })
  if (entityId) params.set('entity', entityId)
  redirect(`/panel/multimedia?${params.toString()}`)
}

function mediaMetadata(formData) {
  const rightsStatus = value(formData, 'rights_status') || 'authorized'
  if (!RIGHTS_STATUSES.has(rightsStatus)) throw new Error('Estado de derechos no válido.')

  return {
    title: nullable(formData, 'title'),
    caption: nullable(formData, 'caption'),
    alt_text: nullable(formData, 'alt_text'),
    author_name: nullable(formData, 'author_name'),
    source_name: nullable(formData, 'source_name'),
    source_url: nullable(formData, 'source_url'),
    rights_status: rightsStatus,
    rights_holder: nullable(formData, 'rights_holder'),
    license: nullable(formData, 'license'),
    permission_notes: nullable(formData, 'permission_notes'),
    taken_or_created_date: optionalDate(formData, 'taken_or_created_date'),
  }
}

function linkMetadata(formData) {
  const fitMode = value(formData, 'fit_mode') || 'auto'
  if (!FIT_MODES.has(fitMode)) throw new Error('Modo de encaje no válido.')

  return {
    relation_type: value(formData, 'relation_type') || 'gallery',
    sort_order: integer(formData, 'sort_order'),
    is_cover: formData.get('is_cover') === 'on',
    focus_x: percentage(formData, 'focus_x', 50),
    focus_y: percentage(formData, 'focus_y', 50),
    mobile_focus_x: percentage(formData, 'mobile_focus_x', null),
    mobile_focus_y: percentage(formData, 'mobile_focus_y', null),
    fit_mode: fitMode,
    notes: nullable(formData, 'link_notes'),
  }
}

export async function uploadEntityMediaAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const entityId = uuid(formData, 'entity_id')
  const entity = await loadEntity(supabase, entityId)
  const file = formData.get('file')

  if (!(file instanceof File) || file.size === 0) throw new Error('Selecciona una imagen para subir.')
  if (!IMAGE_TYPES.has(file.type)) throw new Error('La imagen debe ser JPG, PNG, WEBP o GIF.')
  if (file.size > 10 * 1024 * 1024) throw new Error('La imagen no puede superar 10 MB.')

  const assetPayload = mediaMetadata(formData)
  if (!assetPayload.alt_text) throw new Error('El texto alternativo es obligatorio.')
  if (!PUBLICATION_RIGHTS.has(assetPayload.rights_status)) {
    throw new Error('Para incorporar un archivo al Front, sus derechos deben permitir la publicación.')
  }

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const storagePath = `${entityId}/${randomUUID()}.${extension}`
  const uploaded = await supabase.storage.from('hilo-media').upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  })
  assertMutation(uploaded, 'No se pudo subir la imagen')

  const assetResult = await supabase
    .from('media_assets')
    .insert({
      storage_path: storagePath,
      media_type: 'image',
      ...assetPayload,
      title: assetPayload.title || file.name,
    })
    .select('id')
    .single()

  if (assetResult.error) {
    await supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo registrar la imagen: ${assetResult.error.message}`)
  }

  const linkPayload = linkMetadata(formData)
  if (linkPayload.is_cover) await clearPreviousCover(supabase, entityId)

  const linkResult = await supabase
    .from('entity_media')
    .insert({
      entity_id: entityId,
      media_asset_id: assetResult.data.id,
      ...linkPayload,
    })
    .select('id')
    .single()

  if (linkResult.error) {
    await supabase.from('media_assets').delete().eq('id', assetResult.data.id)
    await supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo vincular la imagen: ${linkResult.error.message}`)
  }

  await audit(supabase, user, {
    action_type: 'link',
    object_type: 'entity_media',
    object_id: linkResult.data.id,
    entity_id: entityId,
    summary: `Recurso multimedia incorporado a ${entity.name}`,
    changed_fields: { asset: assetPayload, link: linkPayload },
  })
  await refreshEntity(supabase, entityId)
  redirectSaved(entityId, 'uploaded')
}

export async function linkExistingMediaAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const entityId = uuid(formData, 'entity_id')
  const mediaAssetId = uuid(formData, 'media_asset_id')
  const entity = await loadEntity(supabase, entityId)
  const asset = assertRow(
    await supabase.from('media_assets').select('id, title, rights_status').eq('id', mediaAssetId).maybeSingle(),
    'El archivo multimedia seleccionado no existe.'
  )
  if (!PUBLICATION_RIGHTS.has(asset.rights_status)) {
    throw new Error('El archivo no tiene un estado de derechos publicable.')
  }

  const payload = linkMetadata(formData)
  if (payload.is_cover) await clearPreviousCover(supabase, entityId)

  const existing = await supabase
    .from('entity_media')
    .select('id')
    .eq('entity_id', entityId)
    .eq('media_asset_id', mediaAssetId)
    .eq('relation_type', payload.relation_type)
    .limit(1)
    .maybeSingle()
  if (existing.error) throw new Error(`No se pudo comprobar el vínculo: ${existing.error.message}`)

  const link = existing.data
    ? assertRow(
        await supabase.from('entity_media').update(payload).eq('id', existing.data.id).select('id').single(),
        'No se pudo actualizar el vínculo multimedia'
      )
    : assertRow(
        await supabase.from('entity_media').insert({ entity_id: entityId, media_asset_id: mediaAssetId, ...payload }).select('id').single(),
        'No se pudo vincular el archivo multimedia'
      )

  await audit(supabase, user, {
    action_type: existing.data ? 'update' : 'link',
    object_type: 'entity_media',
    object_id: link.id,
    entity_id: entityId,
    summary: `Archivo multimedia ${existing.data ? 'actualizado en' : 'vinculado a'} ${entity.name}: ${asset.title || asset.id}`,
    changed_fields: payload,
  })
  await refreshEntity(supabase, entityId)
  redirectSaved(entityId, existing.data ? 'updated' : 'linked')
}

export async function updateEntityMediaAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const linkId = uuid(formData, 'media_link_id')
  const entityId = uuid(formData, 'entity_id')
  const mediaAssetId = uuid(formData, 'media_asset_id')
  const entity = await loadEntity(supabase, entityId)

  const link = assertRow(
    await supabase
      .from('entity_media')
      .select('id, entity_id, media_asset_id')
      .eq('id', linkId)
      .eq('entity_id', entityId)
      .eq('media_asset_id', mediaAssetId)
      .maybeSingle(),
    'El vínculo multimedia no existe o ya no pertenece a esta entidad.'
  )

  const assetPayload = mediaMetadata(formData)
  const linkPayload = linkMetadata(formData)
  if (linkPayload.is_cover) await clearPreviousCover(supabase, entityId, link.id)

  assertMutation(
    await supabase.from('media_assets').update(assetPayload).eq('id', mediaAssetId),
    'No se pudo actualizar la información del archivo'
  )
  assertMutation(
    await supabase.from('entity_media').update(linkPayload).eq('id', link.id),
    'No se pudo actualizar la relación multimedia'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'entity_media',
    object_id: link.id,
    entity_id: entityId,
    summary: `Recurso multimedia actualizado en ${entity.name}`,
    changed_fields: { asset: assetPayload, link: linkPayload },
  })
  await refreshEntity(supabase, entityId)
  redirectSaved(entityId, 'updated')
}

export async function unlinkEntityMediaAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const linkId = uuid(formData, 'media_link_id')
  const entityId = uuid(formData, 'entity_id')
  const entity = await loadEntity(supabase, entityId)
  const link = assertRow(
    await supabase
      .from('entity_media')
      .select('id, media_asset_id, relation_type')
      .eq('id', linkId)
      .eq('entity_id', entityId)
      .maybeSingle(),
    'El vínculo multimedia no existe.'
  )

  assertRow(
    await supabase.from('entity_media').delete().eq('id', link.id).select('id').single(),
    'No se pudo retirar el vínculo multimedia'
  )

  await audit(supabase, user, {
    action_type: 'unlink',
    object_type: 'entity_media',
    object_id: link.id,
    entity_id: entityId,
    summary: `Recurso multimedia desvinculado de ${entity.name}`,
    changed_fields: { media_asset_id: link.media_asset_id, relation_type: link.relation_type },
  })
  await refreshEntity(supabase, entityId)
  redirectSaved(entityId, 'unlinked')
}
