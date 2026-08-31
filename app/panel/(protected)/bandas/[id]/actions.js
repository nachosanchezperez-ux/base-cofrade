'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { isValidLogoBackgroundColor, normalizeLogoBackgroundColor } from '@/lib/bands/logo-background'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const PARTICIPATION_MODES = new Set(['full_route', 'segment', 'alternating', 'unspecified'])
const SOCIAL_PLATFORMS = new Set(['website', 'facebook', 'instagram', 'x', 'youtube', 'spotify', 'tiktok', 'whatsapp'])

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
function logoBackgroundColor(formData) {
  const candidate = nullable(formData, 'logo_background_color')
  if (!candidate) return null
  if (!isValidLogoBackgroundColor(candidate)) throw new Error('El fondo del logotipo debe escribirse como #RRGGBB.')
  return normalizeLogoBackgroundColor(candidate)
}
function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function slugify(valueToSlug) {
  return String(valueToSlug || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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
    description: nullable(formData, 'description'),
    primary_color: color(formData, 'primary_color'),
    secondary_color: color(formData, 'secondary_color'),
    logo_background_color: logoBackgroundColor(formData),
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

export async function saveBandSocialLinkAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const linkId = optionalUuid(formData, 'link_id')
  const platform = required(formData, 'platform', 'La plataforma')
  if (!SOCIAL_PLATFORMS.has(platform)) throw new Error('Plataforma no válida.')
  const payload = { entity_id: bandId, platform, url: url(formData, 'url', 'La URL', true), label: nullable(formData, 'label'), display_order: integer(formData, 'display_order') || 0, is_public: checked(formData, 'is_public') }
  const result = linkId
    ? await supabase.from('entity_social_links').update(payload).eq('id', linkId).eq('entity_id', bandId).select('id').single()
    : await supabase.from('entity_social_links').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar el enlace de interés')
  await audit(supabase, user, { action_type: linkId ? 'update' : 'create', object_type: 'entity_social_link', object_id: saved.id, entity_id: bandId, summary: `${linkId ? 'Enlace actualizado' : 'Enlace creado'}: ${platform}`, changed_fields: payload })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'enlaces')
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
  const dateFromText = nullable(formData, 'date_from_text')
  if (!yearFrom && !dateFromText) throw new Error('Indica un año de inicio o una datación textual.')
  const brotherhoodId = uuid(formData, 'brotherhood_entity_id')
  const stepId = optionalUuid(formData, 'step_entity_id')
  const publicEntities = assertMutation(
    await supabase.from('entities').select('id, name, slug').in('id', [brotherhoodId, stepId].filter(Boolean)),
    'No se pudieron consultar las etiquetas públicas del acompañamiento'
  )
  const publicName = (entityId) => publicEntities.find((item) => item.id === entityId)?.name || null
  const payload = {
    band_entity_id: bandId,
    brotherhood_entity_id: brotherhoodId,
    step_entity_id: stepId,
    public_brotherhood_name: publicName(brotherhoodId),
    public_brotherhood_slug: publicEntities.find((item) => item.id === brotherhoodId)?.slug || null,
    public_step_name: publicName(stepId),
    position: required(formData, 'position', 'La ubicación'),
    outing_type: required(formData, 'outing_type', 'La jornada o salida'),
    date_from_text: dateFromText,
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
  const returnSection = value(formData, 'return_section') === 'acompanamientos-historicos' ? 'acompanamientos-historicos' : 'acompanamientos'
  redirectSaved(bandId, returnSection)
}

export async function archiveBandAccompanimentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const periodId = uuid(formData, 'period_id')
  assertMutation(await supabase.from('music_accompaniment_periods').update({ status: 'archived', is_current: false }).eq('id', periodId).eq('band_entity_id', bandId), 'No se pudo archivar el acompañamiento')
  await audit(supabase, user, { action_type: 'archive', object_type: 'music_accompaniment_period', object_id: periodId, entity_id: bandId, summary: 'Acompañamiento archivado' })
  await refreshBand(supabase, bandId)
  const returnSection = value(formData, 'return_section') === 'acompanamientos-historicos' ? 'acompanamientos-historicos' : 'acompanamientos'
  redirectSaved(bandId, returnSection)
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

async function ensureAgentByName(supabase, agentName, description) {
  if (!agentName) return null
  const agentSlug = slugify(agentName)
  const existing = assertMutation(
    await supabase.from('entities').select('id').eq('entity_type', 'agent').eq('slug', agentSlug).maybeSingle(),
    'No se pudo consultar el autor'
  )
  if (existing?.id) return existing.id

  const agentId = randomUUID()
  assertMutation(
    await supabase.from('entities').insert({ id: agentId, entity_type: 'agent', name: agentName, slug: agentSlug, summary: description, status: 'published' }),
    'No se pudo crear el autor'
  )
  assertMutation(
    await supabase.from('agents').insert({ entity_id: agentId, agent_kind: 'person', description }),
    'No se pudo completar la ficha del autor'
  )
  return agentId
}

async function savePremiereMarch(supabase, { marchId, title, premiereYear, composerName, adapterName, publishStatus }) {
  const nextMarchId = marchId || randomUUID()
  const marchSlug = `marcha-${slugify(title)}`
  const entityPayload = {
    name: title,
    slug: marchSlug,
    summary: `Marcha estrenada en ${premiereYear}.`,
    status: publishStatus,
  }
  if (marchId) {
    assertMutation(await supabase.from('entities').update(entityPayload).eq('id', marchId).eq('entity_type', 'march'), 'No se pudo actualizar la marcha')
    assertMutation(await supabase.from('marches').update({ music_type: adapterName ? 'Adaptación para cornetas y tambores' : 'Marcha procesional' }).eq('entity_id', marchId), 'No se pudo actualizar la ficha musical')
  } else {
    assertMutation(await supabase.from('entities').insert({ id: nextMarchId, entity_type: 'march', ...entityPayload }), 'No se pudo crear la marcha')
    assertMutation(await supabase.from('marches').insert({ entity_id: nextMarchId, music_type: adapterName ? 'Adaptación para cornetas y tambores' : 'Marcha procesional' }), 'No se pudo crear la ficha musical')
  }

  const composerId = await ensureAgentByName(supabase, composerName, 'Compositor de música procesional.')
  const adapterId = await ensureAgentByName(supabase, adapterName, 'Compositor y adaptador de música procesional.')
  const existingCredits = assertMutation(
    await supabase.from('march_authors').select('id, agent_entity_id, author_role').eq('march_entity_id', nextMarchId),
    'No se pudieron consultar las autorías de la marcha'
  ) || []

  for (const credit of existingCredits) {
    const expectedAgent = credit.author_role === 'composer' ? composerId : credit.author_role === 'adapter' ? adapterId : credit.agent_entity_id
    if (!expectedAgent || expectedAgent !== credit.agent_entity_id) {
      assertMutation(await supabase.from('march_authors').update({ status: 'archived' }).eq('id', credit.id), 'No se pudo archivar una autoría anterior')
    }
  }

  const credits = [
    composerId ? { agentId: composerId, role: 'composer', notes: null } : null,
    adapterId ? { agentId: adapterId, role: 'adapter', notes: 'Adaptación para cornetas y tambores.' } : null,
  ].filter(Boolean)
  for (const credit of credits) {
    assertMutation(
      await supabase.from('march_authors').upsert({ march_entity_id: nextMarchId, agent_entity_id: credit.agentId, author_role: credit.role, notes: credit.notes, status: publishStatus }, { onConflict: 'march_entity_id,agent_entity_id,author_role' }),
      'No se pudo guardar la autoría de la marcha'
    )
  }
  return nextMarchId
}

export async function saveBandPremiereAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const premiereId = optionalUuid(formData, 'premiere_id')
  const premiereYear = integer(formData, 'premiere_year')
  if (!premiereYear) throw new Error('El año del estreno es obligatorio.')
  const title = required(formData, 'title', 'El título de la marcha')
  const composerName = required(formData, 'composer_name', 'El compositor')
  const adapterName = nullable(formData, 'adapter_name')
  const editorialStatus = status(formData)
  const marchEntityId = await savePremiereMarch(supabase, {
    marchId: optionalUuid(formData, 'march_entity_id'),
    title,
    premiereYear,
    composerName,
    adapterName,
    publishStatus: editorialStatus,
  })
  const sourceId = await saveSource(supabase, formData)
  const payload = {
    band_entity_id: bandId,
    march_entity_id: marchEntityId,
    title,
    composer_name: composerName,
    premiere_year: premiereYear,
    premiere_date: nullable(formData, 'premiere_date'),
    venue_text: nullable(formData, 'venue_text'),
    municipality_text: nullable(formData, 'municipality_text'),
    video_url: url(formData, 'video_url', 'El enlace de YouTube'),
    description: nullable(formData, 'description'),
    source_id: sourceId,
    status: editorialStatus,
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
  const premiere = assertMutation(await supabase.from('band_premieres').select('march_entity_id').eq('id', premiereId).eq('band_entity_id', bandId).single(), 'No se pudo consultar el estreno')
  assertMutation(await supabase.from('band_premieres').update({ status: 'archived' }).eq('id', premiereId).eq('band_entity_id', bandId), 'No se pudo archivar el estreno')
  if (premiere?.march_entity_id) {
    assertMutation(await supabase.from('entities').update({ status: 'archived' }).eq('id', premiere.march_entity_id).eq('entity_type', 'march'), 'No se pudo archivar la marcha')
    assertMutation(await supabase.from('march_authors').update({ status: 'archived' }).eq('march_entity_id', premiere.march_entity_id), 'No se pudieron archivar las autorías')
  }
  await audit(supabase, user, { action_type: 'archive', object_type: 'band_premiere', object_id: premiereId, entity_id: bandId, summary: 'Estreno archivado' })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'estrenos')
}

