'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CONCERT_EVENT_TYPE_LABELS } from '@/lib/concert-events'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const EVENT_STATUSES = new Set(['announced', 'postponed', 'cancelled', 'held'])
const EVENT_TYPES = new Set(Object.keys(CONCERT_EVENT_TYPE_LABELS))

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) { const candidate = value(formData, name); if (!candidate) throw new Error(`${label} es obligatorio.`); return candidate }
function uuid(formData, name, optional = false) { const candidate = value(formData, name); if (optional && !candidate) return null; if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`); return candidate }
function optionalInteger(formData, name) { const candidate = value(formData, name); if (!candidate) return 0; const parsed = Number.parseInt(candidate, 10); if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${name} debe ser un entero positivo.`); return parsed }
function editorialStatus(formData) { const candidate = value(formData, 'status') || 'draft'; if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.'); return candidate }
function relationStatus(formData) { const candidate = value(formData, 'relation_status') || 'draft'; if (!STATUSES.has(candidate)) throw new Error('Estado de relación no válido.'); return candidate }
function eventStatus(formData) { const candidate = value(formData, 'event_status') || 'announced'; if (!EVENT_STATUSES.has(candidate)) throw new Error('Estado del concierto no válido.'); return candidate }
function eventType(formData) { const candidate = value(formData, 'event_type'); if (!EVENT_TYPES.has(candidate)) throw new Error('Tipo de acto musical no válido.'); return candidate }
function date(formData) { const candidate = required(formData, 'event_date', 'La fecha'); if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error('La fecha no es válida.'); return candidate }
function optionalTime(formData, name) { const candidate = value(formData, name); if (!candidate) return null; if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(candidate)) throw new Error(`La hora de ${name} no es válida.`); return candidate }
function slugify(input) { return String(input || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
function assertRow(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); if (!result.data) throw new Error(label); return result.data }
function assertMutation(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); return result.data }

function selectedBandIds(formData) {
  const ids = formData.getAll('band_entity_ids').map((item) => String(item || '').trim()).filter(Boolean)
  const unique = [...new Set(ids)]
  if (!unique.length) throw new Error('Selecciona al menos una Banda.')
  if (unique.some((id) => !UUID_PATTERN.test(id))) throw new Error('Hay una Banda con identificador no válido.')
  return unique
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición del concierto', error)
}

async function ensureUniqueSlug(supabase, slug, id = null) {
  let query = supabase.from('entities').select('id, name').eq('slug', slug)
  if (id) query = query.neq('id', id)
  const result = await query.limit(1).maybeSingle()
  if (result.error) throw new Error(`No se pudo comprobar el slug: ${result.error.message}`)
  if (result.data) throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
}

async function requireEntity(supabase, id, type, label) {
  return assertRow(
    await supabase.from('entities').select('id, entity_type, name, slug, status').eq('id', id).eq('entity_type', type).neq('status', 'archived').maybeSingle(),
    `${label} no existe o no está disponible.`
  )
}

async function requireBandEntities(supabase, ids) {
  const result = await supabase
    .from('entities')
    .select('id, name, status')
    .eq('entity_type', 'band')
    .neq('status', 'archived')
    .in('id', ids)
  if (result.error) throw new Error(`No se pudieron comprobar las Bandas: ${result.error.message}`)
  const bands = result.data || []
  if (bands.length !== ids.length) throw new Error('Una o varias Bandas no existen o no están disponibles.')
  return bands
}

async function requireConcertEvent(supabase, id) {
  const entity = assertRow(await supabase.from('entities').select('id, name, slug, status').eq('id', id).eq('entity_type', 'event').maybeSingle(), 'El concierto no existe.')
  const event = assertRow(await supabase.from('events').select('*').eq('entity_id', id).eq('event_category', 'concert').maybeSingle(), 'La ficha del concierto no existe.')
  return { entity, event }
}

function eventPayload(formData) {
  const startTime = optionalTime(formData, 'start_time')
  const endTime = optionalTime(formData, 'end_time')
  if (startTime && endTime && endTime < startTime) throw new Error('La hora final no puede ser anterior a la hora inicial.')
  return {
    event_category: 'concert',
    event_type: eventType(formData),
    event_date: date(formData),
    event_date_text: null,
    brotherhood_entity_id: uuid(formData, 'brotherhood_entity_id', true),
    municipality_id: uuid(formData, 'municipality_id'),
    place_id: uuid(formData, 'place_id', true),
    start_time: startTime,
    end_time: endTime,
    time_text: nullable(formData, 'time_text'),
    event_status: eventStatus(formData),
    location_text: nullable(formData, 'location_text'),
    requirements: null,
    public_notes: nullable(formData, 'public_notes'),
    description: nullable(formData, 'description'),
  }
}

