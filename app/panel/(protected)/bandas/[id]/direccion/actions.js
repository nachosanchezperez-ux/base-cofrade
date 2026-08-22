'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

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

function uuid(formData, name) {
  const candidate = optionalUuid(formData, name)
  if (!candidate) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
}

function checked(formData, name) {
  return formData.get(name) === 'on'
}

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
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

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la auditoría', error)
}

async function refreshBand(supabase, bandId, agentId = null) {
  const { data } = await supabase.from('entities').select('slug').eq('id', bandId).maybeSingle()
  revalidatePath('/panel')
  revalidatePath('/panel/bandas')
  revalidatePath(`/panel/bandas/${bandId}`)
  revalidatePath(`/panel/bandas/${bandId}/direccion`)
  revalidatePath('/panel/datos/salud')
  revalidatePath('/panel/agentes')
  if (agentId) revalidatePath(`/panel/agentes/${agentId}`)
  revalidatePath('/bandas')
  revalidatePath('/')
  if (data?.slug) revalidatePath(`/bandas/${data.slug}`)
}

async function ensureSpecializedAgent(supabase, agentId) {
  const entity = assertRow(
    await supabase
      .from('entities')
      .select('id, name, entity_type, status')
      .eq('id', agentId)
      .eq('entity_type', 'agent')
      .maybeSingle(),
    'La Persona seleccionada no existe.'
  )

  const existing = await supabase.from('agents').select('entity_id, agent_kind').eq('entity_id', agentId).maybeSingle()
  if (existing.error) throw new Error(`No se pudo comprobar la ficha de Persona: ${existing.error.message}`)
  if (existing.data?.agent_kind && existing.data.agent_kind !== 'person') {
    throw new Error('La Dirección de una Banda debe vincularse a una Persona, no a un taller, empresa o institución.')
  }
  if (!existing.data) {
    assertMutation(
      await supabase.from('agents').insert({ entity_id: agentId, agent_kind: 'person' }),
      'No se pudo consolidar la Persona seleccionada'
    )
  }
  return entity
}

async function createPersonAgent(supabase, personName) {
  const agentId = randomUUID()
  const baseSlug = slugify(personName) || `agente-${agentId.slice(0, 8)}`
  const slugMatch = await supabase.from('entities').select('id').eq('slug', baseSlug).limit(1).maybeSingle()
  if (slugMatch.error) throw new Error(`No se pudo comprobar el slug de la Persona: ${slugMatch.error.message}`)
  const agentSlug = slugMatch.data ? `${baseSlug}-${agentId.slice(0, 8)}` : baseSlug

  assertMutation(
    await supabase.from('entities').insert({
      id: agentId,
      entity_type: 'agent',
      name: personName,
      slug: agentSlug,
      status: 'published',
    }),
    'No se pudo crear la Persona'
  )

  const specialized = await supabase.from('agents').insert({ entity_id: agentId, agent_kind: 'person' })
  if (specialized.error) {
    const rollback = await supabase.from('entities').delete().eq('id', agentId).eq('entity_type', 'agent')
    if (rollback.error) console.error('[Hilo Cofrade] No se pudo revertir una Persona incompleta', rollback.error)
    throw new Error(`No se pudo crear la ficha especializada de Persona: ${specialized.error.message}`)
  }

  return { id: agentId, name: personName }
}

async function resolveAgent(supabase, formData, relationId, bandId) {
  if (relationId) {
    const relation = assertRow(
      await supabase
        .from('band_agents')
        .select('id, agent_entity_id')
        .eq('id', relationId)
        .eq('band_entity_id', bandId)
        .maybeSingle(),
      'La responsabilidad no existe o ya no pertenece a esta Banda.'
    )
    return ensureSpecializedAgent(supabase, relation.agent_entity_id)
  }

  const selectedAgentId = optionalUuid(formData, 'agent_entity_id')
  if (selectedAgentId) return ensureSpecializedAgent(supabase, selectedAgentId)

  return createPersonAgent(supabase, required(formData, 'person_name', 'El nombre de la nueva Persona'))
}

export async function saveBandDirectionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const relationId = optionalUuid(formData, 'band_agent_id')

  assertRow(
    await supabase.from('entities').select('id').eq('id', bandId).eq('entity_type', 'band').maybeSingle(),
    'La Banda no existe.'
  )

  const agent = await resolveAgent(supabase, formData, relationId, bandId)
  const payload = {
    band_entity_id: bandId,
    agent_entity_id: agent.id,
    role_name: required(formData, 'role_name', 'La responsabilidad'),
    date_from: nullable(formData, 'date_from'),
    date_from_text: nullable(formData, 'date_from_text'),
    date_to: nullable(formData, 'date_to'),
    date_to_text: nullable(formData, 'date_to_text'),
    is_current: checked(formData, 'is_current'),
    notes: nullable(formData, 'notes'),
    is_public: checked(formData, 'is_public'),
  }

  const result = relationId
    ? await supabase.from('band_agents').update(payload).eq('id', relationId).eq('band_entity_id', bandId).select('id').single()
    : await supabase.from('band_agents').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la responsabilidad')

  await audit(supabase, user, {
    action_type: relationId ? 'update' : 'create',
    object_type: 'band_agent',
    object_id: saved.id,
    entity_id: bandId,
    summary: `Dirección: ${agent.name} · ${payload.role_name}`,
    changed_fields: payload,
  })
  await refreshBand(supabase, bandId, agent.id)
  redirect(`/panel/bandas/${bandId}/direccion?saved=direction`)
}

export async function archiveBandDirectionAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const bandId = uuid(formData, 'band_id')
  const relationId = uuid(formData, 'band_agent_id')

  const relation = assertRow(
    await supabase
      .from('band_agents')
      .select('id, agent_entity_id, date_to, date_to_text')
      .eq('id', relationId)
      .eq('band_entity_id', bandId)
      .maybeSingle(),
    'La responsabilidad no existe o ya no pertenece a esta Banda.'
  )

  const payload = {
    is_current: false,
    date_to: relation.date_to || new Date().toISOString().slice(0, 10),
  }
  assertMutation(
    await supabase.from('band_agents').update(payload).eq('id', relationId).eq('band_entity_id', bandId),
    'No se pudo retirar la responsabilidad'
  )

  await audit(supabase, user, {
    action_type: 'archive',
    object_type: 'band_agent',
    object_id: relationId,
    entity_id: bandId,
    summary: 'Responsabilidad retirada de la dirección actual',
    changed_fields: payload,
  })
  await refreshBand(supabase, bandId, relation.agent_entity_id)
  redirect(`/panel/bandas/${bandId}/direccion?saved=archived`)
}
