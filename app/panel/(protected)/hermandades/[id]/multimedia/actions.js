'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const PUBLICATION_RIGHTS = new Set(['owned', 'authorized', 'licensed', 'public_domain'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function mediaExtension(file) {
  const byType = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
  }
  return byType[file.type] || file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
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

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la subida rápida', error)
}

export async function uploadBrotherhoodRelatedMediaAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const targetId = uuid(formData, 'entity_id')
  const [brotherhood, target] = await Promise.all([
    loadEntity(supabase, brotherhoodId, 'La Hermandad no existe o está archivada.'),
    loadEntity(supabase, targetId, 'La ficha de destino no existe o está archivada.'),
  ])

  if (brotherhood.entity_type !== 'brotherhood') throw new Error('La ficha de contexto no es una Hermandad.')
  await assertBrotherhoodTarget(supabase, brotherhoodId, target)

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) throw new Error('Selecciona una imagen para subir.')
  if (!IMAGE_TYPES.has(file.type)) throw new Error('La imagen debe ser JPG, PNG, WEBP, GIF o AVIF.')
  if (file.size > 10 * 1024 * 1024) throw new Error('La imagen no puede superar 10 MB.')

  const altText = value(formData, 'alt_text')
  const rightsStatus = value(formData, 'rights_status') || 'authorized'
  if (!altText) throw new Error('La descripción accesible es obligatoria.')
  if (!PUBLICATION_RIGHTS.has(rightsStatus)) throw new Error('El estado de derechos no permite publicar esta imagen.')

  const storagePath = `${targetId}/${randomUUID()}.${mediaExtension(file)}`
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
      title: value(formData, 'title') || target.name || file.name,
      caption: value(formData, 'caption') || null,
      alt_text: altText,
      author_name: value(formData, 'author_name') || null,
      rights_status: rightsStatus,
    })
    .select('id')
    .single()

  if (assetResult.error) {
    await supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo registrar la imagen: ${assetResult.error.message}`)
  }

  const previousCoverResult = await supabase
    .from('entity_media')
    .select('id')
    .eq('entity_id', targetId)
    .eq('is_cover', true)
  if (previousCoverResult.error) {
    await supabase.from('media_assets').delete().eq('id', assetResult.data.id)
    await supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo comprobar la fotografía principal anterior: ${previousCoverResult.error.message}`)
  }

  const previousCoverIds = (previousCoverResult.data || []).map((item) => item.id)
  if (previousCoverIds.length) {
    const previousCover = await supabase
      .from('entity_media')
      .update({ is_cover: false })
      .in('id', previousCoverIds)
    if (previousCover.error) {
      await supabase.from('media_assets').delete().eq('id', assetResult.data.id)
      await supabase.storage.from('hilo-media').remove([storagePath])
      throw new Error(`No se pudo actualizar la fotografía principal anterior: ${previousCover.error.message}`)
    }
  }

  const linkResult = await supabase
    .from('entity_media')
    .insert({
      entity_id: targetId,
      media_asset_id: assetResult.data.id,
      relation_type: 'cover',
      sort_order: 0,
      is_cover: true,
      focus_x: 50,
      focus_y: 50,
      fit_mode: 'auto',
    })
    .select('id')
    .single()

  if (linkResult.error) {
    if (previousCoverIds.length) {
      await supabase.from('entity_media').update({ is_cover: true }).in('id', previousCoverIds)
    }
    await supabase.from('media_assets').delete().eq('id', assetResult.data.id)
    await supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo vincular la imagen: ${linkResult.error.message}`)
  }

  await audit(supabase, user, {
    action_type: 'link',
    object_type: 'entity_media',
    object_id: linkResult.data.id,
    entity_id: targetId,
    summary: `Imagen principal incorporada a ${target.name} desde ${brotherhood.name}`,
    changed_fields: {
      brotherhood_id: brotherhoodId,
      media_asset_id: assetResult.data.id,
      relation_type: 'cover',
    },
  })

  revalidatePath('/panel')
  revalidatePath('/panel/multimedia')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/multimedia`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/patrimonio`)
  if (brotherhood.slug) revalidatePath(`/hermandades/${brotherhood.slug}`)

  if (target.entity_type === 'step') {
    revalidatePath(`/panel/pasos/${targetId}`)
    if (target.slug) revalidatePath(`/pasos/${target.slug}`)
  }

  if (target.entity_type === 'image') {
    revalidatePath(`/panel/imagenes/${targetId}`)
    if (target.slug) revalidatePath(`/imagenes/${target.slug}`)
  }

  const anchor = `contenido-${targetId}`
  redirect(`/panel/hermandades/${brotherhoodId}/multimedia?saved=uploaded#${anchor}`)
}
