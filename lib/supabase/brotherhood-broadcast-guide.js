import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

const PUBLISHED = 'published'
const OMITTED_STATUS = new Set(['held', 'cancelled', 'canceled'])
const UNDOCUMENTED_PATTERNS = [
  /pendiente/i,
  /por confirmar/i,
  /por anunciar/i,
  /sin documentar/i,
  /no documentad[oa]/i,
  /por incorporar/i,
]

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function documentedText(value = '') {
  const text = String(value || '').trim()
  if (!text) return ''
  return UNDOCUMENTED_PATTERNS.some((pattern) => pattern.test(text)) ? '' : text
}

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${value.year}-${value.month}-${value.day}`
}

function datePresentation(value) {
  if (!value) return null
  const date = new Date(`${value}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return null

  const long = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
  const month = new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    timeZone: 'UTC',
  }).format(date).replace('.', '').toUpperCase()

  return {
    iso: value,
    long: long.charAt(0).toUpperCase() + long.slice(1),
    day: String(date.getUTCDate()).padStart(2, '0'),
    month,
    year: String(date.getUTCFullYear()),
  }
}

function displayTime(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  const match = /^(\d{2}):(\d{2})/.exec(text)
  return match ? `${match[1]}:${match[2]} h` : text
}

function routeItems(route) {
  if (Array.isArray(route)) {
    return route.map((item) => documentedText(typeof item === 'string' ? item : item?.name || item?.label)).filter(Boolean)
  }
  if (!route || typeof route !== 'object') return []

  const candidate = route.streets || route.items || route.path || route.route || route.recorrido
  return Array.isArray(candidate)
    ? candidate.map((item) => documentedText(typeof item === 'string' ? item : item?.name || item?.label)).filter(Boolean)
    : []
}

function colorValue(row, fallback) {
  return /^#[0-9A-Fa-f]{6}$/.test(row?.hex_value || '') ? row.hex_value : fallback
}

function darkenHex(hex, amount = 0.52) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex || '')) return '#174F67'
  const channels = [1, 3, 5].map((position) => (
    Math.round(Number.parseInt(hex.slice(position, position + 2), 16) * amount)
      .toString(16)
      .padStart(2, '0')
  ))
  return `#${channels.join('')}`
}

function contrastText(hex) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex || '')) return '#FFFFFF'
  const [red, green, blue] = [1, 3, 5].map((position) => Number.parseInt(hex.slice(position, position + 2), 16))
  const brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000
  return brightness > 155 ? '#153B50' : '#FFFFFF'
}

function themeFromRows(rows = []) {
  const primaryRow = rows.find((row) => row.color_role === 'primary') || rows[0]
  const whiteRow = rows.find((row) => normalized(row.color_name) === 'blanco' || row.hex_value?.toUpperCase() === '#FFFFFF')
  const accentRow = rows.find((row) => row.color_role !== 'primary' && row !== whiteRow)
  const primary = colorValue(primaryRow, '#153B69')
  const secondary = colorValue(accentRow, primary)

  return {
    primary,
    secondary,
    light: colorValue(whiteRow, '#FFFFFF'),
    dark: darkenHex(primary),
    onSecondary: contrastText(secondary),
  }
}

function personnelPeriod(item) {
  return documentedText(item.date_from_text)
    || (item.year_from ? `Desde ${item.year_from}` : '')
}

function cueYear(value = '') {
  return String(value || '').match(/\b(1[0-9]{3}|20[0-9]{2})\b/)?.[0] || ''
}

function sortByYear(first, second) {
  return Number(first.year || 9999) - Number(second.year || 9999)
}

