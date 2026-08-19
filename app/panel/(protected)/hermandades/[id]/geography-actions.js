'use server'

import { revalidatePath } from 'next/cache'
import { PUBLIC_CACHE_TAGS, revalidatePublicData } from '@/lib/cache/public-cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

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

function uuidValue(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
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
  revalidatePath('/panel/hermandades')
  revalidatePath('/hermandades')
  if (data?.slug) revalidatePath(`/hermandades/${data.slug}`)
  revalidatePublicData(PUBLIC_CACHE_TAGS.BROTHERHOODS)
}

function editorUrl(brotherhoodId, params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, item]) => item !== null && item !== undefined && item !== ''))
  const suffix = query.size ? `?${query.toString()}` : ''
  return `/panel/hermandades/${brotherhoodId}${suffix}#general`
}

async function assignMunicipality(supabase, brotherhoodId, municipalityId) {
  const { data: brotherhood, error } = await supabase
    .from('brotherhoods')
    .select('canonical_see_place_id')
    .eq('entity_id', brotherhoodId)
    .maybeSingle()
  if (error) throw new Error(`No se pudo validar la Hermandad: ${error.message}`)
  if (!brotherhood) throw new Error('La Hermandad no existe.')

  let canonicalSeePlaceId = brotherhood.canonical_see_place_id
  if (canonicalSeePlaceId) {
    const { data: place, error: placeError } = await supabase
      .from('places')
      .select('municipality_id')
      .eq('id', canonicalSeePlaceId)
      .maybeSingle()
    if (placeError) throw new Error(`No se pudo validar la Sede actual: ${placeError.message}`)
    if (!place || place.municipality_id !== municipalityId) canonicalSeePlaceId = null
  }

  assertMutation(
    await supabase
      .from('brotherhoods')
      .update({ municipality_id: municipalityId, canonical_see_place_id: canonicalSeePlaceId })
      .eq('entity_id', brotherhoodId)
      .select('entity_id')
      .single(),
    'No se pudo asignar la Localidad a la Hermandad'
  )
}

async function assignCanonicalPlace(supabase, brotherhoodId, placeId, municipalityId) {
  assertMutation(
    await supabase
      .from('brotherhoods')
      .update({ municipality_id: municipalityId, canonical_see_place_id: placeId })
      .eq('entity_id', brotherhoodId)
      .select('entity_id')
      .single(),
    'No se pudo asignar la Sede canónica a la Hermandad'
  )
}

