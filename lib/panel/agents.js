import 'server-only'

import { createClient } from '@/lib/supabase/server'

export const AGENT_KIND_LABELS = {
  person: 'Persona',
  workshop: 'Taller',
  company: 'Empresa',
  institution: 'Institución',
}

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

export async function getPanelAgents({ query = '', status = '', kind = '' } = {}) {
  const supabase = await createClient()
  let entityQuery = supabase
    .from('entities')
    .select('id, name, slug, status, updated_at')
    .eq('entity_type', 'agent')
    .order('name')

  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)

  const entities = assertQuery(
    await entityQuery,
    'No se pudieron cargar los Agentes del Panel'
  ) || []

  if (!entities.length) return []

  let agentQuery = supabase
    .from('agents')
    .select('entity_id, agent_kind')
    .in('entity_id', entities.map((entity) => entity.id))

  if (kind) agentQuery = agentQuery.eq('agent_kind', kind)

  const rows = assertQuery(
    await agentQuery,
    'No se pudieron cargar las fichas de Agente'
  ) || []
  const agentById = new Map(rows.map((row) => [row.entity_id, row]))

  return entities
    .filter((entity) => !kind || agentById.has(entity.id))
    .map((entity) => {
      const agent = agentById.get(entity.id) || {}
      return {
        ...entity,
        kind: agent.agent_kind || 'person',
        kindLabel: AGENT_KIND_LABELS[agent.agent_kind] || 'Agente',
      }
    })
}

export async function getAgentEditorData(id) {
  const supabase = await createClient()
  const entity = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug, summary, status, updated_at')
      .eq('id', id)
      .eq('entity_type', 'agent')
      .maybeSingle(),
    'No se pudo cargar la entidad del Agente'
  )

  if (!entity) return null

  const agent = assertQuery(
    await supabase
      .from('agents')
      .select('entity_id, agent_kind')
      .eq('entity_id', id)
      .maybeSingle(),
    'No se pudo cargar la ficha del Agente'
  )

  if (!agent) return null
  return { entity, agent }
}
