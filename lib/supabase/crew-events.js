import 'server-only'

import { crewEventTimeLabel, crewEventTypeLabel } from '@/lib/crew-events'
import { createPublicClient } from '@/lib/supabase/public'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

function dateParts(value) {
  if (!value) return { day: '', month: '', year: '', label: '', weekdayLabel: '' }
  const date = new Date(`${value}T12:00:00`)
  const format = (options) => new Intl.DateTimeFormat('es-ES', {
    ...options,
    timeZone: 'Europe/Madrid',
  }).format(date)
  const weekday = format({ weekday: 'long', day: 'numeric', month: 'long' })
  return {
    day: format({ day: '2-digit' }),
    month: format({ month: 'short' }).replace('.', '').toUpperCase(),
    year: format({ year: 'numeric' }),
    label: format({ day: 'numeric', month: 'long', year: 'numeric' }),
    weekdayLabel: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`,
  }
}

function monthMeta(value) {
  if (!value) return { key: 'sin-fecha', label: 'SIN FECHA' }
  const date = new Date(`${value}T12:00:00`)
  const label = new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
  return { key: value.slice(0, 7), label: label.toLocaleUpperCase('es') }
}

function urgencyLabel(date, today) {
  if (!date || date < today) return ''
  const start = Date.parse(`${today}T12:00:00Z`)
  const end = Date.parse(`${date}T12:00:00Z`)
  const days = Math.round((end - start) / 86400000)
  if (days === 0) return 'HOY'
  if (days === 1) return 'MAÑANA'
  if (days > 1 && days <= 31) return `EN ${days} DÍAS`
  return 'PRÓXIMA'
}

function publicHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  return ''
}

async function loadDirectoryRows(supabase) {
  return assertRows(
    await supabase
      .from('events')
      .select('entity_id, event_type, event_date, brotherhood_entity_id, municipality_id, place_id, start_time, end_time, time_text, event_status, location_text, requirements, public_notes, description, updated_at')
      .eq('event_category', 'crew_call')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false }),
    'No se pudieron consultar las igualás y ensayos'
  )
}

export async function getCrewEventDirectory() {
  try {
    const supabase = createPublicClient()
    const today = madridDateKey()
    const events = await loadDirectoryRows(supabase)
    if (!events.length) return []

    const eventIds = events.map((item) => item.entity_id)
    const brotherhoodIds = [...new Set(events.map((item) => item.brotherhood_entity_id).filter(Boolean))]
    const stepLinks = assertRows(
      await supabase
        .from('crew_event_steps')
        .select('id, event_entity_id, step_entity_id, is_primary, sort_order, notes')
        .in('event_entity_id', eventIds)
        .order('sort_order'),
      'No se pudieron consultar los Pasos de las convocatorias'
    )
    const agentLinks = assertRows(
      await supabase
        .from('crew_event_agents')
        .select('id, event_entity_id, agent_entity_id, role_name, is_primary, sort_order, notes')
        .in('event_entity_id', eventIds)
        .order('sort_order'),
      'No se pudieron consultar los capataces de las convocatorias'
    )
    const relatedIds = [...new Set([
      ...eventIds,
      ...brotherhoodIds,
      ...stepLinks.map((item) => item.step_entity_id),
      ...agentLinks.map((item) => item.agent_entity_id),
    ].filter(Boolean))]

    const [entities, brotherhoodRows, places] = await Promise.all([
      assertRows(
        await supabase
          .from('entities')
          .select('id, entity_type, name, slug, summary, status, updated_at')
          .in('id', relatedIds),
        'No se pudieron consultar las entidades de las convocatorias'
      ),
      brotherhoodIds.length
        ? assertRows(
            await supabase
              .from('brotherhoods')
              .select('entity_id, popular_name, municipality_id, crest_path')
              .in('entity_id', brotherhoodIds),
            'No se pudieron consultar las Hermandades de las convocatorias'
          )
        : [],
      assertRows(
        await supabase.from('places').select('id, name, municipality_id'),
        'No se pudieron consultar los lugares de las convocatorias'
      ),
    ])

    const municipalityIds = [...new Set([
      ...events.map((item) => item.municipality_id),
      ...brotherhoodRows.map((item) => item.municipality_id),
      ...places.map((item) => item.municipality_id),
    ].filter(Boolean))]
    const municipalities = municipalityIds.length
      ? assertRows(
          await supabase
            .from('municipalities')
            .select('id, name, province')
            .in('id', municipalityIds),
          'No se pudieron consultar las localidades de las convocatorias'
        )
      : []

    const entityById = new Map(entities.map((item) => [item.id, item]))
    const brotherhoodById = new Map(brotherhoodRows.map((item) => [item.entity_id, item]))
    const placeById = new Map(places.map((item) => [item.id, item]))
    const municipalityById = new Map(municipalities.map((item) => [item.id, item]))

    return events
      .map((event) => {
        const entity = entityById.get(event.entity_id)
        const brotherhoodEntity = entityById.get(event.brotherhood_entity_id)
        const brotherhood = brotherhoodById.get(event.brotherhood_entity_id) || {}
        const place = placeById.get(event.place_id) || null
        const municipalityId = event.municipality_id || place?.municipality_id || brotherhood.municipality_id
        const municipality = municipalityById.get(municipalityId) || null
        const steps = stepLinks
          .filter((item) => item.event_entity_id === event.entity_id)
          .map((item) => ({ ...item, entity: entityById.get(item.step_entity_id) || null }))
          .filter((item) => item.entity)
        const agents = agentLinks
          .filter((item) => item.event_entity_id === event.entity_id)
          .map((item) => ({ ...item, entity: entityById.get(item.agent_entity_id) || null }))
          .filter((item) => item.entity)
        const date = event.event_date || ''
        const month = monthMeta(date)
        const isPast = Boolean(date) && date < today
        const isHeld = event.event_status === 'held'
        const isCancelled = event.event_status === 'cancelled'
        const isUpcoming = !isPast

        if (!entity?.slug || municipality?.province !== 'Sevilla') return null

        return {
          id: event.entity_id,
          slug: entity.slug,
          detailHref: `/igualas-y-ensayos/${entity.slug}`,
          title: entity.name,
          summary: entity.summary || '',
          updatedAt: event.updated_at || entity.updated_at || '',
          eventType: event.event_type,
          eventTypeLabel: crewEventTypeLabel(event.event_type),
          date,
          dateParts: dateParts(date),
          monthKey: month.key,
          monthLabel: month.label,
          year: Number(date.slice(0, 4)) || null,
          startTime: crewEventTimeLabel(event.start_time),
          endTime: crewEventTimeLabel(event.end_time),
          timeText: event.time_text || '',
          eventStatus: event.event_status || 'announced',
          urgencyLabel: isUpcoming ? urgencyLabel(date, today) : '',
          isUpcoming,
          isPast,
          isHeld,
          isCancelled,
          isPostponed: event.event_status === 'postponed',
          brotherhoodId: event.brotherhood_entity_id,
          brotherhoodName: brotherhood.popular_name || brotherhoodEntity?.name || 'Hermandad por confirmar',
          brotherhoodHref: publicHref(brotherhoodEntity),
          crestPath: brotherhood.crest_path || '',
          municipalityId,
          municipality: municipality?.name || '',
          province: municipality?.province || '',
          placeName: place?.name || '',
          locationText: event.location_text || '',
          location: event.location_text || place?.name || '',
          requirements: event.requirements || '',
          publicNotes: event.public_notes || '',
          description: event.description || '',
          steps: steps.map((item) => ({
            id: item.step_entity_id,
            name: item.entity.name,
            href: publicHref(item.entity),
            isPrimary: item.is_primary,
            notes: item.notes || '',
          })),
          agents: agents.map((item) => ({
            id: item.agent_entity_id,
            name: item.entity.name,
            roleName: item.role_name || 'Capataz',
            isPrimary: item.is_primary,
            notes: item.notes || '',
          })),
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el calendario de igualás y ensayos', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

export async function getCrewEventDetail(slug) {
  if (!slug) return null
  const directory = await getCrewEventDirectory()
  const item = directory.find((event) => event.slug === slug) || null
  if (!item) return null

  try {
    const supabase = createPublicClient()
    const links = assertRows(
      await supabase
        .from('source_links')
        .select('id, source_id, scope, notes')
        .eq('entity_id', item.id),
      'No se pudieron consultar las Fuentes de la convocatoria'
    )
    const sourceIds = [...new Set(links.map((link) => link.source_id).filter(Boolean))]
    const sources = sourceIds.length
      ? assertRows(
          await supabase
            .from('sources')
            .select('id, name, url, source_type, author_or_publisher, publication_date, accessed_at')
            .in('id', sourceIds)
            .order('name'),
          'No se pudieron consultar las Fuentes documentales de la convocatoria'
        )
      : []
    const linkBySource = new Map(links.map((link) => [link.source_id, link]))
    return {
      ...item,
      sources: sources.map((source) => ({ ...source, link: linkBySource.get(source.id) || null })),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron completar las Fuentes de la convocatoria', {
      error: error instanceof Error ? error.message : String(error),
    })
    return { ...item, sources: [] }
  }
}
