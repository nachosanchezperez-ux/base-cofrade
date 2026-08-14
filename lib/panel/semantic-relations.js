import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'

export const SEMANTIC_RELATION_TYPES = {
  has_titular: 'Titular institucional',
  owned_by: 'Propiedad',
  institutional_band: 'Banda vinculada institucionalmente',
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getSemanticRelationsData() {
  const supabase = await createClient()
  const [entitiesResult, advocationsResult, agentsResult, relationsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .in('entity_type', ['brotherhood', 'advocation', 'image', 'agent', 'band'])
      .neq('status', 'archived')
      .order('name'),
    supabase
      .from('advocations')
      .select('entity_id, advocation_type, description'),
    supabase
      .from('agents')
      .select('entity_id, agent_kind'),
    supabase
      .from('entity_relations')
      .select('id, source_entity_id, relation_type, target_entity_id, date_from_text, date_to_text, notes, status, created_at')
      .in('relation_type', Object.keys(SEMANTIC_RELATION_TYPES))
      .neq('status', 'archived')
      .order('created_at'),
  ])

  const entities = rows(entitiesResult, 'No se pudieron cargar las entidades')
  const advocations = rows(advocationsResult, 'No se pudieron cargar las advocaciones')
  const agents = rows(agentsResult, 'No se pudieron cargar los Agentes')
  const relations = rows(relationsResult, 'No se pudieron cargar las relaciones semánticas')
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const agentKindById = new Map(agents.map((agent) => [agent.entity_id, agent.agent_kind]))
  const sourceSupport = await loadRelationSourceSupport(supabase, relations, 'entity_relation')

  const option = (entity) => ({
    id: entity.id,
    name: entity.name,
    meta: [entity.entity_type, entity.status].join(' · '),
  })

  return {
    brotherhoodOptions: entities.filter((item) => item.entity_type === 'brotherhood').map(option),
    imageOptions: entities.filter((item) => item.entity_type === 'image').map(option),
    advocationOptions: entities.filter((item) => item.entity_type === 'advocation').map(option),
    institutionOptions: entities
      .filter((item) => item.entity_type === 'agent' && agentKindById.get(item.id) === 'institution')
      .map(option),
    bandOptions: entities.filter((item) => item.entity_type === 'band').map(option),
    advocations: advocations.map((row) => ({
      ...row,
      entity: entityById.get(row.entity_id) || null,
    })).filter((row) => row.entity),
    sourceOptions: sourceSupport.sourceOptions,
    relations: sourceSupport.relations.map((relation) => ({
      ...relation,
      sourceEntity: entityById.get(relation.source_entity_id) || null,
      targetEntity: entityById.get(relation.target_entity_id) || null,
      relationLabel: SEMANTIC_RELATION_TYPES[relation.relation_type] || relation.relation_type,
    })).filter((relation) => relation.sourceEntity && relation.targetEntity),
  }
}
