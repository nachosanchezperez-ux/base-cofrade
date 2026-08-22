'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const EVENT_STATUSES = new Set(['announced', 'held', 'cancelled'])
const CHARACTERS = new Set(['ordinary', 'extraordinary'])
const PARTICIPATION_MODES = new Set(['full_route', 'segment', 'alternating', 'unspecified'])
const PARTICIPANT_ROLES = new Set(['processional_image', 'liturgical_music'])
const IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp'], ['image/gif', 'gif'], ['image/avif', 'avif'],
])

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
}
function uuid(formData, name, optional = false) {
  const candidate = value(formData, name)
  if (optional && !candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}
function integer(formData, name, fallback = null, min = null) {
  const candidate = value(formData, name)
  if (!candidate) return fallback
  const parsed = Number.parseInt(candidate, 10)
  if (!Number.isFinite(parsed)) throw new Error(`${name} debe ser un número entero.`)
  if (min !== null && parsed < min) throw new Error(`${name} no puede ser menor que ${min}.`)
  return parsed
}
function optionalDate(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error(`La fecha ${name} no es válida.`)
  return candidate
}
function optionalTime(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(candidate)) throw new Error(`La hora ${name} no es válida.`)
  return `${candidate}:00`
}
function status(formData) {
  const candidate = value(formData, 'status') || 'draft'
  if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.')
  return candidate
}
function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}
function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}
function routeJson(formData) {
  const candidate = value(formData, 'route_json')
  if (!candidate) return null
  try {
    return JSON.parse(candidate)
  } catch {
    throw new Error('El JSON del recorrido no es válido.')
  }
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de la salida', error)
}

async function requireBrotherhood(supabase, brotherhoodId) {
  return assertRow(
    await supabase.from('entities').select('id, name, slug').eq('id', brotherhoodId).eq('entity_type', 'brotherhood').maybeSingle(),
    'La Hermandad no existe.'
  )
}

async function requireOuting(supabase, brotherhoodId, outingId) {
  return assertRow(
    await supabase.from('outings').select('*').eq('id', outingId).eq('brotherhood_entity_id', brotherhoodId).maybeSingle(),
    'La salida no existe o no pertenece a esta Hermandad.'
  )
}

async function requireEntity(supabase, entityId, allowedTypes = []) {
  let query = supabase.from('entities').select('id, entity_type, name, slug, status').eq('id', entityId).neq('status', 'archived')
  if (allowedTypes.length) query = query.in('entity_type', allowedTypes)
  return assertRow(await query.maybeSingle(), 'La entidad seleccionada no existe o no está disponible.')
}

