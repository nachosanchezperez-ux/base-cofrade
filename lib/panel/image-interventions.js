import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'

function row(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getImageInterventionsData(imageId) {
  const supabase = await createClient()
  const [entityResult, interventionsResult, agentsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .maybeSingle(),
    supabase
      .from('heritage_interventions')
      .select('id, target_entity_id, agent_entity_id, discipline, intervention_type, date_from_text, date_to_text, description, status, created_at')
      .eq('target_entity_id', imageId)
      .neq('status', 'archived')
      .order('created_at'),
    supabase
      .from('entities')
      .select('id, name, status')
      .eq('entity_type', 'agent')
      .neq('status', 'archived')
      .order('name'),
  ])

  const entity = row(entityResult, 'No se pudo cargar la Imagen')
  if (!entity) return null

  const interventions = rows(interventionsResult, 'No se pudieron cargar las intervenciones')
  const agents = rows(agentsResult, 'No se pudieron cargar los Agentes')
  const agentById = new Map(agents.map((agent) => [agent.id, agent]))
  const sourceSupport = await loadRelationSourceSupport(supabase, interventions, 'heritage_intervention')

  return {
    entity,
    sourceOptions: sourceSupport.sourceOptions,
    agentOptions: agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      meta: agent.status === 'published' ? 'Publicado' : 'Borrador',
    })),
    interventions: sourceSupport.relations.map((intervention) => ({
      ...intervention,
      agent: intervention.agent_entity_id
        ? agentById.get(intervention.agent_entity_id) || null
        : null,
    })),
  }
}
