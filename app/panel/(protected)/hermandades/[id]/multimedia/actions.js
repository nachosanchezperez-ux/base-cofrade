'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const QUICK_UPLOAD_PATH_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(?:jpg|png|webp|gif|avif)$/i
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const QUICK_UPLOAD_RIGHTS = new Set(['owned', 'authorized'])
const TARGET_KINDS = new Set(['entity', 'cult'])
const MAX_FILE_SIZE = 10 * 1024 * 1024

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function fileSize(formData) {
  const candidate = Number(value(formData, 'file_size'))
  if (!Number.isSafeInteger(candidate) || candidate <= 0) {
    throw new Error('No se pudo comprobar el tamaño de la imagen.')
  }
  if (candidate > MAX_FILE_SIZE) throw new Error('La imagen no puede superar 10 MB.')
  return candidate
}

function mediaExtension(fileType) {
  const byType = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
  }
  return byType[fileType] || 'jpg'
}

async function loadEntity(supabase, entityId, label) {
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, status')
    .eq('id', entityId)
    .neq('status', 'archived')
    .maybeSingle()

  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}

async function loadCult(supabase, cultId, brotherhoodId) {
  const result = await supabase
    .from('cults')
    .select('id, brotherhood_entity_id, title, status')
    .eq('id', cultId)
    .eq('brotherhood_entity_id', brotherhoodId)
    .neq('status', 'archived')
    .maybeSingle()

  if (result.error) throw new Error(`No se pudo comprobar el Culto: ${result.error.message}`)
  if (!result.data) throw new Error('El Culto seleccionado no pertenece a esta Hermandad.')

  return {
    id: result.data.id,
    name: result.data.title,
    entity_type: 'cult',
    slug: '',
  }
}

async function assertBrotherhoodTarget(supabase, brotherhoodId, target) {
  if (target.entity_type === 'step') {
    const result = await supabase
      .from('brotherhood_steps')
      .select('step_entity_id')
      .eq('brotherhood_entity_id', brotherhoodId)
      .eq('step_entity_id', target.id)
      .neq('status', 'archived')
      .limit(1)
      .maybeSingle()
    if (result.error) throw new Error(`No se pudo comprobar la relación con el Paso: ${result.error.message}`)
    if (result.data) return
  }

  if (target.entity_type === 'image') {
    const result = await supabase
      .from('brotherhood_images')
      .select('image_entity_id')
      .eq('brotherhood_entity_id', brotherhoodId)
      .eq('image_entity_id', target.id)
      .neq('status', 'archived')
      .limit(1)
      .maybeSingle()
    if (result.error) throw new Error(`No se pudo comprobar la relación con el Titular: ${result.error.message}`)
    if (result.data) return
  }

  if (target.entity_type === 'heritage_asset') {
    const result = await supabase
      .from('heritage_assets')
      .select('entity_id')
      .eq('parent_entity_id', brotherhoodId)
      .eq('entity_id', target.id)
      .limit(1)
      .maybeSingle()
    if (result.error) throw new Error(`No se pudo comprobar la pieza patrimonial: ${result.error.message}`)
    if (result.data) return
  }

  throw new Error('El contenido seleccionado no pertenece a esta Hermandad.')
}

async function loadUploadContext(formData) {
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const targetId = uuid(formData, 'target_id')
  const targetKind = value(formData, 'target_kind') || 'entity'
  if (!TARGET_KINDS.has(targetKind)) throw new Error('El tipo de destino de la imagen no es válido.')

  const brotherhood = await loadEntity(supabase, brotherhoodId, 'La Hermandad no existe o está archivada.')
  if (brotherhood.entity_type !== 'brotherhood') throw new Error('La ficha de contexto no es una Hermandad.')

  const target = targetKind === 'cult'
    ? await loadCult(supabase, targetId, brotherhoodId)
    : await loadEntity(supabase, targetId, 'La ficha de destino no existe o está archivada.')

  if (targetKind === 'entity') await assertBrotherhoodTarget(supabase, brotherhoodId, target)

  const fileType = value(formData, 'file_type')
  const originalFileName = value(formData, 'file_name').slice(0, 255)
  const originalFileSize = fileSize(formData)
  const altText = value(formData, 'alt_text')
  const rightsStatus = value(formData, 'rights_status') || 'authorized'

  if (!IMAGE_TYPES.has(fileType)) throw new Error('La imagen debe ser JPG, PNG, WEBP, GIF o AVIF.')
  if (!originalFileName) throw new Error('No se pudo identificar el archivo seleccionado.')
  if (!altText) throw new Error('La descripción accesible es obligatoria.')
  if (!QUICK_UPLOAD_RIGHTS.has(rightsStatus)) {
    throw new Error('La subida rápida solo admite material propio o autorizado. Para licencias abiertas o dominio público utiliza la Biblioteca multimedia.')
  }

  const storageRoot = targetKind === 'cult'
    ? `${brotherhoodId}/cultos/${targetId}`
    : targetId

  return {
    supabase,
    brotherhoodId,
    targetId,
    targetKind,
    brotherhood,
    target,
    storageRoot,
    fileType,
    originalFileName,
    originalFileSize,
    altText,
    rightsStatus,
  }
}

