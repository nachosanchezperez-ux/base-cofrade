'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const PUBLICATION_RIGHTS = new Set(['owned', 'authorized', 'licensed', 'public_domain'])
const MEDIA_ROLES = new Set(['poster', 'gallery'])
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_GALLERY_ITEMS = 12

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function relationOne(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
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

function validateFile(file) {
  if (!(file instanceof File) || file.size === 0) throw new Error('Selecciona una imagen para subir.')
  if (!IMAGE_TYPES.has(file.type)) throw new Error('La imagen debe ser JPG, PNG, WEBP o AVIF.')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('La imagen no puede superar 10 MB.')
}

async function cleanupAssetIfUnused(supabase, mediaAssetId, storagePath = '') {
  if (!mediaAssetId) return
  const [outingLinks, entityLinks] = await Promise.all([
    supabase.from('outing_media').select('id', { count: 'exact', head: true }).eq('media_asset_id', mediaAssetId),
    supabase.from('entity_media').select('id', { count: 'exact', head: true }).eq('media_asset_id', mediaAssetId),
  ])
  if (outingLinks.error || entityLinks.error) return
  if ((outingLinks.count || 0) > 0 || (entityLinks.count || 0) > 0) return

  const deleted = await supabase.from('media_assets').delete().eq('id', mediaAssetId)
  if (deleted.error) return
  if (storagePath) {
    const removed = await supabase.storage.from('hilo-media').remove([storagePath])
    if (removed.error) console.error('[Hilo Cofrade] No se pudo retirar el archivo multimedia huérfano', removed.error)
  }
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

  if (hasNewFile) validateFile(file)

  const hasImageAfterSave = hasNewFile || Boolean(outing.hero_image_path)
  if (hasImageAfterSave && !altText) throw new Error('Añade una descripción accesible de la fotografía.')

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
    .update({ hero_image_path: nextPath, hero_image_alt: altText || null, hero_image_credit: credit })
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
  redirect(`/panel/extraordinarias/${outing.id}?saved=image#fotografia`)
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
  redirect(`/panel/extraordinarias/${outing.id}?saved=removed#fotografia`)
}

export async function saveOutingMediaAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const outing = await loadOuting(supabase, outingId)
  const role = value(formData, 'role')
  if (!MEDIA_ROLES.has(role)) throw new Error('Tipo de recurso multimedia no válido.')

  const file = formData.get('file')
  validateFile(file)
  const altText = value(formData, 'alt_text')
  if (!altText) throw new Error('Añade una descripción accesible de la imagen.')
  const credit = value(formData, 'credit') || null
  const rightsStatus = value(formData, 'rights_status') || 'authorized'
  if (!PUBLICATION_RIGHTS.has(rightsStatus)) throw new Error('Selecciona un estado de derechos que permita publicar la imagen.')

  if (role === 'gallery') {
    const galleryCount = await supabase.from('outing_media').select('id', { count: 'exact', head: true }).eq('outing_id', outing.id).eq('role', 'gallery')
    if (galleryCount.error) throw new Error(`No se pudo comprobar la galería: ${galleryCount.error.message}`)
    if ((galleryCount.count || 0) >= MAX_GALLERY_ITEMS) throw new Error(`La galería admite un máximo de ${MAX_GALLERY_ITEMS} imágenes.`)
  }

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const storagePath = `${outing.id}/extraordinarias/${role}-${randomUUID()}.${extension}`
  const uploaded = await supabase.storage.from('hilo-media').upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  })
  if (uploaded.error) throw new Error(`No se pudo subir la imagen: ${uploaded.error.message}`)

  const assetResult = await supabase
    .from('media_assets')
    .insert({
      storage_path: storagePath,
      media_type: 'image',
      title: file.name,
      alt_text: altText,
      author_name: credit,
      rights_status: rightsStatus,
    })
    .select('id, storage_path')
    .single()

  if (assetResult.error) {
    await supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo registrar la imagen: ${assetResult.error.message}`)
  }

  let previousAsset = null
  let linkId = ''

  if (role === 'poster') {
    const existing = await supabase
      .from('outing_media')
      .select('id, media_asset_id, media_assets(storage_path)')
      .eq('outing_id', outing.id)
      .eq('role', 'poster')
      .maybeSingle()
    if (existing.error) throw new Error(`No se pudo comprobar el cartel actual: ${existing.error.message}`)

    if (existing.data) {
      previousAsset = {
        id: existing.data.media_asset_id,
        storagePath: relationOne(existing.data.media_assets)?.storage_path || '',
      }
      const updated = await supabase
        .from('outing_media')
        .update({ media_asset_id: assetResult.data.id, sort_order: 0 })
        .eq('id', existing.data.id)
        .select('id')
        .single()
      if (updated.error) throw new Error(`No se pudo reemplazar el cartel: ${updated.error.message}`)
      linkId = updated.data.id
    } else {
      const inserted = await supabase
        .from('outing_media')
        .insert({ outing_id: outing.id, media_asset_id: assetResult.data.id, role, sort_order: 0 })
        .select('id')
        .single()
      if (inserted.error) throw new Error(`No se pudo vincular el cartel: ${inserted.error.message}`)
      linkId = inserted.data.id
    }
  } else {
    const maxOrder = await supabase
      .from('outing_media')
      .select('sort_order')
      .eq('outing_id', outing.id)
      .eq('role', 'gallery')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (maxOrder.error) throw new Error(`No se pudo ordenar la galería: ${maxOrder.error.message}`)
    const inserted = await supabase
      .from('outing_media')
      .insert({ outing_id: outing.id, media_asset_id: assetResult.data.id, role, sort_order: (maxOrder.data?.sort_order || 0) + 1 })
      .select('id')
      .single()
    if (inserted.error) throw new Error(`No se pudo añadir la imagen a la galería: ${inserted.error.message}`)
    linkId = inserted.data.id
  }

  if (previousAsset) await cleanupAssetIfUnused(supabase, previousAsset.id, previousAsset.storagePath)

  await audit(supabase, user, outing, `${role === 'poster' ? 'Cartel' : 'Imagen de galería'} actualizado en ${outing.title || 'Extraordinaria'}`, {
    outing_media_id: linkId,
    role,
    media_asset_id: assetResult.data.id,
    alt_text: altText,
    credit,
    rights_status: rightsStatus,
  })

  refresh(outing)
  redirect(`/panel/extraordinarias/${outing.id}?saved=${role}#${role === 'poster' ? 'cartel' : 'galeria'}`)
}

