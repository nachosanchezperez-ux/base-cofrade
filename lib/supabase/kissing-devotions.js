import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function assertRows(result, label) {
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

function normalizeText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
}

function devotionLabel(value) {
  return normalizeText(value).includes('besapi') ? 'Besapiés' : 'Besamanos'
}

function firstTime(rows = []) {
  const row = rows.find((item) => item.start_time || item.time_text)
  return row?.start_time ? String(row.start_time).slice(0, 5) : row?.time_text || ''
}

function publicBrotherhoodHref(entity) {
  return entity?.slug && entity.status === 'published' && entity.entity_type === 'brotherhood'
    ? `/hermandades/${entity.slug}`
    : ''
}

export async function getKissingDevotions() {
  try {
    const supabase = createPublicClient()
    const cults = assertRows(
      await supabase
        .from('cults')
        .select('id, brotherhood_entity_id, image_entity_id, cult_type, title, time_text, place_id, description, status')
        .eq('status', 'published')
        .or('cult_type.ilike.%besaman%,cult_type.ilike.%besapi%'),
      'No se pudieron consultar los besamanos y besapiés'
    )

    if (!cults.length) return []

    const occurrences = assertRows(
      await supabase
        .from('cult_occurrences')
        .select('id, cult_id, title_override, start_date, end_date, place_id, description_override, event_status, status')
        .in('cult_id', cults.map((item) => item.id))
        .eq('status', 'published')
        .order('start_date', { ascending: true, nullsFirst: false }),
      'No se pudieron consultar las ediciones de besamanos y besapiés'
    )

    const brotherhoodIds = [...new Set(cults.map((item) => item.brotherhood_entity_id).filter(Boolean))]
    const occurrenceIds = occurrences.map((item) => item.id)
    const placeIds = [...new Set([
      ...cults.map((item) => item.place_id),
      ...occurrences.map((item) => item.place_id),
    ].filter(Boolean))]

    const [entities, brotherhoods, places, days] = await Promise.all([
      brotherhoodIds.length ? assertRows(
        await supabase.from('entities').select('id, name, slug, entity_type, status').in('id', brotherhoodIds),
        'No se pudieron consultar las Hermandades de los besamanos'
      ) : [],
      brotherhoodIds.length ? assertRows(
        await supabase.from('brotherhoods').select('entity_id, municipality_id, crest_path').in('entity_id', brotherhoodIds),
        'No se pudieron consultar las sedes de los besamanos'
      ) : [],
      placeIds.length ? assertRows(
        await supabase.from('places').select('id, name, municipality_id').in('id', placeIds),
        'No se pudieron consultar los lugares de los besamanos'
      ) : [],
      occurrenceIds.length ? assertRows(
        await supabase.from('cult_occurrence_days').select('cult_occurrence_id, celebration_date, start_time, time_text, day_number').in('cult_occurrence_id', occurrenceIds).order('day_number'),
        'No se pudieron consultar los horarios de los besamanos'
      ) : [],
    ])

    const municipalityIds = [...new Set([
      ...brotherhoods.map((item) => item.municipality_id),
      ...places.map((item) => item.municipality_id),
    ].filter(Boolean))]
    const municipalities = municipalityIds.length ? assertRows(
      await supabase.from('municipalities').select('id, name, province').in('id', municipalityIds),
      'No se pudieron consultar las localidades de los besamanos'
    ) : []

    const cultById = new Map(cults.map((item) => [item.id, item]))
    const entityById = new Map(entities.map((item) => [item.id, item]))
    const brotherhoodById = new Map(brotherhoods.map((item) => [item.entity_id, item]))
    const placeById = new Map(places.map((item) => [item.id, item]))
    const municipalityById = new Map(municipalities.map((item) => [item.id, item]))
    const daysByOccurrence = new Map()
    for (const day of days) {
      const current = daysByOccurrence.get(day.cult_occurrence_id) || []
      current.push(day)
      daysByOccurrence.set(day.cult_occurrence_id, current)
    }

    const today = madridDateKey()
    return occurrences.map((occurrence) => {
      const cult = cultById.get(occurrence.cult_id)
      if (!cult) return null
      const entity = entityById.get(cult.brotherhood_entity_id) || null
      const brotherhood = brotherhoodById.get(cult.brotherhood_entity_id) || null
      const place = placeById.get(occurrence.place_id || cult.place_id) || null
      const municipality = municipalityById.get(place?.municipality_id || brotherhood?.municipality_id) || null
      if (municipality?.province !== 'Sevilla') return null

      const date = occurrence.start_date || ''
      const finalDate = occurrence.end_date || date
      const isCancelled = occurrence.event_status === 'cancelled'
      const isPast = occurrence.event_status === 'held' || (Boolean(finalDate) && finalDate < today)
      const brotherhoodHref = publicBrotherhoodHref(entity)
      return {
        id: occurrence.id,
        title: occurrence.title_override || cult.title || devotionLabel(cult.cult_type),
        devotionType: devotionLabel(cult.cult_type),
        date,
        endDate: occurrence.end_date || '',
        timeText: firstTime(daysByOccurrence.get(occurrence.id)) || cult.time_text || '',
        municipality: municipality?.name || '',
        province: municipality?.province || '',
        scope: normalizeText(municipality?.name) === 'sevilla' ? 'capital' : 'province',
        place: place?.name || '',
        description: occurrence.description_override || cult.description || '',
        eventStatus: occurrence.event_status || 'announced',
        isUpcoming: !isCancelled && !isPast && Boolean(date),
        isPast,
        isCancelled,
        brotherhoodName: entity?.name || 'Hermandad organizadora',
        brotherhoodHref,
        crestPath: brotherhood?.crest_path || '',
        detailHref: brotherhoodHref ? `${brotherhoodHref}#cultos` : '',
      }
    }).filter(Boolean)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la agenda de besamanos y besapiés', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
