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

function option(entity, label = '') {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug || '',
    meta: [label, entity.status].filter(Boolean).join(' · '),
  }
}

export async function getPanelMarches({ query = '', status = '', musicType = '' } = {}) {
  const supabase = await createClient()
  let entityQuery = supabase
    .from('entities')
    .select('id, name, slug, summary, status, updated_at')
    .eq('entity_type', 'march')
    .order('name')

  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)

  const entities = rows(await entityQuery, 'No se pudieron cargar las Marchas')
  if (!entities.length) return []
  const ids = entities.map((item) => item.id)

  let marchQuery = supabase
    .from('marches')
    .select('entity_id, composition_year, composition_date_text, music_type, premiere_date, premiere_date_text, eligible_for_daily, daily_priority')
    .in('entity_id', ids)
  if (musicType) marchQuery = marchQuery.eq('music_type', musicType)
  const marchRows = rows(await marchQuery, 'No se pudieron cargar las fichas musicales')
  const allowedIds = new Set(marchRows.map((item) => item.entity_id))
  const filteredEntities = musicType ? entities.filter((item) => allowedIds.has(item.id)) : entities
  if (!filteredEntities.length) return []

  const authorRows = rows(
    await supabase
      .from('march_authors')
      .select('march_entity_id, agent_entity_id, author_role, status')
      .in('march_entity_id', filteredEntities.map((item) => item.id))
      .neq('status', 'archived'),
    'No se pudieron cargar las autorías de las Marchas'
  )
  const agentIds = [...new Set(authorRows.map((item) => item.agent_entity_id).filter(Boolean))]
  const agents = agentIds.length
    ? rows(await supabase.from('entities').select('id, name').in('id', agentIds), 'No se pudieron cargar los autores de las Marchas')
    : []
  const agentById = new Map(agents.map((agent) => [agent.id, agent.name]))
  const marchById = new Map(marchRows.map((march) => [march.entity_id, march]))

  return filteredEntities.map((entity) => {
    const march = marchById.get(entity.id) || {}
    const composers = authorRows
      .filter((author) => author.march_entity_id === entity.id && author.author_role === 'composer')
      .map((author) => agentById.get(author.agent_entity_id))
      .filter(Boolean)
    return {
      ...entity,
      march,
      composers,
    }
  })
}

export async function getMarchEditorData(marchId) {
  const supabase = await createClient()
  const [
    entityResult,
    marchResult,
    authorsResult,
    dedicationsResult,
    recordingsResult,
    agentsResult,
    bandsResult,
    dedicateesResult,
    placesResult,
    mediaResult,
    directSourcesResult,
  ] = await Promise.all([
    supabase.from('entities').select('id, name, slug, summary, status, updated_at').eq('id', marchId).eq('entity_type', 'march').maybeSingle(),
    supabase.from('marches').select('*').eq('entity_id', marchId).maybeSingle(),
    supabase.from('march_authors').select('*').eq('march_entity_id', marchId).neq('status', 'archived').order('author_role'),
    supabase.from('march_dedications').select('*').eq('march_entity_id', marchId).neq('status', 'archived').order('created_at'),
    supabase.from('march_recordings').select('*').eq('march_entity_id', marchId).neq('status', 'archived').order('is_featured', { ascending: false }).order('recording_year', { ascending: false, nullsFirst: false }),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'agent').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'band').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, entity_type, name, slug, status').in('entity_type', ['brotherhood', 'image']).neq('status', 'archived').order('name'),
    supabase.from('places').select('id, name, municipality_id, place_type').order('name'),
    supabase.from('entity_media').select('id, relation_type, is_cover').eq('entity_id', marchId),
    supabase.from('source_links').select('id, source_id, scope').eq('entity_id', marchId),
  ])

  const entity = row(entityResult, 'No se pudo cargar la Marcha')
  const march = row(marchResult, 'No se pudo cargar la ficha musical')
  if (!entity || !march) return null

  const authors = rows(authorsResult, 'No se pudieron cargar las autorías')
  const dedications = rows(dedicationsResult, 'No se pudieron cargar las dedicatorias')
  const recordings = rows(recordingsResult, 'No se pudieron cargar las grabaciones')
  const agents = rows(agentsResult, 'No se pudieron cargar las Personas')
  const bands = rows(bandsResult, 'No se pudieron cargar las Bandas')
  const dedicatees = rows(dedicateesResult, 'No se pudieron cargar las entidades dedicatarias')
  const agentById = new Map(agents.map((agent) => [agent.id, agent]))
  const bandById = new Map(bands.map((band) => [band.id, band]))
  const dedicateeById = new Map(dedicatees.map((item) => [item.id, item]))

  const [authorSources, dedicationSources, recordingSources] = await Promise.all([
    loadRelationSourceSupport(supabase, authors, 'march_author'),
    loadRelationSourceSupport(supabase, dedications, 'march_dedication'),
    loadRelationSourceSupport(supabase, recordings, 'march_recording'),
  ])

  const directSourceLinks = rows(directSourcesResult, 'No se pudieron cargar las Fuentes directas')
    .filter((link) => !String(link.scope || '').startsWith('relation:'))
  const directSourceIds = [...new Set(directSourceLinks.map((link) => link.source_id).filter(Boolean))]
  const directSources = directSourceIds.length
    ? rows(await supabase.from('sources').select('id, name, url, source_type').in('id', directSourceIds).order('name'), 'No se pudieron cargar las Fuentes directas')
    : []

  return {
    entity,
    march,
    authors: authorSources.relations.map((author) => ({ ...author, agent: agentById.get(author.agent_entity_id) || null })),
    dedications: dedicationSources.relations.map((dedication) => ({ ...dedication, dedicatee: dedicateeById.get(dedication.dedicatee_entity_id) || null })),
    recordings: recordingSources.relations.map((recording) => ({ ...recording, band: recording.band_entity_id ? bandById.get(recording.band_entity_id) || null : null })),
    agentOptions: agents.map((agent) => option(agent, 'Persona / Agente')),
    bandOptions: bands.map((band) => option(band, 'Banda')),
    dedicateeOptions: dedicatees.map((item) => option(item, item.entity_type === 'brotherhood' ? 'Hermandad' : 'Imagen')),
    places: rows(placesResult, 'No se pudieron cargar los lugares'),
    sourceOptions: authorSources.sourceOptions,
    directSources,
    coverage: {
      authors: authors.length,
      dedications: dedications.length,
      recordings: recordings.length,
      media: rows(mediaResult, 'No se pudo cargar el multimedia').length,
      sources: directSources.length,
    },
  }
}
