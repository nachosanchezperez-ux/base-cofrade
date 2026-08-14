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
  const [entityResult, interventionsResult, agentEntitiesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .maybeSingle(),
    supabase
      .from('heritage_interventions')
      .select('id, target_entity_id, agent_entity_id, discipline, element_name, intervention_type, phase, date_from, date_from_text, date_to, date_to_text, description, status, created_at')
      .eq('target_entity_id', imageId)
      .neq('status', 'archived')
      .order('date_from', { ascending: true, nullsFirst: false }),
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
  const agents = rows(agentEntitiesResult, 'No se pudieron cargar los Agentes')
  const agentById = new Map(agents.map((agent) => [agent.id, agent]))
  const sourceSupport = await loadRelationSourceSupport(supabase, interventions, 'intervention')

  return {
    entity,
    agentOptions: agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      meta: agent.status === 'published' ? 'Publicado' : 'Borrador',
    })),
    sourceOptions: sourceSupport.sourceOptions,
    interventions: sourceSupport.relations.map((intervention) => ({
      ...intervention,
      agent: intervention.agent_entity_id ? agentById.get(intervention.agent_entity_id) || null : null,
    })),
  }
}
