'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CREW_EVENT_TYPE_LABELS } from '@/lib/crew-events'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const EVENT_STATUSES = new Set(['announced', 'postponed', 'cancelled', 'held'])
const EVENT_TYPES = new Set(Object.keys(CREW_EVENT_TYPE_LABELS))

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) { const candidate = value(formData, name); if (!candidate) throw new Error(`${label} es obligatorio.`); return candidate }
function uuid(formData, name, optional = false) { const candidate = value(formData, name); if (optional && !candidate) return null; if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`); return candidate }
function optionalInteger(formData, name) { const candidate = value(formData, name); if (!candidate) return 0; const parsed = Number.parseInt(candidate, 10); if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${name} debe ser un entero positivo.`); return parsed }
function editorialStatus(formData) { const candidate = value(formData, 'status') || 'draft'; if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.'); return candidate }
function relationStatus(formData) { const candidate = value(formData, 'relation_status') || 'draft'; if (!STATUSES.has(candidate)) throw new Error('Estado de relación no válido.'); return candidate }
function eventStatus(formData) { const candidate = value(formData, 'event_status') || 'announced'; if (!EVENT_STATUSES.has(candidate)) throw new Error('Estado de convocatoria no válido.'); return candidate }
function eventType(formData) { const candidate = value(formData, 'event_type'); if (!EVENT_TYPES.has(candidate)) throw new Error('Tipo de convocatoria no válido.'); return candidate }
function date(formData) { const candidate = required(formData, 'event_date', 'La fecha'); if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error('La fecha no es válida.'); return candidate }
function optionalTime(formData, name) { const candidate = value(formData, name); if (!candidate) return null; if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(candidate)) throw new Error(`La hora de ${name} no es válida.`); return candidate }
function slugify(input) { return String(input || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
function assertRow(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); if (!result.data) throw new Error(label); return result.data }
function assertMutation(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); return result.data }

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de la convocatoria', error)
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

async function requireCrewEvent(supabase, id) {
  const entity = assertRow(await supabase.from('entities').select('id, name, slug, status').eq('id', id).eq('entity_type', 'event').maybeSingle(), 'La convocatoria no existe.')
  const event = assertRow(await supabase.from('events').select('*').eq('entity_id', id).eq('event_category', 'crew_call').maybeSingle(), 'La ficha de la convocatoria no existe.')
  return { entity, event }
}

function eventPayload(formData) {
  const startTime = optionalTime(formData, 'start_time')
  const endTime = optionalTime(formData, 'end_time')
  if (startTime && endTime && endTime < startTime) throw new Error('La hora final no puede ser anterior a la hora inicial.')
  return {
    event_category: 'crew_call',
    event_type: eventType(formData),
    event_date: date(formData),
    event_date_text: null,
    brotherhood_entity_id: uuid(formData, 'brotherhood_entity_id'),
    municipality_id: uuid(formData, 'municipality_id', true),
    place_id: uuid(formData, 'place_id', true),
    start_time: startTime,
    end_time: endTime,
    time_text: nullable(formData, 'time_text'),
    event_status: eventStatus(formData),
    location_text: nullable(formData, 'location_text'),
    requirements: nullable(formData, 'requirements'),
    public_notes: nullable(formData, 'public_notes'),
    description: nullable(formData, 'description'),
  }
}

async function refreshCrewEvent(supabase, id, relatedIds = []) {
  revalidatePath('/igualas-y-ensayos')
  revalidatePath('/panel')
  revalidatePath('/panel/igualas-y-ensayos')
  revalidatePath(`/panel/igualas-y-ensayos/${id}`)
  revalidatePath('/sitemap.xml')
  const ids = [...new Set([id, ...relatedIds].filter(Boolean))]
  if (!ids.length) return
  const result = await supabase.from('entities').select('id, entity_type, slug').in('id', ids)
  if (result.error) return
  result.data?.forEach((entity) => {
    if (!entity.slug) return
    if (entity.id === id) revalidatePath(`/igualas-y-ensayos/${entity.slug}`)
    if (entity.entity_type === 'brotherhood') revalidatePath(`/hermandades/${entity.slug}`)
    if (entity.entity_type === 'step') revalidatePath(`/pasos/${entity.slug}`)
  })
}

