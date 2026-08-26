'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const BUCKET = 'hilo-media'
const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
])
const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function uuid(formData, name) {
  const candidate = String(formData.get(name) || '').trim()
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function text(formData, name) {
  return String(formData.get(name) || '').trim() || null
}

function imageFile(formData) {
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) throw new Error('Selecciona una imagen para subir.')
  if (file.size > MAX_BYTES) throw new Error('La imagen supera el máximo permitido de 10 MB.')
  const extension = ALLOWED_TYPES.get(file.type)
  if (!extension) throw new Error('Formato no admitido. Usa JPG, PNG, WEBP, GIF o AVIF.')
  return { file, extension }
}

function safeSlug(value) {
  return String(value || 'banda')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'banda'
}

async function upload(supabase, { bandId, bandSlug, kind, file, extension }) {
  const path = `bandas/${safeSlug(bandSlug || bandId)}/${kind}.${extension}`
  const result = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: true,
  })
  if (result.error) throw new Error(`No se pudo subir la imagen: ${result.error.message}`)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

async function bandIdentity(supabase, bandId) {
  const { data, error } = await supabase
    .from('entities')
    .select('id, name, slug')
    .eq('id', bandId)
    .eq('entity_type', 'band')
    .single()
  if (error || !data) throw new Error('No se pudo validar la banda.')
  return data
}

async function refresh(bandId, slug) {
  revalidatePath('/panel/bandas')
  revalidatePath(`/panel/bandas/${bandId}`)
  revalidatePath(`/panel/bandas/${bandId}/multimedia`)
  revalidatePath('/bandas')
  if (slug) revalidatePath(`/bandas/${slug}`)
}

async function audit(supabase, user, payload) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...payload,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la subida multimedia', error)
}

export async function uploadBandLogoAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const band = await bandIdentity(supabase, bandId)
  const { file, extension } = imageFile(formData)
  const publicUrl = await upload(supabase, { bandId, bandSlug: band.slug, kind: 'logo', file, extension })

  const { error } = await supabase.from('bands').update({ logo_path: publicUrl }).eq('entity_id', bandId)
  if (error) throw new Error(`No se pudo asociar el logotipo a la banda: ${error.message}`)

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'band',
    object_id: bandId,
    entity_id: bandId,
    summary: `Logotipo actualizado: ${band.name}`,
    changed_fields: { logo_path: publicUrl },
  })
  await refresh(bandId, band.slug)
  redirect(`/panel/bandas/${bandId}/multimedia?saved=logo`)
}

export async function uploadBandHeroAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const band = await bandIdentity(supabase, bandId)
  const { file, extension } = imageFile(formData)
  const publicUrl = await upload(supabase, { bandId, bandSlug: band.slug, kind: 'principal', file, extension })
  const payload = {
    hero_image_path: publicUrl,
    hero_image_alt: text(formData, 'alt_text'),
    hero_image_credit: text(formData, 'credit'),
  }

  const { error } = await supabase.from('bands').update(payload).eq('entity_id', bandId)
  if (error) throw new Error(`No se pudo asociar la fotografía principal: ${error.message}`)

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'band',
    object_id: bandId,
    entity_id: bandId,
    summary: `Fotografía principal actualizada: ${band.name}`,
    changed_fields: payload,
  })
  await refresh(bandId, band.slug)
  redirect(`/panel/bandas/${bandId}/multimedia?saved=principal`)
}

export async function uploadBandBanderinAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const assetId = uuid(formData, 'asset_entity_id')
  const band = await bandIdentity(supabase, bandId)

  const { data: bandRow, error: bandError } = await supabase
    .from('bands')
    .select('banderin_entity_id')
    .eq('entity_id', bandId)
    .single()
  if (bandError) throw new Error(`No se pudo validar el banderín: ${bandError.message}`)

  const { data: asset, error: assetError } = await supabase
    .from('heritage_assets')
    .select('entity_id, parent_entity_id')
    .eq('entity_id', assetId)
    .single()
  if (assetError || !asset) throw new Error('No se encontró la pieza patrimonial seleccionada.')
  if (bandRow?.banderin_entity_id !== assetId && asset.parent_entity_id !== bandId) {
    throw new Error('La pieza seleccionada no pertenece a esta banda.')
  }

  const { file, extension } = imageFile(formData)
  const publicUrl = await upload(supabase, { bandId, bandSlug: band.slug, kind: 'banderin', file, extension })
  const payload = {
    public_image_path: publicUrl,
    public_image_alt: text(formData, 'alt_text') || `Banderín de ${band.name}`,
    public_image_credit: text(formData, 'credit'),
  }
  const { error } = await supabase.from('heritage_assets').update(payload).eq('entity_id', assetId)
  if (error) throw new Error(`No se pudo asociar la fotografía del banderín: ${error.message}`)

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'heritage_asset',
    object_id: assetId,
    entity_id: bandId,
    summary: `Imagen del banderín actualizada: ${band.name}`,
    changed_fields: payload,
  })
  await refresh(bandId, band.slug)
  redirect(`/panel/bandas/${bandId}/multimedia?saved=banderin`)
}
