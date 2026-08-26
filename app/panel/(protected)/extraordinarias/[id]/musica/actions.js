'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const PARTICIPATION_MODES = new Set(['full_route', 'segment', 'alternating', 'unspecified'])
const SOURCE_FRAMING_PATTERN = /(?:\bseg[uú]n\s+(?:el|la)\s+(?:dossier|fuente|documento|programa)\b|\b(?:el|la)\s+(?:dossier|fuente|documento|programa)\s+(?:describe|recoge|indica|señala|senala|detalla|explica)\b)/i

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) {
  const candidate = value(formData, name)
  if (name === 'notes' && candidate && SOURCE_FRAMING_PATTERN.test(candidate)) {
    throw new Error('Normaliza el texto público: describe el dato directamente y deja la referencia documental para Fuentes.')
  }
  return candidate || null
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

async function loadOuting(supabase, id) {
  const result = await supabase.from('outings').select('id, slug, title').eq('id', id).eq('character', 'extraordinary').maybeSingle()
  if (result.error) throw new Error(`No se pudo cargar la extraordinaria: ${result.error.message}`)
  if (!result.data) throw new Error('La extraordinaria no existe.')
  return result.data
}

async function loadPosition(supabase, outingId, positionId) {
  const result = await supabase.from('outing_music_positions').select('*').eq('id', positionId).eq('outing_id', outingId).maybeSingle()
  if (result.error) throw new Error(`No se pudo cargar el momento musical: ${result.error.message}`)
  if (!result.data) throw new Error('El momento musical no existe.')
  return result.data
}

async function loadAssignment(supabase, positionId, assignmentId) {
  const result = await supabase.from('outing_music_assignments').select('*').eq('id', assignmentId).eq('music_position_id', positionId).maybeSingle()
  if (result.error) throw new Error(`No se pudo cargar el acompañamiento: ${result.error.message}`)
  if (!result.data) throw new Error('El acompañamiento no existe.')
  return result.data
}

async function audit(supabase, user, outing, objectType, objectId, actionType, summary, changedFields) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: actionType,
    object_type: objectType,
    object_id: objectId,
    summary,
    changed_fields: changedFields,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo auditar la música de Extraordinarias', error)
}

function refresh(outing) {
  revalidatePath('/')
  revalidatePath('/extraordinarias')
  if (outing.slug) revalidatePath(`/extraordinarias/${outing.slug}`)
  revalidatePath(`/panel/extraordinarias/${outing.id}`)
  revalidatePath(`/panel/extraordinarias/${outing.id}/musica`)
}

function positionPayload(formData) {
  const status = value(formData, 'status') || 'published'
  if (!STATUSES.has(status)) throw new Error('Estado no válido.')
  return {
    position_code: value(formData, 'position_code') || 'processional_music',
    position_label: nullable(formData, 'position_label'),
    step_entity_id: optionalUuid(formData, 'step_entity_id'),
    notes: nullable(formData, 'notes'),
    status,
  }
}

function assignmentPayload(formData) {
  const status = value(formData, 'status') || 'published'
  const participationMode = value(formData, 'participation_mode') || 'unspecified'
  if (!STATUSES.has(status)) throw new Error('Estado no válido.')
  if (!PARTICIPATION_MODES.has(participationMode)) throw new Error('Modo de participación no válido.')
  const bandEntityId = optionalUuid(formData, 'band_entity_id')
  const bandNameText = nullable(formData, 'band_name_text')
  if (!bandEntityId && !bandNameText) throw new Error('Selecciona una Banda o escribe el nombre de la formación.')
  return {
    band_entity_id: bandEntityId,
    band_name_text: bandNameText,
    participation_mode: participationMode,
    segment_start_label: nullable(formData, 'segment_start_label'),
    segment_end_label: nullable(formData, 'segment_end_label'),
    notes: nullable(formData, 'notes'),
    status,
  }
}

export async function createMusicPositionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const outing = await loadOuting(supabase, outingId)
  const last = await supabase.from('outing_music_positions').select('sequence_no').eq('outing_id', outingId).order('sequence_no', { ascending: false }).limit(1).maybeSingle()
  if (last.error) throw new Error(`No se pudo calcular el orden: ${last.error.message}`)
  const data = { outing_id: outingId, sequence_no: (last.data?.sequence_no || 0) + 1, ...positionPayload(formData) }
  const created = await supabase.from('outing_music_positions').insert(data).select('id').single()
  if (created.error) throw new Error(`No se pudo crear el momento musical: ${created.error.message}`)
  await audit(supabase, user, outing, 'outing_music_position', created.data.id, 'create', 'Momento musical añadido', data)
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/musica?saved=position-created`)
}

export async function updateMusicPositionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id')
  const outing = await loadOuting(supabase, outingId)
  await loadPosition(supabase, outingId, positionId)
  const data = positionPayload(formData)
  const updated = await supabase.from('outing_music_positions').update(data).eq('id', positionId).eq('outing_id', outingId).select('id').single()
  if (updated.error) throw new Error(`No se pudo guardar el momento musical: ${updated.error.message}`)
  await audit(supabase, user, outing, 'outing_music_position', positionId, 'update', 'Momento musical actualizado', data)
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/musica?saved=position-updated`)
}