export async function getBrotherhoodBroadcastGuideBySlug(slug, { now = new Date() } = {}) {
  if (!slug) return null

  try {
    const supabase = createPublicClient()
    const entity = assertRow(
      await supabase
        .from('entities')
        .select('id, name, slug, summary')
        .eq('entity_type', 'brotherhood')
        .eq('slug', slug)
        .eq('status', PUBLISHED)
        .maybeSingle(),
      'No se pudo consultar la Hermandad de la guía de retransmisión'
    )
    if (!entity) return null

    const today = madridDateKey(now)
    const [brotherhoodResult, colorsResult, outingsResult, stepLinksResult, musicPeriodsResult] = await Promise.all([
      supabase
        .from('brotherhoods')
        .select('official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, current_procession_day')
        .eq('entity_id', entity.id)
        .maybeSingle(),
      supabase
        .from('brotherhood_colors')
        .select('color_name, hex_value, color_role, sort_order')
        .eq('brotherhood_entity_id', entity.id)
        .eq('status', PUBLISHED)
        .order('sort_order'),
      supabase
        .from('outings')
        .select('id, outing_type, character, title, outing_date, departure_time, return_time, origin_place_id, destination_place_id, origin_text, destination_text, route, route_summary, description, public_notes, event_status')
        .eq('brotherhood_entity_id', entity.id)
        .eq('status', PUBLISHED)
        .gte('outing_date', today)
        .order('outing_date', { ascending: true })
        .limit(6),
      supabase
        .from('brotherhood_steps')
        .select('step_entity_id')
        .eq('brotherhood_entity_id', entity.id)
        .eq('status', PUBLISHED),
      supabase
        .from('music_accompaniment_periods')
        .select('id, band_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, notes')
        .eq('brotherhood_entity_id', entity.id)
        .eq('is_current', true)
        .eq('status', PUBLISHED),
    ])

    const brotherhood = assertRow(brotherhoodResult, 'No se pudieron consultar los datos de la Hermandad')
    if (!brotherhood) return null
    const colors = assertRows(colorsResult, 'No se pudieron consultar los colores de la Hermandad')
    const outings = assertRows(outingsResult, 'No se pudieron consultar las próximas salidas')
    const outing = outings.find((item) => !OMITTED_STATUS.has(normalized(item.event_status)))
    if (!outing?.outing_date) return null

    const stepIds = unique(assertRows(stepLinksResult, 'No se pudieron consultar los pasos de la Hermandad').map((item) => item.step_entity_id))
    const musicPeriods = assertRows(musicPeriodsResult, 'No se pudieron consultar los acompañamientos musicales')
    const bandIds = unique(musicPeriods.map((item) => item.band_entity_id))
    const placeIds = unique([
      brotherhood.canonical_see_place_id,
      outing.origin_place_id,
      outing.destination_place_id,
    ])

    const [municipalityResult, placesResult, outingEntitiesResult, stepEntitiesResult, personnelResult, phasesResult, bandEntitiesResult, bandRowsResult] = await Promise.all([
      brotherhood.municipality_id
        ? supabase.from('municipalities').select('id, name, province').eq('id', brotherhood.municipality_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      placeIds.length
        ? supabase.from('places').select('id, name, address').in('id', placeIds)
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from('outing_entities')
        .select('entity_id, role')
        .eq('outing_id', outing.id),
      stepIds.length
        ? supabase.from('entities').select('id, name, slug').in('id', stepIds).eq('entity_type', 'step').eq('status', PUBLISHED)
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase.from('current_step_personnel').select('step_entity_id, agent_entity_id, agent_name, role_name, year_from, date_from_text, notes').in('step_entity_id', stepIds)
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase.from('step_phases').select('id, step_entity_id, phase_name, phase_type, date_from, date_from_text, description').in('step_entity_id', stepIds).eq('status', PUBLISHED)
        : Promise.resolve({ data: [], error: null }),
      bandIds.length
        ? supabase.from('entities').select('id, name, slug').in('id', bandIds).eq('entity_type', 'band').eq('status', PUBLISHED)
        : Promise.resolve({ data: [], error: null }),
      bandIds.length
        ? supabase.from('bands').select('entity_id, band_type').in('entity_id', bandIds)
        : Promise.resolve({ data: [], error: null }),
    ])

    const municipality = assertRow(municipalityResult, 'No se pudo consultar la localidad')
    const places = assertRows(placesResult, 'No se pudieron consultar los lugares de la salida')
    const placeById = new Map(places.map((place) => [place.id, place]))
    const outingEntityLinks = assertRows(outingEntitiesResult, 'No se pudieron consultar los participantes de la salida')
    const processionalImageIds = unique(
      outingEntityLinks
        .filter((item) => item.role === 'processional_image')
        .map((item) => item.entity_id)
    )
    const imageEntities = processionalImageIds.length
      ? assertRows(
          await supabase
            .from('entities')
            .select('id, name, slug')
            .in('id', processionalImageIds)
            .eq('entity_type', 'image')
            .eq('status', PUBLISHED),
          'No se pudieron consultar las imágenes de la salida'
        )
      : []

    const stepEntities = assertRows(stepEntitiesResult, 'No se pudieron consultar los pasos procesionales')
    const stepById = new Map(stepEntities.map((step) => [step.id, step]))
    const personnel = assertRows(personnelResult, 'No se pudieron consultar los responsables de los pasos')
    const crew = stepEntities
      .map((step) => {
        const members = personnel.filter((item) => (
          item.step_entity_id === step.id && normalized(item.role_name).includes('capataz')
        ))
        if (!members.length) return null
        return {
          step: step.name,
          stepSlug: step.slug,
          people: unique(members.map((item) => documentedText(item.agent_name))),
          period: unique(members.map(personnelPeriod)).join(' · '),
        }
      })
      .filter((item) => item?.people.length)

    const bandEntities = assertRows(bandEntitiesResult, 'No se pudieron consultar las bandas')
    const bandRows = assertRows(bandRowsResult, 'No se pudieron consultar los tipos de banda')
    const bandEntityById = new Map(bandEntities.map((item) => [item.id, item]))
    const bandById = new Map(bandRows.map((item) => [item.entity_id, item]))
    const music = musicPeriods
      .map((period) => {
        const bandEntity = bandEntityById.get(period.band_entity_id)
        if (!bandEntity) return null
        return {
          id: period.id,
          name: bandEntity.name,
          slug: bandEntity.slug,
          type: documentedText(bandById.get(period.band_entity_id)?.band_type),
          position: documentedText(period.position),
          outing: documentedText(period.outing_type),
          period: documentedText(period.date_from_text) || (period.year_from ? `Desde ${period.year_from}` : ''),
          step: documentedText(stepById.get(period.step_entity_id)?.name),
        }
      })
      .filter(Boolean)

    const phases = assertRows(phasesResult, 'No se pudieron consultar los hitos de los pasos')
    const cues = []
    const foundation = documentedText(brotherhood.foundation_text)
    if (foundation) {
      cues.push({
        year: cueYear(foundation) || foundation,
        title: 'Fundación de la Hermandad',
        text: `${brotherhood.popular_name || entity.name} conserva una trayectoria documentada desde ${foundation}.`,
      })
    }
    phases.forEach((phase) => {
      const year = cueYear(phase.date_from_text || phase.date_from)
      const title = documentedText(phase.phase_name)
      const text = documentedText(phase.description)
      if (!year || !title) return
      cues.push({ year, title, text })
    })

    const originPlace = placeById.get(outing.origin_place_id)
    const destinationPlace = placeById.get(outing.destination_place_id)
    const route = routeItems(outing.route)
    const date = datePresentation(outing.outing_date)
    if (!date) return null

    return {
      id: outing.id,
      brotherhood: {
        name: brotherhood.popular_name || entity.name,
        officialName: brotherhood.official_name || '',
        slug: entity.slug,
        locality: municipality?.name || '',
        province: municipality?.province || '',
        seat: placeById.get(brotherhood.canonical_see_place_id)?.name || '',
      },
      outing: {
        title: documentedText(outing.title) || documentedText(outing.outing_type),
        type: documentedText(outing.outing_type),
        character: outing.character === 'extraordinary' ? 'Extraordinaria' : 'Ordinaria',
        date,
        departure: displayTime(outing.departure_time),
        return: displayTime(outing.return_time),
        origin: documentedText(outing.origin_text) || documentedText(originPlace?.name),
        destination: documentedText(outing.destination_text) || documentedText(destinationPlace?.name),
        routeSummary: documentedText(outing.route_summary),
        route,
        description: documentedText(outing.public_notes) || documentedText(outing.description),
        status: documentedText(outing.event_status),
        subjects: imageEntities.map((item) => ({ name: item.name, slug: item.slug })),
      },
      crew,
      music,
      cues: cues.sort(sortByYear).slice(0, 5),
      theme: themeFromRows(colors),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo construir la guía de retransmisión', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
