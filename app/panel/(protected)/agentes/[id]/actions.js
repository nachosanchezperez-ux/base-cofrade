'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const AGENT_KINDS = new Set(['person', 'workshop', 'company', 'institution'])
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const NAME_TYPES = new Set(['official', 'commercial', 'former', 'artistic', 'alias', 'acronym'])

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
function status(formData) {
  const candidate = value(formData, 'status') || 'draft'
  if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.')
  return candidate
}
function url(formData, name, label) {
  const candidate = nullable(formData, name)
  if (!candidate) return null
  try {
    const parsed = new URL(candidate)
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error()
    return parsed.toString()
  } catch {
    throw new Error(`${label} no es válida.`)
  }
}
function slugify(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
function normalizeIdentity(input) {
  return String(input || '')
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
function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}
async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición del Agente', error)
}
async function refreshAgent(supabase, agentId) {
  const { data } = await supabase.from('entities').select('slug').eq('id', agentId).maybeSingle()
  revalidatePath('/panel')
  revalidatePath('/panel/agentes')
  revalidatePath(`/panel/agentes/${agentId}`)
  revalidatePath('/')
  if (data?.slug) revalidatePath(`/agentes/${data.slug}`)
}
function redirectSaved(agentId, section) {
  redirect(`/panel/agentes/${agentId}?saved=${section}#${section}`)
}
async function ensureUniqueIdentity(supabase, { agentId, name, slug }) {
  const [slugResult, agentsResult] = await Promise.all([
    supabase.from('entities').select('id, name, slug').eq('slug', slug).neq('id', agentId).limit(1),
    supabase.from('entities').select('id, name, slug').eq('entity_type', 'agent').neq('id', agentId),
  ])
  const slugMatch = (assertQuery(slugResult, 'No se pudo comprobar el slug') || [])[0]
  if (slugMatch) throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
  const duplicate = (assertQuery(agentsResult, 'No se pudieron comprobar posibles duplicados') || [])
    .find((item) => normalizeIdentity(item.name) === normalizeIdentity(name))
  if (duplicate && slug === slugify(name)) {
    throw new Error(`Ya existe una persona o entidad con ese nombre: ${duplicate.name}. Usa un slug específico solo si se trata de otra ficha.`)
  }
}
function auditAction(currentStatus, nextStatus) {
  if (currentStatus !== 'published' && nextStatus === 'published') return 'publish'
  if (currentStatus === 'published' && nextStatus !== 'published') return 'unpublish'
  if (nextStatus === 'archived') return 'archive'
  return 'update'
}

export async function updateAgentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const agentId = uuid(formData, 'agent_id')
  const agentName = required(formData, 'name', 'El nombre')
  const entitySlug = slugify(required(formData, 'slug', 'El slug'))
  const agentKind = value(formData, 'agent_kind')
  const nextStatus = status(formData)

  if (!AGENT_KINDS.has(agentKind)) throw new Error('El tipo de registro no es válido.')
  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  const current = assertQuery(
    await supabase.from('entities').select('id, name, slug, status').eq('id', agentId).eq('entity_type', 'agent').maybeSingle(),
    'No se pudo comprobar la ficha'
  )
  if (!current) throw new Error('La ficha ya no existe.')
  if (current.status === 'published' && current.slug !== entitySlug) {
    throw new Error('El slug de una ficha publicada no puede cambiarse. Retira primero la publicación si necesitas modificar la URL.')
  }

  await ensureUniqueIdentity(supabase, { agentId, name: agentName, slug: entitySlug })

  const entityPayload = {
    name: agentName,
    slug: entitySlug,
    summary: nullable(formData, 'summary'),
    status: nextStatus,
  }
  const agentPayload = {
    agent_kind: agentKind,
    municipality_id: optionalUuid(formData, 'municipality_id'),
    foundation_or_birth_text: nullable(formData, 'foundation_or_birth_text'),
    death_or_end_text: nullable(formData, 'death_or_end_text'),
    website_url: url(formData, 'website_url', 'La web'),
    instagram_url: url(formData, 'instagram_url', 'La URL de Instagram'),
    description: nullable(formData, 'description'),
    birth_or_foundation_date: optionalDate(formData, 'birth_or_foundation_date'),
    death_or_end_date: optionalDate(formData, 'death_or_end_date'),
    address: nullable(formData, 'address'),
    email: nullable(formData, 'email'),
    phone: nullable(formData, 'phone'),
    active_notes: nullable(formData, 'active_notes'),
  }

  assertMutation(await supabase.from('entities').update(entityPayload).eq('id', agentId).eq('entity_type', 'agent'), 'No se pudo actualizar la entidad')
  assertMutation(await supabase.from('agents').update(agentPayload).eq('entity_id', agentId), 'No se pudo actualizar la ficha')

  await audit(supabase, user, {
    action_type: auditAction(current.status, nextStatus),
    object_type: 'agent', object_id: agentId, entity_id: agentId,
    summary: `Ficha actualizada: ${agentName}`,
    changed_fields: { entity: entityPayload, agent: agentPayload },
  })
  await refreshAgent(supabase, agentId)
  redirectSaved(agentId, 'general')
}

