import 'server-only'

import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import {
  PROGRAMME_BROTHERHOOD_SLUGS,
  PROGRAMME_CONFIG_VERSION,
  accentColor,
  bandSegment,
  isSilentStep,
  orderBandsBySegment,
  PROGRAMME_DAYS,
  REFERENCE_YEAR,
  brotherhoodInSentence,
  dayPositions,
  isHolyWeekStep,
  orderSteps,
  positionMove,
  routeLegs,
  routePoints,
  shortTime,
  sortDayItems,
  stepTitle,
} from '@/lib/holy-week-programme'

// Programa de mano: una carga para toda la semana (unas 75 hermandades) en
// consultas por lotes, sin N+1. Si una consulta secundaria falla, la página se
// pinta con lo que haya (orden y escudos), nunca con datos inventados.

const OUTING_FROM = `${REFERENCE_YEAR}-03-27`
const OUTING_TO = `${REFERENCE_YEAR}-04-05`
const NON_HOLY_WEEK_MUSIC = /(gloria|rosario|eucarist|romer|corpus|triunfal|extraordinari)/

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function soft(result) {
  return result?.error ? [] : (result?.data || [])
}

function normalized(value = '') {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function isCruzDeGuia(position = '') {
  return normalized(position).includes('cruz de guia')
}

async function loadProgramme() {
  const supabase = createPublicClient()

  const entities = rows(await supabase
    .from('entities')
    .select('id, slug, name')
    .eq('status', 'published')
    .in('slug', PROGRAMME_BROTHERHOOD_SLUGS), 'Programa 2027: hermandades')
  const ids = entities.map((entity) => entity.id)
  if (!ids.length) return { days: [], generatedAt: new Date().toISOString() }

  const [brotherhoodsResult, colorsResult, stepLinksResult, musicResult, outingsResult] = await Promise.all([
    supabase.from('brotherhoods').select('entity_id, popular_name, crest_path, canonical_see_place_id').in('entity_id', ids),
    supabase.from('published_brotherhood_colors').select('brotherhood_entity_id, hex_value, color_role, sort_order').in('brotherhood_entity_id', ids).order('sort_order'),
    supabase.from('brotherhood_steps').select('brotherhood_entity_id, step_entity_id, date_to').eq('status', 'published').in('brotherhood_entity_id', ids),
    supabase.from('music_accompaniment_periods').select('brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, public_step_name').eq('is_current', true).eq('status', 'published').in('brotherhood_entity_id', ids),
    supabase.from('outings').select('brotherhood_entity_id, outing_date, departure_time, return_time, origin_text, origin_place_id, route_summary').eq('status', 'published').gte('outing_date', OUTING_FROM).lte('outing_date', OUTING_TO).in('brotherhood_entity_id', ids).order('outing_date'),
  ])

  const brotherhoods = rows(brotherhoodsResult, 'Programa 2027: fichas')
  const colors = soft(colorsResult)
  const stepLinks = soft(stepLinksResult).filter((link) => !link.date_to)
  const music = soft(musicResult).filter((period) => !NON_HOLY_WEEK_MUSIC.test(normalized(period.outing_type)))
  const outings = soft(outingsResult)

  // Pasos que la ficha muestra a través de su acompañamiento musical aunque el
  // paso aún no esté publicado (p. ej. el palio de Santa Cruz): entran en el
  // cortejo con su nombre, sin enlace.
  const stepIds = [...new Set([
    ...stepLinks.map((link) => link.step_entity_id),
    ...music.map((period) => period.step_entity_id).filter(Boolean),
  ])]
  const bandIds = [...new Set(music.map((period) => period.band_entity_id).filter(Boolean))]
  const placeIds = [...new Set([
    ...outings.map((outing) => outing.origin_place_id),
    ...brotherhoods.map((brotherhood) => brotherhood.canonical_see_place_id),
  ].filter(Boolean))]

  const [stepEntitiesResult, stepsResult, bandEntitiesResult, bandsResult, placesResult] = await Promise.all([
    stepIds.length ? supabase.from('entities').select('id, slug, name, status').in('id', stepIds) : { data: [] },
    stepIds.length ? supabase.from('steps').select('entity_id, step_type').in('entity_id', stepIds) : { data: [] },
    bandIds.length ? supabase.from('entities').select('id, slug, name').eq('status', 'published').in('id', bandIds) : { data: [] },
    bandIds.length ? supabase.from('bands').select('entity_id, logo_path, logo_background_color').in('entity_id', bandIds) : { data: [] },
    placeIds.length ? supabase.from('places').select('id, name').in('id', placeIds) : { data: [] },
  ])

  const stepEntityById = new Map(soft(stepEntitiesResult).map((step) => [step.id, step]))
  const stepTypeById = new Map(soft(stepsResult).map((step) => [step.entity_id, step.step_type]))
  const bandEntityById = new Map(soft(bandEntitiesResult).map((band) => [band.id, band]))
  const bandById = new Map(soft(bandsResult).map((band) => [band.entity_id, band]))
  const placeById = new Map(soft(placesResult).map((place) => [place.id, place.name]))
  const brotherhoodById = new Map(brotherhoods.map((brotherhood) => [brotherhood.entity_id, brotherhood]))
  const entityBySlug = new Map(entities.map((entity) => [entity.slug, entity]))

  function bandOf(period) {
    const entity = bandEntityById.get(period.band_entity_id)
    if (!entity) return null
    const band = bandById.get(period.band_entity_id) || {}
    return {
      slug: entity.slug,
      name: entity.name,
      href: `/bandas/${entity.slug}`,
      logoPath: band.logo_path || '',
      logoBackground: band.logo_background_color || '',
    }
  }

  function cortejoFor(entity, entry) {
    const periods = music.filter((period) => period.brotherhood_entity_id === entity.id)
    const linkedIds = stepLinks
      .filter((link) => link.brotherhood_entity_id === entity.id)
      .map((link) => link.step_entity_id)
      .filter((id) => stepEntityById.get(id)?.status === 'published')
    const fromMusic = periods.map((period) => period.step_entity_id).filter(Boolean)
    const steps = [...new Set([...linkedIds, ...fromMusic])]
      .map((id) => {
        const step = stepEntityById.get(id)
        if (step) return { id: step.id, slug: step.slug, name: step.name, published: step.status === 'published', type: stepTypeById.get(step.id) || '' }
        // Paso en borrador (la lectura pública no lo ve): basta su nombre público.
        const name = periods.find((period) => period.step_entity_id === id && period.public_step_name)?.public_step_name
        return name ? { id, slug: id, name, published: false, type: '' } : null
      })
      .filter((step) => step && isHolyWeekStep(step.type))
      .filter((step) => !entry.steps || entry.steps.includes(step.slug))
      .filter((step) => !entry.withoutSteps || !entry.withoutSteps.includes(step.slug))

    const bandsOf = (filter) => {
      const seen = new Set()
      return periods.filter(filter).map(bandOf).filter((band) => {
        if (!band || seen.has(band.slug)) return false
        seen.add(band.slug)
        return true
      })
    }

    const items = orderSteps(steps, entity.slug).map((step) => ({
      key: step.slug,
      title: stepTitle(step.name),
      href: step.published ? `/pasos/${step.slug}` : '',
      silent: isSilentStep(entity.slug, step.slug),
      bands: orderBandsBySegment(bandsOf((period) => period.step_entity_id === step.id)
        .map((band) => ({ ...band, segment: bandSegment(entity.slug, band.slug) }))),
    }))

    // La Cruz de Guía solo se muestra si consta su banda, y nunca en un
    // cortejo parcial (la Borriquita no lleva la del Amor).
    const crossBands = entry.steps ? [] : bandsOf((period) => !period.step_entity_id && isCruzDeGuia(period.position))
    if (crossBands.length) items.unshift({ key: 'cruz-de-guia', title: 'Cruz de Guía', href: '', bands: crossBands })
    return items
  }

  const days = PROGRAMME_DAYS.map((day) => {
    const items = day.entries.map((entry) => {
      const entity = entityBySlug.get(entry.slug)
      if (!entity) return null
      const brotherhood = brotherhoodById.get(entity.id) || {}
      const palette = colors.filter((color) => color.brotherhood_entity_id === entity.id).map((color) => color.hex_value).filter(Boolean)
      const outing = entry.dropOuting ? null : outings.find((item) => item.brotherhood_entity_id === entity.id) || null
      const departure = entry.times?.[0] || shortTime(outing?.departure_time)
      const arrival = entry.times?.[1] || shortTime(outing?.return_time)
      const origin = outing?.origin_text || placeById.get(outing?.origin_place_id) || placeById.get(brotherhood.canonical_see_place_id) || ''
      const name = entry.label || brotherhood.popular_name || entity.name

      return {
        entry,
        key: entry.key || entry.slug,
        slug: entity.slug,
        name,
        officialName: entity.name,
        parentName: entry.label ? (brotherhood.popular_name || entity.name) : '',
        sentenceName: entry.label ? `la ${entry.label.replace(/^La /, '')}` : brotherhoodInSentence(brotherhood.popular_name || entity.name, entity.name),
        href: `/hermandades/${entity.slug}`,
        crestPath: brotherhood.crest_path || '',
        color: palette[0] ? accentColor(palette[0]) : '',
        departure,
        arrival,
        timesSource: entry.times ? 'consejo' : (outing ? 'hilo' : ''),
        origin,
        legs: routeLegs(routePoints(outing?.route_summary)),
        cortejo: cortejoFor(entity, entry),
      }
    }).filter(Boolean)

    const sorted = sortDayItems(day, items)
    const positions = dayPositions(day, sorted)
    return {
      id: day.id,
      short: day.short,
      name: day.name,
      date: day.date,
      dateLabel: day.dateLabel || '',
      kind: day.kind,
      status: day.status,
      order: day.order,
      note: day.note || '',
      items: sorted.map(({ entry, ...item }, index) => ({
        ...item,
        position: positions[index],
        move: positionMove(day, entry, positions[index]),
      })),
    }
  })

  return { days, generatedAt: new Date().toISOString() }
}

export const getHolyWeekProgramme = unstable_cache(
  loadProgramme,
  ['semana-santa-sevilla-2027-programme', PROGRAMME_CONFIG_VERSION],
  { revalidate: 900, tags: ['public-holy-week-programme', 'public-brotherhood-detail'] },
)
