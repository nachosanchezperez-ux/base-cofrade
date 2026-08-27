'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { requirePanelEditor } from '@/lib/panel/auth'
import {
  assertStoredImageUpload,
  imageUploadMetadata,
  storagePathFromPublicUrl,
} from '@/lib/panel/signed-image-upload'
import { createClient } from '@/lib/supabase/server'

const BUCKET = 'hilo-media'
const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const FILE_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(?:jpg|png|webp|gif|avif)$/i
const MEDIA_KINDS = new Set(['logo', 'hero', 'banderin'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function optionalUuid(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function text(formData, name) {
  return value(formData, name) || null
}

function mediaKind(formData) {
  const candidate = value(formData, 'media_kind')
  if (!MEDIA_KINDS.has(candidate)) throw new Error('Tipo de imagen de Banda no válido.')
  return candidate
}

function safeSlug(input) {
  return String(input || 'banda')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'banda'
}

async function loadContext(formData) {
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const kind = mediaKind(formData)
  const upload = imageUploadMetadata(formData, 'La imagen')

  const [entityResult, bandResult] = await Promise.all([
    supabase.from('entities').select('id, name, slug, status').eq('id', bandId).eq('entity_type', 'band').neq('status', 'archived').maybeSingle(),
    supabase.from('bands').select('logo_path, hero_image_path, banderin_entity_id').eq('entity_id', bandId).maybeSingle(),
  ])
  if (entityResult.error || !entityResult.data) throw new Error('No se pudo validar la Banda.')
  if (bandResult.error || !bandResult.data) throw new Error('No existe la ficha especializada de la Banda.')

  let asset = null
  if (kind === 'banderin') {
    const assetId = optionalUuid(formData, 'asset_entity_id')
    if (!assetId) throw new Error('Selecciona primero la pieza patrimonial del banderín.')
    const assetResult = await supabase
      .from('heritage_assets')
      .select('entity_id, parent_entity_id, public_image_path')
      .eq('entity_id', assetId)
      .maybeSingle()
    if (assetResult.error || !assetResult.data) throw new Error('No se encontró la pieza patrimonial seleccionada.')
    if (bandResult.data.banderin_entity_id !== assetId && assetResult.data.parent_entity_id !== bandId) {
      throw new Error('La pieza seleccionada no pertenece a esta Banda.')
    }
    asset = assetResult.data
  }

  return {
    supabase,
    bandId,
    kind,
    upload,
    entity: entityResult.data,
    band: bandResult.data,
    asset,
    storageRoot: `bandas/${bandId}/${kind}`,
  }
}

function assertPreparedPath(storagePath, context) {
  const prefix = `${context.storageRoot}/`
  const fileName = storagePath.startsWith(prefix) ? storagePath.slice(prefix.length) : ''
  if (!storagePath || storagePath.startsWith('/') || storagePath.includes('..') || !FILE_PATTERN.test(fileName)) {
    throw new Error('La ruta temporal de la imagen no pertenece a esta Banda.')
  }
  if (!fileName.endsWith(`.${context.upload.extension}`)) {
    throw new Error('El formato seleccionado no coincide con la ruta temporal.')
  }
}

function previousPublicPath(context) {
  if (context.kind === 'logo') return context.band.logo_path || ''
  if (context.kind === 'hero') return context.band.hero_image_path || ''
  return context.asset?.public_image_path || ''
}

function managedPreviousPath(context) {
  const path = storagePathFromPublicUrl(previousPublicPath(context), BUCKET)
  if (!path) return ''
  const roots = [
    `bandas/${context.bandId}/`,
    `bandas/${safeSlug(context.entity.slug || context.entity.name)}/`,
  ]
  return roots.some((root) => path.startsWith(root)) ? path : ''
}

async function refresh(context) {
  revalidatePath('/panel')
  revalidatePath('/panel/bandas')
  revalidatePath(`/panel/bandas/${context.bandId}`)
  revalidatePath(`/panel/bandas/${context.bandId}/multimedia`)
  revalidatePath('/bandas')
  if (context.entity.slug) revalidatePath(`/bandas/${context.entity.slug}`)
}

async function audit(supabase, user, payload) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...payload,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la subida multimedia', error)
}

function uploadError(error) {
  return error instanceof Error && error.message
    ? error.message
    : 'No se ha podido actualizar la imagen de la Banda.'
}

export async function prepareBandMediaUploadAction(formData) {
  await requirePanelEditor()
  try {
    const context = await loadContext(formData)
    const storagePath = `${context.storageRoot}/${randomUUID()}.${context.upload.extension}`
    const signed = await context.supabase.storage.from(BUCKET).createSignedUploadUrl(storagePath, { upsert: false })
    if (signed.error) throw new Error(`No se pudo preparar la subida: ${signed.error.message}`)
    if (!signed.data?.token) throw new Error('No se pudo generar el permiso temporal de subida.')
    return { upload: { path: storagePath, token: signed.data.token } }
  } catch (error) {
    console.error('[Hilo Cofrade] Error al preparar multimedia de Banda', error)
    return { error: uploadError(error) }
  }
}

export async function saveBandMediaUploadAction(formData) {
  const user = await requirePanelEditor()
  let cleanupPath = ''
  let context

  try {
    context = await loadContext(formData)
    const storagePath = value(formData, 'storage_path')
    assertPreparedPath(storagePath, context)
    cleanupPath = storagePath
    await assertStoredImageUpload(context.supabase, {
      storagePath,
      fileType: context.upload.fileType,
      fileSize: context.upload.fileSize,
      bucket: BUCKET,
      label: 'La imagen de la Banda',
    })

    const publicUrl = context.supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
    if (!publicUrl) throw new Error('No se pudo resolver la URL pública de la imagen.')

    const alt = text(formData, 'alt_text')
    const credit = text(formData, 'credit')
    let objectType = 'band'
    let objectId = context.bandId
    let changedFields
    let updateResult

    if (context.kind === 'logo') {
      changedFields = { logo_path: publicUrl }
      updateResult = await context.supabase.from('bands').update(changedFields).eq('entity_id', context.bandId)
    } else if (context.kind === 'hero') {
      changedFields = { hero_image_path: publicUrl, hero_image_alt: alt, hero_image_credit: credit }
      updateResult = await context.supabase.from('bands').update(changedFields).eq('entity_id', context.bandId)
    } else {
      objectType = 'heritage_asset'
      objectId = context.asset.entity_id
      changedFields = {
        public_image_path: publicUrl,
        public_image_alt: alt || `Banderín de ${context.entity.name}`,
        public_image_credit: credit,
      }
      updateResult = await context.supabase.from('heritage_assets').update(changedFields).eq('entity_id', context.asset.entity_id)
    }

    if (updateResult.error) throw new Error(`No se pudo vincular la imagen: ${updateResult.error.message}`)
    cleanupPath = ''

    await audit(context.supabase, user, {
      action_type: 'update',
      object_type: objectType,
      object_id: objectId,
      entity_id: context.bandId,
      summary: `Multimedia actualizada: ${context.entity.name} · ${context.kind}`,
      changed_fields: {
        ...changedFields,
        previous_path: previousPublicPath(context) || null,
        file_type: context.upload.fileType,
        file_size: context.upload.fileSize,
        upload_mode: 'signed_direct',
      },
    })

    const previousPath = managedPreviousPath(context)
    if (previousPath && previousPath !== storagePath) {
      const removed = await context.supabase.storage.from(BUCKET).remove([previousPath])
      if (removed.error) console.error('[Hilo Cofrade] No se pudo limpiar la imagen anterior de la Banda', removed.error)
    }

    await refresh(context)
    return { saved: true, publicUrl }
  } catch (error) {
    if (cleanupPath && context?.supabase) await context.supabase.storage.from(BUCKET).remove([cleanupPath])
    console.error('[Hilo Cofrade] Error al vincular multimedia de Banda', error)
    return { error: uploadError(error) }
  }
}
