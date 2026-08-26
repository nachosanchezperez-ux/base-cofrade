import 'server-only'

import { createClient } from '@/lib/supabase/server'

const EDITORIAL_TYPES = new Set(['fact', 'curiosity'])
const OVERRIDE_TYPES = new Set(['ephemeris', 'fact', 'curiosity', 'march'])
const DISCOVERY_KINDS = new Set([
  'musical_heritage', 'posters', 'band_brotherhoods', 'step_personnel', 'titularity',
  'brotherhood_steps', 'discography', 'image_authorship', 'step_phases',
  'heritage_interventions', 'heritage_updates',
])

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const get = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

function stableIndex(key, length) {
  if (!length) return 0
  const hash = [...key].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 7)
  return hash % length
}

function chooseCandidate(items, key, priorityField = 'daily_priority') {
  if (!items.length) return null
  const sorted = [...items].sort((a, b) => (Number(b[priorityField]) || 0) - (Number(a[priorityField]) || 0))
  const highest = Number(sorted[0]?.[priorityField]) || 0
  const top = sorted.filter((item) => (Number(item[priorityField]) || 0) === highest)
  return top[stableIndex(key, top.length)] || sorted[0]
}

function entityOption(entity, label = '') {
  return { id: entity.id, name: entity.name, slug: entity.slug || '', meta: [label || entity.entity_type, entity.status].filter(Boolean).join(' · ') }
}

function panelHref(entity) {
  if (!entity?.id) return ''
  if (entity.entity_type === 'brotherhood') return `/panel/hermandades/${entity.id}`
  if (entity.entity_type === 'image') return `/panel/imagenes/${entity.id}`
  if (entity.entity_type === 'step') return `/panel/pasos/${entity.id}`
  if (entity.entity_type === 'band') return `/panel/bandas/${entity.id}`
  if (entity.entity_type === 'agent') return `/panel/agentes/${entity.id}`
  if (entity.entity_type === 'event') return `/panel/acontecimientos/${entity.id}`
  if (entity.entity_type === 'march') return `/panel/marchas/${entity.id}`
  return ''
}

function preferredOverride(items, type) {
  const matches = items.filter((item) => item.content_type === type)
  return matches.find((item) => item.status !== 'archived') || matches[0] || null
}

function editorialRoot(item) {
  return item?.links?.find((link) => link.is_primary)?.entity || item?.links?.[0]?.entity || null
}

function chooseDiscovery(items, date, blockedRoots) {
  const candidates = items
    .filter((item) => DISCOVERY_KINDS.has(item.activity_kind))
    .filter((item) => !blockedRoots.has(item.root_entity_id))
    .filter((item) => item.root_slug)
    .sort((a, b) => {
      const priority = (Number(b.priority) || 0) - (Number(a.priority) || 0)
      if (priority) return priority
      return `${a.root_name}:${a.activity_kind}`.localeCompare(`${b.root_name}:${b.activity_kind}`, 'es')
    })
    .slice(0, 24)
  return candidates.length ? candidates[stableIndex(`${date}:discovery`, candidates.length)] : null
}

async function resolveEventRoot(supabase, eventId, entityById) {
  if (!eventId) return null
  const relations = rows(
    await supabase.from('entity_relations').select('target_entity_id').eq('source_entity_id', eventId).eq('relation_type', 'involves').eq('status', 'published'),
    'No se pudo resolver la entidad principal de la efeméride'
  )
  const weight = { brotherhood: 0, image: 1, step: 2, band: 3 }
  return relations
    .map((item) => entityById.get(item.target_entity_id))
    .filter((entity) => entity && ['brotherhood', 'image', 'step', 'band'].includes(entity.entity_type) && entity.status === 'published')
    .sort((a, b) => (weight[a.entity_type] ?? 9) - (weight[b.entity_type] ?? 9))[0] || null
}

