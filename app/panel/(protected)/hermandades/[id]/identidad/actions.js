'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const SOCIAL_PLATFORMS = new Set(['website', 'facebook', 'instagram', 'x', 'youtube', 'tiktok', 'whatsapp'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function nullable(formData, name) {
  return value(formData, name) || null
}

function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
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

function integer(formData, name) {
  const candidate = Number.parseInt(value(formData, name), 10)
  return Number.isFinite(candidate) ? candidate : 0
}

function checked(formData, name) {
  return formData.get(name) === 'on'
}

function normalized(input = '') {
  return String(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

function slugify(input = '') {
  return normalized(input)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function officialUrl(formData) {
  const candidate = required(formData, 'url', 'La URL')
  let parsed
  try {
    parsed = new URL(candidate)
  } catch {
    throw new Error('La URL del enlace oficial no es válida.')
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('La URL debe comenzar por http:// o https://.')
  }
  return parsed.toString()
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
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la auditoría', error)
}

async function uniqueSlug(supabase, table, preferred, fallback = '') {
  const base = slugify(preferred) || 'registro'
  const alternatives = [base]
  if (fallback) alternatives.push(`${base}-${slugify(fallback)}`)

  for (const candidate of alternatives) {
    const { data, error } = await supabase.from(table).select('id').eq('slug', candidate).maybeSingle()
    if (error) throw new Error(`No se pudo comprobar el slug: ${error.message}`)
    if (!data) return candidate
  }

  const extended = alternatives.at(-1)
  for (let suffix = 2; suffix < 100; suffix += 1) {
    const candidate = `${extended}-${suffix}`
    const { data, error } = await supabase.from(table).select('id').eq('slug', candidate).maybeSingle()
    if (error) throw new Error(`No se pudo comprobar el slug: ${error.message}`)
    if (!data) return candidate
  }
  throw new Error('No se pudo generar un slug único.')
}

async function refreshBrotherhood(supabase, brotherhoodId) {
  const { data } = await supabase.from('entities').select('slug').eq('id', brotherhoodId).maybeSingle()
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/identidad`)
  revalidatePath('/panel/hermandades')
  revalidatePath('/hermandades')
  if (data?.slug) revalidatePath(`/hermandades/${data.slug}`)
}

function presenceUrl(brotherhoodId, params = {}, section = 'geografia') {
  const query = new URLSearchParams(Object.entries(params).filter(([, item]) => item !== null && item !== undefined && item !== ''))
  const suffix = query.size ? `?${query.toString()}` : ''
  return `/panel/hermandades/${brotherhoodId}/identidad${suffix}#${section}`
}

export async function createMunicipalityAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const payload = {
    name: required(formData, 'name', 'El nombre de la localidad'),
    province: required(formData, 'province', 'La provincia'),
    autonomous_community: required(formData, 'autonomous_community', 'La comunidad autónoma'),
    country: required(formData, 'country', 'El país'),
  }

  const { data: municipalities, error } = await supabase
    .from('municipalities')
    .select('id, name, province, autonomous_community, country')
  if (error) throw new Error(`No se pudieron comprobar las localidades existentes: ${error.message}`)

  const existing = (municipalities || []).find((item) => (
    normalized(item.name) === normalized(payload.name)
    && normalized(item.province) === normalized(payload.province)
    && normalized(item.autonomous_community) === normalized(payload.autonomous_community)
    && normalized(item.country) === normalized(payload.country)
  ))
  if (existing) redirect(presenceUrl(brotherhoodId, { municipality: existing.id, reused: 'municipality' }))

  const slug = await uniqueSlug(supabase, 'municipalities', payload.name, payload.province)
  const municipality = assertMutation(
    await supabase.from('municipalities').insert({ ...payload, slug }).select('id').single(),
    'No se pudo crear la localidad'
  )

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'municipality',
    object_id: municipality.id,
    entity_id: brotherhoodId,
    summary: `Localidad creada: ${payload.name}`,
    changed_fields: { ...payload, slug },
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirect(presenceUrl(brotherhoodId, { municipality: municipality.id, saved: 'municipality' }))
}

export async function createPlaceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const municipalityId = uuid(formData, 'municipality_id')
  const name = required(formData, 'name', 'El nombre del Lugar')

  const [{ data: municipality, error: municipalityError }, { data: places, error: placesError }] = await Promise.all([
    supabase.from('municipalities').select('id, name, slug').eq('id', municipalityId).maybeSingle(),
    supabase.from('places').select('id, name').eq('municipality_id', municipalityId),
  ])
  if (municipalityError) throw new Error(`No se pudo validar la localidad: ${municipalityError.message}`)
  if (!municipality) throw new Error('La localidad seleccionada no existe.')
  if (placesError) throw new Error(`No se pudieron comprobar los Lugares existentes: ${placesError.message}`)

  const existing = (places || []).find((item) => normalized(item.name) === normalized(name))
  if (existing) {
    redirect(presenceUrl(brotherhoodId, { municipality: municipalityId, place: existing.id, reused: 'place' }))
  }

  const slug = await uniqueSlug(supabase, 'places', name, municipality.slug || municipality.name)
  const payload = {
    municipality_id: municipalityId,
    name,
    slug,
    place_type: nullable(formData, 'place_type'),
    address: nullable(formData, 'address'),
    opening_hours_text: nullable(formData, 'opening_hours_text'),
    opening_hours_verified_at: nullable(formData, 'opening_hours_verified_at'),
  }
  const place = assertMutation(
    await supabase.from('places').insert(payload).select('id').single(),
    'No se pudo crear el Lugar'
  )

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'place',
    object_id: place.id,
    entity_id: brotherhoodId,
    summary: `Lugar creado: ${name} · ${municipality.name}`,
    changed_fields: payload,
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirect(presenceUrl(brotherhoodId, { municipality: municipalityId, place: place.id, saved: 'place' }))
}

export async function updateBrotherhoodPresenceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  let municipalityId = optionalUuid(formData, 'municipality_id')
  const placeId = optionalUuid(formData, 'canonical_see_place_id')

  if (placeId) {
    const { data: place, error } = await supabase
      .from('places')
      .select('id, municipality_id, name')
      .eq('id', placeId)
      .maybeSingle()
    if (error) throw new Error(`No se pudo validar la Sede canónica: ${error.message}`)
    if (!place) throw new Error('La Sede canónica seleccionada no existe.')
    if (!municipalityId && place.municipality_id) municipalityId = place.municipality_id
    if (municipalityId && place.municipality_id && municipalityId !== place.municipality_id) {
      throw new Error('La Sede canónica seleccionada pertenece a una localidad diferente.')
    }
  }

  const payload = {
    municipality_id: municipalityId,
    canonical_see_place_id: placeId,
  }
  assertMutation(
    await supabase.from('brotherhoods').update(payload).eq('entity_id', brotherhoodId).select('entity_id').single(),
    'No se pudo actualizar la localidad y la Sede canónica'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'brotherhood',
    object_id: brotherhoodId,
    entity_id: brotherhoodId,
    summary: 'Localidad y Sede canónica actualizadas',
    changed_fields: payload,
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirect(presenceUrl(brotherhoodId, { saved: 'presence' }))
}

export async function updatePlaceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const placeId = uuid(formData, 'place_id')
  const municipalityId = uuid(formData, 'municipality_id')
  const name = required(formData, 'name', 'El nombre del Lugar')

  const { data: siblings, error } = await supabase
    .from('places')
    .select('id, name')
    .eq('municipality_id', municipalityId)
  if (error) throw new Error(`No se pudieron comprobar otros Lugares: ${error.message}`)
  const duplicate = (siblings || []).find((item) => item.id !== placeId && normalized(item.name) === normalized(name))
  if (duplicate) throw new Error('Ya existe otro Lugar con ese nombre en la misma localidad.')

  const payload = {
    municipality_id: municipalityId,
    name,
    place_type: nullable(formData, 'place_type'),
    address: nullable(formData, 'address'),
    opening_hours_text: nullable(formData, 'opening_hours_text'),
    opening_hours_verified_at: nullable(formData, 'opening_hours_verified_at'),
  }
  assertMutation(
    await supabase.from('places').update(payload).eq('id', placeId).select('id').single(),
    'No se pudo actualizar el Lugar'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'place',
    object_id: placeId,
    entity_id: brotherhoodId,
    summary: `Lugar actualizado: ${name}`,
    changed_fields: payload,
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirect(presenceUrl(brotherhoodId, { municipality: municipalityId, place: placeId, saved: 'place-updated' }))
}

export async function savePresenceSocialLinkAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const linkId = optionalUuid(formData, 'link_id')
  const platform = required(formData, 'platform', 'La plataforma')
  if (!SOCIAL_PLATFORMS.has(platform)) throw new Error('Plataforma no válida.')

  if (!linkId) {
    const { data: existing, error } = await supabase
      .from('entity_social_links')
      .select('id')
      .eq('entity_id', brotherhoodId)
      .eq('platform', platform)
      .maybeSingle()
    if (error) throw new Error(`No se pudo comprobar el enlace existente: ${error.message}`)
    if (existing) redirect(presenceUrl(brotherhoodId, { duplicate: platform }, 'redes'))
  }

  const payload = {
    entity_id: brotherhoodId,
    platform,
    url: officialUrl(formData),
    label: nullable(formData, 'label'),
    display_order: integer(formData, 'display_order'),
    is_public: checked(formData, 'is_public'),
  }
  const result = linkId
    ? await supabase.from('entity_social_links').update(payload).eq('id', linkId).eq('entity_id', brotherhoodId).select('id').single()
    : await supabase.from('entity_social_links').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar el enlace oficial')

  await audit(supabase, user, {
    action_type: linkId ? 'update' : 'create',
    object_type: 'entity_social_link',
    object_id: saved.id,
    entity_id: brotherhoodId,
    summary: `${linkId ? 'Enlace actualizado' : 'Enlace creado'}: ${platform}`,
    changed_fields: payload,
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirect(presenceUrl(brotherhoodId, { saved: 'social' }, 'redes'))
}
