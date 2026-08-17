'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const RELEASE_TYPES = new Set(['album', 'ep', 'single', 'live', 'compilation', 'other'])

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
  const raw = value(formData, name)
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : null
}

function editorialStatus(formData) {
  const candidate = value(formData, 'status') || 'draft'
  if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.')
  return candidate
}

function releaseType(formData) {
  const candidate = value(formData, 'release_type') || 'album'
  if (!RELEASE_TYPES.has(candidate)) throw new Error('Tipo de publicación no válido.')
  return candidate
}

function optionalUrl(formData, name, label) {
  const candidate = nullable(formData, name)
  if (!candidate) return null
  try {
    const parsed = new URL(candidate)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error()
    return parsed.toString()
  } catch {
    throw new Error(`${label} no es válido.`)
  }
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

async function requireBand(supabase, bandId) {
  const band = assertMutation(
    await supabase
      .from('entities')
      .select('id, name, slug')
      .eq('id', bandId)
      .eq('entity_type', 'band')
      .maybeSingle(),
    'No se pudo consultar la banda'
  )
  if (!band) throw new Error('La banda indicada no existe.')
  return band
}

async function requireRelease(supabase, bandId, releaseId) {
  const release = assertMutation(
    await supabase
      .from('band_releases')
      .select('id, title')
      .eq('id', releaseId)
      .eq('band_entity_id', bandId)
      .maybeSingle(),
    'No se pudo consultar el lanzamiento'
  )
  if (!release) throw new Error('El lanzamiento no pertenece a esta banda.')
  return release
}

async function refreshDiscography(supabase, bandId) {
  const band = await requireBand(supabase, bandId)
  revalidatePath('/panel/bandas')
  revalidatePath(`/panel/bandas/${bandId}`)
  revalidatePath(`/panel/bandas/${bandId}/discografia`)
  revalidatePath('/bandas')
  if (band.slug) revalidatePath(`/bandas/${band.slug}`)
  return band
}

function redirectSaved(bandId, kind, anchor = 'discografia') {
  redirect(`/panel/bandas/${bandId}/discografia?saved=${kind}#${anchor}`)
}

export async function saveBandReleaseAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const releaseId = optionalUuid(formData, 'release_id')
  await requireBand(supabase, bandId)

  const releaseYear = integer(formData, 'release_year')
  if (releaseYear && (releaseYear < 1800 || releaseYear > 2200)) throw new Error('El año del lanzamiento no es válido.')
  const ordinalNumber = integer(formData, 'ordinal_number')
  if (ordinalNumber && ordinalNumber < 1) throw new Error('El ordinal debe ser mayor que cero.')

  const payload = {
    band_entity_id: bandId,
    title: required(formData, 'title', 'El título'),
    release_type: releaseType(formData),
    release_year: releaseYear,
    release_date: nullable(formData, 'release_date'),
    release_date_text: nullable(formData, 'release_date_text'),
    ordinal_number: ordinalNumber,
    description: nullable(formData, 'description'),
    cover_image_path: nullable(formData, 'cover_image_path'),
    cover_image_alt: nullable(formData, 'cover_image_alt'),
    cover_image_credit: nullable(formData, 'cover_image_credit'),
    spotify_url: optionalUrl(formData, 'spotify_url', 'La URL de Spotify'),
    external_url: optionalUrl(formData, 'external_url', 'La URL de información'),
    status: editorialStatus(formData),
  }

  const result = releaseId
    ? await supabase
        .from('band_releases')
        .update(payload)
        .eq('id', releaseId)
        .eq('band_entity_id', bandId)
        .select('id')
        .single()
    : await supabase.from('band_releases').insert(payload).select('id').single()

  const saved = assertMutation(result, 'No se pudo guardar el lanzamiento')
  await audit(supabase, user, {
    action_type: releaseId ? 'update' : 'create',
    object_type: 'band_release',
    object_id: saved.id,
    entity_id: bandId,
    summary: `${releaseId ? 'Lanzamiento actualizado' : 'Lanzamiento creado'}: ${payload.title}`,
    changed_fields: payload,
  })
  await refreshDiscography(supabase, bandId)
  redirectSaved(bandId, 'lanzamiento', `release-${saved.id}`)
}

export async function archiveBandReleaseAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const releaseId = uuid(formData, 'release_id')
  const release = await requireRelease(supabase, bandId, releaseId)

  assertMutation(
    await supabase
      .from('band_releases')
      .update({ status: 'archived' })
      .eq('id', releaseId)
      .eq('band_entity_id', bandId),
    'No se pudo archivar el lanzamiento'
  )
  await audit(supabase, user, {
    action_type: 'archive',
    object_type: 'band_release',
    object_id: releaseId,
    entity_id: bandId,
    summary: `Lanzamiento archivado: ${release.title}`,
  })
  await refreshDiscography(supabase, bandId)
  redirectSaved(bandId, 'lanzamiento')
}

