import 'server-only'

import { crewEventTypeLabel } from '@/lib/crew-events'
import { createClient } from '@/lib/supabase/server'

function row(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}
function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function option(entity, meta = '') {
  return { id: entity.id, name: entity.name, slug: entity.slug || '', meta }
}

export async function getCrewEventReferenceOptions(supabaseClient = null) {
  const supabase = supabaseClient || await createClient()
  const [brotherhoodsResult, stepsResult, agentsResult, municipalitiesResult, placesResult] = await Promise.all([
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'brotherhood').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'step').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'agent').neq('status', 'archived').order('name'),
    supabase.from('municipalities').select('id, name, province').eq('province', 'Sevilla').order('name'),
    supabase.from('places').select('id, name, municipality_id, place_type').order('name'),
  ])
  const brotherhoods = rows(brotherhoodsResult, 'No se pudieron cargar las Hermandades')
  const steps = rows(stepsResult, 'No se pudieron cargar los Pasos')
  const agents = rows(agentsResult, 'No se pudieron cargar los capataces y responsables')
  const municipalities = rows(municipalitiesResult, 'No se pudieron cargar las localidades')
  const places = rows(placesResult, 'No se pudieron cargar los lugares')
  const municipalityById = new Map(municipalities.map((item) => [item.id, item.name]))
  return {
    brotherhoodOptions: brotherhoods.map((item) => option(item, item.status === 'published' ? 'Publicada' : 'Borrador')),
    stepOptions: steps.map((item) => option(item, item.status === 'published' ? 'Publicado' : 'Borrador')),
    agentOptions: agents.map((item) => option(item, item.status === 'published' ? 'Publicado' : 'Borrador')),
    municipalities,
    places: places.map((item) => ({
      ...item,
      label: `${item.name}${municipalityById.get(item.municipality_id) ? ` · ${municipalityById.get(item.municipality_id)}` : ''}`,
    })),
  }
}

export async function getPanelCrewEvents({ query = '', status = '' } = {}) {
  const supabase = await createClient()
  const eventRows = rows(
    await supabase
      .from('events')
      .select('entity_id, event_type, event_date, start_time, time_text, event_status, brotherhood_entity_id, municipality_id')
      .eq('event_category', 'crew_call')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false }),
    'No se pudieron cargar las igualás y ensayos'
  )
  if (!eventRows.length) return []

  let entityQuery = supabase
    .from('entities')
    .select('id, name, slug, summary, status, updated_at')
    .eq('entity_type', 'event')
    .in('id', eventRows.map((item) => item.entity_id))
  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)
  const entities = rows(await entityQuery, 'No se pudieron cargar las convocatorias del Panel')
  if (!entities.length) return []

  const visibleIds = new Set(entities.map((item) => item.id))
  const visibleEvents = eventRows.filter((item) => visibleIds.has(item.entity_id))
  const brotherhoodIds = [...new Set(visibleEvents.map((item) => item.brotherhood_entity_id).filter(Boolean))]
  const municipalityIds = [...new Set(visibleEvents.map((item) => item.municipality_id).filter(Boolean))]
  const [brotherhoods, municipalities] = await Promise.all([
    brotherhoodIds.length
      ? rows(await supabase.from('entities').select('id, name').in('id', brotherhoodIds), 'No se pudieron cargar las Hermandades relacionadas')
      : [],
    municipalityIds.length
      ? rows(await supabase.from('municipalities').select('id, name').in('id', municipalityIds), 'No se pudieron cargar las localidades relacionadas')
      : [],
  ])
  const entityById = new Map(entities.map((item) => [item.id, item]))
  const brotherhoodById = new Map(brotherhoods.map((item) => [item.id, item.name]))
  const municipalityById = new Map(municipalities.map((item) => [item.id, item.name]))

  return visibleEvents.map((event) => ({
    ...entityById.get(event.entity_id),
    event: {
      ...event,
      eventTypeLabel: crewEventTypeLabel(event.event_type),
      brotherhoodName: brotherhoodById.get(event.brotherhood_entity_id) || 'Hermandad por confirmar',
      municipalityName: municipalityById.get(event.municipality_id) || '',
    },
  }))
}

export async function getCrewEventEditorData(id) {
  const supabase = await createClient()
  const [entityResult, eventResult, stepsResult, agentsResult, mediaResult, sourcesResult, options] = await Promise.all([
    supabase.from('entities').select('id, name, slug, summary, status, updated_at').eq('id', id).eq('entity_type', 'event').maybeSingle(),
    supabase.from('events').select('*').eq('entity_id', id).eq('event_category', 'crew_call').maybeSingle(),
    supabase.from('crew_event_steps').select('*').eq('event_entity_id', id).neq('status', 'archived').order('sort_order'),
    supabase.from('crew_event_agents').select('*').eq('event_entity_id', id).neq('status', 'archived').order('sort_order'),
    supabase.from('entity_media').select('id').eq('entity_id', id),
    supabase.from('source_links').select('id, source_id, scope').eq('entity_id', id),
    getCrewEventReferenceOptions(supabase),
  ])
  const entity = row(entityResult, 'No se pudo cargar la convocatoria')
  const event = row(eventResult, 'No se pudo cargar la ficha de la convocatoria')
  if (!entity || !event) return null

  const stepLinks = rows(stepsResult, 'No se pudieron cargar los Pasos vinculados')
  const agentLinks = rows(agentsResult, 'No se pudieron cargar los responsables vinculados')
  const entityIds = [...new Set([
    ...stepLinks.map((item) => item.step_entity_id),
    ...agentLinks.map((item) => item.agent_entity_id),
    event.brotherhood_entity_id,
  ].filter(Boolean))]
  const related = entityIds.length
    ? rows(await supabase.from('entities').select('id, name, slug, status, entity_type').in('id', entityIds), 'No se pudieron cargar las entidades relacionadas')
    : []
  const entityById = new Map(related.map((item) => [item.id, item]))

  return {
    entity,
    event,
    ...options,
    steps: stepLinks.map((item) => ({ ...item, entity: entityById.get(item.step_entity_id) || null })),
    agents: agentLinks.map((item) => ({ ...item, entity: entityById.get(item.agent_entity_id) || null })),
    brotherhood: entityById.get(event.brotherhood_entity_id) || null,
    coverage: {
      steps: stepLinks.length,
      agents: agentLinks.length,
      media: rows(mediaResult, 'No se pudo cargar el multimedia de la convocatoria').length,
      sources: rows(sourcesResult, 'No se pudieron cargar las Fuentes de la convocatoria').length,
    },
  }
}
