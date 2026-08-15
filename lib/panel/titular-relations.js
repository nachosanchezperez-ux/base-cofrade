import 'server-only'

import { createClient } from '@/lib/supabase/server'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getTitularRelationsData() {
  const supabase = await createClient()
  const [entitiesResult, advocationsResult, relationsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .in('entity_type', ['brotherhood', 'advocation'])
      .neq('status', 'archived')
      .order('name'),
    supabase
      .from('advocations')
      .select('entity_id, advocation_type, description'),
    supabase
      .from('entity_relations')
      .select('id, source_entity_id, target_entity_id, relation_type, status, notes, created_at')
      .eq('relation_type', 'has_titular')
      .neq('status', 'archived')
      .order('created_at'),
  ])

  const entities = rows(entitiesResult, 'No se pudieron cargar las entidades')
  const advocations = rows(advocationsResult, 'No se pudieron cargar las identidades devocionales')
  const relations = rows(relationsResult, 'No se pudieron cargar las titularidades')
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))

  const option = (entity) => ({
    id: entity.id,
    name: entity.name,
    meta: entity.status === 'published' ? 'Publicado' : 'Borrador',
  })

  return {
    brotherhoodOptions: entities
      .filter((entity) => entity.entity_type === 'brotherhood')
      .map(option),
    advocationOptions: entities
      .filter((entity) => entity.entity_type === 'advocation')
      .map(option),
    advocations: advocations
      .map((row) => ({ ...row, entity: entityById.get(row.entity_id) || null }))
      .filter((row) => row.entity),
    relations: relations
      .map((relation) => ({
        ...relation,
        brotherhood: entityById.get(relation.source_entity_id) || null,
        advocation: entityById.get(relation.target_entity_id) || null,
      }))
      .filter((relation) => relation.brotherhood && relation.advocation),
  }
}
