'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

async function loadOuting(supabase, id) {
  const result = await supabase
    .from('outings')
    .select('id, slug, title, character, hero_image_path, hero_image_alt, hero_image_credit')
    .eq('id', id)
    .eq('character', 'extraordinary')
    .maybeSingle()

  if (result.error) throw new Error(`No se pudo cargar la extraordinaria: ${result.error.message}`)
  if (!result.data) throw new Error('La extraordinaria no existe.')
  return result.data
}

function storagePathFromPublicUrl(url = '') {
  const marker = '/storage/v1/object/public/hilo-media/'
  const index = String(url).indexOf(marker)
  if (index < 0) return ''
  return decodeURIComponent(String(url).slice(index + marker.length))
}

async function audit(supabase, user, outing, summary, changedFields) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: 'update',
    object_type: 'outing',
    object_id: outing.id,
    summary,
    changed_fields: changedFields,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de Extraordinarias', error)
}

function refresh(outing) {
  revalidatePath('/')
  revalidatePath('/extraordinarias')
  revalidatePath('/panel/extraordinarias')
  revalidatePath(`/panel/extraordinarias/${outing.id}`)
  if (outing.slug) revalidatePath(`/extraordinarias/${outing.slug}`)
}

export async function saveExtraordinaryImageAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const outing = await loadOuting(supabase, outingId)
  const file = formData.get('file')
  const hasNewFile = file instanceof File && file.size > 0
  const altText = value(formData, 'hero_image_alt')
  const credit = value(formData, 'hero_image_credit') || null

  if (hasNewFile) {
    if (!IMAGE_TYPES.has(file.type)) throw new Error('La fotografía debe ser JPG, PNG, WEBP o AVIF.')
    if (file.size > MAX_IMAGE_SIZE) throw new Error('La fotografía no puede superar 10 MB.')
  }

  const hasImageAfterSave = hasNewFile || Boolean(outing.hero_image_path)
  if (hasImageAfterSave && !altText) {
    throw new Error('Añade una descripción accesible de la fotografía.')
  }

  let nextPath = outing.hero_image_path || null
  let uploadedStoragePath = ''

  if (hasNewFile) {
    const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    uploadedStoragePath = `${outing.id}/extraordinaria-${randomUUID()}.${extension}`
    const uploaded = await supabase.storage.from('hilo-media').upload(uploadedStoragePath, file, {
      contentType: file.type,
      upsert: false,
    })
    if (uploaded.error) throw new Error(`No se pudo subir la fotografía: ${uploaded.error.message}`)

    nextPath = supabase.storage.from('hilo-media').getPublicUrl(uploadedStoragePath).data.publicUrl || ''
    if (!nextPath) {
      await supabase.storage.from('hilo-media').remove([uploadedStoragePath])
      throw new Error('No se pudo obtener la URL pública de la fotografía.')
    }
  }

  const updated = await supabase
    .from('outings')
    .update({
      hero_image_path: nextPath,
      hero_image_alt: altText || null,
      hero_image_credit: credit,
    })
    .eq('id', outing.id)
    .select('id')
    .single()

  if (updated.error) {
    if (uploadedStoragePath) await supabase.storage.from('hilo-media').remove([uploadedStoragePath])
    throw new Error(`No se pudo guardar la fotografía: ${updated.error.message}`)
  }

  const previousStoragePath = storagePathFromPublicUrl(outing.hero_image_path)
  if (uploadedStoragePath && previousStoragePath && previousStoragePath !== uploadedStoragePath) {
    const removed = await supabase.storage.from('hilo-media').remove([previousStoragePath])
    if (removed.error) console.error('[Hilo Cofrade] No se pudo retirar la fotografía anterior de Extraordinarias', removed.error)
  }

  await audit(supabase, user, outing, `Fotografía principal actualizada en ${outing.title || 'Extraordinaria'}`, {
    hero_image_path: nextPath,
    hero_image_alt: altText || null,
    hero_image_credit: credit,
  })

  refresh(outing)
  redirect(`/panel/extraordinarias/${outing.id}?saved=image`)
}

export async function removeExtraordinaryImageAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const outing = await loadOuting(supabase, outingId)

  const updated = await supabase
    .from('outings')
    .update({ hero_image_path: null, hero_image_alt: null, hero_image_credit: null })
    .eq('id', outing.id)
    .select('id')
    .single()
  if (updated.error) throw new Error(`No se pudo retirar la fotografía: ${updated.error.message}`)

  const storagePath = storagePathFromPublicUrl(outing.hero_image_path)
  if (storagePath) {
    const removed = await supabase.storage.from('hilo-media').remove([storagePath])
    if (removed.error) console.error('[Hilo Cofrade] No se pudo borrar el archivo de Storage', removed.error)
  }

  await audit(supabase, user, outing, `Fotografía principal retirada de ${outing.title || 'Extraordinaria'}`, {
    hero_image_path: null,
    hero_image_alt: null,
    hero_image_credit: null,
  })

  refresh(outing)
  redirect(`/panel/extraordinarias/${outing.id}?saved=removed`)
}
