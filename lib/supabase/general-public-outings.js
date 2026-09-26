import 'server-only'

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

function dateMeta(value) {
  if (!value) {
    return {
      day: '—',
      month: 'FECHA',
      year: '',
      label: 'Fecha por confirmar',
      weekdayLabel: 'Fecha por confirmar',
      monthKey: 'sin-fecha',
      monthLabel: 'FECHA POR CONFIRMAR',
    }
  }

  const date = new Date(`${value}T12:00:00Z`)
  const format = (options) => new Intl.DateTimeFormat('es-ES', {
    ...options,
    timeZone: 'Europe/Madrid',
  }).format(date)
  const weekday = format({ weekday: 'long', day: 'numeric', month: 'long' })
  const monthLong = format({ month: 'long' })

  return {
    day: format({ day: '2-digit' }),
    month: format({ month: 'short' }).replace('.', '').toUpperCase(),
    year: format({ year: 'numeric' }),
    label: format({ day: 'numeric', month: 'long', year: 'numeric' }),
    weekdayLabel: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`,
    monthKey: value.slice(0, 7),
    monthLabel: `${monthLong} ${format({ year: 'numeric' })}`.toLocaleUpperCase('es'),
  }
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

function entityHref(entity) {
  if (!entity?.slug || entity.status !== 'published' || entity.entity_type !== 'brotherhood') return ''
  return `/hermandades/${entity.slug}`
}

export async function getGeneralPublicOutings({ throwOnError = false } = {}) {
  try {
    const supabase = createPublicClient()
    const rows = assertRows(
      await supabase
        .from('outings')
        .select('id, slug, brotherhood_entity_id, organizer_name, outing_type, character, title, outing_date, return_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, origin_text, destination_text, route_summary, description, public_notes, event_status, status, updated_at, hero_image_path, hero_image_alt, hero_image_credit')
        .eq('status', 'published')
        .in('outing_type', ['Romería', 'Procesión'])
        .order('outing_date', { ascending: true, nullsFirst: false })
        .order('departure_time', { ascending: true, nullsFirst: false }),
      'No se pudieron consultar las salidas públicas generales'
    )

    const brotherhoodIds = [...new Set(rows.map((item) => item.brotherhood_entity_id).filter(Boolean))]
    const explicitMunicipalityIds = [...new Set(rows.map((item) => item.municipality_id).filter(Boolean))]
    const placeIds = [...new Set(rows.flatMap((item) => [item.origin_place_id, item.destination_place_id]).filter(Boolean))]

    const [entities, brotherhoods, places] = await Promise.all([
      brotherhoodIds.length
        ? assertRows(
            await supabase.from('entities').select('id, name, slug, entity_type, status').in('id', brotherhoodIds),
            'No se pudieron consultar las Hermandades de las salidas generales'
          )
        : [],
      brotherhoodIds.length
        ? assertRows(
            await supabase.from('brotherhoods').select('entity_id, municipality_id, crest_path').in('entity_id', brotherhoodIds),
            'No se pudieron consultar los datos de las Hermandades de las salidas generales'
          )
        : [],
      placeIds.length
        ? assertRows(
            await supabase.from('places').select('id, name, municipality_id').in('id', placeIds),
            'No se pudieron consultar los lugares de las salidas generales'
          )
        : [],
    ])

    const brotherhoodById = new Map(brotherhoods.map((item) => [item.entity_id, item]))
    const municipalityIds = [...new Set([
      ...explicitMunicipalityIds,
      ...brotherhoods.map((item) => item.municipality_id),
      ...places.map((item) => item.municipality_id),
    ].filter(Boolean))]
    const municipalities = municipalityIds.length
      ? assertRows(
          await supabase.from('municipalities').select('id, name, slug, province').in('id', municipalityIds),
          'No se pudieron consultar las localidades de las salidas generales'
        )
      : []

    const entityById = new Map(entities.map((item) => [item.id, item]))
    const municipalityById = new Map(municipalities.map((item) => [item.id, item]))
    const placeById = new Map(places.map((item) => [item.id, item]))
    const today = madridDateKey()

    return rows.map((item) => {
      const date = item.outing_date || ''
      const endDate = item.return_date || date
      const dateInfo = dateMeta(date)
      const entity = entityById.get(item.brotherhood_entity_id) || null
      const brotherhood = brotherhoodById.get(item.brotherhood_entity_id) || null
      const origin = placeById.get(item.origin_place_id) || null
      const destination = placeById.get(item.destination_place_id) || null
      const municipalityId = item.municipality_id
        || origin?.municipality_id
        || brotherhood?.municipality_id
        || destination?.municipality_id
        || null
      const municipality = municipalityById.get(municipalityId) || null
      if (municipality?.province && municipality.province !== 'Sevilla') return null

      const isCancelled = item.event_status === 'cancelled'
      const isPast = item.event_status === 'held' || (Boolean(endDate) && endDate < today)
      const isUpcoming = !isCancelled && !isPast && Boolean(date)
      const kind = normalizeText(item.outing_type).includes('romeria') ? 'romery' : 'procession'
      const brotherhoodHref = entityHref(entity)

      return {
        id: item.id,
        slug: item.slug || '',
        kind,
        mode: kind === 'romery' ? 'Romería' : 'Procesión',
        title: item.title || (kind === 'romery' ? 'Romería' : 'Procesión'),
        date,
        returnDate: item.return_date || '',
        year: Number(item.year) || Number(date.slice(0, 4)) || null,
        dateInfo,
        monthKey: dateInfo.monthKey,
        monthLabel: dateInfo.monthLabel,
        departureTime: timeLabel(item.departure_time),
        returnTime: timeLabel(item.return_time),
        municipality: municipality?.name || '',
        municipalitySlug: municipality?.slug || '',
        province: municipality?.province || 'Sevilla',
        scope: normalizeText(municipality?.name) === 'sevilla' ? 'capital' : 'province',
        origin: origin?.name || item.origin_text || '',
        destination: destination?.name || item.destination_text || '',
        routeSummary: item.route_summary || '',
        description: item.description || '',
        publicNotes: item.public_notes || '',
        eventStatus: item.event_status || 'announced',
        updatedAt: item.updated_at || '',
        isUpcoming,
        isPast,
        isCancelled,
        brotherhoodName: entity?.name || item.organizer_name || 'Entidad organizadora',
        brotherhoodHref,
        crestPath: brotherhood?.crest_path || '',
        heroImagePath: item.hero_image_path || '',
        heroImageAlt: item.hero_image_alt || item.title || (kind === 'romery' ? 'Romería' : 'Procesión'),
        heroImageCredit: item.hero_image_credit || '',
        detailHref: brotherhoodHref,
      }
    }).filter(Boolean)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las salidas públicas generales', {
      error: error instanceof Error ? error.message : String(error),
    })
    if (throwOnError) throw error
    return []
  }
}
