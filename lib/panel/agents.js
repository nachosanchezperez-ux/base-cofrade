import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { mergeEditableEntities } from '@/lib/panel/reference-nodes'

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
  const merged = mergeEditableEntities(entities, rows, 'agente', { agent_kind: 'person' })

  return merged
    .filter((entity) => !kind || entity.isEditable)
    .map((entity) => {
      return {
        ...entity,
        kind: entity.agent_kind || 'person',
        kindLabel: entity.isEditable
          ? AGENT_KIND_LABELS[entity.agent_kind] || 'Agente'
          : 'Nodo de referencia',
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