function assertPreparedStoragePath(storagePath, context) {
  const prefix = `${context.storageRoot}/`
  const fileName = storagePath.startsWith(prefix) ? storagePath.slice(prefix.length) : ''

  if (!storagePath || storagePath.startsWith('/') || storagePath.includes('..')) {
    throw new Error('La ruta temporal de la imagen no es válida.')
  }
  if (!fileName || fileName.includes('/') || !QUICK_UPLOAD_PATH_PATTERN.test(fileName)) {
    throw new Error('La ruta temporal de la imagen no pertenece al contenido seleccionado.')
  }
  if (!fileName.endsWith(`.${mediaExtension(context.fileType)}`)) {
    throw new Error('El formato de la imagen no coincide con la ruta temporal.')
  }
}

async function assertStoredUpload(context, storagePath) {
  const segments = storagePath.split('/')
  const fileName = segments.pop()
  const folder = segments.join('/')
  const result = await context.supabase.storage
    .from('hilo-media')
    .list(folder, { limit: 20, search: fileName })

  if (result.error) throw new Error(`No se pudo comprobar la imagen subida: ${result.error.message}`)
  const storedObject = (result.data || []).find((item) => item.name === fileName)
  if (!storedObject) throw new Error('La imagen no llegó correctamente al almacenamiento.')

  const storedSize = Number(storedObject.metadata?.size || storedObject.metadata?.contentLength || 0)
  const storedType = String(storedObject.metadata?.mimetype || storedObject.metadata?.contentType || '')

  if (storedSize && storedSize !== context.originalFileSize) {
    throw new Error('El tamaño almacenado no coincide con el archivo seleccionado.')
  }
  if (storedType && storedType !== context.fileType) {
    throw new Error('El formato almacenado no coincide con el archivo seleccionado.')
  }
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la subida rápida', error)
}

async function rollbackNewAsset(supabase, mediaAssetId, storagePath) {
  if (mediaAssetId) await supabase.from('media_assets').delete().eq('id', mediaAssetId)
  if (storagePath) await supabase.storage.from('hilo-media').remove([storagePath])
}

