import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'
import { selectAllRows, selectRowsByIds } from '@/lib/supabase/query-all'

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

function isKissingDevotion(value) {
  const text = normalizeText(value)
  return text.includes('besaman') || text.includes('besapi')
}

function devotionLabel(value) {
  return normalizeText(value).includes('besapi') ? 'Besapiés' : 'Besamanos'
}

// Cultos que ya figuran en la Agenda como salida (rosarios, traslados,
// procesiones, vía crucis): no se repiten como culto.
function isOutingLikeCult(value) {
  return /rosario|traslado|procesi|via crucis/.test(normalizeText(value))
}

function cultLabel(value) {
  if (isKissingDevotion(value)) return devotionLabel(value)
  const text = String(value || '').trim()
  return text ? text.charAt(0).toLocaleUpperCase('es') + text.slice(1) : 'Culto'
}

function firstTime(rows = []) {
  const row = rows.find((item) => item.start_time || item.time_text)
  return row?.start_time ? String(row.start_time).slice(0, 5) : row?.time_text || ''
}

// Algunas ediciones importadas guardan solo la fecha («2026-10-17 a 2026-10-18»)
// como descripción: no aporta nada y se ve como un código.
function usefulOverride(value) {
  const text = String(value || '').trim()
  return /^[\d\s:-]+(?:a [\d\s:-]+)?$/.test(text) ? '' : text
}

function publicBrotherhoodHref(entity) {
  return entity?.slug && entity.status === 'published' && entity.entity_type === 'brotherhood'
    ? `/hermandades/${entity.slug}`
    : ''
}

// Por defecto, besamanos y besapiés. Con allCults, también triduos, quinarios,
// funciones, novenas, misas… (los cultos con fecha publicada de cada edición).
export async function getKissingDevotions({ throwOnError = false, allCults = false } = {}) {
  try {
    const supabase = createPublicClient()
    const cults = assertRows(await selectAllRows(() => {
      let cultsQuery = supabase
        .from('cults')
        .select('id, brotherhood_entity_id, image_entity_id, cult_type, title, time_text, place_id, description, status')
        .eq('status', 'published')
      if (!allCults) cultsQuery = cultsQuery.or('cult_type.ilike.%besaman%,cult_type.ilike.%besapi%')
      return cultsQuery
    }), 'No se pudieron consultar los cultos')
      .filter((item) => !allCults || !isOutingLikeCult(item.cult_type))

    if (!cults.length) return []

    // Una lista grande de cult_id convierte el filtro IN en una URL demasiado larga.
    // Se divide en lotes con la utilidad común para evitar respuestas 400 de PostgREST.
    const occurrences = assertRows(
      await selectRowsByIds(
        cults.map((item) => item.id),
        (batch) => supabase
          .from('cult_occurrences')
          .select('id, cult_id, title_override, start_date, end_date, place_id, description_override, event_status, status')
          .in('cult_id', batch)
          .eq('status', 'published')
          .order('start_date', { ascending: true, nullsFirst: false })
      ),
      'No se pudieron consultar las ediciones de besamanos y besapiés'
    ).sort((a, b) => {
      const byDate = String(a.start_date || '9999-12-31').localeCompare(String(b.start_date || '9999-12-31'))
      return byDate || String(a.id || '').localeCompare(String(b.id || ''))
    })

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
        await selectRowsByIds(
          occurrenceIds,
          (batch) => supabase.from('cult_occurrence_days').select('cult_occurrence_id, celebration_date, start_time, time_text, day_number').in('cult_occurrence_id', batch).order('day_number')
        ),
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
      const daySchedules = (daysByOccurrence.get(occurrence.id) || []).map((day) => ({
        celebrationDate: day.celebration_date || '',
        startTime: day.start_time ? String(day.start_time).slice(0, 5) : '',
        timeText: day.time_text || '',
        dayNumber: day.day_number || null,
      }))
      const isCancelled = occurrence.event_status === 'cancelled'
      const isPast = occurrence.event_status === 'held' || (Boolean(finalDate) && finalDate < today)
      const brotherhoodHref = publicBrotherhoodHref(entity)
      return {
        id: occurrence.id,
        title: occurrence.title_override || cult.title || cultLabel(cult.cult_type),
        devotionType: cultLabel(cult.cult_type),
        isKissingDevotion: isKissingDevotion(cult.cult_type),
        date,
        endDate: occurrence.end_date || '',
        timeText: firstTime(daysByOccurrence.get(occurrence.id)) || cult.time_text || '',
        daySchedules,
        municipality: municipality?.name || '',
        province: municipality?.province || '',
        scope: normalizeText(municipality?.name) === 'sevilla' ? 'capital' : 'province',
        place: place?.name || '',
        description: usefulOverride(occurrence.description_override) || cult.description || '',
        eventStatus: occurrence.event_status || 'announced',
        isUpcoming: !isCancelled && !isPast && Boolean(date),
        isPast,
        isCancelled,
        brotherhoodName: entity?.name || '',
        brotherhoodHref,
        crestPath: brotherhood?.crest_path || '',
        detailHref: brotherhoodHref ? `${brotherhoodHref}#cultos` : '',
        // Para el hilo de la Agenda: imagen a la que se dedica el culto.
        cultId: cult.id,
        imageEntityId: cult.image_entity_id || '',
      }
    }).filter(Boolean)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la agenda de besamanos y besapiés', {
      error: error instanceof Error ? error.message : String(error),
    })
    if (throwOnError) throw error
    return []
  }
}
