'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const RIGHTS_STATUSES = new Set(['owned', 'authorized', 'licensed', 'public_domain'])
const FIT_MODES = new Set(['auto', 'cover', 'contain'])
const PANEL_ROUTES = {
  brotherhood: 'hermandades',
  image: 'imagenes',
  step: 'pasos',
}

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function nullable(formData, name) {
  return value(formData, name) || null
}

function uuid(formData, name, optional = false) {
  const candidate = value(formData, name)
  if (!candidate && optional) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function percentage(formData, name, fallback = 50) {
  const raw = value(formData, name)
  const parsed = raw === '' ? fallback : Number(raw)
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`${name} debe estar entre 0 y 100.`)
  }
  return parsed
}

function positiveInteger(formData, name) {
  const parsed = Number.parseInt(value(formData, name), 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de portada', error)
}

function refreshEntity(entity) {
  const panelRoute = PANEL_ROUTES[entity.entity_type]
  revalidatePath('/panel')
  revalidatePath(`/panel/${panelRoute}`)
  revalidatePath(`/panel/${panelRoute}/${entity.id}`)
  if (entity.slug) revalidatePath(`/${panelRoute}/${entity.slug}`)
}

export async function saveEntityCoverAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const entityId = uuid(formData, 'entity_id')
  const relationId = uuid(formData, 'cover_relation_id', true)
  const storagePath = value(formData, 'storage_path')
  const hasNewUpload = Boolean(storagePath)
  const altText = value(formData, 'alt_text')
  const rightsStatus = value(formData, 'rights_status')
  const fitMode = value(formData, 'fit_mode') || 'auto'

  if (!altText) throw new Error('El texto alternativo es obligatorio.')
  if (!RIGHTS_STATUSES.has(rightsStatus)) throw new Error('El estado de derechos no permite la publicación.')
  if (!FIT_MODES.has(fitMode)) throw new Error('El modo de ajuste no es válido.')

  const { data: entity, error: entityError } = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, status')
    .eq('id', entityId)
    .in('entity_type', Object.keys(PANEL_ROUTES))
    .maybeSingle()
  if (entityError) throw new Error(`No se pudo validar la entidad: ${entityError.message}`)
  if (!entity) throw new Error('La entidad ya no existe o no admite portada.')
  if (hasNewUpload) {
    const storagePattern = new RegExp(
      `^${entityId}\/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(?:jpg|png|webp|avif)$`,
      'i'
    )
    if (!storagePattern.test(storagePath)) throw new Error('La ruta de la nueva portada no es válida.')
  }

  let currentCover = null
  if (relationId) {
    const { data, error } = await supabase
      .from('entity_media')
      .select('id, media_asset_id')
      .eq('id', relationId)
      .eq('entity_id', entityId)
      .eq('is_cover', true)
      .maybeSingle()
    if (error) throw new Error(`No se pudo validar la portada actual: ${error.message}`)
    if (!data) throw new Error('La portada que intentas editar ya no está activa.')
    currentCover = data
  }

  const relationPayload = {
    focus_x: percentage(formData, 'focus_x'),
    focus_y: percentage(formData, 'focus_y'),
    mobile_focus_x: percentage(formData, 'mobile_focus_x'),
    mobile_focus_y: percentage(formData, 'mobile_focus_y'),
    fit_mode: fitMode,
  }
  const assetPayload = {
    title: nullable(formData, 'title'),
    caption: nullable(formData, 'caption'),
    alt_text: altText,
    author_name: nullable(formData, 'author_name'),
    source_name: nullable(formData, 'source_name'),
    source_url: nullable(formData, 'source_url'),
    rights_status: rightsStatus,
    rights_holder: nullable(formData, 'rights_holder'),
    license: nullable(formData, 'license'),
    permission_notes: nullable(formData, 'permission_notes'),
  }

  let savedRelationId = relationId

  if (hasNewUpload) {
    const assetResult = await supabase
      .from('media_assets')
      .insert({
        ...assetPayload,
        storage_path: storagePath,
        media_type: 'image',
        title: assetPayload.title || nullable(formData, 'original_file_name') || entity.name,
        width_px: positiveInteger(formData, 'width_px'),
        height_px: positiveInteger(formData, 'height_px'),
      })
      .select('id')
      .single()

    if (assetResult.error) {
      await supabase.storage.from('hilo-media').remove([storagePath])
      throw new Error(`No se pudo registrar la portada: ${assetResult.error.message}`)
    }

    const mediaAssetId = assetResult.data.id
    if (currentCover) {
      const demoteResult = await supabase
        .from('entity_media')
        .update({ is_cover: false })
        .eq('id', currentCover.id)
        .eq('entity_id', entityId)
      if (demoteResult.error) {
        await supabase.from('media_assets').delete().eq('id', mediaAssetId)
        await supabase.storage.from('hilo-media').remove([storagePath])
        throw new Error(`No se pudo sustituir la portada: ${demoteResult.error.message}`)
      }
    }

    const relationResult = await supabase
      .from('entity_media')
      .insert({
        entity_id: entityId,
        media_asset_id: mediaAssetId,
        relation_type: 'cover',
        sort_order: 0,
        is_cover: true,
        ...relationPayload,
      })
      .select('id')
      .single()

    if (relationResult.error) {
      if (currentCover) await supabase.from('entity_media').update({ is_cover: true }).eq('id', currentCover.id)
      await supabase.from('media_assets').delete().eq('id', mediaAssetId)
      await supabase.storage.from('hilo-media').remove([storagePath])
      throw new Error(`No se pudo vincular la portada: ${relationResult.error.message}`)
    }

    savedRelationId = relationResult.data.id
  } else {
    if (!currentCover) throw new Error('Selecciona una imagen para crear la portada.')
    assertMutation(
      await supabase
        .from('media_assets')
        .update(assetPayload)
        .eq('id', currentCover.media_asset_id),
      'No se pudieron guardar los datos de la fotografía'
    )
    assertMutation(
      await supabase
        .from('entity_media')
        .update(relationPayload)
        .eq('id', currentCover.id)
        .eq('entity_id', entityId),
      'No se pudo guardar el encuadre'
    )
  }

  await audit(supabase, user, {
    action_type: currentCover ? 'update' : 'create',
    object_type: 'entity_cover',
    object_id: savedRelationId,
    entity_id: entityId,
    summary: `${currentCover ? 'Portada actualizada' : 'Portada creada'}: ${entity.name}`,
    changed_fields: { presentation: relationPayload, asset: assetPayload },
  })

  refreshEntity(entity)
  const panelRoute = PANEL_ROUTES[entity.entity_type]
  redirect(`/panel/${panelRoute}/${entity.id}?saved=portada#portada`)
}
