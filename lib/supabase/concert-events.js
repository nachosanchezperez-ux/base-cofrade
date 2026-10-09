import 'server-only'

import { concertEventTimeLabel, concertEventTypeLabel } from '@/lib/concert-events'
import { createPublicClient } from '@/lib/supabase/public'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

function publicHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'march') return `/marchas/${entity.slug}`
  return ''
}

export async function getConcertEventDirectory({ throwOnError = false } = {}) {
  try {
    const supabase = createPublicClient()
    const today = madridDateKey()
    const events = rows(
      await supabase
        .from('events')
        .select('entity_id, event_type, event_date, brotherhood_entity_id, municipality_id, place_id, start_time, end_time, time_text, event_status, location_text, public_notes, description, updated_at')
        .eq('event_category', 'concert')
        .order('event_date', { ascending: true })
        .order('start_time', { ascending: true, nullsFirst: false }),
      'No se pudieron consultar los conciertos'
    )
    if (!events.length) return []

    const eventIds = events.map((item) => item.entity_id)
    const bandLinks = rows(
      await supabase
        .from('concert_event_bands')
        .select('id, event_entity_id, band_entity_id, role_name, is_primary, sort_order, notes, status')
        .in('event_entity_id', eventIds)
        .eq('status', 'published')
        .order('sort_order'),
      'No se pudieron consultar las bandas de los conciertos'
    )
    const programs = rows(
      await supabase
        .from('concert_programs')
        .select('id, event_entity_id, band_entity_id, source_id, title, program_kind, notes, status, created_at, updated_at')
        .in('event_entity_id', eventIds)
        .eq('status', 'published')
        .order('created_at'),
      'No se pudieron consultar los programas de los conciertos'
    )
    const programIds = programs.map((item) => item.id)
    const programEntries = programIds.length
      ? rows(
          await supabase
            .from('concert_program_entries')
            .select('id, concert_program_id, march_entity_id, display_title, author_text, performance_order, premiere_label, notes')
            .in('concert_program_id', programIds)
            .order('performance_order'),
          'No se pudieron consultar las obras de los programas de concierto'
        )
      : []

    const bandIds = [...new Set([
      ...bandLinks.map((item) => item.band_entity_id),
      ...programs.map((item) => item.band_entity_id),
    ].filter(Boolean))]
    const brotherhoodIds = [...new Set(events.map((item) => item.brotherhood_entity_id).filter(Boolean))]
    const marchIds = [...new Set(programEntries.map((item) => item.march_entity_id).filter(Boolean))]
    const relatedIds = [...new Set([...eventIds, ...bandIds, ...brotherhoodIds, ...marchIds])]

    const [entities, bandRows, brotherhoodRows, places] = await Promise.all([
      rows(
        await supabase
          .from('entities')
          .select('id, entity_type, name, slug, summary, status, updated_at')
          .in('id', relatedIds),
        'No se pudieron consultar las entidades de los conciertos'
      ),
      bandIds.length
        ? rows(
            await supabase
              .from('bands')
              .select('entity_id, band_type, municipality_id, logo_path, primary_color, secondary_color')
              .in('entity_id', bandIds),
            'No se pudieron consultar las bandas de los conciertos'
          )
        : [],
      brotherhoodIds.length
        ? rows(
            await supabase
              .from('brotherhoods')
              .select('entity_id, popular_name, municipality_id, crest_path')
              .in('entity_id', brotherhoodIds),
            'No se pudieron consultar las Hermandades de los conciertos'
          )
        : [],
      rows(await supabase.from('places').select('id, name, municipality_id'), 'No se pudieron consultar los lugares de los conciertos'),
    ])

    const municipalityIds = [...new Set([
      ...events.map((item) => item.municipality_id),
      ...bandRows.map((item) => item.municipality_id),
      ...brotherhoodRows.map((item) => item.municipality_id),
      ...places.map((item) => item.municipality_id),
    ].filter(Boolean))]
    const municipalities = municipalityIds.length
      ? rows(
          await supabase
            .from('municipalities')
            .select('id, name, province')
            .in('id', municipalityIds),
          'No se pudieron consultar las localidades de los conciertos'
        )
      : []

    const entityById = new Map(entities.map((item) => [item.id, item]))
    const bandById = new Map(bandRows.map((item) => [item.entity_id, item]))
    const brotherhoodById = new Map(brotherhoodRows.map((item) => [item.entity_id, item]))
    const placeById = new Map(places.map((item) => [item.id, item]))
    const municipalityById = new Map(municipalities.map((item) => [item.id, item]))
    const programsByEvent = new Map()

    for (const program of programs) {
      const bandEntity = entityById.get(program.band_entity_id) || null
      const entries = programEntries
        .filter((item) => item.concert_program_id === program.id)
        .map((entry) => {
          const march = entityById.get(entry.march_entity_id) || null
          return {
            id: entry.id,
            order: entry.performance_order,
            title: entry.display_title,
            author: entry.author_text || '',
            premiereLabel: entry.premiere_label || '',
            notes: entry.notes || '',
            marchEntityId: march?.id || '',
            href: march?.entity_type === 'march' ? publicHref(march) : '',
          }
        })

      const normalized = {
        id: program.id,
        title: program.title || 'Programa musical',
        programKind: program.program_kind || 'announced',
        bandEntityId: program.band_entity_id,
        bandName: bandEntity?.name || '',
        bandHref: publicHref(bandEntity),
        notes: program.notes || '',
        entries,
      }

      const eventPrograms = programsByEvent.get(program.event_entity_id) || []
      eventPrograms.push(normalized)
      programsByEvent.set(program.event_entity_id, eventPrograms)
    }

    return events.map((event) => {
      const entity = entityById.get(event.entity_id)
      if (!entity?.slug) return null
      const place = placeById.get(event.place_id) || null
      const brotherhoodEntity = entityById.get(event.brotherhood_entity_id) || null
      const brotherhood = brotherhoodById.get(event.brotherhood_entity_id) || null
      const links = bandLinks.filter((item) => item.event_entity_id === event.entity_id)
      const bands = links.map((link) => {
        const bandEntity = entityById.get(link.band_entity_id)
        if (!bandEntity) return null
        const band = bandById.get(link.band_entity_id) || {}
        return {
          id: link.band_entity_id,
          name: bandEntity.name,
          slug: bandEntity.slug || '',
          href: publicHref(bandEntity),
          bandType: band.band_type || '',
          logoPath: band.logo_path || '',
          roleName: link.role_name || '',
          isPrimary: Boolean(link.is_primary),
          notes: link.notes || '',
          municipalityId: band.municipality_id || '',
        }
      }).filter(Boolean)
      if (!bands.length) return null

      const primaryBand = bands.find((band) => band.isPrimary) || bands[0]
      const municipalityId = event.municipality_id || place?.municipality_id || brotherhood?.municipality_id || primaryBand?.municipalityId
      const municipality = municipalityById.get(municipalityId) || null
      if (municipality?.province !== 'Sevilla') return null

      const date = event.event_date || ''
      const isCancelled = event.event_status === 'cancelled'
      const isHeld = event.event_status === 'held'
      const isPast = isHeld || (Boolean(date) && date < today)
      const isUpcoming = Boolean(date) && date >= today && !isHeld

      return {
        id: event.entity_id,
        slug: entity.slug,
        title: entity.name,
        summary: entity.summary || event.description || '',
        description: event.description || '',
        publicNotes: event.public_notes || '',
        eventType: event.event_type,
        eventTypeLabel: concertEventTypeLabel(event.event_type),
        date,
        startTime: concertEventTimeLabel(event.start_time),
        endTime: concertEventTimeLabel(event.end_time),
        timeText: event.time_text || '',
        eventStatus: event.event_status || 'announced',
        isUpcoming,
        isPast,
        isHeld,
        isCancelled,
        isPostponed: event.event_status === 'postponed',
        municipalityId,
        municipality: municipality?.name || '',
        province: municipality?.province || '',
        placeName: event.location_text || place?.name || '',
        bands,
        primaryBand,
        programs: programsByEvent.get(event.entity_id) || [],
        brotherhoodName: brotherhood?.popular_name || brotherhoodEntity?.name || '',
        brotherhoodHref: publicHref(brotherhoodEntity),
        imagePath: primaryBand?.logoPath || '',
        updatedAt: event.updated_at || entity.updated_at || '',
      }
    }).filter(Boolean)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la agenda de conciertos', {
      error: error instanceof Error ? error.message : String(error),
    })
    if (throwOnError) throw error
    return []
  }
}