export async function moveMusicPositionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id')
  const direction = value(formData, 'direction')
  if (!['up', 'down'].includes(direction)) throw new Error('Dirección no válida.')
  const outing = await loadOuting(supabase, outingId)
  const position = await loadPosition(supabase, outingId, positionId)
  const base = supabase.from('outing_music_positions').select('id, sequence_no').eq('outing_id', outingId)
  const neighbor = direction === 'up'
    ? await base.lt('sequence_no', position.sequence_no).order('sequence_no', { ascending: false }).limit(1).maybeSingle()
    : await base.gt('sequence_no', position.sequence_no).order('sequence_no', { ascending: true }).limit(1).maybeSingle()
  if (neighbor.error) throw new Error(`No se pudo calcular el orden: ${neighbor.error.message}`)
  if (!neighbor.data) redirect(`/panel/extraordinarias/${outingId}/musica`)

  const temporary = -2000000 - position.sequence_no
  const first = await supabase.from('outing_music_positions').update({ sequence_no: temporary }).eq('id', position.id)
  if (first.error) throw new Error(`No se pudo mover el momento musical: ${first.error.message}`)
  const second = await supabase.from('outing_music_positions').update({ sequence_no: position.sequence_no }).eq('id', neighbor.data.id)
  if (second.error) throw new Error(`No se pudo completar el cambio de orden: ${second.error.message}`)
  const third = await supabase.from('outing_music_positions').update({ sequence_no: neighbor.data.sequence_no }).eq('id', position.id)
  if (third.error) throw new Error(`No se pudo completar el cambio de orden: ${third.error.message}`)

  await audit(supabase, user, outing, 'outing_music_position', position.id, 'update', 'Orden musical actualizado', { sequence_no: neighbor.data.sequence_no })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/musica?saved=moved`)
}

export async function archiveMusicPositionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id')
  const outing = await loadOuting(supabase, outingId)
  await loadPosition(supabase, outingId, positionId)
  const [positionResult, assignmentsResult] = await Promise.all([
    supabase.from('outing_music_positions').update({ status: 'archived' }).eq('id', positionId).select('id').single(),
    supabase.from('outing_music_assignments').update({ status: 'archived' }).eq('music_position_id', positionId),
  ])
  if (positionResult.error) throw new Error(`No se pudo archivar el momento musical: ${positionResult.error.message}`)
  if (assignmentsResult.error) throw new Error(`No se pudieron archivar sus acompañamientos: ${assignmentsResult.error.message}`)
  await audit(supabase, user, outing, 'outing_music_position', positionId, 'update', 'Momento musical archivado', { status: 'archived' })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/musica?saved=position-archived`)
}

export async function createMusicAssignmentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id')
  const outing = await loadOuting(supabase, outingId)
  await loadPosition(supabase, outingId, positionId)
  const last = await supabase.from('outing_music_assignments').select('sequence_no').eq('music_position_id', positionId).order('sequence_no', { ascending: false }).limit(1).maybeSingle()
  if (last.error) throw new Error(`No se pudo calcular el orden: ${last.error.message}`)
  const data = { music_position_id: positionId, sequence_no: (last.data?.sequence_no || 0) + 1, ...assignmentPayload(formData) }
  const created = await supabase.from('outing_music_assignments').insert(data).select('id').single()
  if (created.error) throw new Error(`No se pudo añadir la formación: ${created.error.message}`)
  await audit(supabase, user, outing, 'outing_music_assignment', created.data.id, 'create', 'Formación musical añadida', data)
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/musica?saved=assignment-created`)
}

export async function updateMusicAssignmentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id')
  const assignmentId = uuid(formData, 'assignment_id')
  const outing = await loadOuting(supabase, outingId)
  await loadPosition(supabase, outingId, positionId)
  await loadAssignment(supabase, positionId, assignmentId)
  const data = assignmentPayload(formData)
  const updated = await supabase.from('outing_music_assignments').update(data).eq('id', assignmentId).eq('music_position_id', positionId).select('id').single()
  if (updated.error) throw new Error(`No se pudo actualizar la formación: ${updated.error.message}`)
  await audit(supabase, user, outing, 'outing_music_assignment', assignmentId, 'update', 'Formación musical actualizada', data)
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/musica?saved=assignment-updated`)
}

export async function archiveMusicAssignmentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const positionId = uuid(formData, 'position_id')
  const assignmentId = uuid(formData, 'assignment_id')
  const outing = await loadOuting(supabase, outingId)
  await loadPosition(supabase, outingId, positionId)
  await loadAssignment(supabase, positionId, assignmentId)
  const updated = await supabase.from('outing_music_assignments').update({ status: 'archived' }).eq('id', assignmentId).select('id').single()
  if (updated.error) throw new Error(`No se pudo archivar la formación: ${updated.error.message}`)
  await audit(supabase, user, outing, 'outing_music_assignment', assignmentId, 'update', 'Formación musical archivada', { status: 'archived' })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/musica?saved=assignment-archived`)
}