function redirectEditor(id, saved) { redirect(`/panel/igualas-y-ensayos/${id}?saved=${saved}`) }

export async function createCrewEventAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = randomUUID()
  const name = required(formData, 'name', 'El título')
  const slug = slugify(value(formData, 'slug') || `${name}-${value(formData, 'event_date')}`)
  if (!slug) throw new Error('No se ha podido generar un slug válido.')
  await ensureUniqueSlug(supabase, slug)
  const nextStatus = editorialStatus(formData)
  const event = eventPayload(formData)
  const brotherhood = await requireEntity(supabase, event.brotherhood_entity_id, 'brotherhood', 'La Hermandad')
  if (nextStatus === 'published' && brotherhood.status !== 'published') throw new Error('La Hermandad debe estar publicada antes de publicar la convocatoria.')
  const entity = { id, entity_type: 'event', name, slug, summary: nullable(formData, 'summary'), status: nextStatus }
  assertMutation(await supabase.from('entities').insert(entity), 'No se pudo crear la entidad de la convocatoria')
  const result = await supabase.from('events').insert({ entity_id: id, ...event })
  if (result.error) {
    await supabase.from('entities').delete().eq('id', id)
    throw new Error(`No se pudo crear la convocatoria: ${result.error.message}`)
  }
  await audit(supabase, user, { action_type: 'create', object_type: 'crew_event', object_id: id, entity_id: id, summary: `Convocatoria creada: ${name}`, changed_fields: { entity, event } })
  await refreshCrewEvent(supabase, id, [event.brotherhood_entity_id])
  redirectEditor(id, 'created')
}

export async function updateCrewEventAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = uuid(formData, 'event_id')
  const current = await requireCrewEvent(supabase, id)
  const name = required(formData, 'name', 'El título')
  const slug = slugify(required(formData, 'slug', 'El slug'))
  const nextStatus = editorialStatus(formData)
  if (current.entity.status === 'published' && nextStatus === 'published' && current.entity.slug !== slug) throw new Error('El slug de una convocatoria publicada no puede cambiarse. Pásala primero a borrador o revisión.')
  await ensureUniqueSlug(supabase, slug, id)
  const event = eventPayload(formData)
  const brotherhood = await requireEntity(supabase, event.brotherhood_entity_id, 'brotherhood', 'La Hermandad')
  if (nextStatus === 'published' && brotherhood.status !== 'published') throw new Error('La Hermandad debe estar publicada antes de publicar la convocatoria.')
  const entity = { name, slug, summary: nullable(formData, 'summary'), status: nextStatus }

  if (current.entity.status === 'published' && nextStatus !== 'published') {
    assertMutation(await supabase.from('entities').update(entity).eq('id', id).eq('entity_type', 'event'), 'No se pudo retirar temporalmente la convocatoria')
    assertMutation(await supabase.from('events').update(event).eq('entity_id', id).eq('event_category', 'crew_call'), 'No se pudo actualizar la convocatoria')
  } else {
    assertMutation(await supabase.from('events').update(event).eq('entity_id', id).eq('event_category', 'crew_call'), 'No se pudo actualizar la convocatoria')
    assertMutation(await supabase.from('entities').update(entity).eq('id', id).eq('entity_type', 'event'), 'No se pudo actualizar la entidad de la convocatoria')
  }

  await audit(supabase, user, { action_type: nextStatus === 'published' && current.entity.status !== 'published' ? 'publish' : 'update', object_type: 'crew_event', object_id: id, entity_id: id, summary: `Convocatoria actualizada: ${name}`, changed_fields: { entity, event } })
  await refreshCrewEvent(supabase, id, [current.event.brotherhood_entity_id, event.brotherhood_entity_id])
  redirectEditor(id, 'updated')
}