async function requireBandAsset(supabase, bandId, assetId) {
  const asset = assertMutation(
    await supabase.from('heritage_assets').select('entity_id').eq('entity_id', assetId).eq('parent_entity_id', bandId).eq('asset_type', 'Banderín').maybeSingle(),
    'No se pudo consultar el banderín'
  )
  if (!asset) throw new Error('El banderín no pertenece a esta banda.')
  return asset
}

export async function saveBandHeritageAssetAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const currentAssetId = optionalUuid(formData, 'asset_entity_id')
  const assetId = currentAssetId || randomUUID()
  const assetStatus = status(formData)
  const assetName = required(formData, 'asset_name', 'El nombre del banderín')
  const assetSlug = required(formData, 'asset_slug', 'El slug del banderín')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(assetSlug)) throw new Error('El slug solo puede contener minúsculas, números y guiones simples.')
  if (!currentAssetId) {
    const existingBanderin = assertMutation(
      await supabase.from('heritage_assets').select('entity_id').eq('parent_entity_id', bandId).eq('asset_type', 'Banderín').limit(1).maybeSingle(),
      'No se pudo comprobar el banderín de la banda'
    )
    if (existingBanderin) throw new Error('Esta banda ya tiene un banderín asociado.')
  }
  const entityPayload = { name: assetName, slug: assetSlug, summary: nullable(formData, 'asset_summary'), status: assetStatus }
  const assetPayload = {
    parent_entity_id: bandId,
    asset_type: 'Banderín',
    description: nullable(formData, 'asset_description'),
    technique: nullable(formData, 'technique'),
    date_from: nullable(formData, 'date_from'),
    date_from_text: nullable(formData, 'date_from_text'),
    is_current: checked(formData, 'is_current'),
    origin_notes: nullable(formData, 'origin_notes'),
    display_order: integer(formData, 'display_order') || 0,
    is_featured: checked(formData, 'is_featured'),
    public_image_path: nullable(formData, 'public_image_path'),
    public_image_alt: nullable(formData, 'public_image_alt'),
    public_image_credit: nullable(formData, 'public_image_credit'),
    notes: nullable(formData, 'asset_notes'),
  }
  if (currentAssetId) {
    await requireBandAsset(supabase, bandId, currentAssetId)
    assertMutation(await supabase.from('entities').update(entityPayload).eq('id', currentAssetId).eq('entity_type', 'heritage_asset'), 'No se pudo actualizar el banderín')
    assertMutation(await supabase.from('heritage_assets').update(assetPayload).eq('entity_id', currentAssetId).eq('parent_entity_id', bandId), 'No se pudo actualizar la ficha del banderín')
  } else {
    assertMutation(await supabase.from('entities').insert({ id: assetId, entity_type: 'heritage_asset', ...entityPayload }), 'No se pudo crear el banderín')
    assertMutation(await supabase.from('heritage_assets').insert({ entity_id: assetId, ...assetPayload }), 'No se pudo crear la ficha del banderín')
  }
  assertMutation(await supabase.from('bands').update({ banderin_entity_id: assetId }).eq('entity_id', bandId), 'No se pudo vincular el banderín con la banda')
  await audit(supabase, user, { action_type: currentAssetId ? 'update' : 'create', object_type: 'heritage_asset', object_id: assetId, entity_id: bandId, summary: `${currentAssetId ? 'Banderín actualizado' : 'Banderín creado'}: ${assetName}`, changed_fields: { ...entityPayload, ...assetPayload } })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'banderin')
}

export async function archiveBandHeritageAssetAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const assetId = uuid(formData, 'asset_entity_id')
  await requireBandAsset(supabase, bandId, assetId)
  assertMutation(await supabase.from('entities').update({ status: 'archived' }).eq('id', assetId).eq('entity_type', 'heritage_asset'), 'No se pudo archivar el banderín')
  assertMutation(await supabase.from('bands').update({ banderin_entity_id: null }).eq('entity_id', bandId).eq('banderin_entity_id', assetId), 'No se pudo retirar el banderín de la banda')
  await audit(supabase, user, { action_type: 'archive', object_type: 'heritage_asset', object_id: assetId, entity_id: bandId, summary: 'Banderín archivado' })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'banderin')
}

export async function saveBandAssetContributionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const assetId = uuid(formData, 'asset_entity_id')
  const contributionId = optionalUuid(formData, 'contribution_id')
  const agentId = uuid(formData, 'agent_entity_id')
  await requireBandAsset(supabase, bandId, assetId)
  const agent = assertMutation(await supabase.from('entities').select('id, name').eq('id', agentId).eq('entity_type', 'agent').maybeSingle(), 'No se pudo validar el autor o taller')
  if (!agent) throw new Error('Selecciona un autor o taller válido.')
  const payload = {
    target_entity_id: assetId,
    agent_entity_id: agentId,
    discipline: required(formData, 'discipline', 'La disciplina'),
    element_name: nullable(formData, 'element_name'),
    intervention_type: nullable(formData, 'intervention_type') || 'Realización',
    phase: nullable(formData, 'phase'),
    date_from: nullable(formData, 'contribution_date_from'),
    date_from_text: nullable(formData, 'contribution_date_from_text'),
    description: nullable(formData, 'contribution_description'),
    status: status(formData),
  }
  const result = contributionId
    ? await supabase.from('heritage_interventions').update(payload).eq('id', contributionId).eq('target_entity_id', assetId).select('id').single()
    : await supabase.from('heritage_interventions').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar la intervención')
  await audit(supabase, user, { action_type: contributionId ? 'update' : 'create', object_type: 'heritage_intervention', object_id: saved.id, entity_id: bandId, summary: `${payload.intervention_type}: ${agent.name}`, changed_fields: payload })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'banderin')
}

export async function archiveBandAssetContributionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const assetId = uuid(formData, 'asset_entity_id')
  const contributionId = uuid(formData, 'contribution_id')
  await requireBandAsset(supabase, bandId, assetId)
  assertMutation(await supabase.from('heritage_interventions').update({ status: 'archived' }).eq('id', contributionId).eq('target_entity_id', assetId), 'No se pudo archivar la intervención')
  await audit(supabase, user, { action_type: 'archive', object_type: 'heritage_intervention', object_id: contributionId, entity_id: bandId, summary: 'Intervención patrimonial archivada' })
  await refreshBand(supabase, bandId)
  redirectSaved(bandId, 'banderin')
}
