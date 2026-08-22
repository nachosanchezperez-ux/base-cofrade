'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const EDITORIAL_TYPES = new Set(['fact', 'curiosity'])
const OVERRIDE_TYPES = new Set(['ephemeris', 'fact', 'curiosity', 'march'])

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) { const candidate = value(formData, name); if (!candidate) throw new Error(`${label} es obligatorio.`); return candidate }
function uuid(formData, name, optional = false) { const candidate = value(formData, name); if (optional && !candidate) return null; if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`); return candidate }
function integer(formData, name, fallback = 0, min = null) { const candidate = value(formData, name); if (!candidate) return fallback; const parsed = Number.parseInt(candidate, 10); if (!Number.isFinite(parsed)) throw new Error(`${name} debe ser un número entero.`); if (min !== null && parsed < min) throw new Error(`${name} no puede ser menor que ${min}.`); return parsed }
function status(formData) { const candidate = value(formData, 'status') || 'draft'; if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.'); return candidate }
function dateValue(formData, name, requiredValue = false) {
  const candidate = value(formData, name)
  if (!candidate) {
    if (requiredValue) throw new Error('La fecha es obligatoria.')
    return null
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error('La fecha no es válida.')
  return candidate
}
function assertRow(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); if (!result.data) throw new Error(label); return result.data }
function assertMutation(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); return result.data }

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de la Home', error)
}

async function requireEntity(supabase, id, types = []) {
  let query = supabase.from('entities').select('id, entity_type, name, slug, status').eq('id', id).neq('status', 'archived')
  if (types.length) query = query.in('entity_type', types)
  return assertRow(await query.maybeSingle(), 'La entidad seleccionada no existe o no está disponible.')
}

async function requireEditorial(supabase, id) {
  return assertRow(await supabase.from('editorial_content').select('*').eq('id', id).maybeSingle(), 'El contenido editorial no existe.')
}

async function refreshHome() {
  revalidatePath('/panel')
  revalidatePath('/panel/hoy')
  revalidatePath('/panel/hoy/programacion')
  revalidatePath('/panel/hoy/banco')
  revalidatePath('/')
}

function redirectDate(date, saved = '', extra = '') {
  const params = new URLSearchParams({ fecha: date })
  if (saved) params.set('saved', saved)
  if (extra) params.set('content', extra)
  const destination = saved.startsWith('content') ? '/panel/hoy/banco' : '/panel/hoy/programacion'
  redirect(`${destination}?${params.toString()}`)
}

export async function saveEditorialContentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const contentId = uuid(formData, 'content_id', true)
  const type = value(formData, 'content_type') || 'curiosity'
  if (!EDITORIAL_TYPES.has(type)) throw new Error('Tipo de contenido editorial no válido.')
  const payload = {
    content_type: type,
    title: required(formData, 'title', 'El título'),
    summary: nullable(formData, 'summary'),
    body: nullable(formData, 'body'),
    author_name: nullable(formData, 'author_name'),
    cover_image_path: nullable(formData, 'cover_image_path'),
    publish_date: dateValue(formData, 'publish_date'),
    eligible_for_daily: formData.get('eligible_for_daily') === 'on',
    daily_priority: integer(formData, 'daily_priority', 0, 0),
    status: status(formData),
    notes: nullable(formData, 'notes'),
  }
  const result = contentId
    ? await supabase.from('editorial_content').update(payload).eq('id', contentId).select('id').single()
    : await supabase.from('editorial_content').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar el contenido editorial')

  await audit(supabase, user, { action_type: contentId ? 'update' : 'create', object_type: 'editorial_content', object_id: saved.id, summary: `${contentId ? 'Contenido editorial actualizado' : 'Contenido editorial creado'}: ${payload.title}`, changed_fields: payload })
  await refreshHome()
  redirectDate(value(formData, 'return_date') || new Date().toISOString().slice(0, 10), contentId ? 'content-updated' : 'content-created', saved.id)
}

export async function archiveEditorialContentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const contentId = uuid(formData, 'content_id')
  const content = await requireEditorial(supabase, contentId)
  assertMutation(await supabase.from('editorial_content').update({ status: 'archived', eligible_for_daily: false }).eq('id', contentId), 'No se pudo archivar el contenido editorial')
  await audit(supabase, user, { action_type: 'archive', object_type: 'editorial_content', object_id: contentId, summary: `Contenido editorial archivado: ${content.title}` })
  await refreshHome()
  redirectDate(value(formData, 'return_date') || new Date().toISOString().slice(0, 10), 'content-archived')
}

export async function saveEditorialContentLinkAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const contentId = uuid(formData, 'content_id')
  const linkId = uuid(formData, 'link_id', true)
  const entityId = uuid(formData, 'entity_id')
  await Promise.all([requireEditorial(supabase, contentId), requireEntity(supabase, entityId)])
  const isPrimary = formData.get('is_primary') === 'on'
  if (isPrimary) {
    const cleared = await supabase.from('editorial_content_links').update({ is_primary: false }).eq('editorial_content_id', contentId).eq('is_primary', true)
    if (cleared.error) throw new Error(`No se pudo actualizar la entidad principal: ${cleared.error.message}`)
  }
  const payload = {
    editorial_content_id: contentId,
    entity_id: entityId,
    relation_type: value(formData, 'relation_type') || 'about',
    is_primary: isPrimary,
    notes: nullable(formData, 'notes'),
  }
  const result = linkId
    ? await supabase.from('editorial_content_links').update(payload).eq('id', linkId).eq('editorial_content_id', contentId).select('id').single()
    : await supabase.from('editorial_content_links').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la relación editorial. Comprueba que no exista ya.')
  await audit(supabase, user, { action_type: linkId ? 'update' : 'link', object_type: 'editorial_content_link', object_id: saved.id, entity_id: entityId, summary: 'Entidad relacionada con contenido editorial', changed_fields: payload })
  await refreshHome()
  redirectDate(value(formData, 'return_date') || new Date().toISOString().slice(0, 10), 'content-link', contentId)
}

export async function removeEditorialContentLinkAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const contentId = uuid(formData, 'content_id')
  const linkId = uuid(formData, 'link_id')
  const saved = assertRow(await supabase.from('editorial_content_links').delete().eq('id', linkId).eq('editorial_content_id', contentId).select('id, entity_id').single(), 'No se pudo retirar la relación editorial')
  await audit(supabase, user, { action_type: 'unlink', object_type: 'editorial_content_link', object_id: saved.id, entity_id: saved.entity_id, summary: 'Relación editorial retirada' })
  await refreshHome()
  redirectDate(value(formData, 'return_date') || new Date().toISOString().slice(0, 10), 'content-link-removed', contentId)
}

export async function saveDailyOverrideAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const overrideId = uuid(formData, 'override_id', true)
  const publishDate = dateValue(formData, 'publish_date', true)
  let contentType = required(formData, 'content_type', 'El tipo de bloque')
  if (!OVERRIDE_TYPES.has(contentType)) throw new Error('Bloque diario no válido.')

  let editorialContentId = EDITORIAL_TYPES.has(contentType) ? uuid(formData, 'editorial_content_id', true) : null
  let editorialContent = null
  if (editorialContentId) {
    editorialContent = await requireEditorial(supabase, editorialContentId)
    if (!EDITORIAL_TYPES.has(editorialContent.content_type) || editorialContent.status !== 'published') throw new Error('El contenido del Banco debe estar publicado para programarlo.')
    contentType = editorialContent.content_type
  }

  const eventId = contentType === 'ephemeris' ? uuid(formData, 'event_entity_id') : null
  const marchId = contentType === 'march' ? uuid(formData, 'march_entity_id') : null
  const entityId = EDITORIAL_TYPES.has(contentType) && !editorialContentId ? uuid(formData, 'entity_id', true) : null
  if (eventId) await requireEntity(supabase, eventId, ['event'])
  if (marchId) await requireEntity(supabase, marchId, ['march'])
  if (entityId) await requireEntity(supabase, entityId)

  const title = editorialContentId ? null : nullable(formData, 'title')
  const summary = editorialContentId ? null : nullable(formData, 'summary')
  if (contentType === 'ephemeris' && !title) throw new Error('La efeméride manual necesita un título visible.')
  if (EDITORIAL_TYPES.has(contentType) && !editorialContentId && !title && !entityId) throw new Error('El contenido manual necesita un título, una entidad relacionada o un contenido del Banco.')

  const payload = {
    publish_date: publishDate,
    content_type: contentType,
    title,
    summary,
    entity_id: entityId,
    editorial_content_id: editorialContentId,
    march_entity_id: marchId,
    event_entity_id: eventId,
    reason: nullable(formData, 'reason'),
    sort_order: integer(formData, 'sort_order', 0, 0),
    status: status(formData),
  }

  let resolvedId = overrideId
  if (!resolvedId) {
    let existingQuery = supabase.from('daily_overrides').select('id').eq('publish_date', publishDate)
    existingQuery = EDITORIAL_TYPES.has(contentType)
      ? existingQuery.in('content_type', [...EDITORIAL_TYPES])
      : existingQuery.eq('content_type', contentType)
    const existing = await existingQuery.order('sort_order').limit(1).maybeSingle()
    if (existing.error) throw new Error(`No se pudo comprobar la programación diaria: ${existing.error.message}`)
    resolvedId = existing.data?.id || null
  }

  if (EDITORIAL_TYPES.has(contentType)) {
    let clear = supabase.from('daily_overrides').update({ status: 'archived' }).eq('publish_date', publishDate).in('content_type', [...EDITORIAL_TYPES]).neq('status', 'archived')
    if (resolvedId) clear = clear.neq('id', resolvedId)
    const cleared = await clear
    if (cleared.error) throw new Error(`No se pudieron retirar overrides editoriales duplicados: ${cleared.error.message}`)
  }

  const result = resolvedId
    ? await supabase.from('daily_overrides').update(payload).eq('id', resolvedId).select('id').single()
    : await supabase.from('daily_overrides').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la programación diaria')
  await audit(supabase, user, { action_type: resolvedId ? 'update' : 'create', object_type: 'daily_override', object_id: saved.id, entity_id: entityId || marchId || eventId, summary: `Programación manual de Home: ${contentType} · ${publishDate}`, changed_fields: payload })
  await refreshHome()
  redirectDate(publishDate, 'override')
}

export async function archiveDailyOverrideAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const overrideId = uuid(formData, 'override_id')
  const publishDate = dateValue(formData, 'publish_date', true)
  const saved = assertRow(await supabase.from('daily_overrides').update({ status: 'archived' }).eq('id', overrideId).select('id, content_type').single(), 'No se pudo retirar la programación manual')
  await audit(supabase, user, { action_type: 'archive', object_type: 'daily_override', object_id: saved.id, summary: `La Home vuelve a modo automático para ${saved.content_type} · ${publishDate}` })
  await refreshHome()
  redirectDate(publishDate, 'override-archived')
}