export async function getHomeEditorialPanelData({ date = '' } = {}) {
  const supabase = await createClient()
  const selectedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : madridDateKey()
  const isToday = selectedDate === madridDateKey()
  const [
    overridesResult,
    editorialResult,
    entitiesResult,
    eventsResult,
    marchesResult,
    editorialCandidatesResult,
    marchCandidatesResult,
    discoveryResult,
    todayEphemerisResult,
  ] = await Promise.all([
    supabase.from('daily_overrides').select('*').eq('publish_date', selectedDate).order('sort_order'),
    supabase.from('editorial_content').select('*').in('content_type', [...EDITORIAL_TYPES]).neq('status', 'archived').order('updated_at', { ascending: false }),
    supabase.from('entities').select('id, entity_type, name, slug, summary, status').in('entity_type', ['brotherhood', 'image', 'step', 'band', 'agent', 'heritage_asset']).neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, entity_type, name, slug, summary, status').eq('entity_type', 'event').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, entity_type, name, slug, summary, status').eq('entity_type', 'march').neq('status', 'archived').order('name'),
    supabase.from('daily_editorial_candidates').select('*'),
    supabase.from('daily_march_candidates').select('*'),
    supabase.from('home_knowledge_threads').select('thread_key, root_entity_id, root_type, root_name, root_slug, activity_kind, relation_count, secondary_count, priority'),
    isToday ? supabase.from('today_ephemeris_candidates').select('*') : Promise.resolve({ data: [], error: null }),
  ])

  const overrides = rows(overridesResult, 'No se pudo cargar la programación manual de la Home')
  const editorial = rows(editorialResult, 'No se pudieron cargar los contenidos editoriales')
  const entities = rows(entitiesResult, 'No se pudieron cargar las entidades relacionables')
  const events = rows(eventsResult, 'No se pudieron cargar los Acontecimientos')
  const marches = rows(marchesResult, 'No se pudieron cargar las Marchas')
  const editorialCandidates = rows(editorialCandidatesResult, 'No se pudieron cargar los candidatos editoriales')
  const marchCandidates = rows(marchCandidatesResult, 'No se pudieron cargar las Marchas candidatas')
  const discoveryRows = rows(discoveryResult, 'No se pudieron cargar los hilos de descubrimiento')
  const todayEphemeris = rows(todayEphemerisResult, 'No se pudieron cargar las efemérides candidatas')

  const editorialIds = editorial.map((item) => item.id)
  const links = editorialIds.length
    ? rows(
        await supabase.from('editorial_content_links').select('*').in('editorial_content_id', editorialIds).order('is_primary', { ascending: false }),
        'No se pudieron cargar las relaciones editoriales'
      )
    : []
  const eventRows = events.length
    ? rows(await supabase.from('events').select('entity_id, event_type, event_date, event_date_text, description').in('entity_id', events.map((item) => item.id)), 'No se pudieron cargar las fechas de los Acontecimientos')
    : []

  const entityById = new Map([...entities, ...events, ...marches].map((entity) => [entity.id, entity]))
  const hydratedEditorial = editorial.map((item) => ({
    ...item,
    links: links
      .filter((link) => link.editorial_content_id === item.id)
      .map((link) => ({ ...link, entity: entityById.get(link.entity_id) || null }))
      .filter((link) => link.entity),
  }))
  const editorialById = new Map(hydratedEditorial.map((item) => [item.id, item]))

  const overrideByType = new Map([...OVERRIDE_TYPES].map((type) => [type, preferredOverride(overrides, type)]))
  const editorialOverrides = overrides.filter((item) => EDITORIAL_TYPES.has(item.content_type))
  const editorialOverride = editorialOverrides.find((item) => item.status === 'published')
    || editorialOverrides.find((item) => item.status !== 'archived')
    || editorialOverrides[0]
    || null

  const ephemerisOverride = overrides.find((item) => item.content_type === 'ephemeris' && item.status === 'published') || null
  let ephemerisCandidate = null
  if (!ephemerisOverride) {
    if (isToday) {
      ephemerisCandidate = todayEphemeris[stableIndex(`${selectedDate}:ephemeris`, todayEphemeris.length)] || null
    } else {
      const monthDay = selectedDate.slice(5)
      const eventById = new Map(events.map((item) => [item.id, item]))
      const candidates = eventRows
        .filter((item) => item.event_date && item.event_date.slice(5) === monthDay && eventById.get(item.entity_id)?.status === 'published')
        .map((item) => ({
          entity_id: item.entity_id,
          title: eventById.get(item.entity_id)?.name || '',
          description: item.description || '',
          event_type: item.event_type || '',
        }))
        .sort((a, b) => `${a.title}:${a.entity_id}`.localeCompare(`${b.title}:${b.entity_id}`, 'es'))
      ephemerisCandidate = candidates[stableIndex(`${selectedDate}:ephemeris`, candidates.length)] || null
    }
  }
  const ephemerisEventId = ephemerisOverride?.event_entity_id || ephemerisCandidate?.entity_id || null
  const ephemerisEvent = entityById.get(ephemerisEventId) || null
  const ephemerisRoot = await resolveEventRoot(supabase, ephemerisEventId, entityById)

  const publishedEditorialOverride = editorialOverrides.find((item) => item.status === 'published') || null
  let effectiveEditorialItem = null
  let editorialTitle = ''
  let editorialType = ''
  let editorialRootEntity = null
  if (publishedEditorialOverride) {
    effectiveEditorialItem = publishedEditorialOverride.editorial_content_id ? editorialById.get(publishedEditorialOverride.editorial_content_id) || null : null
    editorialType = effectiveEditorialItem?.content_type || publishedEditorialOverride.content_type
    editorialTitle = effectiveEditorialItem?.title || publishedEditorialOverride.title || entityById.get(publishedEditorialOverride.entity_id)?.name || ''
    editorialRootEntity = effectiveEditorialItem ? editorialRoot(effectiveEditorialItem) : entityById.get(publishedEditorialOverride.entity_id) || null
  } else {
    const candidate = chooseCandidate(editorialCandidates, `${selectedDate}:editorial`)
    effectiveEditorialItem = candidate?.id ? editorialById.get(candidate.id) || null : null
    editorialType = effectiveEditorialItem?.content_type || candidate?.content_type || ''
    editorialTitle = effectiveEditorialItem?.title || candidate?.title || ''
    editorialRootEntity = effectiveEditorialItem ? editorialRoot(effectiveEditorialItem) : entityById.get(candidate?.entity_id) || null
  }

  const blockedRoots = new Set([ephemerisRoot?.id, editorialRootEntity?.id].filter(Boolean))
  const discovery = chooseDiscovery(discoveryRows, selectedDate, blockedRoots)
  const discoveryEntity = discovery ? entityById.get(discovery.root_entity_id) || { id: discovery.root_entity_id, entity_type: discovery.root_type } : null

  const marchOverride = overrides.find((item) => item.content_type === 'march' && item.status === 'published') || null
  const automaticMarch = marchOverride ? null : chooseCandidate(marchCandidates, `${selectedDate}:march`)
  const marchId = marchOverride?.march_entity_id || automaticMarch?.entity_id || null
  const marchEntity = entityById.get(marchId) || null

  const effective = {
    ephemeris: {
      mode: ephemerisOverride ? 'manual' : 'automatic',
      title: ephemerisOverride?.title || ephemerisCandidate?.title || ephemerisEvent?.name || 'Sin efeméride candidata',
      detail: ephemerisOverride ? 'Override publicado' : ephemerisCandidate ? 'Selección automática por fecha' : 'Sin candidato publicado',
      editHref: ephemerisEvent ? `/panel/acontecimientos/${ephemerisEvent.id}` : '',
      rootEntityId: ephemerisRoot?.id || '',
    },
    editorial: {
      mode: publishedEditorialOverride ? 'manual' : 'automatic',
      title: editorialTitle || 'Sin contenido editorial candidato',
      detail: editorialType === 'fact' ? 'Dato Cofrade' : editorialType === 'curiosity' ? 'Curiosidad' : 'Sin candidato publicado',
      editHref: effectiveEditorialItem ? `/panel/hoy/banco?content=${effectiveEditorialItem.id}&fecha=${selectedDate}` : panelHref(editorialRootEntity),
      rootEntityId: editorialRootEntity?.id || '',
    },
    discovery: {
      mode: 'automatic',
      title: discovery?.root_name || 'Sin hilo candidato',
      detail: discovery?.activity_kind ? `Hilo automático · ${discovery.activity_kind}` : 'Sin candidato publicado',
      editHref: panelHref(discoveryEntity),
      rootEntityId: discovery?.root_entity_id || '',
    },
    march: {
      mode: marchOverride ? 'manual' : 'automatic',
      title: marchEntity?.name || automaticMarch?.name || 'Sin Marcha candidata',
      detail: marchOverride ? 'Override publicado' : marchId ? 'Selección automática por prioridad' : 'Sin candidata publicada',
      editHref: marchEntity ? `/panel/marchas/${marchEntity.id}` : '',
      rootEntityId: marchEntity?.id || '',
    },
  }

  return {
    selectedDate,
    overrideTypes: [...OVERRIDE_TYPES],
    overrides,
    overrideByType,
    editorialOverride,
    editorialOverrideConflict: editorialOverrides.filter((item) => item.status !== 'archived').length > 1,
    editorial: hydratedEditorial,
    editorialOptions: hydratedEditorial
      .filter((item) => item.status === 'published')
      .map((item) => ({ id: item.id, name: item.title, meta: `${item.content_type === 'fact' ? 'Dato Cofrade' : 'Curiosidad'} · publicado` })),
    entityOptions: entities.map((entity) => entityOption(entity)),
    eventOptions: events.map((event) => entityOption(event, 'Acontecimiento')),
    marchOptions: marches.map((march) => entityOption(march, 'Marcha')),
    effective,
    metrics: {
      publishedOverrides: overrides.filter((item) => item.status === 'published').length,
      editorialTotal: hydratedEditorial.length,
      editorialEligible: hydratedEditorial.filter((item) => item.status === 'published' && item.eligible_for_daily).length,
      editorialPublished: hydratedEditorial.filter((item) => item.status === 'published').length,
    },
  }
}
