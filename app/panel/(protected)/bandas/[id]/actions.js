'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const PARTICIPATION_MODES = new Set(['full_route', 'segment', 'alternating', 'unspecified'])

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function integer(formData, name) {
  const raw = value(formData, name)
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : null
}
function checked(formData, name) { return formData.get(name) === 'on' }
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
function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
}
function status(formData) {
  const candidate = value(formData, 'status') || 'draft'
  if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.')
  return candidate
}
function url(formData, name, label, requiredValue = false) {
  const candidate = requiredValue ? required(formData, name, label) : nullable(formData, name)
  if (!candidate) return null
  try {
    const parsed = new URL(candidate)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error()
    return parsed.toString()
  } catch {
    throw new Error(`${label} no es válido.`)
  }
}
function color(formData, name) {
  const candidate = nullable(formData, name)
  if (candidate && !/^#[0-9a-f]{6}$/i.test(candidate)) throw new Error('El color debe escribirse como #63358B.')
  return candidate
}
function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la auditoría', error)
}

async function refreshBand(supabase, bandId) {
  const { data } = await supabase.from('entities').select('slug').eq('id', bandId).maybeSingle()
  revalidatePath('/panel')
  revalidatePath('/panel/bandas')
  revalidatePath(`/panel/bandas/${bandId}`)
  revalidatePath('/bandas')
  revalidatePath('/')
  if (data?.slug) revalidatePath(`/bandas/${data.slug}`)
}

function redirectSaved(bandId, section) {
  redirect(`/panel/bandas/${bandId}?saved=${section}#${section}`)
}

async function saveBandName(supabase, { id, bandId, name, shortName, type }) {
  const payload = { band_entity_id: bandId, name, short_name: shortName || null, name_type: type, is_current: true }
  if (id) {
    assertMutation(await supabase.from('band_names').update(payload).eq('id', id).eq('band_entity_id', bandId), 'No se pudo actualizar el nombre')
  } else {
    assertMutation(await supabase.from('band_names').insert(payload), 'No se pudo crear el nombre')
  }
}

async function saveLinkedBrotherhood(supabase, bandId, brotherhoodId) {
  const existing = assertMutation(
    await supabase
      .from('entity_relations')
      .select('id')
      .eq('source_entity_id', bandId)
      .eq('relation_type', 'belongs_to_brotherhood')
      .limit(1)
      .maybeSingle(),
    'No se pudo consultar la vinculación con la hermandad'
  )

  if (!brotherhoodId) {
    if (existing?.id) {
      assertMutation(await supabase.from('entity_relations').update({ status: 'archived' }).eq('id', existing.id), 'No se pudo retirar la vinculación')
    }
    return null
  }

  const payload = {
    source_entity_id: bandId,
    relation_type: 'belongs_to_brotherhood',
    target_entity_id: brotherhoodId,
    status: 'published',
  }
  if (existing?.id) {
    assertMutation(await supabase.from('entity_relations').update(payload).eq('id', existing.id), 'No se pudo actualizar la vinculación')
    return existing.id
  }
  const relation = assertMutation(await supabase.from('entity_relations').insert(payload).select('id').single(), 'No se pudo crear la vinculación')
  return relation.id
}

