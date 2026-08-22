'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function uuid(formData, name, optional = false) {
  const candidate = value(formData, name)
  if (optional && !candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}
function integer(formData, name, { min = null, max = null, required = false } = {}) {
  const candidate = value(formData, name)
  if (!candidate) {
    if (required) throw new Error(`${name} es obligatorio.`)
    return null
  }
  const parsed = Number.parseInt(candidate, 10)
  if (!Number.isFinite(parsed)) throw new Error(`${name} debe ser un número entero.`)
  if (min !== null && parsed < min) throw new Error(`${name} no puede ser menor que ${min}.`)
  if (max !== null && parsed > max) throw new Error(`${name} no puede ser mayor que ${max}.`)
  return parsed
}
function optionalDate(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error('La fecha de la procesión no es válida.')
  return candidate
}
function optionalTime(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(candidate)) throw new Error(`La hora de ${name} no es válida.`)
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

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de jornada', error)
}

async function requireBrotherhood(supabase, brotherhoodId) {
  return assertRow(
    await supabase.from('entities').select('id, name, slug').eq('id', brotherhoodId).eq('entity_type', 'brotherhood').maybeSingle(),
    'La Hermandad no existe.'
  )
}

async function requireSource(supabase, sourceId) {
  if (!sourceId) return null
  return assertRow(await supabase.from('sources').select('id, name').eq('id', sourceId).maybeSingle(), 'La Fuente seleccionada no existe.')
}

async function refresh(supabase, brotherhoodId) {
  const entity = await requireBrotherhood(supabase, brotherhoodId)
  revalidatePath('/panel')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/jornada`)
  revalidatePath('/hermandades')
  revalidatePath('/')
  if (entity.slug) revalidatePath(`/hermandades/${entity.slug}`)
}

function redirectSaved(brotherhoodId, saved) {
  redirect(`/panel/hermandades/${brotherhoodId}/jornada?saved=${saved}`)
}

export async function saveBrotherhoodProcessionStatsAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const statsId = uuid(formData, 'stats_id', true)
  const brotherhood = await requireBrotherhood(supabase, brotherhoodId)
  const year = integer(formData, 'year', { min: 1900, max: 2100, required: true })
  const sourceId = uuid(formData, 'source_id', true)
  const source = await requireSource(supabase, sourceId)
  const brotherhoodsInDay = integer(formData, 'brotherhoods_in_day', { min: 1 })
  const positionByNazarenos = integer(formData, 'position_by_nazarenos', { min: 1 })
  const positionByProcession = integer(formData, 'position_by_procession', { min: 1 })

  if (brotherhoodsInDay && positionByNazarenos && positionByNazarenos > brotherhoodsInDay) throw new Error('La posición por nazarenos no puede superar el número de hermandades de la jornada.')
  if (brotherhoodsInDay && positionByProcession && positionByProcession > brotherhoodsInDay) throw new Error('La posición por cortejo no puede superar el número de hermandades de la jornada.')

  const duplicate = await supabase
    .from('brotherhood_procession_stats')
    .select('id')
    .eq('brotherhood_entity_id', brotherhoodId)
    .eq('year', year)
    .neq('id', statsId || '00000000-0000-0000-0000-000000000000')
    .limit(1)
    .maybeSingle()
  if (duplicate.error) throw new Error(`No se pudo comprobar el año: ${duplicate.error.message}`)
  if (duplicate.data) throw new Error(`Ya existen Datos de jornada para ${year}. Edita ese registro en lugar de crear otro.`)

  const payload = {
    brotherhood_entity_id: brotherhoodId,
    year,
    procession_date: optionalDate(formData, 'procession_date'),
    procession_day: nullable(formData, 'procession_day'),
    nazarenos_count: integer(formData, 'nazarenos_count', { min: 0 }),
    penitents_count: integer(formData, 'penitents_count', { min: 0 }),
    total_nazarenos_count: integer(formData, 'total_nazarenos_count', { min: 0 }),
    acolytes_count: integer(formData, 'acolytes_count', { min: 0 }),
    monaguillos_count: integer(formData, 'monaguillos_count', { min: 0 }),
    musical_accompaniment_count: integer(formData, 'musical_accompaniment_count', { min: 0 }),
    total_procession_count: integer(formData, 'total_procession_count', { min: 0 }),
    position_by_nazarenos: positionByNazarenos,
    position_by_procession: positionByProcession,
    brotherhoods_in_day: brotherhoodsInDay,
    official_route_duration_minutes: integer(formData, 'official_route_duration_minutes', { min: 0 }),
    official_career_duration_minutes: integer(formData, 'official_career_duration_minutes', { min: 0 }),
    departure_time: optionalTime(formData, 'departure_time'),
    entrance_time: optionalTime(formData, 'entrance_time'),
    source_id: sourceId,
    status: status(formData),
    notes: nullable(formData, 'notes'),
  }

  const result = statsId
    ? await supabase.from('brotherhood_procession_stats').update(payload).eq('id', statsId).eq('brotherhood_entity_id', brotherhoodId).select('id').single()
    : await supabase.from('brotherhood_procession_stats').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudieron guardar los Datos de jornada.')

  await audit(supabase, user, {
    action_type: statsId ? 'update' : 'create',
    object_type: 'brotherhood_procession_stats',
    object_id: saved.id,
    entity_id: brotherhoodId,
    summary: `${statsId ? 'Datos de jornada actualizados' : 'Datos de jornada creados'}: ${brotherhood.name} · ${year}`,
    changed_fields: { ...payload, source_name: source?.name || null },
  })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, statsId ? 'updated' : 'created')
}

export async function archiveBrotherhoodProcessionStatsAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const statsId = uuid(formData, 'stats_id')
  const saved = assertRow(
    await supabase.from('brotherhood_procession_stats').update({ status: 'archived' }).eq('id', statsId).eq('brotherhood_entity_id', brotherhoodId).select('id, year').single(),
    'No se pudieron archivar los Datos de jornada.'
  )
  await audit(supabase, user, { action_type: 'archive', object_type: 'brotherhood_procession_stats', object_id: saved.id, entity_id: brotherhoodId, summary: `Datos de jornada archivados: ${saved.year}` })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'archived')
}
