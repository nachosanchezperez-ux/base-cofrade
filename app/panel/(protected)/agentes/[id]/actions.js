'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const AGENT_KINDS = new Set(['person', 'workshop', 'company', 'institution'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

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

function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function ensureUniqueIdentity(supabase, { agentId, name, slug }) {
  const [slugResult, agentsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug')
      .eq('slug', slug)
      .neq('id', agentId)
      .limit(1),
    supabase
      .from('entities')
      .select('id, name, slug')
      .eq('entity_type', 'agent')
      .neq('id', agentId),
  ])

  const slugMatch = (assertQuery(slugResult, 'No se pudo comprobar el slug') || [])[0]
  if (slugMatch) throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)

  const duplicate = (assertQuery(agentsResult, 'No se pudieron comprobar posibles duplicados') || [])
    .find((item) => normalizeIdentity(item.name) === normalizeIdentity(name))

  if (duplicate && slug === slugify(name)) {
    throw new Error(`Ya existe un Agente con ese nombre: ${duplicate.name}. Usa un slug específico solo si es otra persona o entidad.`)
  }
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición del Agente', error)
}

export async function updateAgentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const agentId = uuid(formData, 'agent_id')
  const agentName = required(formData, 'name', 'El nombre del Agente')
  const entitySlug = slugify(required(formData, 'slug', 'El slug'))
  const agentKind = value(formData, 'agent_kind')

  if (!AGENT_KINDS.has(agentKind)) throw new Error('El tipo de Agente no es válido.')
  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  const current = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', agentId)
      .eq('entity_type', 'agent')
      .maybeSingle(),
    'No se pudo comprobar el Agente'
  )

  if (!current) throw new Error('El Agente ya no existe.')
  if (current.status === 'published' && current.slug !== entitySlug) {
    throw new Error('El slug de un Agente publicado no puede cambiarse desde este editor básico.')
  }

  await ensureUniqueIdentity(supabase, {
    agentId,
    name: agentName,
    slug: entitySlug,
  })

  const entityPayload = { name: agentName, slug: entitySlug }
  const agentPayload = { agent_kind: agentKind }

  assertMutation(
    await supabase
      .from('entities')
      .update(entityPayload)
      .eq('id', agentId)
      .eq('entity_type', 'agent'),
    'No se pudo actualizar la entidad del Agente'
  )
  assertMutation(
    await supabase
      .from('agents')
      .update(agentPayload)
      .eq('entity_id', agentId),
    'No se pudo actualizar la ficha del Agente'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'agent',
    object_id: agentId,
    entity_id: agentId,
    summary: `Agente actualizado: ${agentName}`,
    changed_fields: { entity: entityPayload, agent: agentPayload },
  })

  revalidatePath('/panel')
  revalidatePath('/panel/agentes')
  revalidatePath(`/panel/agentes/${agentId}`)
  redirect(`/panel/agentes/${agentId}?saved=general`)
}
