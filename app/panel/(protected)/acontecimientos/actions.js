'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) { const candidate = value(formData, name); if (!candidate) throw new Error(`${label} es obligatorio.`); return candidate }
function uuid(formData, name, optional = false) { const candidate = value(formData, name); if (optional && !candidate) return null; if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`); return candidate }
function status(formData) { const candidate = value(formData, 'status') || 'draft'; if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.'); return candidate }
function optionalDate(formData, name) { const candidate = value(formData, name); if (!candidate) return null; if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error('La fecha no es válida.'); return candidate }
function slugify(input) { return String(input || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
function assertRow(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); if (!result.data) throw new Error(label); return result.data }
function assertMutation(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); return result.data }

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición del Acontecimiento', error)
}

async function ensureUniqueSlug(supabase, slug, eventId = null) {
  let query = supabase.from('entities').select('id, name').eq('slug', slug)
  if (eventId) query = query.neq('id', eventId)
  const result = await query.limit(1).maybeSingle()
  if (result.error) throw new Error(`No se pudo comprobar el slug: ${result.error.message}`)
  if (result.data) throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
}

async function requireEvent(supabase, eventId) {
  const entity = assertRow(await supabase.from('entities').select('id, name, slug, status').eq('id', eventId).eq('entity_type', 'event').maybeSingle(), 'El Acontecimiento no existe.')
  const event = assertRow(await supabase.from('events').select('*').eq('entity_id', eventId).eq('event_category', 'historical').maybeSingle(), 'La ficha del Acontecimiento no existe.')
  return { entity, event }
}

async function requireTarget(supabase, targetId) {
  return assertRow(await supabase.from('entities').select('id, entity_type, name, slug, status').eq('id', targetId).neq('entity_type', 'event').neq('status', 'archived').maybeSingle(), 'La entidad relacionada no existe o no está disponible.')
}

async function refreshEvent(supabase, eventId, targetIds = []) {
  revalidatePath('/panel')
  revalidatePath('/panel/acontecimientos')
  revalidatePath(`/panel/acontecimientos/${eventId}`)
  revalidatePath('/')

  if (targetIds.length) {
    const result = await supabase.from('entities').select('entity_type, slug').in('id', [...new Set(targetIds.filter(Boolean))])
    if (!result.error) {
      for (const entity of result.data || []) {
        if (!entity.slug) continue
        if (entity.entity_type === 'brotherhood') revalidatePath(`/hermandades/${entity.slug}`)
        if (entity.entity_type === 'image') revalidatePath(`/imagenes/${entity.slug}`)
        if (entity.entity_type === 'step') revalidatePath(`/pasos/${entity.slug}`)
        if (entity.entity_type === 'band') revalidatePath(`/bandas/${entity.slug}`)
      }
    }
  }
}

function redirectEvent(eventId, saved = '') {
  redirect(`/panel/acontecimientos/${eventId}${saved ? `?saved=${saved}` : ''}`)
}

export async function createEventAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = randomUUID()
  const name = required(formData, 'name', 'El título')
  const slug = slugify(value(formData, 'slug') || name)
  if (!slug) throw new Error('No se ha podido generar un slug válido.')
  await ensureUniqueSlug(supabase, slug)
  const entityStatus = status(formData)
  const entityPayload = { id: eventId, entity_type: 'event', name, slug, summary: nullable(formData, 'summary'), status: entityStatus }
  const eventPayload = {
    entity_id: eventId,
    event_category: 'historical',
    event_type: required(formData, 'event_type', 'El tipo de acontecimiento'),
    event_date: optionalDate(formData, 'event_date'),
    event_date_text: nullable(formData, 'event_date_text'),
    place_id: uuid(formData, 'place_id', true),
    description: nullable(formData, 'description'),
  }

  assertMutation(await supabase.from('entities').insert(entityPayload), 'No se pudo crear la entidad de Acontecimiento')
  const eventResult = await supabase.from('events').insert(eventPayload)
  if (eventResult.error) {
    await supabase.from('entities').delete().eq('id', eventId)
    throw new Error(`No se pudo crear la ficha del Acontecimiento: ${eventResult.error.message}`)
  }

  const contextEntityId = uuid(formData, 'context_entity_id', true)
  if (contextEntityId) {
    await requireTarget(supabase, contextEntityId)
    const relation = await supabase.from('entity_relations').insert({ source_entity_id: eventId, relation_type: 'involves', target_entity_id: contextEntityId, status: entityStatus }).select('id').single()
    if (relation.error) console.error('[Hilo Cofrade] El Acontecimiento se creó, pero no se pudo relacionar con el contexto', relation.error)
  }

  await audit(supabase, user, { action_type: 'create', object_type: 'event', object_id: eventId, entity_id: eventId, summary: `Acontecimiento creado: ${name}`, changed_fields: { entity: entityPayload, event: eventPayload, context_entity_id: contextEntityId } })
  await refreshEvent(supabase, eventId, [contextEntityId])
  redirectEvent(eventId, 'created')
}

export async function updateEventAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const current = await requireEvent(supabase, eventId)
  const name = required(formData, 'name', 'El título')
  const slug = slugify(required(formData, 'slug', 'El slug'))
  const nextStatus = status(formData)
  if (current.entity.status === 'published' && current.entity.slug !== slug) throw new Error('El slug de un Acontecimiento publicado no puede cambiarse. Retira primero la publicación.')
  await ensureUniqueSlug(supabase, slug, eventId)

  const entityPayload = { name, slug, summary: nullable(formData, 'summary'), status: nextStatus }
  const eventPayload = {
    event_type: required(formData, 'event_type', 'El tipo de acontecimiento'),
    event_date: optionalDate(formData, 'event_date'),
    event_date_text: nullable(formData, 'event_date_text'),
    place_id: uuid(formData, 'place_id', true),
    description: nullable(formData, 'description'),
  }
  assertMutation(await supabase.from('entities').update(entityPayload).eq('id', eventId).eq('entity_type', 'event'), 'No se pudo actualizar el Acontecimiento')
  assertMutation(await supabase.from('events').update(eventPayload).eq('entity_id', eventId).eq('event_category', 'historical'), 'No se pudo actualizar la ficha del Acontecimiento')
  await audit(supabase, user, { action_type: nextStatus === 'published' && current.entity.status !== 'published' ? 'publish' : 'update', object_type: 'event', object_id: eventId, entity_id: eventId, summary: `Acontecimiento actualizado: ${name}`, changed_fields: { entity: entityPayload, event: eventPayload } })
  const relations = await supabase.from('entity_relations').select('target_entity_id').eq('source_entity_id', eventId).neq('status', 'archived')
  await refreshEvent(supabase, eventId, (relations.data || []).map((item) => item.target_entity_id))
  redirectEvent(eventId, 'updated')
}

export async function archiveEventAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const current = await requireEvent(supabase, eventId)
  assertMutation(await supabase.from('entities').update({ status: 'archived' }).eq('id', eventId).eq('entity_type', 'event'), 'No se pudo archivar el Acontecimiento')
  await audit(supabase, user, { action_type: 'archive', object_type: 'event', object_id: eventId, entity_id: eventId, summary: `Acontecimiento archivado: ${current.entity.name}` })
  const relations = await supabase.from('entity_relations').select('target_entity_id').eq('source_entity_id', eventId)
  await refreshEvent(supabase, eventId, (relations.data || []).map((item) => item.target_entity_id))
  redirect('/panel/acontecimientos?saved=archived')
}

export async function saveEventRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const relationId = uuid(formData, 'relation_id', true)
  const targetId = uuid(formData, 'target_entity_id')
  await requireEvent(supabase, eventId)
  const target = await requireTarget(supabase, targetId)
  const relationStatus = status(formData)
  const payload = {
    source_entity_id: eventId,
    relation_type: 'involves',
    target_entity_id: targetId,
    date_from: optionalDate(formData, 'date_from'),
    date_from_text: nullable(formData, 'date_from_text'),
    date_to: optionalDate(formData, 'date_to'),
    date_to_text: nullable(formData, 'date_to_text'),
    notes: nullable(formData, 'notes'),
    status: relationStatus,
  }

  if (!relationId) {
    const duplicate = await supabase.from('entity_relations').select('id').eq('source_entity_id', eventId).eq('relation_type', 'involves').eq('target_entity_id', targetId).neq('status', 'archived').limit(1).maybeSingle()
    if (duplicate.error) throw new Error(`No se pudo comprobar la relación: ${duplicate.error.message}`)
    if (duplicate.data) throw new Error('Este Acontecimiento ya está relacionado con esa entidad.')
  }

  const result = relationId
    ? await supabase.from('entity_relations').update(payload).eq('id', relationId).eq('source_entity_id', eventId).select('id').single()
    : await supabase.from('entity_relations').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la relación del Acontecimiento')
  await audit(supabase, user, { action_type: relationId ? 'update' : 'link', object_type: 'entity_relation', object_id: saved.id, entity_id: eventId, summary: `Acontecimiento relacionado con ${target.name}`, changed_fields: payload })
  await refreshEvent(supabase, eventId, [targetId])
  redirectEvent(eventId, 'relation')
}

export async function archiveEventRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const eventId = uuid(formData, 'event_id')
  const relationId = uuid(formData, 'relation_id')
  await requireEvent(supabase, eventId)
  const saved = assertRow(await supabase.from('entity_relations').update({ status: 'archived' }).eq('id', relationId).eq('source_entity_id', eventId).select('id, target_entity_id').single(), 'No se pudo archivar la relación')
  await audit(supabase, user, { action_type: 'archive', object_type: 'entity_relation', object_id: saved.id, entity_id: eventId, summary: 'Relación del Acontecimiento archivada' })
  await refreshEvent(supabase, eventId, [saved.target_entity_id])
  redirectEvent(eventId, 'relation-archived')
}