async function refresh(supabase, brotherhoodId, extraEntityIds = []) {
  const brotherhood = await requireBrotherhood(supabase, brotherhoodId)
  revalidatePath('/panel')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/salidas`)
  revalidatePath('/hermandades')
  revalidatePath('/')
  if (brotherhood.slug) revalidatePath(`/hermandades/${brotherhood.slug}`)

  if (extraEntityIds.length) {
    const entities = await supabase.from('entities').select('entity_type, slug').in('id', [...new Set(extraEntityIds.filter(Boolean))])
    if (!entities.error) {
      for (const entity of entities.data || []) {
        if (!entity.slug) continue
        if (entity.entity_type === 'band') revalidatePath(`/bandas/${entity.slug}`)
        if (entity.entity_type === 'image') revalidatePath(`/imagenes/${entity.slug}`)
        if (entity.entity_type === 'step') revalidatePath(`/pasos/${entity.slug}`)
      }
    }
  }
}

function redirectSaved(brotherhoodId, saved, outingId = '') {
  const params = new URLSearchParams({ saved })
  if (outingId) params.set('outing', outingId)
  redirect(`/panel/hermandades/${brotherhoodId}/salidas?${params.toString()}${outingId ? `#outing-${outingId}` : ''}`)
}

export async function saveOutingAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id', true)
  const brotherhood = await requireBrotherhood(supabase, brotherhoodId)
  const character = value(formData, 'character') || 'ordinary'
  const eventStatus = value(formData, 'event_status') || 'announced'
  if (!CHARACTERS.has(character)) throw new Error('Carácter de salida no válido.')
  if (!EVENT_STATUSES.has(eventStatus)) throw new Error('Estado del evento no válido.')

  const outingDate = optionalDate(formData, 'outing_date')
  const returnDate = optionalDate(formData, 'return_date')
  if (outingDate && returnDate && returnDate < outingDate) throw new Error('La fecha de regreso no puede ser anterior a la salida.')
  const year = integer(formData, 'year', outingDate ? Number(outingDate.slice(0, 4)) : null)
  const seriesId = uuid(formData, 'outing_series_id', true)
  if (seriesId) {
    assertRow(await supabase.from('outing_series').select('id').eq('id', seriesId).eq('brotherhood_entity_id', brotherhoodId).maybeSingle(), 'La serie anual no pertenece a esta Hermandad.')
  }

  const payload = {
    brotherhood_entity_id: brotherhoodId,
    outing_series_id: seriesId,
    outing_type: required(formData, 'outing_type', 'El tipo de salida'),
    character,
    title: nullable(formData, 'title'),
    outing_date: outingDate,
    return_date: returnDate,
    year,
    departure_time: optionalTime(formData, 'departure_time'),
    return_time: optionalTime(formData, 'return_time'),
    municipality_id: uuid(formData, 'municipality_id', true),
    origin_place_id: uuid(formData, 'origin_place_id', true),
    destination_place_id: uuid(formData, 'destination_place_id', true),
    reason: nullable(formData, 'reason'),
    route: routeJson(formData),
    route_summary: nullable(formData, 'route_summary'),
    description: nullable(formData, 'description'),
    public_notes: nullable(formData, 'public_notes'),
    organizer_name: nullable(formData, 'organizer_name') || brotherhood.name,
    organizer_notes: nullable(formData, 'organizer_notes'),
    event_status: eventStatus,
    status: status(formData),
    hero_image_path: nullable(formData, 'hero_image_path'),
    hero_image_alt: nullable(formData, 'hero_image_alt'),
    hero_image_credit: nullable(formData, 'hero_image_credit'),
  }

  const result = outingId
    ? await supabase.from('outings').update(payload).eq('id', outingId).eq('brotherhood_entity_id', brotherhoodId).select('id').single()
    : await supabase.from('outings').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la salida')

  await audit(supabase, user, {
    action_type: outingId ? 'update' : 'create', object_type: 'outing', object_id: saved.id, entity_id: brotherhoodId,
    summary: `${outingId ? 'Salida actualizada' : 'Salida creada'}: ${payload.title || payload.outing_type}`,
    changed_fields: payload,
  })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, outingId ? 'updated' : 'created', saved.id)
}

export async function archiveOutingAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const saved = assertRow(
    await supabase.from('outings').update({ status: 'archived' }).eq('id', outingId).eq('brotherhood_entity_id', brotherhoodId).select('id, title, outing_type').single(),
    'No se pudo archivar la salida'
  )
  await audit(supabase, user, { action_type: 'archive', object_type: 'outing', object_id: saved.id, entity_id: brotherhoodId, summary: `Salida archivada: ${saved.title || saved.outing_type}` })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'archived')
}

export async function saveOutingParticipantAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const participantId = uuid(formData, 'participant_id', true)
  const entityId = uuid(formData, 'entity_id')
  const role = required(formData, 'role', 'El papel del participante')
  if (!PARTICIPANT_ROLES.has(role)) throw new Error('Papel de participante no válido.')
  await requireOuting(supabase, brotherhoodId, outingId)
  const entity = await requireEntity(supabase, entityId, role === 'processional_image' ? ['image'] : [])

  const payload = { outing_id: outingId, entity_id: entityId, role, notes: nullable(formData, 'notes') }
  const result = participantId
    ? await supabase.from('outing_entities').update(payload).eq('id', participantId).eq('outing_id', outingId).select('id').single()
    : await supabase.from('outing_entities').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar el participante. Comprueba que no esté ya relacionado con el mismo papel.')
  await audit(supabase, user, { action_type: participantId ? 'update' : 'link', object_type: 'outing_entity', object_id: saved.id, entity_id: brotherhoodId, summary: `Participante de salida: ${entity.name} · ${role}`, changed_fields: payload })
  await refresh(supabase, brotherhoodId, [entityId])
  redirectSaved(brotherhoodId, 'participant', outingId)
}

export async function removeOutingParticipantAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const participantId = uuid(formData, 'participant_id')
  await requireOuting(supabase, brotherhoodId, outingId)
  const saved = assertRow(await supabase.from('outing_entities').delete().eq('id', participantId).eq('outing_id', outingId).select('id, entity_id, role').single(), 'No se pudo retirar el participante')
  await audit(supabase, user, { action_type: 'unlink', object_type: 'outing_entity', object_id: saved.id, entity_id: brotherhoodId, summary: `Participante retirado de la salida: ${saved.role}` })
  await refresh(supabase, brotherhoodId, [saved.entity_id])
  redirectSaved(brotherhoodId, 'participant-removed', outingId)
}

export async function saveOutingScheduleItemAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const itemId = uuid(formData, 'schedule_item_id', true)
  await requireOuting(supabase, brotherhoodId, outingId)
  const payload = {
    outing_id: outingId,
    sequence_no: integer(formData, 'sequence_no', 1, 1),
    label: required(formData, 'label', 'El hito'),
    item_date: optionalDate(formData, 'item_date'),
    item_time: optionalTime(formData, 'item_time'),
    time_text: nullable(formData, 'time_text'),
    place_id: uuid(formData, 'place_id', true),
    notes: nullable(formData, 'notes'),
  }
  const result = itemId
    ? await supabase.from('outing_schedule_items').update(payload).eq('id', itemId).eq('outing_id', outingId).select('id').single()
    : await supabase.from('outing_schedule_items').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar el hito. Cada posición del horario debe tener un orden distinto.')
  await audit(supabase, user, { action_type: itemId ? 'update' : 'create', object_type: 'outing_schedule_item', object_id: saved.id, entity_id: brotherhoodId, summary: `Hito de salida: ${payload.label}`, changed_fields: payload })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'schedule', outingId)
}

export async function deleteOutingScheduleItemAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const itemId = uuid(formData, 'schedule_item_id')
  await requireOuting(supabase, brotherhoodId, outingId)
  const saved = assertRow(await supabase.from('outing_schedule_items').delete().eq('id', itemId).eq('outing_id', outingId).select('id, label').single(), 'No se pudo eliminar el hito')
  await audit(supabase, user, { action_type: 'delete', object_type: 'outing_schedule_item', object_id: saved.id, entity_id: brotherhoodId, summary: `Hito eliminado: ${saved.label}` })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'schedule-removed', outingId)
}

export async function saveOutingMusicPositionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id', true)
  const stepId = uuid(formData, 'step_entity_id', true)
  await requireOuting(supabase, brotherhoodId, outingId)
  if (stepId) await requireEntity(supabase, stepId, ['step'])
  const payload = {
    outing_id: outingId,
    step_entity_id: stepId,
    position_code: required(formData, 'position_code', 'El código de posición'),
    position_label: nullable(formData, 'position_label'),
    sequence_no: integer(formData, 'sequence_no', 1, 1),
    notes: nullable(formData, 'notes'),
    status: status(formData),
  }
  const result = positionId
    ? await supabase.from('outing_music_positions').update(payload).eq('id', positionId).eq('outing_id', outingId).select('id').single()
    : await supabase.from('outing_music_positions').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la posición musical. Cada orden debe ser único en la salida.')
  await audit(supabase, user, { action_type: positionId ? 'update' : 'create', object_type: 'outing_music_position', object_id: saved.id, entity_id: brotherhoodId, summary: `Posición musical: ${payload.position_label || payload.position_code}`, changed_fields: payload })
  await refresh(supabase, brotherhoodId, [stepId])
  redirectSaved(brotherhoodId, 'music-position', outingId)
}

export async function archiveOutingMusicPositionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id')
  await requireOuting(supabase, brotherhoodId, outingId)
  const saved = assertRow(await supabase.from('outing_music_positions').update({ status: 'archived' }).eq('id', positionId).eq('outing_id', outingId).select('id, position_label, position_code').single(), 'No se pudo archivar la posición musical')
  await audit(supabase, user, { action_type: 'archive', object_type: 'outing_music_position', object_id: saved.id, entity_id: brotherhoodId, summary: `Posición musical archivada: ${saved.position_label || saved.position_code}` })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'music-position-archived', outingId)
}

export async function saveOutingMusicAssignmentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id')
  const assignmentId = uuid(formData, 'assignment_id', true)
  const bandId = uuid(formData, 'band_entity_id')
  const mode = value(formData, 'participation_mode') || 'unspecified'
  if (!PARTICIPATION_MODES.has(mode)) throw new Error('Modo de participación no válido.')
  await requireOuting(supabase, brotherhoodId, outingId)
  assertRow(await supabase.from('outing_music_positions').select('id').eq('id', positionId).eq('outing_id', outingId).neq('status', 'archived').maybeSingle(), 'La posición musical no pertenece a esta salida.')
  const band = await requireEntity(supabase, bandId, ['band'])
  const payload = {
    music_position_id: positionId,
    band_entity_id: bandId,
    participation_mode: mode,
    sequence_no: integer(formData, 'sequence_no', 1, 1),
    segment_start_label: nullable(formData, 'segment_start_label'),
    segment_end_label: nullable(formData, 'segment_end_label'),
    notes: nullable(formData, 'notes'),
    status: status(formData),
  }
  const result = assignmentId
    ? await supabase.from('outing_music_assignments').update(payload).eq('id', assignmentId).eq('music_position_id', positionId).select('id').single()
    : await supabase.from('outing_music_assignments').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la Banda en esta posición.')
  await audit(supabase, user, { action_type: assignmentId ? 'update' : 'link', object_type: 'outing_music_assignment', object_id: saved.id, entity_id: brotherhoodId, summary: `Banda en salida: ${band.name}`, changed_fields: payload })
  await refresh(supabase, brotherhoodId, [bandId])
  redirectSaved(brotherhoodId, 'music-assignment', outingId)
}

export async function archiveOutingMusicAssignmentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id')
  const assignmentId = uuid(formData, 'assignment_id')
  await requireOuting(supabase, brotherhoodId, outingId)
  const saved = assertRow(await supabase.from('outing_music_assignments').update({ status: 'archived' }).eq('id', assignmentId).eq('music_position_id', positionId).select('id, band_entity_id').single(), 'No se pudo archivar la Banda de la salida')
  await audit(supabase, user, { action_type: 'archive', object_type: 'outing_music_assignment', object_id: saved.id, entity_id: brotherhoodId, summary: 'Asignación musical archivada' })
  await refresh(supabase, brotherhoodId, [saved.band_entity_id])
  redirectSaved(brotherhoodId, 'music-assignment-archived', outingId)
}

function storagePathFromPublicUrl(publicUrl = '') {
  const marker = '/storage/v1/object/public/hilo-media/'
  const index = publicUrl.indexOf(marker)
  return index >= 0 ? decodeURIComponent(publicUrl.slice(index + marker.length)) : ''
}

export async function uploadOutingHeroImageAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const outingId = uuid(formData, 'outing_id')
  const outing = await requireOuting(supabase, brotherhoodId, outingId)
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) throw new Error('Selecciona una imagen para la salida.')
  if (file.size > 10 * 1024 * 1024) throw new Error('La imagen no puede superar 10 MB.')
  const extension = IMAGE_TYPES.get(file.type)
  if (!extension) throw new Error('Formato no admitido. Usa JPG, PNG, WEBP, GIF o AVIF.')

  const path = `salidas/${outingId}/${randomUUID()}.${extension}`
  const uploaded = await supabase.storage.from('hilo-media').upload(path, file, { contentType: file.type, upsert: false })
  assertMutation(uploaded, 'No se pudo subir la imagen de la salida')
  const publicUrl = supabase.storage.from('hilo-media').getPublicUrl(path).data.publicUrl
  const alt = required(formData, 'hero_image_alt', 'El texto alternativo')
  const credit = nullable(formData, 'hero_image_credit')
  const updated = await supabase.from('outings').update({ hero_image_path: publicUrl, hero_image_alt: alt, hero_image_credit: credit }).eq('id', outingId).eq('brotherhood_entity_id', brotherhoodId)
  if (updated.error) {
    await supabase.storage.from('hilo-media').remove([path])
    throw new Error(`No se pudo asociar la imagen a la salida: ${updated.error.message}`)
  }

  const oldPath = storagePathFromPublicUrl(outing.hero_image_path || '')
  if (oldPath && oldPath !== path) {
    const removed = await supabase.storage.from('hilo-media').remove([oldPath])
    if (removed.error) console.error('[Hilo Cofrade] No se pudo limpiar la imagen anterior de la salida', removed.error)
  }
  await audit(supabase, user, { action_type: 'update', object_type: 'outing', object_id: outingId, entity_id: brotherhoodId, summary: `Imagen de salida actualizada: ${outing.title || outing.outing_type}`, changed_fields: { hero_image_path: publicUrl, hero_image_alt: alt, hero_image_credit: credit } })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'hero-image', outingId)
}