export async function saveBandReleaseTrackAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const releaseId = uuid(formData, 'release_id')
  const trackId = optionalUuid(formData, 'track_id')
  const release = await requireRelease(supabase, bandId, releaseId)
  const sequenceNo = integer(formData, 'sequence_no')
  if (!sequenceNo || sequenceNo < 1) throw new Error('El orden de la pista debe ser mayor que cero.')

  const marchEntityId = optionalUuid(formData, 'march_entity_id')
  if (marchEntityId) {
    const march = assertMutation(
      await supabase
        .from('entities')
        .select('id')
        .eq('id', marchEntityId)
        .eq('entity_type', 'march')
        .neq('status', 'archived')
        .maybeSingle(),
      'No se pudo consultar la Marcha'
    )
    if (!march) throw new Error('La Marcha seleccionada no está disponible.')
  }

  const payload = {
    release_id: releaseId,
    sequence_no: sequenceNo,
    title: required(formData, 'title', 'El título de la pista'),
    march_entity_id: marchEntityId,
    duration_text: nullable(formData, 'duration_text'),
    spotify_url: optionalUrl(formData, 'spotify_url', 'La URL de Spotify de la pista'),
    notes: nullable(formData, 'notes'),
  }

  const result = trackId
    ? await supabase
        .from('band_release_tracks')
        .update(payload)
        .eq('id', trackId)
        .eq('release_id', releaseId)
        .select('id')
        .single()
    : await supabase.from('band_release_tracks').insert(payload).select('id').single()

  const saved = assertMutation(result, 'No se pudo guardar la pista')
  await audit(supabase, user, {
    action_type: trackId ? 'update' : 'create',
    object_type: 'band_release_track',
    object_id: saved.id,
    entity_id: bandId,
    summary: `${trackId ? 'Pista actualizada' : 'Pista creada'} en ${release.title}: ${payload.title}`,
    changed_fields: payload,
  })
  await refreshDiscography(supabase, bandId)
  redirectSaved(bandId, 'pista', `release-${releaseId}`)
}

export async function deleteBandReleaseTrackAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const releaseId = uuid(formData, 'release_id')
  const trackId = uuid(formData, 'track_id')
  const release = await requireRelease(supabase, bandId, releaseId)

  const track = assertMutation(
    await supabase
      .from('band_release_tracks')
      .select('id, title')
      .eq('id', trackId)
      .eq('release_id', releaseId)
      .maybeSingle(),
    'No se pudo consultar la pista'
  )
  if (!track) throw new Error('La pista no pertenece a este lanzamiento.')

  assertMutation(
    await supabase.from('band_release_tracks').delete().eq('id', trackId).eq('release_id', releaseId),
    'No se pudo eliminar la pista'
  )
  await audit(supabase, user, {
    action_type: 'delete',
    object_type: 'band_release_track',
    object_id: trackId,
    entity_id: bandId,
    summary: `Pista retirada de ${release.title}: ${track.title}`,
  })
  await refreshDiscography(supabase, bandId)
  redirectSaved(bandId, 'pista', `release-${releaseId}`)
}

export async function linkBandReleaseSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const releaseId = uuid(formData, 'release_id')
  const sourceId = uuid(formData, 'source_id')
  const release = await requireRelease(supabase, bandId, releaseId)

  const source = assertMutation(
    await supabase.from('sources').select('id, name').eq('id', sourceId).maybeSingle(),
    'No se pudo consultar la fuente'
  )
  if (!source) throw new Error('La fuente seleccionada no existe.')

  const payload = {
    release_id: releaseId,
    source_id: sourceId,
    scope: nullable(formData, 'scope'),
  }
  assertMutation(
    await supabase
      .from('band_release_sources')
      .upsert(payload, { onConflict: 'release_id,source_id' }),
    'No se pudo vincular la fuente'
  )
  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'band_release_source',
    object_id: releaseId,
    entity_id: bandId,
    summary: `Fuente vinculada a ${release.title}: ${source.name}`,
    changed_fields: payload,
  })
  await refreshDiscography(supabase, bandId)
  redirectSaved(bandId, 'fuente', `release-${releaseId}`)
}

export async function unlinkBandReleaseSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const releaseId = uuid(formData, 'release_id')
  const sourceId = uuid(formData, 'source_id')
  const release = await requireRelease(supabase, bandId, releaseId)

  assertMutation(
    await supabase
      .from('band_release_sources')
      .delete()
      .eq('release_id', releaseId)
      .eq('source_id', sourceId),
    'No se pudo desvincular la fuente'
  )
  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'band_release_source',
    object_id: releaseId,
    entity_id: bandId,
    summary: `Fuente desvinculada de ${release.title}`,
    changed_fields: { source_id: sourceId },
  })
  await refreshDiscography(supabase, bandId)
  redirectSaved(bandId, 'fuente', `release-${releaseId}`)
}
