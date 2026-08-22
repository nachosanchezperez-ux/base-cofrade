'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
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
function optionalDate(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) {
    throw new Error(`La fecha de ${name} no es válida.`)
  }
  return candidate
}
function optionalInteger(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  const parsed = Number.parseInt(candidate, 10)
  if (!Number.isFinite(parsed)) throw new Error(`${name} debe ser un número entero.`)
  return parsed
}
function optionalNumber(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  const parsed = Number.parseFloat(candidate.replace(',', '.'))
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${name} debe ser un número positivo.`)
  return parsed
}
function entityStatus(formData) {
  const candidate = value(formData, 'status') || 'draft'
  if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.')
  return candidate
}
function slugify(valueToSlug) {
  return String(valueToSlug || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
function normalizeIdentity(identity) {
  return String(identity || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}
function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}
function assertRow(result, label) {
  const data = assertQuery(result, label)
  if (!data) throw new Error(label)
  return data
}
function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición del paso', error)
}

async function requireEntity(supabase, id, type, label) {
  return assertRow(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('id', id)
      .eq('entity_type', type)
      .neq('status', 'archived')
      .maybeSingle(),
    `${label} no existe o no está disponible.`
  )
}

async function refreshStep(supabase, stepId, relatedEntityIds = []) {
  revalidatePath('/panel')
  revalidatePath('/panel/pasos')
  revalidatePath(`/panel/pasos/${stepId}`)
  revalidatePath('/pasos')
  revalidatePath('/')

  const ids = [...new Set([stepId, ...relatedEntityIds].filter(Boolean))]
  if (!ids.length) return
  const entities = assertQuery(
    await supabase.from('entities').select('id, entity_type, slug').in('id', ids),
    'No se pudieron refrescar las fichas relacionadas'
  ) || []

  for (const entity of entities) {
    if (!entity.slug) continue
    if (entity.entity_type === 'step') revalidatePath(`/pasos/${entity.slug}`)
    if (entity.entity_type === 'brotherhood') revalidatePath(`/hermandades/${entity.slug}`)
    if (entity.entity_type === 'band') revalidatePath(`/bandas/${entity.slug}`)
  }
}

function redirectSaved(stepId, section) {
  redirect(`/panel/pasos/${stepId}?saved=${section}#${section}`)
}

async function ensureUniqueIdentity(supabase, { stepId, name, slug }) {
  const [slugResult, stepsResult] = await Promise.all([
    supabase.from('entities').select('id, entity_type, name, slug, status').eq('slug', slug).neq('id', stepId).limit(1),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'step').neq('id', stepId),
  ])
  const slugMatch = (assertQuery(slugResult, 'No se pudo comprobar el slug') || [])[0]
  if (slugMatch) throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
  const duplicate = (assertQuery(stepsResult, 'No se pudieron comprobar posibles duplicados') || [])
    .find((item) => normalizeIdentity(item.name) === normalizeIdentity(name))
  if (duplicate && slug === slugify(name)) {
    throw new Error(`Ya existe un paso con ese nombre: ${duplicate.name}. Usa un slug específico solo si se trata de otro paso físico.`)
  }
}

function startFields(formData) {
  const dateFrom = optionalDate(formData, 'date_from')
  const dateFromText = nullable(formData, 'date_from_text')
  const yearFrom = optionalInteger(formData, 'year_from')
  if (!dateFrom && !dateFromText && !yearFrom) throw new Error('Indica una fecha, una datación textual o un año de inicio.')
  return { date_from: dateFrom, date_from_text: dateFromText, year_from: yearFrom }
}

function endFields(formData) {
  return {
    date_to: optionalDate(formData, 'date_to'),
    date_to_text: nullable(formData, 'date_to_text'),
    year_to: optionalInteger(formData, 'year_to'),
  }
}

