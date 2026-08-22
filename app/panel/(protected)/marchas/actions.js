'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const AUTHOR_ROLES = new Set(['composer', 'adapter'])
const DEDICATION_TYPES = new Set(['dedicated_to'])

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) { const candidate = value(formData, name); if (!candidate) throw new Error(`${label} es obligatorio.`); return candidate }
function uuid(formData, name, optional = false) { const candidate = value(formData, name); if (optional && !candidate) return null; if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`); return candidate }
function integer(formData, name, { min = null, max = null, fallback = null } = {}) {
  const candidate = value(formData, name)
  if (!candidate) return fallback
  const parsed = Number.parseInt(candidate, 10)
  if (!Number.isFinite(parsed)) throw new Error(`${name} debe ser un número entero.`)
  if (min !== null && parsed < min) throw new Error(`${name} no puede ser menor que ${min}.`)
  if (max !== null && parsed > max) throw new Error(`${name} no puede ser mayor que ${max}.`)
  return parsed
}
function optionalDate(formData, name) { const candidate = value(formData, name); if (!candidate) return null; if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error(`La fecha ${name} no es válida.`); return candidate }
function status(formData) { const candidate = value(formData, 'status') || 'draft'; if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.'); return candidate }
function slugify(input) { return String(input || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
function httpUrl(formData, name) {
  const candidate = nullable(formData, name)
  if (!candidate) return null
  try {
    const parsed = new URL(candidate)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error()
    return parsed.toString()
  } catch {
    throw new Error(`La URL de ${name} no es válida.`)
  }
}
function assertRow(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); if (!result.data) throw new Error(label); return result.data }
function assertMutation(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); return result.data }

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de la Marcha', error)
}

async function ensureUniqueSlug(supabase, slug, marchId = null) {
  let query = supabase.from('entities').select('id, name').eq('slug', slug)
  if (marchId) query = query.neq('id', marchId)
  const result = await query.limit(1).maybeSingle()
  if (result.error) throw new Error(`No se pudo comprobar el slug: ${result.error.message}`)
  if (result.data) throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
}

async function requireMarch(supabase, marchId) {
  const entity = assertRow(await supabase.from('entities').select('id, name, slug, status').eq('id', marchId).eq('entity_type', 'march').maybeSingle(), 'La Marcha no existe.')
  const march = assertRow(await supabase.from('marches').select('*').eq('entity_id', marchId).maybeSingle(), 'La ficha musical no existe.')
  return { entity, march }
}

async function requireEntity(supabase, entityId, types, label) {
  return assertRow(
    await supabase.from('entities').select('id, entity_type, name, slug, status').eq('id', entityId).in('entity_type', types).neq('status', 'archived').maybeSingle(),
    `${label} no existe o no está disponible.`
  )
}

async function refreshMarch(supabase, marchId, relatedEntityIds = []) {
  revalidatePath('/panel')
  revalidatePath('/panel/marchas')
  revalidatePath(`/panel/marchas/${marchId}`)
  revalidatePath('/panel/hoy')
  revalidatePath('/')

  if (!relatedEntityIds.length) return
  const result = await supabase.from('entities').select('entity_type, slug').in('id', [...new Set(relatedEntityIds.filter(Boolean))])
  if (result.error) return
  for (const entity of result.data || []) {
    if (!entity.slug) continue
    if (entity.entity_type === 'brotherhood') revalidatePath(`/hermandades/${entity.slug}`)
    if (entity.entity_type === 'image') revalidatePath(`/imagenes/${entity.slug}`)
    if (entity.entity_type === 'band') revalidatePath(`/bandas/${entity.slug}`)
  }
}

function redirectMarch(marchId, saved = '') {
  redirect(`/panel/marchas/${marchId}${saved ? `?saved=${saved}` : ''}`)
}

export async function createMarchAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const marchId = randomUUID()
  const name = required(formData, 'name', 'El título')
  const slug = slugify(value(formData, 'slug') || name)
  if (!slug) throw new Error('No se ha podido generar un slug válido.')
  await ensureUniqueSlug(supabase, slug)
  const entityStatus = status(formData)
  const premiereBandId = uuid(formData, 'premiered_by_band_entity_id', true)
  if (premiereBandId) await requireEntity(supabase, premiereBandId, ['band'], 'La Banda de estreno')

  const entityPayload = { id: marchId, entity_type: 'march', name, slug, summary: nullable(formData, 'summary'), status: entityStatus }
  const marchPayload = {
    entity_id: marchId,
    composition_year: integer(formData, 'composition_year', { min: 1800, max: 2200 }),
    composition_date_text: nullable(formData, 'composition_date_text'),
    music_type: nullable(formData, 'music_type'),
    youtube_video_id: nullable(formData, 'youtube_video_id'),
    premiere_date: optionalDate(formData, 'premiere_date'),
    premiere_date_text: nullable(formData, 'premiere_date_text'),
    premiere_place_id: uuid(formData, 'premiere_place_id', true),
    premiered_by_band_entity_id: premiereBandId,
    description: nullable(formData, 'description'),
    eligible_for_daily: formData.get('eligible_for_daily') === 'on',
    daily_priority: integer(formData, 'daily_priority', { min: 0, fallback: 0 }),
  }

  assertMutation(await supabase.from('entities').insert(entityPayload), 'No se pudo crear la entidad de Marcha')
  const marchResult = await supabase.from('marches').insert(marchPayload)
  if (marchResult.error) {
    await supabase.from('entities').delete().eq('id', marchId)
    throw new Error(`No se pudo crear la ficha musical: ${marchResult.error.message}`)
  }

  await audit(supabase, user, { action_type: 'create', object_type: 'march', object_id: marchId, entity_id: marchId, summary: `Marcha creada: ${name}`, changed_fields: { entity: entityPayload, march: marchPayload } })
  await refreshMarch(supabase, marchId, [premiereBandId])
  redirectMarch(marchId, 'created')
}

export async function updateMarchAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const marchId = uuid(formData, 'march_id')
  const current = await requireMarch(supabase, marchId)
  const name = required(formData, 'name', 'El título')
  const slug = slugify(required(formData, 'slug', 'El slug'))
  const nextStatus = status(formData)
  if (current.entity.status === 'published' && current.entity.slug !== slug) throw new Error('El slug de una Marcha publicada no puede cambiarse. Retira primero la publicación.')
  await ensureUniqueSlug(supabase, slug, marchId)
  const premiereBandId = uuid(formData, 'premiered_by_band_entity_id', true)
  if (premiereBandId) await requireEntity(supabase, premiereBandId, ['band'], 'La Banda de estreno')

  const entityPayload = { name, slug, summary: nullable(formData, 'summary'), status: nextStatus }
  const marchPayload = {
    composition_year: integer(formData, 'composition_year', { min: 1800, max: 2200 }),
    composition_date_text: nullable(formData, 'composition_date_text'),
    music_type: nullable(formData, 'music_type'),
    youtube_video_id: nullable(formData, 'youtube_video_id'),
    premiere_date: optionalDate(formData, 'premiere_date'),
    premiere_date_text: nullable(formData, 'premiere_date_text'),
    premiere_place_id: uuid(formData, 'premiere_place_id', true),
    premiered_by_band_entity_id: premiereBandId,
    description: nullable(formData, 'description'),
    eligible_for_daily: formData.get('eligible_for_daily') === 'on',
    daily_priority: integer(formData, 'daily_priority', { min: 0, fallback: 0 }),
  }
  assertMutation(await supabase.from('entities').update(entityPayload).eq('id', marchId).eq('entity_type', 'march'), 'No se pudo actualizar la Marcha')
  assertMutation(await supabase.from('marches').update(marchPayload).eq('entity_id', marchId), 'No se pudo actualizar la ficha musical')

  const actionType = current.entity.status !== 'published' && nextStatus === 'published' ? 'publish' : current.entity.status === 'published' && nextStatus !== 'published' ? 'unpublish' : 'update'
  await audit(supabase, user, { action_type: actionType, object_type: 'march', object_id: marchId, entity_id: marchId, summary: `Marcha actualizada: ${name}`, changed_fields: { entity: entityPayload, march: marchPayload } })
  await refreshMarch(supabase, marchId, [current.march.premiered_by_band_entity_id, premiereBandId])
  redirectMarch(marchId, 'updated')
}

export async function archiveMarchAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const marchId = uuid(formData, 'march_id')
  const current = await requireMarch(supabase, marchId)
  assertMutation(await supabase.from('entities').update({ status: 'archived' }).eq('id', marchId).eq('entity_type', 'march'), 'No se pudo archivar la Marcha')
  await audit(supabase, user, { action_type: 'archive', object_type: 'march', object_id: marchId, entity_id: marchId, summary: `Marcha archivada: ${current.entity.name}` })
  await refreshMarch(supabase, marchId, [current.march.premiered_by_band_entity_id])
  redirect('/panel/marchas?saved=archived')
}

export async function saveMarchAuthorAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const marchId = uuid(formData, 'march_id')
  const authorId = uuid(formData, 'author_id', true)
  const agentId = uuid(formData, 'agent_entity_id')
  const role = value(formData, 'author_role') || 'composer'
  if (!AUTHOR_ROLES.has(role)) throw new Error('Tipo de autoría no válido.')
  await Promise.all([requireMarch(supabase, marchId), requireEntity(supabase, agentId, ['agent'], 'La Persona / Agente')])
  const payload = { march_entity_id: marchId, agent_entity_id: agentId, author_role: role, notes: nullable(formData, 'notes'), status: status(formData) }
  const result = authorId
    ? await supabase.from('march_authors').update(payload).eq('id', authorId).eq('march_entity_id', marchId).select('id').single()
    : await supabase.from('march_authors').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la autoría. Comprueba que no exista ya el mismo autor con el mismo papel.')
  await audit(supabase, user, { action_type: authorId ? 'update' : 'link', object_type: 'march_author', object_id: saved.id, entity_id: marchId, summary: `Autoría de Marcha guardada: ${role}`, changed_fields: payload })
  await refreshMarch(supabase, marchId, [agentId])
  redirectMarch(marchId, 'author')
}

export async function archiveMarchAuthorAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const marchId = uuid(formData, 'march_id')
  const authorId = uuid(formData, 'author_id')
  const saved = assertRow(await supabase.from('march_authors').update({ status: 'archived' }).eq('id', authorId).eq('march_entity_id', marchId).select('id, agent_entity_id').single(), 'No se pudo archivar la autoría')
  await audit(supabase, user, { action_type: 'archive', object_type: 'march_author', object_id: saved.id, entity_id: marchId, summary: 'Autoría de Marcha archivada' })
  await refreshMarch(supabase, marchId, [saved.agent_entity_id])
  redirectMarch(marchId, 'author-archived')
}

export async function saveMarchDedicationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const marchId = uuid(formData, 'march_id')
  const dedicationId = uuid(formData, 'dedication_id', true)
  const dedicateeId = uuid(formData, 'dedicatee_entity_id')
  const type = value(formData, 'dedication_type') || 'dedicated_to'
  if (!DEDICATION_TYPES.has(type)) throw new Error('Tipo de dedicatoria no válido.')
  await Promise.all([requireMarch(supabase, marchId), requireEntity(supabase, dedicateeId, ['brotherhood', 'image'], 'La entidad dedicataria')])
  const payload = { march_entity_id: marchId, dedicatee_entity_id: dedicateeId, dedication_type: type, dedication_text: nullable(formData, 'dedication_text'), notes: nullable(formData, 'notes'), status: status(formData) }
  const result = dedicationId
    ? await supabase.from('march_dedications').update(payload).eq('id', dedicationId).eq('march_entity_id', marchId).select('id').single()
    : await supabase.from('march_dedications').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la dedicatoria. Comprueba que no exista ya la misma relación.')
  await audit(supabase, user, { action_type: dedicationId ? 'update' : 'link', object_type: 'march_dedication', object_id: saved.id, entity_id: marchId, summary: 'Dedicatoria de Marcha guardada', changed_fields: payload })
  await refreshMarch(supabase, marchId, [dedicateeId])
  redirectMarch(marchId, 'dedication')
}

export async function archiveMarchDedicationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const marchId = uuid(formData, 'march_id')
  const dedicationId = uuid(formData, 'dedication_id')
  const saved = assertRow(await supabase.from('march_dedications').update({ status: 'archived' }).eq('id', dedicationId).eq('march_entity_id', marchId).select('id, dedicatee_entity_id').single(), 'No se pudo archivar la dedicatoria')
  await audit(supabase, user, { action_type: 'archive', object_type: 'march_dedication', object_id: saved.id, entity_id: marchId, summary: 'Dedicatoria de Marcha archivada' })
  await refreshMarch(supabase, marchId, [saved.dedicatee_entity_id])
  redirectMarch(marchId, 'dedication-archived')
}

export async function saveMarchRecordingAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const marchId = uuid(formData, 'march_id')
  const recordingId = uuid(formData, 'recording_id', true)
  const bandId = uuid(formData, 'band_entity_id', true)
  await requireMarch(supabase, marchId)
  if (bandId) await requireEntity(supabase, bandId, ['band'], 'La Banda')
  const isFeatured = formData.get('is_featured') === 'on'
  if (isFeatured) {
    let clear = supabase.from('march_recordings').update({ is_featured: false }).eq('march_entity_id', marchId).eq('is_featured', true)
    if (recordingId) clear = clear.neq('id', recordingId)
    const result = await clear
    if (result.error) throw new Error(`No se pudo actualizar la grabación destacada: ${result.error.message}`)
  }
  const payload = {
    march_entity_id: marchId,
    band_entity_id: bandId,
    title: nullable(formData, 'title'),
    recording_year: integer(formData, 'recording_year', { min: 1800, max: 2200 }),
    youtube_video_id: nullable(formData, 'youtube_video_id'),
    external_url: httpUrl(formData, 'external_url'),
    place_id: uuid(formData, 'place_id', true),
    is_featured: isFeatured,
    notes: nullable(formData, 'notes'),
    status: status(formData),
  }
  const result = recordingId
    ? await supabase.from('march_recordings').update(payload).eq('id', recordingId).eq('march_entity_id', marchId).select('id').single()
    : await supabase.from('march_recordings').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la grabación')
  await audit(supabase, user, { action_type: recordingId ? 'update' : 'create', object_type: 'march_recording', object_id: saved.id, entity_id: marchId, summary: 'Grabación de Marcha guardada', changed_fields: payload })
  await refreshMarch(supabase, marchId, [bandId])
  redirectMarch(marchId, 'recording')
}

export async function archiveMarchRecordingAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const marchId = uuid(formData, 'march_id')
  const recordingId = uuid(formData, 'recording_id')
  const saved = assertRow(await supabase.from('march_recordings').update({ status: 'archived', is_featured: false }).eq('id', recordingId).eq('march_entity_id', marchId).select('id, band_entity_id').single(), 'No se pudo archivar la grabación')
  await audit(supabase, user, { action_type: 'archive', object_type: 'march_recording', object_id: saved.id, entity_id: marchId, summary: 'Grabación de Marcha archivada' })
  await refreshMarch(supabase, marchId, [saved.band_entity_id])
  redirectMarch(marchId, 'recording-archived')
}
