'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { getBrotherhoodHeroWorkspace } from '@/lib/panel/brotherhood-hero'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const PUBLICATION_RIGHTS = new Set(['owned', 'authorized', 'licensed', 'public_domain'])
const FIT_MODES = new Set(['auto', 'cover', 'contain'])
const HERO_RELATION = 'hero'

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
  const candidate = value(formData, 'fit_mode') || 'auto'
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

async function loadBrotherhood(supabase, brotherhoodId) {
  return assertRow(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .neq('status', 'archived')
      .maybeSingle(),
    'La Hermandad no existe o está archivada.'
  )
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la portada de la Hermandad', error)
}

async function refreshBrotherhood(supabase, brotherhoodId) {
  const { data } = await supabase
    .from('entities')
    .select('slug')
    .eq('id', brotherhoodId)
    .maybeSingle()

  revalidatePath('/panel')
  revalidatePath('/panel/hermandades')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/portada`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/multimedia`)
  revalidatePath('/hermandades')
  if (data?.slug) revalidatePath(`/hermandades/${data.slug}`)
}

function redirectSaved(brotherhoodId, saved) {
  redirect(`/panel/hermandades/${brotherhoodId}/portada?saved=${encodeURIComponent(saved)}`)
}

export async function selectBrotherhoodHeroAction(formData) {
  const user = await requirePanelEditor()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const mediaAssetId = uuid(formData, 'media_asset_id')
  const workspace = await getBrotherhoodHeroWorkspace(brotherhoodId)
  if (!workspace) throw new Error('La Hermandad no existe o está archivada.')

  const source = workspace.candidates.find((item) => item.media_asset_id === mediaAssetId)
  if (!source) throw new Error('La fotografía seleccionada ya no pertenece al archivo visual de esta Hermandad.')
  if (source.asset?.media_type !== 'image' || !PUBLICATION_RIGHTS.has(source.asset?.rights_status)) {
    throw new Error('La fotografía no dispone de derechos válidos para publicarse como portada.')
  }

  const supabase = await createClient()
  const entity = await loadBrotherhood(supabase, brotherhoodId)
  const currentHeroes = assertMutation(
    await supabase
      .from('entity_media')
      .select('id, media_asset_id')
      .eq('entity_id', brotherhoodId)
      .eq('relation_type', HERO_RELATION),
    'No se pudo comprobar la portada actual'
  ) || []

  const otherHeroIds = currentHeroes
    .filter((item) => item.media_asset_id !== mediaAssetId)
    .map((item) => item.id)

  const existingHero = currentHeroes.find((item) => item.media_asset_id === mediaAssetId)
  const framing = {
    relation_type: HERO_RELATION,
    sort_order: 0,
    is_cover: false,
    notes: 'Portada de la Hermandad',
    focus_x: 50,
    focus_y: 50,
    mobile_focus_x: null,
    mobile_focus_y: null,
    fit_mode: 'auto',
  }

  const hero = existingHero
    ? assertRow(
        await supabase
          .from('entity_media')
          .update(framing)
          .eq('id', existingHero.id)
          .select('id')
          .single(),
        'No se pudo actualizar la portada de la Hermandad'
      )
    : assertRow(
        await supabase
          .from('entity_media')
          .insert({
            entity_id: brotherhoodId,
            media_asset_id: mediaAssetId,
            ...framing,
          })
          .select('id')
          .single(),
        'No se pudo seleccionar la portada de la Hermandad'
      )

  if (otherHeroIds.length) {
    const removal = await supabase.from('entity_media').delete().in('id', otherHeroIds)
    if (removal.error) {
      if (!existingHero) {
        const rollback = await supabase.from('entity_media').delete().eq('id', hero.id)
        if (rollback.error) {
          console.error('[Hilo Cofrade] No se pudo revertir la nueva portada tras fallar el reemplazo', rollback.error)
        }
      }
      throw new Error(`No se pudo retirar la portada anterior: ${removal.error.message}`)
    }
  }

  await audit(supabase, user, {
    action_type: existingHero ? 'update' : 'link',
    object_type: 'entity_media',
    object_id: hero.id,
    entity_id: brotherhoodId,
    summary: `Portada de Hermandad seleccionada para ${entity.name}`,
    changed_fields: {
      media_asset_id: mediaAssetId,
      relation_type: HERO_RELATION,
      source_type: source.sourceType,
      source_name: source.sourceName,
      source_relation_type: source.relation_type,
      fit_mode: 'auto',
    },
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'selected')
}

export async function updateBrotherhoodHeroFramingAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const linkId = uuid(formData, 'hero_link_id')
  const entity = await loadBrotherhood(supabase, brotherhoodId)
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
      .eq('entity_id', brotherhoodId)
      .eq('relation_type', HERO_RELATION)
      .select('id, media_asset_id')
      .single(),
    'No se pudo guardar el encuadre de la portada'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'entity_media',
    object_id: hero.id,
    entity_id: brotherhoodId,
    summary: `Encuadre de portada actualizado para ${entity.name}`,
    changed_fields: payload,
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'framing')
}

export async function removeBrotherhoodHeroAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const linkId = uuid(formData, 'hero_link_id')
  const entity = await loadBrotherhood(supabase, brotherhoodId)

  const hero = assertRow(
    await supabase
      .from('entity_media')
      .select('id, media_asset_id')
      .eq('id', linkId)
      .eq('entity_id', brotherhoodId)
      .eq('relation_type', HERO_RELATION)
      .maybeSingle(),
    'La portada de la Hermandad ya no existe.'
  )

  assertMutation(
    await supabase.from('entity_media').delete().eq('id', hero.id),
    'No se pudo retirar la portada de la Hermandad'
  )

  await audit(supabase, user, {
    action_type: 'unlink',
    object_type: 'entity_media',
    object_id: hero.id,
    entity_id: brotherhoodId,
    summary: `Portada de Hermandad retirada de ${entity.name}`,
    changed_fields: {
      media_asset_id: hero.media_asset_id,
      previous_relation_type: HERO_RELATION,
      source_media_preserved: true,
    },
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'removed')
}
