'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelAdmin, requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
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
function optionalDate(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) throw new Error('Fecha no válida.')
  return candidate
}
function optionalTime(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{2}:\d{2}$/.test(candidate)) throw new Error('Hora no válida.')
  return `${candidate}:00`
}

async function loadOuting(supabase, id) {
  const result = await supabase.from('outings').select('id, slug, title').eq('id', id).eq('character', 'extraordinary').maybeSingle()
  if (result.error) throw new Error(`No se pudo cargar la extraordinaria: ${result.error.message}`)
  if (!result.data) throw new Error('La extraordinaria no existe.')
  return result.data
}

async function loadItem(supabase, outingId, itemId) {
  const result = await supabase.from('outing_schedule_items').select('*').eq('id', itemId).eq('outing_id', outingId).maybeSingle()
  if (result.error) throw new Error(`No se pudo cargar el hito: ${result.error.message}`)
  if (!result.data) throw new Error('El hito horario no existe.')
  return result.data
}

async function audit(supabase, user, outing, actionType, summary, changedFields) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: actionType,
    object_type: 'outing_schedule_item',
    object_id: changedFields.id || outing.id,
    summary,
    changed_fields: changedFields,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo auditar el horario', error)
}

function refresh(outing) {
  revalidatePath('/')
  revalidatePath('/extraordinarias')
  revalidatePath(`/extraordinarias/${outing.slug}`)
  revalidatePath(`/panel/extraordinarias/${outing.id}`)
  revalidatePath(`/panel/extraordinarias/${outing.id}/horarios`)
}

function payload(formData) {
  const label = value(formData, 'label')
  if (!label) throw new Error('El nombre del hito es obligatorio.')
  return {
    label,
    item_date: optionalDate(formData, 'item_date'),
    item_time: optionalTime(formData, 'item_time'),
    time_text: nullable(formData, 'time_text'),
    place_id: optionalUuid(formData, 'place_id'),
    place_text: nullable(formData, 'place_text'),
    notes: nullable(formData, 'notes'),
  }
}

export async function createScheduleItemAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const outing = await loadOuting(supabase, outingId)
  const last = await supabase.from('outing_schedule_items').select('sequence_no').eq('outing_id', outingId).order('sequence_no', { ascending: false }).limit(1).maybeSingle()
  if (last.error) throw new Error(`No se pudo calcular el orden: ${last.error.message}`)
  const data = { outing_id: outingId, sequence_no: (last.data?.sequence_no || 0) + 1, ...payload(formData) }
  const created = await supabase.from('outing_schedule_items').insert(data).select('id').single()
  if (created.error) throw new Error(`No se pudo crear el hito: ${created.error.message}`)
  await audit(supabase, user, outing, 'create', `Hito horario añadido: ${data.label}`, { id: created.data.id, ...data })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/horarios?saved=created`)
}

export async function updateScheduleItemAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const itemId = uuid(formData, 'schedule_item_id')
  const outing = await loadOuting(supabase, outingId)
  await loadItem(supabase, outingId, itemId)
  const data = payload(formData)
  const updated = await supabase.from('outing_schedule_items').update(data).eq('id', itemId).eq('outing_id', outingId).select('id').single()
  if (updated.error) throw new Error(`No se pudo actualizar el hito: ${updated.error.message}`)
  await audit(supabase, user, outing, 'update', `Hito horario actualizado: ${data.label}`, { id: itemId, ...data })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/horarios?saved=updated`)
}

export async function moveScheduleItemAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const itemId = uuid(formData, 'schedule_item_id')
  const direction = value(formData, 'direction')
  if (!['up', 'down'].includes(direction)) throw new Error('Dirección de movimiento no válida.')
  const outing = await loadOuting(supabase, outingId)
  const item = await loadItem(supabase, outingId, itemId)
  const neighborQuery = supabase.from('outing_schedule_items').select('id, sequence_no').eq('outing_id', outingId)
  const neighbor = direction === 'up'
    ? await neighborQuery.lt('sequence_no', item.sequence_no).order('sequence_no', { ascending: false }).limit(1).maybeSingle()
    : await neighborQuery.gt('sequence_no', item.sequence_no).order('sequence_no', { ascending: true }).limit(1).maybeSingle()
  if (neighbor.error) throw new Error(`No se pudo calcular el nuevo orden: ${neighbor.error.message}`)
  if (!neighbor.data) redirect(`/panel/extraordinarias/${outingId}/horarios`)

  const temporary = -1000000 - item.sequence_no
  const first = await supabase.from('outing_schedule_items').update({ sequence_no: temporary }).eq('id', item.id)
  if (first.error) throw new Error(`No se pudo mover el hito: ${first.error.message}`)
  const second = await supabase.from('outing_schedule_items').update({ sequence_no: item.sequence_no }).eq('id', neighbor.data.id)
  if (second.error) {
    await supabase.from('outing_schedule_items').update({ sequence_no: item.sequence_no }).eq('id', item.id)
    throw new Error(`No se pudo completar el cambio de orden: ${second.error.message}`)
  }
  const third = await supabase.from('outing_schedule_items').update({ sequence_no: neighbor.data.sequence_no }).eq('id', item.id)
  if (third.error) throw new Error(`No se pudo completar el cambio de orden: ${third.error.message}`)

  await audit(supabase, user, outing, 'update', `Orden de horarios actualizado: ${item.label}`, { id: item.id, sequence_no: neighbor.data.sequence_no })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/horarios?saved=moved`)
}

export async function deleteScheduleItemAction(formData) {
  const user = await requirePanelAdmin()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const itemId = uuid(formData, 'schedule_item_id')
  const outing = await loadOuting(supabase, outingId)
  const item = await loadItem(supabase, outingId, itemId)
  const removed = await supabase.from('outing_schedule_items').delete().eq('id', itemId).eq('outing_id', outingId).select('id').single()
  if (removed.error) throw new Error(`No se pudo borrar el hito: ${removed.error.message}`)
  await audit(supabase, user, outing, 'delete', `Hito horario eliminado: ${item.label}`, { id: item.id, label: item.label })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/horarios?saved=deleted`)
}