export async function updateStepAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const stepName = required(formData, 'name', 'El nombre del paso')
  const entitySlug = slugify(required(formData, 'slug', 'El slug'))
  const nextStatus = entityStatus(formData)

  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  const current = assertRow(
    await supabase.from('entities').select('id, name, slug, status').eq('id', stepId).eq('entity_type', 'step').maybeSingle(),
    'El paso ya no existe.'
  )
  if (current.status === 'published' && current.slug !== entitySlug) {
    throw new Error('El slug de un paso publicado no puede cambiarse. Retira primero la publicación si necesitas modificar la URL pública.')
  }
  await ensureUniqueIdentity(supabase, { stepId, name: stepName, slug: entitySlug })

  const entityPayload = {
    name: stepName,
    slug: entitySlug,
    summary: nullable(formData, 'summary'),
    status: nextStatus,
  }
  const stepPayload = {
    step_type: nullable(formData, 'step_type'),
    style: nullable(formData, 'style'),
    materials: nullable(formData, 'materials'),
    dimensions_text: nullable(formData, 'dimensions_text'),
    length_cm: optionalNumber(formData, 'length_cm'),
    width_cm: optionalNumber(formData, 'width_cm'),
    height_cm: optionalNumber(formData, 'height_cm'),
    workbenches_count: optionalInteger(formData, 'workbenches_count'),
    carrier_system: nullable(formData, 'carrier_system'),
    execution_date_text: nullable(formData, 'execution_date_text'),
    current_condition: nullable(formData, 'current_condition'),
    current_state_notes: nullable(formData, 'current_state_notes'),
    description: nullable(formData, 'description'),
    notes: nullable(formData, 'notes'),
  }

  assertMutation(await supabase.from('entities').update(entityPayload).eq('id', stepId).eq('entity_type', 'step'), 'No se pudo actualizar la entidad de paso')
  assertMutation(await supabase.from('steps').update(stepPayload).eq('entity_id', stepId), 'No se pudo actualizar la ficha de paso')

  const actionType = current.status !== 'published' && nextStatus === 'published'
    ? 'publish'
    : current.status === 'published' && nextStatus !== 'published'
      ? 'unpublish'
      : nextStatus === 'archived'
        ? 'archive'
        : 'update'
  await audit(supabase, user, {
    action_type: actionType,
    object_type: 'step',
    object_id: stepId,
    entity_id: stepId,
    summary: `Paso actualizado: ${stepName}`,
    changed_fields: { entity: entityPayload, step: stepPayload },
  })
  await refreshStep(supabase, stepId)
  redirectSaved(stepId, 'general')
}

export async function saveStepPhaseAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const phaseId = optionalUuid(formData, 'phase_id')
  await requireEntity(supabase, stepId, 'step', 'El Paso')

  const payload = {
    step_entity_id: stepId,
    phase_name: required(formData, 'phase_name', 'El nombre de la fase'),
    phase_type: nullable(formData, 'phase_type'),
    date_from: optionalDate(formData, 'date_from'),
    date_from_text: nullable(formData, 'date_from_text'),
    date_to: optionalDate(formData, 'date_to'),
    date_to_text: nullable(formData, 'date_to_text'),
    description: nullable(formData, 'description'),
    notes: nullable(formData, 'notes'),
    status: entityStatus(formData),
  }
  const result = phaseId
    ? await supabase.from('step_phases').update(payload).eq('id', phaseId).eq('step_entity_id', stepId).select('id').single()
    : await supabase.from('step_phases').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la fase del Paso')

  await audit(supabase, user, { action_type: phaseId ? 'update' : 'create', object_type: 'step_phase', object_id: saved.id, entity_id: stepId, summary: `${phaseId ? 'Fase actualizada' : 'Fase creada'}: ${payload.phase_name}`, changed_fields: payload })
  await refreshStep(supabase, stepId)
  redirectSaved(stepId, 'patrimonio')
}

export async function archiveStepPhaseAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const phaseId = uuid(formData, 'phase_id')
  const saved = assertRow(
    await supabase.from('step_phases').update({ status: 'archived' }).eq('id', phaseId).eq('step_entity_id', stepId).select('id, phase_name').single(),
    'No se pudo archivar la fase'
  )
  await audit(supabase, user, { action_type: 'archive', object_type: 'step_phase', object_id: saved.id, entity_id: stepId, summary: `Fase archivada: ${saved.phase_name}` })
  await refreshStep(supabase, stepId)
  redirectSaved(stepId, 'patrimonio')
}

export async function saveStepPhaseAgentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const phaseId = uuid(formData, 'phase_id')
  const phaseAgentId = optionalUuid(formData, 'phase_agent_id')
  const agentId = uuid(formData, 'agent_entity_id')

  assertRow(await supabase.from('step_phases').select('id').eq('id', phaseId).eq('step_entity_id', stepId).maybeSingle(), 'La fase no pertenece a este Paso.')
  await requireEntity(supabase, agentId, 'agent', 'La Persona o taller')

  const payload = {
    step_phase_id: phaseId,
    agent_entity_id: agentId,
    discipline: required(formData, 'discipline', 'La disciplina'),
    role_name: nullable(formData, 'role_name'),
    notes: nullable(formData, 'notes'),
  }
  const result = phaseAgentId
    ? await supabase.from('step_phase_agents').update(payload).eq('id', phaseAgentId).eq('step_phase_id', phaseId).select('id').single()
    : await supabase.from('step_phase_agents').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar el responsable de la fase')
  await audit(supabase, user, { action_type: phaseAgentId ? 'update' : 'link', object_type: 'step_phase_agent', object_id: saved.id, entity_id: stepId, summary: 'Responsable vinculado a una fase del Paso', changed_fields: payload })
  await refreshStep(supabase, stepId, [agentId])
  redirectSaved(stepId, 'patrimonio')
}

export async function removeStepPhaseAgentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const phaseId = uuid(formData, 'phase_id')
  const phaseAgentId = uuid(formData, 'phase_agent_id')
  const saved = assertRow(
    await supabase.from('step_phase_agents').delete().eq('id', phaseAgentId).eq('step_phase_id', phaseId).select('id, agent_entity_id').single(),
    'No se pudo retirar el responsable de la fase'
  )
  await audit(supabase, user, { action_type: 'unlink', object_type: 'step_phase_agent', object_id: saved.id, entity_id: stepId, summary: 'Responsable retirado de una fase del Paso' })
  await refreshStep(supabase, stepId, [saved.agent_entity_id])
  redirectSaved(stepId, 'patrimonio')
}