async function refreshConcert(supabase, id, relatedIds = []) {
  revalidatePath('/agenda-cofrade')
  revalidatePath('/panel')
  revalidatePath('/panel/conciertos')
  revalidatePath(`/panel/conciertos/${id}`)
  revalidatePath('/sitemap.xml')
  const ids = [...new Set(relatedIds.filter(Boolean))]
  if (!ids.length) return
  const result = await supabase.from('entities').select('id, entity_type, slug').in('id', ids)
  if (result.error) return
  result.data?.forEach((entity) => {
    if (!entity.slug) return
    if (entity.entity_type === 'band') revalidatePath(`/bandas/${entity.slug}`)
    if (entity.entity_type === 'brotherhood') revalidatePath(`/hermandades/${entity.slug}`)
  })
}

function redirectEditor(id, saved) { redirect(`/panel/conciertos/${id}?saved=${saved}`) }

export async function createConcertEventAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = randomUUID()
  const name = required(formData, 'name', 'El título')
  const slug = slugify(value(formData, 'slug') || `${name}-${value(formData, 'event_date')}`)
  if (!slug) throw new Error('No se ha podido generar un slug válido.')
  await ensureUniqueSlug(supabase, slug)
  const nextStatus = editorialStatus(formData)
  const event = eventPayload(formData)
  const bandIds = selectedBandIds(formData)
  const bands = await requireBandEntities(supabase, bandIds)
  if (nextStatus === 'published' && bands.some((band) => band.status !== 'published')) throw new Error('Todas las Bandas vinculadas deben estar publicadas antes de publicar el concierto.')
  if (event.brotherhood_entity_id) {
    const brotherhood = await requireEntity(supabase, event.brotherhood_entity_id, 'brotherhood', 'La Hermandad')
    if (nextStatus === 'published' && brotherhood.status !== 'published') throw new Error('La Hermandad vinculada debe estar publicada antes de publicar el concierto.')
  }

  const entity = { id, entity_type: 'event', name, slug, summary: nullable(formData, 'summary'), status: nextStatus }
  assertMutation(await supabase.from('entities').insert(entity), 'No se pudo crear la entidad del concierto')
  const eventResult = await supabase.from('events').insert({ entity_id: id, ...event })
  if (eventResult.error) {
    await supabase.from('entities').delete().eq('id', id)
    throw new Error(`No se pudo crear el concierto: ${eventResult.error.message}`)
  }

  const relationStatusValue = nextStatus === 'published' ? 'published' : nextStatus
  const links = bandIds.map((bandId, index) => ({
    event_entity_id: id,
    band_entity_id: bandId,
    role_name: index === 0 ? 'Banda principal' : 'Banda participante',
    is_primary: index === 0,
    sort_order: index,
    status: relationStatusValue,
  }))
  const linksResult = await supabase.from('concert_event_bands').insert(links)
  if (linksResult.error) {
    await supabase.from('entities').delete().eq('id', id)
    throw new Error(`No se pudieron vincular las Bandas: ${linksResult.error.message}`)
  }

  await audit(supabase, user, { action_type: 'create', object_type: 'concert_event', object_id: id, entity_id: id, summary: `Concierto creado: ${name}`, changed_fields: { entity, event, band_ids: bandIds } })
  await refreshConcert(supabase, id, [...bandIds, event.brotherhood_entity_id])
  redirectEditor(id, 'created')
}

export async function updateConcertEventAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = uuid(formData, 'event_id')
  const current = await requireConcertEvent(supabase, id)
  const name = required(formData, 'name', 'El título')
  const slug = slugify(required(formData, 'slug', 'El slug'))
  const nextStatus = editorialStatus(formData)
  if (current.entity.status === 'published' && nextStatus === 'published' && current.entity.slug !== slug) throw new Error('El slug de un concierto publicado no puede cambiarse. Pásalo primero a borrador o revisión.')
  await ensureUniqueSlug(supabase, slug, id)
  const event = eventPayload(formData)

  const linksResult = await supabase.from('concert_event_bands').select('band_entity_id, status').eq('event_entity_id', id).neq('status', 'archived')
  if (linksResult.error) throw new Error(`No se pudieron comprobar las Bandas vinculadas: ${linksResult.error.message}`)
  const links = linksResult.data || []
  if (!links.length) throw new Error('El concierto debe tener al menos una Banda vinculada.')
  const bands = await requireBandEntities(supabase, links.map((item) => item.band_entity_id))
  if (nextStatus === 'published' && bands.some((band) => band.status !== 'published')) throw new Error('Todas las Bandas vinculadas deben estar publicadas antes de publicar el concierto.')
  if (event.brotherhood_entity_id) {
    const brotherhood = await requireEntity(supabase, event.brotherhood_entity_id, 'brotherhood', 'La Hermandad')
    if (nextStatus === 'published' && brotherhood.status !== 'published') throw new Error('La Hermandad vinculada debe estar publicada antes de publicar el concierto.')
  }

  const entity = { name, slug, summary: nullable(formData, 'summary'), status: nextStatus }
  if (current.entity.status === 'published' && nextStatus !== 'published') {
    assertMutation(await supabase.from('entities').update(entity).eq('id', id).eq('entity_type', 'event'), 'No se pudo retirar temporalmente el concierto')
    assertMutation(await supabase.from('events').update(event).eq('entity_id', id).eq('event_category', 'concert'), 'No se pudo actualizar el concierto')
  } else {
    assertMutation(await supabase.from('events').update(event).eq('entity_id', id).eq('event_category', 'concert'), 'No se pudo actualizar el concierto')
    assertMutation(await supabase.from('entities').update(entity).eq('id', id).eq('entity_type', 'event'), 'No se pudo actualizar la entidad del concierto')
  }

  await audit(supabase, user, { action_type: nextStatus === 'published' && current.entity.status !== 'published' ? 'publish' : 'update', object_type: 'concert_event', object_id: id, entity_id: id, summary: `Concierto actualizado: ${name}`, changed_fields: { entity, event } })
  await refreshConcert(supabase, id, [...bands.map((band) => band.id), current.event.brotherhood_entity_id, event.brotherhood_entity_id])
  redirectEditor(id, 'updated')
}

