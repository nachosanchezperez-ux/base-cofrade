'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const AGENT_KINDS = new Set(['person', 'workshop', 'company', 'institution'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
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

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function ensureUniqueIdentity(supabase, { name, slug, customSlug }) {
  const [slugResult, agentsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug')
      .eq('slug', slug)
      .limit(1),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'agent'),
  ])

  if (assertRows(slugResult, 'No se pudo comprobar el slug').length) {
    throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
  }

  if (!customSlug) {
    const normalizedName = normalizeIdentity(name)
    const duplicate = assertRows(agentsResult, 'No se pudieron comprobar posibles duplicados')
      .find((item) => normalizeIdentity(item.name) === normalizedName)

    if (duplicate) {
      throw new Error(`Ya existe un Agente con ese nombre: ${duplicate.name}. Usa un slug específico solo si es otra persona o entidad.`)
    }
  }
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar el alta del Agente', error)
}

export async function createAgentAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const agentName = required(formData, 'name', 'El nombre del Agente')
  const submittedSlug = value(formData, 'slug')
  const entitySlug = slugify(submittedSlug || agentName)
  const agentKind = value(formData, 'agent_kind')

  if (!AGENT_KINDS.has(agentKind)) throw new Error('El tipo de Agente no es válido.')
  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  await ensureUniqueIdentity(supabase, {
    name: agentName,
    slug: entitySlug,
    customSlug: Boolean(submittedSlug),
  })

  const agentId = randomUUID()
  const entityPayload = {
    id: agentId,
    entity_type: 'agent',
    name: agentName,
    slug: entitySlug,
    status: 'draft',
  }
  const agentPayload = {
    entity_id: agentId,
    agent_kind: agentKind,
  }

  assertMutation(
    await supabase.from('entities').insert(entityPayload).select('id').single(),
    'No se pudo crear la entidad del Agente'
  )

  const agentResult = await supabase
    .from('agents')
    .insert(agentPayload)
    .select('entity_id')
    .single()

  if (agentResult.error) {
    const rollback = await supabase
      .from('entities')
      .delete()
      .eq('id', agentId)
      .eq('status', 'draft')

    if (rollback.error) {
      console.error('[Hilo Cofrade] No se pudo revertir una entidad creada sin ficha de Agente', {
        agentId,
        rollbackError: rollback.error.message,
      })
    }
    throw new Error(`No se pudo crear la ficha del Agente: ${agentResult.error.message}`)
  }

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'agent',
    object_id: agentId,
    entity_id: agentId,
    summary: `Agente creado como borrador: ${agentName}`,
    changed_fields: { entity: entityPayload, agent: agentPayload },
  })

  revalidatePath('/panel')
  revalidatePath('/panel/agentes')
  revalidatePath(`/panel/agentes/${agentId}`)
  redirect(`/panel/agentes/${agentId}?saved=created`)
}