export async function saveStepPersonnelAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const periodId = optionalUuid(formData, 'period_id')
  const agentId = uuid(formData, 'agent_entity_id')
  await Promise.all([
    requireEntity(supabase, stepId, 'step', 'El Paso'),
    requireEntity(supabase, agentId, 'agent', 'La Persona'),
  ])
  const start = startFields(formData)
  const end = endFields(formData)
  if (start.year_from && end.year_to && end.year_to < start.year_from) throw new Error('El año final no puede ser anterior al año inicial.')

  const payload = {
    step_entity_id: stepId,
    agent_entity_id: agentId,
    role_name: required(formData, 'role_name', 'La responsabilidad'),
    ...start,
    ...end,
    is_current: formData.get('is_current') === 'on',
    notes: nullable(formData, 'notes'),
    status: entityStatus(formData),
  }
  const result = periodId
    ? await supabase.from('step_personnel_periods').update(payload).eq('id', periodId).eq('step_entity_id', stepId).select('id').single()
    : await supabase.from('step_personnel_periods').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar el personal del Paso')
  await audit(supabase, user, { action_type: periodId ? 'update' : 'link', object_type: 'step_personnel_period', object_id: saved.id, entity_id: stepId, summary: 'Responsabilidad del Paso guardada', changed_fields: payload })
  await refreshStep(supabase, stepId, [agentId])
  redirectSaved(stepId, 'personas')
}

export async function archiveStepPersonnelAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const periodId = uuid(formData, 'period_id')
  const saved = assertRow(
    await supabase.from('step_personnel_periods').update({ status: 'archived', is_current: false }).eq('id', periodId).eq('step_entity_id', stepId).select('id, agent_entity_id').single(),
    'No se pudo archivar la responsabilidad'
  )
  await audit(supabase, user, { action_type: 'archive', object_type: 'step_personnel_period', object_id: saved.id, entity_id: stepId, summary: 'Responsabilidad del Paso archivada' })
  await refreshStep(supabase, stepId, [saved.agent_entity_id])
  redirectSaved(stepId, 'personas')
}

export async function saveStepMusicAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const periodId = optionalUuid(formData, 'period_id')
  const bandId = uuid(formData, 'band_entity_id')
  const brotherhoodId = uuid(formData, 'brotherhood_entity_id')
  const [step, band, brotherhood] = await Promise.all([
    requireEntity(supabase, stepId, 'step', 'El Paso'),
    requireEntity(supabase, bandId, 'band', 'La Banda'),
    requireEntity(supabase, brotherhoodId, 'brotherhood', 'La Hermandad'),
  ])
  const start = startFields(formData)
  const end = endFields(formData)
  if (start.year_from && end.year_to && end.year_to < start.year_from) throw new Error('El año final no puede ser anterior al año inicial.')

  const payload = {
    step_entity_id: stepId,
    band_entity_id: bandId,
    brotherhood_entity_id: brotherhoodId,
    public_step_name: step.name,
    public_brotherhood_name: brotherhood.name,
    public_brotherhood_slug: brotherhood.slug || null,
    position: required(formData, 'position', 'La ubicación de la Banda'),
    outing_type: nullable(formData, 'outing_type'),
    ...start,
    ...end,
    is_current: formData.get('is_current') === 'on',
    notes: nullable(formData, 'notes'),
    status: entityStatus(formData),
  }
  const result = periodId
    ? await supabase.from('music_accompaniment_periods').update(payload).eq('id', periodId).eq('step_entity_id', stepId).select('id').single()
    : await supabase.from('music_accompaniment_periods').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar el acompañamiento musical')
  await audit(supabase, user, { action_type: periodId ? 'update' : 'link', object_type: 'music_accompaniment_period', object_id: saved.id, entity_id: stepId, summary: `Acompañamiento musical guardado: ${band.name}`, changed_fields: payload })
  await refreshStep(supabase, stepId, [bandId, brotherhoodId])
  redirectSaved(stepId, 'musica')
}

export async function archiveStepMusicAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const periodId = uuid(formData, 'period_id')
  const saved = assertRow(
    await supabase.from('music_accompaniment_periods').update({ status: 'archived', is_current: false }).eq('id', periodId).eq('step_entity_id', stepId).select('id, band_entity_id, brotherhood_entity_id').single(),
    'No se pudo archivar el acompañamiento musical'
  )
  await audit(supabase, user, { action_type: 'archive', object_type: 'music_accompaniment_period', object_id: saved.id, entity_id: stepId, summary: 'Acompañamiento musical archivado' })
  await refreshStep(supabase, stepId, [saved.band_entity_id, saved.brotherhood_entity_id])
  redirectSaved(stepId, 'musica')
}
