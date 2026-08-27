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

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

async function loadContext(formData) {
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const upload = imageUploadMetadata(formData, 'La imagen de la salida')

  const [outingResult, brotherhoodResult] = await Promise.all([
    supabase
      .from('outings')
      .select('id, brotherhood_entity_id, title, outing_type, hero_image_path')
      .eq('id', outingId)
      .eq('brotherhood_entity_id', brotherhoodId)
      .maybeSingle(),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .neq('status', 'archived')
      .maybeSingle(),
  ])

  if (outingResult.error || !outingResult.data) throw new Error('La salida no existe o no pertenece a esta Hermandad.')
  if (brotherhoodResult.error || !brotherhoodResult.data) throw new Error('La Hermandad no existe o está archivada.')

  return {
    supabase,
    brotherhoodId,
    outingId,
    upload,
    outing: outingResult.data,
    brotherhood: brotherhoodResult.data,
    storageRoot: `salidas/${outingId}`,
  }
}

function assertPreparedPath(storagePath, context) {
  const prefix = `${context.storageRoot}/`
  const fileName = storagePath.startsWith(prefix) ? storagePath.slice(prefix.length) : ''
  if (!storagePath || storagePath.startsWith('/') || storagePath.includes('..') || !FILE_PATTERN.test(fileName)) {
    throw new Error('La ruta temporal de la imagen no pertenece a esta salida.')
  }
  if (!fileName.endsWith(`.${context.upload.extension}`)) {
    throw new Error('El formato seleccionado no coincide con la ruta temporal.')
  }
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la imagen de la salida', error)
}

function refresh(context) {
  revalidatePath('/panel')
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${context.brotherhoodId}/salidas`)
  revalidatePath('/hermandades')
  revalidatePath('/extraordinarias')
  revalidatePath('/glorias')
  revalidatePath('/')
  if (context.brotherhood.slug) revalidatePath(`/hermandades/${context.brotherhood.slug}`)
}

function actionError(error) {
  return error instanceof Error && error.message
    ? error.message
    : 'No se ha podido actualizar la imagen de la salida.'
}

export async function prepareOutingHeroImageUploadAction(formData) {
  await requirePanelEditor()
  try {
    const context = await loadContext(formData)
    const storagePath = `${context.storageRoot}/${randomUUID()}.${context.upload.extension}`
    const signed = await context.supabase.storage.from(BUCKET).createSignedUploadUrl(storagePath, { upsert: false })
    if (signed.error) throw new Error(`No se pudo preparar la subida: ${signed.error.message}`)
    if (!signed.data?.token) throw new Error('No se pudo generar el permiso temporal de subida.')
    return { upload: { path: storagePath, token: signed.data.token } }
  } catch (error) {
    console.error('[Hilo Cofrade] Error al preparar imagen de salida', error)
    return { error: actionError(error) }
  }
}

export async function saveOutingHeroImageUploadAction(formData) {
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
      label: 'La imagen de la salida',
    })

    const alt = value(formData, 'alt_text')
    if (!alt) throw new Error('El texto alternativo es obligatorio.')
    const credit = value(formData, 'credit') || null
    const publicUrl = context.supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
    if (!publicUrl) throw new Error('No se pudo resolver la URL pública de la imagen.')

    const payload = {
      hero_image_path: publicUrl,
      hero_image_alt: alt,
      hero_image_credit: credit,
    }
    const updated = await context.supabase
      .from('outings')
      .update(payload)
      .eq('id', context.outingId)
      .eq('brotherhood_entity_id', context.brotherhoodId)
    if (updated.error) throw new Error(`No se pudo asociar la imagen a la salida: ${updated.error.message}`)
    cleanupPath = ''

    await audit(context.supabase, user, {
      action_type: 'update',
      object_type: 'outing',
      object_id: context.outingId,
      entity_id: context.brotherhoodId,
      summary: `Imagen de salida actualizada: ${context.outing.title || context.outing.outing_type}`,
      changed_fields: {
        ...payload,
        previous_path: context.outing.hero_image_path || null,
        file_type: context.upload.fileType,
        file_size: context.upload.fileSize,
        upload_mode: 'signed_direct',
      },
    })

    const previousPath = storagePathFromPublicUrl(context.outing.hero_image_path || '', BUCKET)
    if (previousPath && previousPath.startsWith(`${context.storageRoot}/`) && previousPath !== storagePath) {
      const removed = await context.supabase.storage.from(BUCKET).remove([previousPath])
      if (removed.error) console.error('[Hilo Cofrade] No se pudo limpiar la imagen anterior de la salida', removed.error)
    }

    refresh(context)
    return { saved: true, publicUrl }
  } catch (error) {
    if (cleanupPath && context?.supabase) await context.supabase.storage.from(BUCKET).remove([cleanupPath])
    console.error('[Hilo Cofrade] Error al guardar imagen de salida', error)
    return { error: actionError(error) }
  }
}