async function persistBrotherhoodRelatedMedia(formData, context, user, storagePath) {
  const assetResult = await context.supabase
    .from('media_assets')
    .insert({
      storage_path: storagePath,
      media_type: 'image',
      title: value(formData, 'title') || context.target.name || context.originalFileName,
      caption: value(formData, 'caption') || null,
      alt_text: context.altText,
      author_name: value(formData, 'author_name') || null,
      rights_status: context.rightsStatus,
    })
    .select('id')
    .single()

  if (assetResult.error) {
    await context.supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo registrar la imagen: ${assetResult.error.message}`)
  }

  const relationTable = context.targetKind === 'cult' ? 'cult_media' : 'entity_media'
  const targetColumn = context.targetKind === 'cult' ? 'cult_id' : 'entity_id'
  const previousCoverResult = await context.supabase
    .from(relationTable)
    .select('id')
    .eq(targetColumn, context.targetId)
    .eq('is_cover', true)

  if (previousCoverResult.error) {
    await rollbackNewAsset(context.supabase, assetResult.data.id, storagePath)
    throw new Error(`No se pudo comprobar la fotografía principal anterior: ${previousCoverResult.error.message}`)
  }

  const previousCoverIds = (previousCoverResult.data || []).map((item) => item.id)
  if (previousCoverIds.length) {
    const previousCover = await context.supabase
      .from(relationTable)
      .update({ is_cover: false })
      .in('id', previousCoverIds)
    if (previousCover.error) {
      await rollbackNewAsset(context.supabase, assetResult.data.id, storagePath)
      throw new Error(`No se pudo actualizar la fotografía principal anterior: ${previousCover.error.message}`)
    }
  }

  const linkPayload = context.targetKind === 'cult'
    ? {
        cult_id: context.targetId,
        media_asset_id: assetResult.data.id,
        role: 'cover',
        sort_order: 0,
        is_cover: true,
        focus_x: 50,
        focus_y: 50,
        fit_mode: 'cover',
      }
    : {
        entity_id: context.targetId,
        media_asset_id: assetResult.data.id,
        relation_type: 'cover',
        sort_order: 0,
        is_cover: true,
        focus_x: 50,
        focus_y: 50,
        fit_mode: 'auto',
      }

  const linkResult = await context.supabase
    .from(relationTable)
    .insert(linkPayload)
    .select('id')
    .single()

  if (linkResult.error) {
    if (previousCoverIds.length) {
      await context.supabase.from(relationTable).update({ is_cover: true }).in('id', previousCoverIds)
    }
    await rollbackNewAsset(context.supabase, assetResult.data.id, storagePath)
    throw new Error(`No se pudo vincular la imagen: ${linkResult.error.message}`)
  }

  await audit(context.supabase, user, {
    action_type: 'link',
    object_type: relationTable,
    object_id: linkResult.data.id,
    entity_id: context.targetKind === 'cult' ? context.brotherhoodId : context.targetId,
    summary: `Imagen principal incorporada a ${context.target.name} desde ${context.brotherhood.name}`,
    changed_fields: {
      brotherhood_id: context.brotherhoodId,
      target_kind: context.targetKind,
      target_id: context.targetId,
      media_asset_id: assetResult.data.id,
      relation_type: 'cover',
      upload_mode: 'signed_direct',
    },
  })

  const anchor = `contenido-${context.targetId}`
  return `/panel/hermandades/${context.brotherhoodId}/multimedia?saved=uploaded#${anchor}`
}

function revalidateUploadedMedia(context) {
  revalidatePath('/panel')
  revalidatePath('/panel/multimedia')
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}/multimedia`)
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}/patrimonio`)
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}/cultos`)
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

function uploadErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message
  return 'No se ha podido subir la imagen. Revisa los datos e inténtalo de nuevo.'
}

export async function prepareBrotherhoodRelatedMediaUploadAction(formData) {
  await requirePanelEditor()

  try {
    const context = await loadUploadContext(formData)
    const storagePath = `${context.storageRoot}/${randomUUID()}.${mediaExtension(context.fileType)}`
    const signedUpload = await context.supabase.storage
      .from('hilo-media')
      .createSignedUploadUrl(storagePath, { upsert: false })

    if (signedUpload.error) {
      throw new Error(`No se pudo preparar la subida: ${signedUpload.error.message}`)
    }
    if (!signedUpload.data?.token) {
      throw new Error('No se pudo generar el permiso temporal de subida.')
    }

    return {
      upload: {
        path: storagePath,
        token: signedUpload.data.token,
      },
    }
  } catch (error) {
    const message = uploadErrorMessage(error)
    console.error('[Hilo Cofrade] Error al preparar la subida rápida de multimedia', error)
    return { error: message }
  }
}

export async function uploadBrotherhoodRelatedMediaAction(formData) {
  const user = await requirePanelEditor()
  let cleanupPath = ''
  let destination
  let context

  try {
    context = await loadUploadContext(formData)
    const storagePath = value(formData, 'storage_path')
    assertPreparedStoragePath(storagePath, context)
    cleanupPath = storagePath
    await assertStoredUpload(context, storagePath)
    destination = await persistBrotherhoodRelatedMedia(formData, context, user, storagePath)
    cleanupPath = ''
  } catch (error) {
    if (cleanupPath && context?.supabase) {
      await context.supabase.storage.from('hilo-media').remove([cleanupPath])
    }
    const message = uploadErrorMessage(error)
    console.error('[Hilo Cofrade] Error en la subida rápida de multimedia', error)
    return { error: message }
  }

  try {
    revalidateUploadedMedia(context)
  } catch (error) {
    console.error('[Hilo Cofrade] La imagen se guardó, pero no se pudo revalidar toda la navegación', error)
  }

  redirect(destination)
}
