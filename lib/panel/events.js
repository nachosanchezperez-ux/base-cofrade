import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'

export const EVENT_TARGET_LABELS = {
  brotherhood: 'Hermandad', image: 'Imagen', step: 'Paso', band: 'Banda', agent: 'Persona / Agente',
  heritage_asset: 'Patrimonio', march: 'Marcha', advocation: 'Advocación',
}

function row(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}
function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getPanelEvents({ query = '', status = '', contextEntityId = '' } = {}) {
  const supabase = await createClient()
  let eventIds = null
  if (contextEntityId) {
    const links = rows(
      await supabase.from('entity_relations').select('source_entity_id').eq('target_entity_id', contextEntityId).eq('relation_type', 'involves').neq('status', 'archived'),
      'No se pudieron consultar los acontecimientos relacionados'
    )
    eventIds = [...new Set(links.map((item) => item.source_entity_id).filter(Boolean))]
    if (!eventIds.length) return []
  }

  let entityQuery = supabase.from('entities').select('id, name, slug, summary, status, updated_at').eq('entity_type', 'event').order('name')
  if (eventIds) entityQuery = entityQuery.in('id', eventIds)
  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)
  const entities = rows(await entityQuery, 'No se pudieron cargar los Acontecimientos')
  if (!entities.length) return []

  const eventRows = rows(
    await supabase.from('events').select('entity_id, event_type, event_date, event_date_text, place_id, description').in('entity_id', entities.map((item) => item.id)),
    'No se pudieron cargar los datos de los Acontecimientos'
  )
  const eventById = new Map(eventRows.map((item) => [item.entity_id, item]))
  return entities.map((entity) => ({ ...entity, event: eventById.get(entity.id) || {} }))
}

export async function getEventEditorData(eventId) {
  const supabase = await createClient()
  const [entityResult, eventResult, relationsResult, placesResult, targetsResult, mediaResult, directSourcesResult] = await Promise.all([
    supabase.from('entities').select('id, name, slug, summary, status, updated_at').eq('id', eventId).eq('entity_type', 'event').maybeSingle(),
    supabase.from('events').select('*').eq('entity_id', eventId).maybeSingle(),
    supabase.from('entity_relations').select('*').eq('source_entity_id', eventId).eq('relation_type', 'involves').neq('status', 'archived').order('created_at'),
    supabase.from('places').select('id, name, municipality_id, place_type').order('name'),
    supabase.from('entities').select('id, entity_type, name, slug, status').neq('entity_type', 'event').neq('status', 'archived').order('name'),
    supabase.from('entity_media').select('id, is_cover').eq('entity_id', eventId),
    supabase.from('source_links').select('id, source_id, scope').eq('entity_id', eventId),
  ])

  const entity = row(entityResult, 'No se pudo cargar el Acontecimiento')
  const event = row(eventResult, 'No se pudo cargar la ficha del Acontecimiento')
  if (!entity || !event) return null

  const relations = rows(relationsResult, 'No se pudieron cargar las relaciones del Acontecimiento')
  const targets = rows(targetsResult, 'No se pudieron cargar las entidades del grafo')
  const targetById = new Map(targets.map((target) => [target.id, target]))
  const sourceSupport = await loadRelationSourceSupport(supabase, relations, 'entity_relation')
  const directSourceLinks = rows(directSourcesResult, 'No se pudieron cargar las Fuentes directas').filter((link) => !String(link.scope || '').startsWith('relation:'))

  return {
    entity,
    event,
    places: rows(placesResult, 'No se pudieron cargar los lugares'),
    targetOptions: targets.map((target) => ({
      id: target.id,
      name: target.name,
      slug: target.slug || '',
      meta: `${EVENT_TARGET_LABELS[target.entity_type] || target.entity_type} · ${target.status}`,
    })),
    sourceOptions: sourceSupport.sourceOptions,
    relations: sourceSupport.relations.map((relation) => ({ ...relation, target: targetById.get(relation.target_entity_id) || null })),
    coverage: {
      relations: relations.length,
      media: rows(mediaResult, 'No se pudo cargar el multimedia').length,
      sources: directSourceLinks.length,
    },
  }
}
