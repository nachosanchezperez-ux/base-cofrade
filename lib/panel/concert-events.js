import 'server-only'

import { concertEventTypeLabel } from '@/lib/concert-events'
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

export async function getConcertEventReferenceOptions(supabaseClient = null) {
  const supabase = supabaseClient || await createClient()
  const [bandsResult, bandMetaResult, brotherhoodsResult, municipalitiesResult, placesResult] = await Promise.all([
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'band').neq('status', 'archived').order('name'),
    supabase.from('bands').select('entity_id, band_type, municipality_id'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'brotherhood').neq('status', 'archived').order('name'),
    supabase.from('municipalities').select('id, name, province').eq('province', 'Sevilla').order('name'),
    supabase.from('places').select('id, name, municipality_id, place_type').order('name'),
  ])
  const bands = rows(bandsResult, 'No se pudieron cargar las Bandas')
  const bandMeta = rows(bandMetaResult, 'No se pudieron cargar los datos de las Bandas')
  const brotherhoods = rows(brotherhoodsResult, 'No se pudieron cargar las Hermandades')
  const municipalities = rows(municipalitiesResult, 'No se pudieron cargar las localidades')
  const places = rows(placesResult, 'No se pudieron cargar los lugares')
  const bandMetaById = new Map(bandMeta.map((item) => [item.entity_id, item]))
  const municipalityById = new Map(municipalities.map((item) => [item.id, item.name]))

  return {
    bandOptions: bands.map((item) => {
      const meta = bandMetaById.get(item.id) || {}
      const labels = [meta.band_type, municipalityById.get(meta.municipality_id), item.status === 'published' ? 'Publicada' : 'Borrador'].filter(Boolean)
      return option(item, labels.join(' · '))
    }),
    brotherhoodOptions: brotherhoods.map((item) => option(item, item.status === 'published' ? 'Publicada' : 'Borrador')),
    municipalities,
    places: places.map((item) => ({
      ...item,
      label: `${item.name}${municipalityById.get(item.municipality_id) ? ` · ${municipalityById.get(item.municipality_id)}` : ''}`,
    })),
  }
}

export async function getPanelConcertEvents({ query = '', status = '' } = {}) {
  const supabase = await createClient()
  const eventRows = rows(
    await supabase
      .from('events')
      .select('entity_id, event_type, event_date, start_time, time_text, event_status, brotherhood_entity_id, municipality_id')
      .eq('event_category', 'concert')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false }),
    'No se pudieron cargar los conciertos'
  )
  if (!eventRows.length) return []

  let entityQuery = supabase
    .from('entities')
    .select('id, name, slug, summary, status, updated_at')
    .eq('entity_type', 'event')
    .in('id', eventRows.map((item) => item.entity_id))
  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)
  const entities = rows(await entityQuery, 'No se pudieron cargar los conciertos del Panel')
  if (!entities.length) return []

  const visibleIds = new Set(entities.map((item) => item.id))
  const visibleEvents = eventRows.filter((item) => visibleIds.has(item.entity_id))
  const links = rows(
    await supabase
      .from('concert_event_bands')
      .select('id, event_entity_id, band_entity_id, is_primary, sort_order, status')
      .in('event_entity_id', visibleEvents.map((item) => item.entity_id))
      .neq('status', 'archived')
      .order('sort_order'),
    'No se pudieron cargar las Bandas de los conciertos'
  )
  const bandIds = [...new Set(links.map((item) => item.band_entity_id).filter(Boolean))]
  const municipalityIds = [...new Set(visibleEvents.map((item) => item.municipality_id).filter(Boolean))]
  const [bands, municipalities] = await Promise.all([
    bandIds.length ? rows(await supabase.from('entities').select('id, name').in('id', bandIds), 'No se pudieron cargar las Bandas relacionadas') : [],
    municipalityIds.length ? rows(await supabase.from('municipalities').select('id, name').in('id', municipalityIds), 'No se pudieron cargar las localidades relacionadas') : [],
  ])
  const entityById = new Map(entities.map((item) => [item.id, item]))
  const bandById = new Map(bands.map((item) => [item.id, item.name]))
  const municipalityById = new Map(municipalities.map((item) => [item.id, item.name]))

  return visibleEvents.map((event) => {
    const eventBands = links
      .filter((item) => item.event_entity_id === event.entity_id)
      .map((item) => ({ ...item, name: bandById.get(item.band_entity_id) || 'Banda no disponible' }))
    return {
      ...entityById.get(event.entity_id),
      event: {
        ...event,
        eventTypeLabel: concertEventTypeLabel(event.event_type),
        municipalityName: municipalityById.get(event.municipality_id) || '',
        bands: eventBands,
      },
    }
  })
}

export async function getConcertEventEditorData(id) {
  const supabase = await createClient()
  const [entityResult, eventResult, bandsResult, mediaResult, sourcesResult, options] = await Promise.all([
    supabase.from('entities').select('id, name, slug, summary, status, updated_at').eq('id', id).eq('entity_type', 'event').maybeSingle(),
    supabase.from('events').select('*').eq('entity_id', id).eq('event_category', 'concert').maybeSingle(),
    supabase.from('concert_event_bands').select('*').eq('event_entity_id', id).neq('status', 'archived').order('sort_order'),
    supabase.from('entity_media').select('id').eq('entity_id', id),
    supabase.from('source_links').select('id, source_id, scope').eq('entity_id', id),
    getConcertEventReferenceOptions(supabase),
  ])
  const entity = row(entityResult, 'No se pudo cargar el concierto')
  const event = row(eventResult, 'No se pudo cargar la ficha del concierto')
  if (!entity || !event) return null

  const bandLinks = rows(bandsResult, 'No se pudieron cargar las Bandas vinculadas')
  const ids = [...new Set([
    ...bandLinks.map((item) => item.band_entity_id),
    event.brotherhood_entity_id,
  ].filter(Boolean))]
  const related = ids.length
    ? rows(await supabase.from('entities').select('id, name, slug, status, entity_type').in('id', ids), 'No se pudieron cargar las entidades relacionadas')
    : []
  const entityById = new Map(related.map((item) => [item.id, item]))

  return {
    entity,
    event,
    ...options,
    bands: bandLinks.map((item) => ({ ...item, entity: entityById.get(item.band_entity_id) || null })),
    brotherhood: entityById.get(event.brotherhood_entity_id) || null,
    coverage: {
      bands: bandLinks.length,
      media: rows(mediaResult, 'No se pudo cargar el multimedia del concierto').length,
      sources: rows(sourcesResult, 'No se pudieron cargar las Fuentes del concierto').length,
    },
  }
}