export async function removeOutingMediaAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const mediaLinkId = uuid(formData, 'outing_media_id')
  const outing = await loadOuting(supabase, outingId)

  const current = await supabase
    .from('outing_media')
    .select('id, role, media_asset_id, media_assets(storage_path)')
    .eq('id', mediaLinkId)
    .eq('outing_id', outing.id)
    .maybeSingle()
  if (current.error) throw new Error(`No se pudo cargar el recurso: ${current.error.message}`)
  if (!current.data) throw new Error('El recurso multimedia ya no existe.')

  const deleted = await supabase.from('outing_media').delete().eq('id', current.data.id)
  if (deleted.error) throw new Error(`No se pudo retirar el recurso: ${deleted.error.message}`)

  const asset = relationOne(current.data.media_assets)
  await cleanupAssetIfUnused(supabase, current.data.media_asset_id, asset?.storage_path || '')

  await audit(supabase, user, outing, `${current.data.role === 'poster' ? 'Cartel' : 'Imagen de galería'} retirado de ${outing.title || 'Extraordinaria'}`, {
    outing_media_id: current.data.id,
    role: current.data.role,
    media_asset_id: current.data.media_asset_id,
  })

  refresh(outing)
  redirect(`/panel/extraordinarias/${outing.id}?saved=media-removed#${current.data.role === 'poster' ? 'cartel' : 'galeria'}`)
}