export async function archiveCrewEventAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = uuid(formData, 'event_id')
  const current = await requireCrewEvent(supabase, id)
  assertMutation(await supabase.from('entities').update({ status: 'archived' }).eq('id', id).eq('entity_type', 'event'), 'No se pudo archivar la convocatoria')
  await audit(supabase, user, { action_type: 'archive', object_type: 'crew_event', object_id: id, entity_id: id, summary: `Convocatoria archivada: ${current.entity.name}` })
  await refreshCrewEvent(supabase, id, [current.event.brotherhood_entity_id])
  redirect('/panel/igualas-y-ensayos?saved=archived')
}

export async function saveCrewEventStepAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const relationId = uuid(formData, 'relation_id', true)
  const stepId = uuid(formData, 'step_entity_id')
  await Promise.all([requireCrewEvent(supabase, eventId), requireEntity(supabase, stepId, 'step', 'El Paso')])
  const payload = { event_entity_id: eventId, step_entity_id: stepId, is_primary: formData.get('is_primary') === 'on', sort_order: optionalInteger(formData, 'sort_order'), notes: nullable(formData, 'notes'), status: relationStatus(formData) }
  const result = relationId
    ? await supabase.from('crew_event_steps').update(payload).eq('id', relationId).eq('event_entity_id', eventId).select('id').single()
    : await supabase.from('crew_event_steps').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar el Paso de la convocatoria')
  await audit(supabase, user, { action_type: relationId ? 'update' : 'link', object_type: 'crew_event_step', object_id: saved.id, entity_id: eventId, summary: 'Paso vinculado a una convocatoria', changed_fields: payload })
  await refreshCrewEvent(supabase, eventId, [stepId])
  redirectEditor(eventId, 'step')
}

export async function archiveCrewEventStepAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const relationId = uuid(formData, 'relation_id')
  await requireCrewEvent(supabase, eventId)
  const saved = assertRow(await supabase.from('crew_event_steps').update({ status: 'archived' }).eq('id', relationId).eq('event_entity_id', eventId).select('id, step_entity_id').single(), 'No se pudo archivar la relación con el Paso')
  await audit(supabase, user, { action_type: 'archive', object_type: 'crew_event_step', object_id: saved.id, entity_id: eventId, summary: 'Paso retirado de una convocatoria' })
  await refreshCrewEvent(supabase, eventId, [saved.step_entity_id])
  redirectEditor(eventId, 'step-archived')
}

export async function saveCrewEventAgentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const relationId = uuid(formData, 'relation_id', true)
  const agentId = uuid(formData, 'agent_entity_id')
  await Promise.all([requireCrewEvent(supabase, eventId), requireEntity(supabase, agentId, 'agent', 'La Persona')])
  const payload = { event_entity_id: eventId, agent_entity_id: agentId, role_name: required(formData, 'role_name', 'La responsabilidad'), is_primary: formData.get('is_primary') === 'on', sort_order: optionalInteger(formData, 'sort_order'), notes: nullable(formData, 'notes'), status: relationStatus(formData) }
  const result = relationId
    ? await supabase.from('crew_event_agents').update(payload).eq('id', relationId).eq('event_entity_id', eventId).select('id').single()
    : await supabase.from('crew_event_agents').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar el responsable de la convocatoria')
  await audit(supabase, user, { action_type: relationId ? 'update' : 'link', object_type: 'crew_event_agent', object_id: saved.id, entity_id: eventId, summary: 'Responsable vinculado a una convocatoria', changed_fields: payload })
  await refreshCrewEvent(supabase, eventId, [agentId])
  redirectEditor(eventId, 'agent')
}

export async function archiveCrewEventAgentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const relationId = uuid(formData, 'relation_id')
  await requireCrewEvent(supabase, eventId)
  const saved = assertRow(await supabase.from('crew_event_agents').update({ status: 'archived' }).eq('id', relationId).eq('event_entity_id', eventId).select('id, agent_entity_id').single(), 'No se pudo archivar el responsable')
  await audit(supabase, user, { action_type: 'archive', object_type: 'crew_event_agent', object_id: saved.id, entity_id: eventId, summary: 'Responsable retirado de una convocatoria' })
  await refreshCrewEvent(supabase, eventId, [saved.agent_entity_id])
  redirectEditor(eventId, 'agent-archived')
}