export async function saveAgentNameAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const agentId = uuid(formData, 'agent_id')
  const nameId = optionalUuid(formData, 'name_id')
  const nameType = value(formData, 'name_type') || 'alias'
  if (!NAME_TYPES.has(nameType)) throw new Error('Tipo de nombre no válido.')
  const payload = {
    agent_entity_id: agentId,
    name: required(formData, 'alternate_name', 'El nombre'),
    name_type: nameType,
    date_from: optionalDate(formData, 'date_from'),
    date_from_text: nullable(formData, 'date_from_text'),
    date_to: optionalDate(formData, 'date_to'),
    date_to_text: nullable(formData, 'date_to_text'),
    is_current: formData.get('is_current') === 'on',
    notes: nullable(formData, 'notes'),
  }
  const result = nameId
    ? await supabase.from('agent_names').update(payload).eq('id', nameId).eq('agent_entity_id', agentId).select('id').single()
    : await supabase.from('agent_names').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar el nombre')
  await audit(supabase, user, { action_type: nameId ? 'update' : 'create', object_type: 'agent_name', object_id: saved.id, entity_id: agentId, summary: `Nombre ${nameId ? 'actualizado' : 'añadido'}: ${payload.name}`, changed_fields: payload })
  await refreshAgent(supabase, agentId)
  redirectSaved(agentId, 'nombres')
}

export async function deleteAgentNameAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const agentId = uuid(formData, 'agent_id')
  const nameId = uuid(formData, 'name_id')
  const row = assertMutation(await supabase.from('agent_names').delete().eq('id', nameId).eq('agent_entity_id', agentId).select('id, name').single(), 'No se pudo retirar el nombre')
  await audit(supabase, user, { action_type: 'delete', object_type: 'agent_name', object_id: row.id, entity_id: agentId, summary: `Nombre retirado: ${row.name}` })
  await refreshAgent(supabase, agentId)
  redirectSaved(agentId, 'nombres')
}

export async function saveAgentDisciplineAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const agentId = uuid(formData, 'agent_id')
  const disciplineId = optionalUuid(formData, 'discipline_id')
  const payload = {
    agent_entity_id: agentId,
    discipline: required(formData, 'discipline', 'La disciplina'),
    is_primary: formData.get('is_primary') === 'on',
    notes: nullable(formData, 'notes'),
  }
  if (payload.is_primary) {
    assertMutation(await supabase.from('agent_disciplines').update({ is_primary: false }).eq('agent_entity_id', agentId), 'No se pudo actualizar la disciplina principal')
  }
  const result = disciplineId
    ? await supabase.from('agent_disciplines').update(payload).eq('id', disciplineId).eq('agent_entity_id', agentId).select('id').single()
    : await supabase.from('agent_disciplines').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar la disciplina')
  await audit(supabase, user, { action_type: disciplineId ? 'update' : 'create', object_type: 'agent_discipline', object_id: saved.id, entity_id: agentId, summary: `Disciplina ${disciplineId ? 'actualizada' : 'añadida'}: ${payload.discipline}`, changed_fields: payload })
  await refreshAgent(supabase, agentId)
  redirectSaved(agentId, 'disciplinas')
}

export async function deleteAgentDisciplineAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const agentId = uuid(formData, 'agent_id')
  const disciplineId = uuid(formData, 'discipline_id')
  const row = assertMutation(await supabase.from('agent_disciplines').delete().eq('id', disciplineId).eq('agent_entity_id', agentId).select('id, discipline').single(), 'No se pudo retirar la disciplina')
  await audit(supabase, user, { action_type: 'delete', object_type: 'agent_discipline', object_id: row.id, entity_id: agentId, summary: `Disciplina retirada: ${row.discipline}` })
  await refreshAgent(supabase, agentId)
  redirectSaved(agentId, 'disciplinas')
}

export async function saveAgentRoleAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const agentId = uuid(formData, 'agent_id')
  const roleId = optionalUuid(formData, 'role_id')
  const payload = {
    agent_entity_id: agentId,
    role_name: required(formData, 'role_name', 'El rol'),
    date_from: optionalDate(formData, 'date_from'),
    date_from_text: nullable(formData, 'date_from_text'),
    date_to: optionalDate(formData, 'date_to'),
    date_to_text: nullable(formData, 'date_to_text'),
    notes: nullable(formData, 'notes'),
  }
  const result = roleId
    ? await supabase.from('agent_roles').update(payload).eq('id', roleId).eq('agent_entity_id', agentId).select('id').single()
    : await supabase.from('agent_roles').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar el rol')
  await audit(supabase, user, { action_type: roleId ? 'update' : 'create', object_type: 'agent_role', object_id: saved.id, entity_id: agentId, summary: `Rol ${roleId ? 'actualizado' : 'añadido'}: ${payload.role_name}`, changed_fields: payload })
  await refreshAgent(supabase, agentId)
  redirectSaved(agentId, 'roles')
}

export async function deleteAgentRoleAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const agentId = uuid(formData, 'agent_id')
  const roleId = uuid(formData, 'role_id')
  const row = assertMutation(await supabase.from('agent_roles').delete().eq('id', roleId).eq('agent_entity_id', agentId).select('id, role_name').single(), 'No se pudo retirar el rol')
  await audit(supabase, user, { action_type: 'delete', object_type: 'agent_role', object_id: row.id, entity_id: agentId, summary: `Rol retirado: ${row.role_name}` })
  await refreshAgent(supabase, agentId)
  redirectSaved(agentId, 'roles')
}