export async function archiveConcertEventAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = uuid(formData, 'event_id')
  const current = await requireConcertEvent(supabase, id)
  const links = await supabase.from('concert_event_bands').select('band_entity_id').eq('event_entity_id', id).neq('status', 'archived')
  assertMutation(await supabase.from('entities').update({ status: 'archived' }).eq('id', id).eq('entity_type', 'event'), 'No se pudo archivar el concierto')
  await audit(supabase, user, { action_type: 'archive', object_type: 'concert_event', object_id: id, entity_id: id, summary: `Concierto archivado: ${current.entity.name}` })
  await refreshConcert(supabase, id, [...(links.data || []).map((item) => item.band_entity_id), current.event.brotherhood_entity_id])
  redirect('/panel/conciertos?saved=archived')
}

export async function saveConcertBandAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const relationId = uuid(formData, 'relation_id', true)
  const bandId = uuid(formData, 'band_entity_id')
  const current = await requireConcertEvent(supabase, eventId)
  const band = await requireEntity(supabase, bandId, 'band', 'La Banda')
  const status = relationStatus(formData)
  if (current.entity.status === 'published' && status === 'published' && band.status !== 'published') throw new Error('La Banda debe estar publicada para mostrarla en un concierto publicado.')
  const isPrimary = formData.get('is_primary') === 'on'
  if (isPrimary) {
    const reset = await supabase.from('concert_event_bands').update({ is_primary: false }).eq('event_entity_id', eventId).neq('status', 'archived')
    if (reset.error) throw new Error(`No se pudo actualizar la Banda principal: ${reset.error.message}`)
  }
  const payload = {
    event_entity_id: eventId,
    band_entity_id: bandId,
    role_name: nullable(formData, 'role_name') || (isPrimary ? 'Banda principal' : 'Banda participante'),
    is_primary: isPrimary,
    sort_order: optionalInteger(formData, 'sort_order'),
    notes: nullable(formData, 'notes'),
    status,
  }
  const result = relationId
    ? await supabase.from('concert_event_bands').update(payload).eq('id', relationId).eq('event_entity_id', eventId).select('id').single()
    : await supabase.from('concert_event_bands').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la Banda del concierto')
  await audit(supabase, user, { action_type: relationId ? 'update' : 'link', object_type: 'concert_event_band', object_id: saved.id, entity_id: eventId, summary: 'Banda vinculada a un concierto', changed_fields: payload })
  await refreshConcert(supabase, eventId, [bandId])
  redirectEditor(eventId, 'band')
}

export async function archiveConcertBandAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const relationId = uuid(formData, 'relation_id')
  await requireConcertEvent(supabase, eventId)
  const activeResult = await supabase.from('concert_event_bands').select('id').eq('event_entity_id', eventId).neq('status', 'archived')
  if (activeResult.error) throw new Error(`No se pudieron comprobar las Bandas del concierto: ${activeResult.error.message}`)
  if ((activeResult.data || []).length <= 1) throw new Error('No puedes retirar la única Banda vinculada al concierto.')
  const saved = assertRow(await supabase.from('concert_event_bands').update({ status: 'archived', is_primary: false }).eq('id', relationId).eq('event_entity_id', eventId).select('id, band_entity_id').single(), 'No se pudo retirar la Banda del concierto')
  await audit(supabase, user, { action_type: 'archive', object_type: 'concert_event_band', object_id: saved.id, entity_id: eventId, summary: 'Banda retirada de un concierto' })
  await refreshConcert(supabase, eventId, [saved.band_entity_id])
  redirectEditor(eventId, 'band-archived')
}