export async function updateBandAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const entitySlug = required(formData, 'slug', 'El slug')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entitySlug)) throw new Error('El slug solo puede contener minúsculas, números y guiones simples.')
  const popularName = required(formData, 'popular_name', 'El nombre popular')
  const officialName = required(formData, 'official_name', 'El nombre oficial')
  const linkedBrotherhoodId = optionalUuid(formData, 'linked_brotherhood_entity_id')
  const linkedBrotherhood = linkedBrotherhoodId
    ? assertMutation(
        await supabase.from('entities').select('name').eq('id', linkedBrotherhoodId).eq('entity_type', 'brotherhood').single(),
        'No se pudo consultar la hermandad vinculada'
      )
    : null
  const entityPayload = { name: popularName, slug: entitySlug, summary: nullable(formData, 'summary'), status: status(formData) }
  const bandPayload = {
    band_type: required(formData, 'band_type', 'El tipo de formación'),
    municipality_id: optionalUuid(formData, 'municipality_id'),
    foundation_text: nullable(formData, 'foundation_text'),
    website_url: url(formData, 'website_url', 'La web oficial'),
    youtube_url: url(formData, 'youtube_url', 'El canal de YouTube'),
    instagram_url: url(formData, 'instagram_url', 'El enlace de Instagram'),
    description: nullable(formData, 'description'),
    primary_color: color(formData, 'primary_color'),
    secondary_color: color(formData, 'secondary_color'),
    logo_path: nullable(formData, 'logo_path'),
    hero_image_path: nullable(formData, 'hero_image_path'),
    hero_image_alt: nullable(formData, 'hero_image_alt'),
    hero_image_credit: nullable(formData, 'hero_image_credit'),
    linked_brotherhood_name: linkedBrotherhood?.name || null,
    headquarters_text: nullable(formData, 'headquarters_text'),
  }

  assertMutation(await supabase.from('entities').update(entityPayload).eq('id', bandId).eq('entity_type', 'band'), 'No se pudo actualizar la entidad')
  assertMutation(await supabase.from('bands').update(bandPayload).eq('entity_id', bandId), 'No se pudo actualizar la ficha')
  await saveBandName(supabase, { id: optionalUuid(formData, 'popular_name_id'), bandId, name: popularName, shortName: popularName, type: 'popular' })
  await saveBandName(supabase, { id: optionalUuid(formData, 'official_name_id'), bandId, name: officialName, shortName: nullable(formData, 'official_short_name'), type: 'official' })
  await saveLinkedBrotherhood(supabase, bandId, linkedBrotherhoodId)
  await audit(supabase, user, { action_type: entityPayload.status === 'published' ? 'publish' : 'update', object_type: 'band', object_id: bandId, entity_id: bandId, summary: `Ficha actualizada: ${popularName}`, changed_fields: { entity: entityPayload, band: bandPayload, linked_brotherhood_entity_id: linkedBrotherhoodId } })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'general')
}

export async function saveBandDirectionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const relationId = optionalUuid(formData, 'band_agent_id')
  let agentId = optionalUuid(formData, 'agent_entity_id')
  const personName = required(formData, 'person_name', 'El nombre')
  if (agentId) {
    assertMutation(await supabase.from('entities').update({ name: personName }).eq('id', agentId).eq('entity_type', 'agent'), 'No se pudo actualizar la persona')
  } else {
    agentId = randomUUID()
    assertMutation(await supabase.from('entities').insert({ id: agentId, entity_type: 'agent', name: personName, slug: `agente-${agentId.slice(0, 8)}`, status: 'published' }), 'No se pudo crear la persona')
  }
  const payload = { band_entity_id: bandId, agent_entity_id: agentId, role_name: required(formData, 'role_name', 'La responsabilidad'), is_current: true, notes: nullable(formData, 'notes') }
  const result = relationId
    ? await supabase.from('band_agents').update(payload).eq('id', relationId).eq('band_entity_id', bandId).select('id').single()
    : await supabase.from('band_agents').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar la responsabilidad')
  await audit(supabase, user, { action_type: relationId ? 'update' : 'create', object_type: 'band_agent', object_id: saved.id, entity_id: bandId, summary: `Dirección: ${personName}`, changed_fields: payload })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'direccion')
}

export async function archiveBandDirectionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const relationId = uuid(formData, 'band_agent_id')
  assertMutation(await supabase.from('band_agents').update({ is_current: false, date_to: new Date().toISOString().slice(0, 10) }).eq('id', relationId).eq('band_entity_id', bandId), 'No se pudo retirar la responsabilidad')
  await audit(supabase, user, { action_type: 'archive', object_type: 'band_agent', object_id: relationId, entity_id: bandId, summary: 'Responsabilidad retirada de la dirección actual' })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'direccion')
}