export async function createMunicipalityAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuidValue(formData, 'brotherhood_id')
  const payload = {
    name: required(formData, 'new_municipality_name', 'El nombre de la localidad'),
    province: required(formData, 'new_municipality_province', 'La provincia'),
    autonomous_community: required(formData, 'new_municipality_autonomous_community', 'La comunidad autónoma'),
    country: required(formData, 'new_municipality_country', 'El país'),
  }

  const { data: municipalities, error } = await supabase
    .from('municipalities')
    .select('id, name, province, autonomous_community, country')
  if (error) throw new Error(`No se pudieron comprobar las localidades existentes: ${error.message}`)

  let municipality = (municipalities || []).find((item) => (
    normalized(item.name) === normalized(payload.name)
    && normalized(item.province) === normalized(payload.province)
    && normalized(item.autonomous_community) === normalized(payload.autonomous_community)
    && normalized(item.country) === normalized(payload.country)
  )) || null

  if (!municipality) {
    const slug = await uniqueSlug(supabase, 'municipalities', payload.name, payload.province)
    municipality = assertMutation(
      await supabase.from('municipalities').insert({ ...payload, slug }).select('id, name').single(),
      'No se pudo crear la localidad'
    )
    await audit(supabase, user, {
      action_type: 'create', object_type: 'municipality', object_id: municipality.id, entity_id: brotherhoodId,
      summary: `Localidad creada: ${payload.name}`, changed_fields: { ...payload, slug },
    })
  }

  await assignMunicipality(supabase, brotherhoodId, municipality.id)
  await audit(supabase, user, {
    action_type: 'update', object_type: 'brotherhood', object_id: brotherhoodId, entity_id: brotherhoodId,
    summary: `Localidad asignada: ${payload.name}`,
    changed_fields: { municipality_id: municipality.id },
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirect(editorUrl(brotherhoodId, { saved: 'municipality' }))
}

export async function createPlaceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuidValue(formData, 'brotherhood_id')
  const municipalityId = uuidValue(formData, 'new_place_municipality_id')
  const name = required(formData, 'new_place_name', 'El nombre del Lugar')

  const [{ data: municipality, error: municipalityError }, { data: places, error: placesError }] = await Promise.all([
    supabase.from('municipalities').select('id, name, slug').eq('id', municipalityId).maybeSingle(),
    supabase.from('places').select('id, name').eq('municipality_id', municipalityId),
  ])
  if (municipalityError) throw new Error(`No se pudo validar la localidad: ${municipalityError.message}`)
  if (!municipality) throw new Error('La localidad seleccionada no existe.')
  if (placesError) throw new Error(`No se pudieron comprobar los Lugares existentes: ${placesError.message}`)

  let place = (places || []).find((item) => normalized(item.name) === normalized(name)) || null

  if (!place) {
    const slug = await uniqueSlug(supabase, 'places', name, municipality.slug || municipality.name)
    const payload = {
      municipality_id: municipalityId,
      name,
      slug,
      place_type: nullable(formData, 'new_place_type'),
      address: nullable(formData, 'new_place_address'),
      opening_hours_text: nullable(formData, 'new_place_opening_hours_text'),
      opening_hours_verified_at: nullable(formData, 'new_place_opening_hours_verified_at'),
    }
    place = assertMutation(
      await supabase.from('places').insert(payload).select('id, name').single(),
      'No se pudo crear el Lugar'
    )
    await audit(supabase, user, {
      action_type: 'create', object_type: 'place', object_id: place.id, entity_id: brotherhoodId,
      summary: `Lugar creado: ${name} · ${municipality.name}`, changed_fields: payload,
    })
  }

  await assignCanonicalPlace(supabase, brotherhoodId, place.id, municipalityId)
  await audit(supabase, user, {
    action_type: 'update', object_type: 'brotherhood', object_id: brotherhoodId, entity_id: brotherhoodId,
    summary: `Sede canónica asignada: ${place.name || name}`,
    changed_fields: { municipality_id: municipalityId, canonical_see_place_id: place.id },
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirect(editorUrl(brotherhoodId, { saved: 'place' }))
}

export async function updatePlaceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuidValue(formData, 'brotherhood_id')
  const placeId = uuidValue(formData, 'place_id')
  const municipalityId = uuidValue(formData, 'place_municipality_id')
  const name = required(formData, 'place_name', 'El nombre del Lugar')

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
    address: nullable(formData, 'place_address'),
    opening_hours_text: nullable(formData, 'place_opening_hours_text'),
    opening_hours_verified_at: nullable(formData, 'place_opening_hours_verified_at'),
  }
  assertMutation(
    await supabase.from('places').update(payload).eq('id', placeId).select('id').single(),
    'No se pudo actualizar el Lugar'
  )

  const { data: brotherhood, error: brotherhoodError } = await supabase
    .from('brotherhoods')
    .select('canonical_see_place_id')
    .eq('entity_id', brotherhoodId)
    .maybeSingle()
  if (brotherhoodError) throw new Error(`No se pudo validar la Hermandad: ${brotherhoodError.message}`)
  if (brotherhood?.canonical_see_place_id === placeId) {
    await assignCanonicalPlace(supabase, brotherhoodId, placeId, municipalityId)
  }

  await audit(supabase, user, {
    action_type: 'update', object_type: 'place', object_id: placeId, entity_id: brotherhoodId,
    summary: `Lugar actualizado: ${name}`, changed_fields: payload,
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirect(editorUrl(brotherhoodId, { saved: 'place-updated' }))
}
