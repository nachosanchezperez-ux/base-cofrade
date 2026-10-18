import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { selectAllRows, selectRowsByIds } from '@/lib/panel/query-all'
import { AGENT_KIND_LABELS } from '@/lib/panel/agents'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

export async function getImageAuthorshipRelations(imageId) {
  const supabase = await createClient()
  const [entityResult, imageResult, relationsResult, agentEntitiesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .maybeSingle(),
    supabase
      .from('images')
      .select('entity_id, image_type')
      .eq('entity_id', imageId)
      .maybeSingle(),
    supabase
      .from('image_authorships')
      .select('id, agent_entity_id, authorship_type, role_name, date_from, date_from_text, date_to, date_to_text, certainty, notes, status, created_at')
      .eq('image_entity_id', imageId)
      .order('created_at'),
    selectAllRows(() => supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'agent')
      .order('name')),
  ])

  const entity = assertRow(entityResult, 'No se pudo cargar la Imagen')
  const image = assertRow(imageResult, 'No se pudo cargar la ficha de la Imagen')
  if (!entity || !image) return null

  const relations = assertRows(relationsResult, 'No se pudieron cargar las autorías')
  const agentEntities = assertRows(agentEntitiesResult, 'No se pudieron cargar los Agentes')
  const agentRows = agentEntities.length
    ? assertRows(
        await selectRowsByIds(agentEntities.map((item) => item.id), (ids) => supabase
          .from('agents')
          .select('entity_id, agent_kind')
          .in('entity_id', ids)),
        'No se pudieron cargar los tipos de Agente'
      )
    : []

  const kindById = new Map(agentRows.map((item) => [item.entity_id, item.agent_kind]))
  const agents = agentEntities.map((agent) => {
    const kind = kindById.get(agent.id) || 'person'
    return {
      ...agent,
      kind,
      kindLabel: AGENT_KIND_LABELS[kind] || 'Agente',
      meta: [
        AGENT_KIND_LABELS[kind] || 'Agente',
        agent.status === 'published' ? 'Publicado' : 'Borrador',
      ].join(' · '),
    }
  })
  const agentById = new Map(agents.map((item) => [item.id, item]))
  const hydratedRelations = relations.map((relation) => ({
    ...relation,
    agent: agentById.get(relation.agent_entity_id) || null,
  }))
  const sourceSupport = await loadRelationSourceSupport(supabase, hydratedRelations, 'image_authorship')

  return {
    entity,
    image,
    relations: sourceSupport.relations,
    candidates: agents.filter((agent) => agent.status !== 'archived'),
    sourceOptions: sourceSupport.sourceOptions,
  }
}