export async function saveBandAccompanimentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const periodId = optionalUuid(formData, 'period_id')
  const yearFrom = integer(formData, 'year_from')
  if (!yearFrom) throw new Error('El año de inicio es obligatorio.')
  const payload = {
    band_entity_id: bandId,
    brotherhood_entity_id: uuid(formData, 'brotherhood_entity_id'),
    step_entity_id: optionalUuid(formData, 'step_entity_id'),
    position: required(formData, 'position', 'La ubicación'),
    outing_type: required(formData, 'outing_type', 'La jornada o salida'),
    year_from: yearFrom,
    year_to: integer(formData, 'year_to'),
    is_current: checked(formData, 'is_current'),
    notes: nullable(formData, 'notes'),
    status: status(formData),
  }
  const result = periodId
    ? await supabase.from('music_accompaniment_periods').update(payload).eq('id', periodId).eq('band_entity_id', bandId).select('id').single()
    : await supabase.from('music_accompaniment_periods').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar el acompañamiento')
  await audit(supabase, user, { action_type: periodId ? 'update' : 'create', object_type: 'music_accompaniment_period', object_id: saved.id, entity_id: bandId, summary: 'Acompañamiento musical guardado', changed_fields: payload })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'acompanamientos')
}

export async function archiveBandAccompanimentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const periodId = uuid(formData, 'period_id')
  assertMutation(await supabase.from('music_accompaniment_periods').update({ status: 'archived', is_current: false }).eq('id', periodId).eq('band_entity_id', bandId), 'No se pudo archivar el acompañamiento')
  await audit(supabase, user, { action_type: 'archive', object_type: 'music_accompaniment_period', object_id: periodId, entity_id: bandId, summary: 'Acompañamiento archivado' })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'acompanamientos')
}

export async function saveBandOutingAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const outingId = optionalUuid(formData, 'outing_id')
  const positionId = optionalUuid(formData, 'position_id')
  const assignmentId = optionalUuid(formData, 'assignment_id')
  const participationMode = PARTICIPATION_MODES.has(value(formData, 'participation_mode')) ? value(formData, 'participation_mode') : 'unspecified'
  const outingPayload = {
    brotherhood_entity_id: optionalUuid(formData, 'brotherhood_entity_id'),
    organizer_name: nullable(formData, 'organizer_name'),
    outing_type: required(formData, 'outing_type', 'El tipo de salida'),
    character: 'extraordinary',
    title: required(formData, 'title', 'El título'),
    outing_date: required(formData, 'outing_date', 'La fecha'),
    departure_time: nullable(formData, 'departure_time'),
    municipality_id: optionalUuid(formData, 'municipality_id'),
    reason: nullable(formData, 'reason'),
    description: nullable(formData, 'description'),
    event_status: ['announced', 'held', 'cancelled'].includes(value(formData, 'event_status')) ? value(formData, 'event_status') : 'announced',
    status: status(formData),
  }
  const outingResult = outingId
    ? await supabase.from('outings').update(outingPayload).eq('id', outingId).select('id').single()
    : await supabase.from('outings').insert(outingPayload).select('id').single()
  const outing = assertMutation(outingResult, 'No se pudo guardar la salida')
  const positionPayload = { outing_id: outing.id, position_code: 'other', position_label: nullable(formData, 'position_label'), sequence_no: 1, status: outingPayload.status }
  const positionResult = positionId
    ? await supabase.from('outing_music_positions').update(positionPayload).eq('id', positionId).select('id').single()
    : await supabase.from('outing_music_positions').insert(positionPayload).select('id').single()
  const position = assertMutation(positionResult, 'No se pudo guardar la posición musical')
  const assignmentPayload = { music_position_id: position.id, band_entity_id: bandId, participation_mode: participationMode, sequence_no: 1, status: outingPayload.status }
  if (assignmentId) assertMutation(await supabase.from('outing_music_assignments').update(assignmentPayload).eq('id', assignmentId), 'No se pudo actualizar la participación')
  else assertMutation(await supabase.from('outing_music_assignments').insert(assignmentPayload), 'No se pudo crear la participación')
  await audit(supabase, user, { action_type: outingId ? 'update' : 'create', object_type: 'outing', object_id: outing.id, entity_id: bandId, summary: `${outingId ? 'Salida actualizada' : 'Salida creada'}: ${outingPayload.title}`, changed_fields: outingPayload })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'extraordinarias')
}

