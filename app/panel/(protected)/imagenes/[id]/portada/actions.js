'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const PUBLICATION_RIGHTS = new Set(['owned', 'authorized', 'licensed', 'public_domain'])
const FIT_MODES = new Set(['auto', 'cover', 'contain'])
const HERO_RELATION = 'hero'
const FALLBACK_RELATION = 'gallery'

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
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

function fitMode(formData) {
  const candidate = value(formData, 'fit_mode') || 'cover'
  if (!FIT_MODES.has(candidate)) throw new Error('Modo de encaje no válido.')
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

function mediaRow(link) {
  return Array.isArray(link?.media_assets) ? link.media_assets[0] : link?.media_assets
}

async function loadImageEntity(supabase, imageId) {
  return assertRow(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .neq('status', 'archived')
      .maybeSingle(),
    'La Imagen no existe o está archivada.'
  )
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la portada de la Imagen', error)
}

async function refreshImage(supabase, imageId) {
  const { data } = await supabase
    .from('entities')
    .select('slug')
    .eq('id', imageId)
    .maybeSingle()

  revalidatePath(`/panel/imagenes/${imageId}`)
  revalidatePath(`/panel/imagenes/${imageId}/portada`)
  revalidatePath('/panel/multimedia')
  revalidatePath(`/panel/multimedia?entity=${imageId}`)
  revalidatePath('/imagenes')
  if (data?.slug) revalidatePath(`/imagenes/${data.slug}`)
}

function redirectSaved(imageId, saved) {
  redirect(`/panel/imagenes/${imageId}/portada?saved=${encodeURIComponent(saved)}`)
}

async function demoteHeroLink(supabase, link) {
  const duplicate = await supabase
    .from('entity_media')
    .select('id')
    .eq('entity_id', link.entity_id)
    .eq('media_asset_id', link.media_asset_id)
    .eq('relation_type', FALLBACK_RELATION)
    .neq('id', link.id)
    .limit(1)
    .maybeSingle()

  if (duplicate.error) throw new Error(`No se pudo comprobar la galería: ${duplicate.error.message}`)

  if (duplicate.data) {
    assertMutation(
      await supabase.from('entity_media').delete().eq('id', link.id),
      'No se pudo retirar la portada anterior'
    )
    return
  }

  assertMutation(
    await supabase
      .from('entity_media')
      .update({ relation_type: FALLBACK_RELATION, is_cover: false })
      .eq('id', link.id),
    'No se pudo devolver la portada anterior a la galería'
  )
}

export async function selectImageHeroAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuid(formData, 'image_id')
  const sourceLinkId = uuid(formData, 'source_link_id')
  const entity = await loadImageEntity(supabase, imageId)

  const sourceLink = assertRow(
    await supabase
      .from('entity_media')
      .select('id, entity_id, media_asset_id, relation_type, sort_order, focus_x, focus_y, mobile_focus_x, mobile_focus_y, fit_mode, media_assets(id, media_type, rights_status, title)')
      .eq('id', sourceLinkId)
      .eq('entity_id', imageId)
      .maybeSingle(),
    'La fotografía seleccionada ya no está vinculada a esta Imagen.'
  )
  const asset = mediaRow(sourceLink)
  if (!asset || asset.media_type !== 'image') throw new Error('El recurso seleccionado no es una imagen.')
  if (!PUBLICATION_RIGHTS.has(asset.rights_status)) {
    throw new Error('La fotografía no dispone de derechos válidos para publicarse como portada.')
  }

  const currentHeroes = assertMutation(
    await supabase
      .from('entity_media')
      .select('id, entity_id, media_asset_id, relation_type')
      .eq('entity_id', imageId)
      .eq('relation_type', HERO_RELATION),
    'No se pudo comprobar la portada actual'
  ) || []

  for (const hero of currentHeroes) {
    if (hero.media_asset_id === sourceLink.media_asset_id) continue
    await demoteHeroLink(supabase, hero)
  }

  const existingHero = currentHeroes.find((hero) => hero.media_asset_id === sourceLink.media_asset_id)
  const framing = {
    focus_x: Number(sourceLink.focus_x ?? 50),
    focus_y: Number(sourceLink.focus_y ?? 50),
    mobile_focus_x: sourceLink.mobile_focus_x === null || sourceLink.mobile_focus_x === undefined
      ? null
      : Number(sourceLink.mobile_focus_x),
    mobile_focus_y: sourceLink.mobile_focus_y === null || sourceLink.mobile_focus_y === undefined
      ? null
      : Number(sourceLink.mobile_focus_y),
    fit_mode: sourceLink.fit_mode || 'cover',
    sort_order: 0,
    is_cover: false,
    notes: 'Portada de la ficha',
  }

  const hero = existingHero
    ? assertRow(
        await supabase
          .from('entity_media')
          .update(framing)
          .eq('id', existingHero.id)
          .select('id')
          .single(),
        'No se pudo actualizar la portada de la ficha'
      )
    : assertRow(
        await supabase
          .from('entity_media')
          .insert({
            entity_id: imageId,
            media_asset_id: sourceLink.media_asset_id,
            relation_type: HERO_RELATION,
            ...framing,
          })
          .select('id')
          .single(),
        'No se pudo seleccionar la portada de la ficha'
      )

  await audit(supabase, user, {
    action_type: existingHero ? 'update' : 'link',
    object_type: 'entity_media',
    object_id: hero.id,
    entity_id: imageId,
    summary: `Portada de ficha seleccionada para ${entity.name}`,
    changed_fields: {
      media_asset_id: sourceLink.media_asset_id,
      relation_type: HERO_RELATION,
      source_relation_type: sourceLink.relation_type,
    },
  })
  await refreshImage(supabase, imageId)
  redirectSaved(imageId, 'selected')
}

