'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const EVENT_STATUSES = new Set(['announced', 'held', 'cancelled'])
const EDITORIAL_STATUSES = new Set(['draft', 'review', 'published'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function nullable(formData, name) {
  return value(formData, name) || null
}

function optionalUuid(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function requiredUuid(formData, name) {
  const candidate = optionalUuid(formData, name)
  if (!candidate) throw new Error(`Falta ${name}`)
  return candidate
}

function timeValue(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{2}:\d{2}$/.test(candidate)) throw new Error(`Hora no válida: ${name}`)
  return `${candidate}:00`
}

function dateValue(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) throw new Error(`Fecha no válida: ${name}`)
  return candidate
}

function slugify(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function loadOuting(supabase, id) {
  const result = await supabase
    .from('outings')
    .select('id, slug, title, outing_date, character')
    .eq('id', id)
    .eq('character', 'extraordinary')
    .maybeSingle()
  if (result.error) throw new Error(`No se pudo cargar la extraordinaria: ${result.error.message}`)
  if (!result.data) throw new Error('La extraordinaria no existe.')
  return result.data
}

async function audit(supabase, user, outing, changedFields) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: 'update',
    object_type: 'outing',
    object_id: outing.id,
    summary: `Datos generales actualizados en ${changedFields.title || outing.title || 'Extraordinaria'}`,
    changed_fields: changedFields,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo auditar la Extraordinaria', error)
}

function refresh(id, slug) {
  revalidatePath('/')
  revalidatePath('/extraordinarias')
  revalidatePath('/panel/extraordinarias')
  revalidatePath(`/panel/extraordinarias/${id}`)
  revalidatePath(`/panel/extraordinarias/${id}/general`)
  if (slug) revalidatePath(`/extraordinarias/${slug}`)
}

export async function saveExtraordinaryGeneralAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = requiredUuid(formData, 'outing_id')
  const outing = await loadOuting(supabase, outingId)

  const title = value(formData, 'title')
  if (!title) throw new Error('El titular o título es obligatorio.')
  const outingDate = dateValue(formData, 'outing_date')
  const eventStatus = value(formData, 'event_status') || 'announced'
  const status = value(formData, 'status') || 'draft'
  if (!EVENT_STATUSES.has(eventStatus)) throw new Error('Estado del evento no válido.')
  if (!EDITORIAL_STATUSES.has(status)) throw new Error('Estado editorial no válido.')

  const requestedSlug = value(formData, 'slug')
  const slug = requestedSlug || outing.slug || slugify(`${title}-${outingDate?.slice(0, 4) || ''}`)
  if (!slug) throw new Error('No se pudo generar un slug público.')

  const duplicateSlug = await supabase
    .from('outings')
    .select('id')
    .eq('slug', slug)
    .neq('id', outingId)
    .limit(1)
    .maybeSingle()
  if (duplicateSlug.error) throw new Error(`No se pudo validar el slug: ${duplicateSlug.error.message}`)
  if (duplicateSlug.data) throw new Error('Ese slug ya está siendo utilizado por otra salida.')

  const referenceCode = nullable(formData, 'reference_code')
  if (referenceCode) {
    const duplicateRef = await supabase
      .from('outings')
      .select('id')
      .eq('reference_code', referenceCode)
      .neq('id', outingId)
      .limit(1)
      .maybeSingle()
    if (duplicateRef.error) throw new Error(`No se pudo validar la REF: ${duplicateRef.error.message}`)
    if (duplicateRef.data) throw new Error('Esa REF ya está siendo utilizada por otra salida.')
  }

  const payload = {
    title,
    slug,
    reference_code: referenceCode,
    outing_type: value(formData, 'outing_type') || 'Procesión extraordinaria',
    outing_date: outingDate,
    year: outingDate ? Number(outingDate.slice(0, 4)) : null,
    departure_time: timeValue(formData, 'departure_time'),
    return_date: dateValue(formData, 'return_date'),
    return_time: timeValue(formData, 'return_time'),
    municipality_id: optionalUuid(formData, 'municipality_id'),
    brotherhood_entity_id: optionalUuid(formData, 'brotherhood_entity_id'),
    organizer_name: nullable(formData, 'organizer_name'),
    organizer_notes: nullable(formData, 'organizer_notes'),
    origin_place_id: optionalUuid(formData, 'origin_place_id'),
    destination_place_id: optionalUuid(formData, 'destination_place_id'),
    origin_text: nullable(formData, 'origin_text'),
    destination_text: nullable(formData, 'destination_text'),
    reason: nullable(formData, 'reason'),
    route_summary: nullable(formData, 'route_summary'),
    description: nullable(formData, 'description'),
    public_notes: nullable(formData, 'public_notes'),
    event_status: eventStatus,
    status,
  }

  const updated = await supabase.from('outings').update(payload).eq('id', outingId).select('id').single()
  if (updated.error) throw new Error(`No se pudo guardar la extraordinaria: ${updated.error.message}`)

  await audit(supabase, user, outing, payload)
  refresh(outingId, slug)
  redirect(`/panel/extraordinarias/${outingId}/general?saved=general`)
}