export async function archiveBandOutingAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const outingId = uuid(formData, 'outing_id')
  assertMutation(await supabase.from('outings').update({ status: 'archived' }).eq('id', outingId), 'No se pudo archivar la salida')
  await audit(supabase, user, { action_type: 'archive', object_type: 'outing', object_id: outingId, entity_id: bandId, summary: 'Salida extraordinaria archivada' })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'extraordinarias')
}

async function saveSource(supabase, formData) {
  const sourceId = optionalUuid(formData, 'source_id')
  const payload = {
    name: required(formData, 'source_name', 'El nombre de la fuente'),
    url: url(formData, 'source_url', 'El enlace de la fuente', true),
    source_type: value(formData, 'source_url').includes('youtu') ? 'video' : 'official_website',
    author_or_publisher: nullable(formData, 'source_publisher'),
    publication_date: nullable(formData, 'source_publication_date'),
    accessed_at: new Date().toISOString().slice(0, 10),
  }
  const result = sourceId
    ? await supabase.from('sources').update(payload).eq('id', sourceId).select('id').single()
    : await supabase.from('sources').insert(payload).select('id').single()
  return assertMutation(result, 'No se pudo guardar la fuente').id
}

export async function saveBandPremiereAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const premiereId = optionalUuid(formData, 'premiere_id')
  const premiereYear = integer(formData, 'premiere_year')
  if (!premiereYear) throw new Error('El año del estreno es obligatorio.')
  const sourceId = await saveSource(supabase, formData)
  const payload = {
    band_entity_id: bandId,
    title: required(formData, 'title', 'El título de la marcha'),
    composer_name: required(formData, 'composer_name', 'El compositor'),
    premiere_year: premiereYear,
    premiere_date: nullable(formData, 'premiere_date'),
    venue_text: nullable(formData, 'venue_text'),
    municipality_text: nullable(formData, 'municipality_text'),
    video_url: url(formData, 'video_url', 'El enlace de YouTube'),
    description: nullable(formData, 'description'),
    source_id: sourceId,
    status: status(formData),
    display_order: integer(formData, 'display_order') || 0,
  }
  const result = premiereId
    ? await supabase.from('band_premieres').update(payload).eq('id', premiereId).eq('band_entity_id', bandId).select('id').single()
    : await supabase.from('band_premieres').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar el estreno')
  const existingLink = await supabase.from('source_links').select('id').eq('band_premiere_id', saved.id).maybeSingle()
  if (existingLink.error) throw new Error(`No se pudo consultar la fuente del estreno: ${existingLink.error.message}`)
  const linkPayload = { source_id: sourceId, band_premiere_id: saved.id, scope: 'Estreno y grabación de referencia' }
  if (existingLink.data) assertMutation(await supabase.from('source_links').update(linkPayload).eq('id', existingLink.data.id), 'No se pudo actualizar el enlace de fuente')
  else assertMutation(await supabase.from('source_links').insert(linkPayload), 'No se pudo vincular la fuente')
  await audit(supabase, user, { action_type: premiereId ? 'update' : 'create', object_type: 'band_premiere', object_id: saved.id, entity_id: bandId, summary: `${premiereId ? 'Estreno actualizado' : 'Estreno creado'}: ${payload.title}`, changed_fields: payload })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'estrenos')
}

export async function archiveBandPremiereAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const premiereId = uuid(formData, 'premiere_id')
  assertMutation(await supabase.from('band_premieres').update({ status: 'archived' }).eq('id', premiereId).eq('band_entity_id', bandId), 'No se pudo archivar el estreno')
  await audit(supabase, user, { action_type: 'archive', object_type: 'band_premiere', object_id: premiereId, entity_id: bandId, summary: 'Estreno archivado' })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'estrenos')
}