export async function updateImageHeroFramingAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuid(formData, 'image_id')
  const linkId = uuid(formData, 'hero_link_id')
  const entity = await loadImageEntity(supabase, imageId)

  const payload = {
    focus_x: percentage(formData, 'focus_x', 50),
    focus_y: percentage(formData, 'focus_y', 50),
    mobile_focus_x: percentage(formData, 'mobile_focus_x', null),
    mobile_focus_y: percentage(formData, 'mobile_focus_y', null),
    fit_mode: fitMode(formData),
    is_cover: false,
  }

  const hero = assertRow(
    await supabase
      .from('entity_media')
      .update(payload)
      .eq('id', linkId)
      .eq('entity_id', imageId)
      .eq('relation_type', HERO_RELATION)
      .select('id, media_asset_id')
      .single(),
    'No se pudo guardar el encuadre de la portada'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'entity_media',
    object_id: hero.id,
    entity_id: imageId,
    summary: `Encuadre de portada actualizado para ${entity.name}`,
    changed_fields: payload,
  })
  await refreshImage(supabase, imageId)
  redirectSaved(imageId, 'framing')
}

export async function removeImageHeroAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuid(formData, 'image_id')
  const linkId = uuid(formData, 'hero_link_id')
  const entity = await loadImageEntity(supabase, imageId)

  const hero = assertRow(
    await supabase
      .from('entity_media')
      .select('id, entity_id, media_asset_id, relation_type')
      .eq('id', linkId)
      .eq('entity_id', imageId)
      .eq('relation_type', HERO_RELATION)
      .maybeSingle(),
    'La portada de la ficha ya no existe.'
  )

  await demoteHeroLink(supabase, hero)
  await audit(supabase, user, {
    action_type: 'unlink',
    object_type: 'entity_media',
    object_id: hero.id,
    entity_id: imageId,
    summary: `Portada de ficha retirada de ${entity.name}`,
    changed_fields: {
      media_asset_id: hero.media_asset_id,
      previous_relation_type: HERO_RELATION,
      next_relation_type: FALLBACK_RELATION,
    },
  })
  await refreshImage(supabase, imageId)
  redirectSaved(imageId, 'removed')
}
