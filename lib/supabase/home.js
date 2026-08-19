import 'server-only'

import { cache } from 'react'
import { getCachedPublicData, PUBLIC_CACHE_TAGS } from '@/lib/cache/public-cache'
import { createPublicClient } from '@/lib/supabase/public'

function assertQuery(result, label) {
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

function madridYear(date = new Date()) {
  return Number(new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
  }).format(date))
}

function dateParts(value) {
  if (!value) return { day: '', month: '', year: '', label: '', weekdayLabel: '' }

  const date = new Date(`${value}T12:00:00`)
  const day = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const month = new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    timeZone: 'Europe/Madrid',
  }).format(date).replace('.', '').toUpperCase()
  const year = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const label = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const weekdayRaw = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const dayMonth = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const weekday = `${weekdayRaw.charAt(0).toUpperCase()}${weekdayRaw.slice(1)}`
  const weekdayLabel = `${weekday} ${dayMonth}`

  return { day, month, year, label, weekdayLabel }
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

function stableIndex(key, length) {
  if (!length) return 0
  const hash = [...key].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 7)
  return hash % length
}

function chooseCandidate(items, key, priorityField = 'daily_priority') {
  if (!items.length) return null
  const sorted = [...items].sort((a, b) => (b[priorityField] || 0) - (a[priorityField] || 0))
  const highest = sorted[0]?.[priorityField] || 0
  const top = sorted.filter((item) => (item[priorityField] || 0) === highest)
  return top[stableIndex(key, top.length)] || sorted[0]
}

function entityHref(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function timestamp(value) {
  const parsed = value ? new Date(value).getTime() : 0
  return Number.isFinite(parsed) ? parsed : 0
}

function maxTimestamp(...values) {
  return Math.max(0, ...values.map(timestamp))
}

async function entityById(supabase, id) {
  if (!id) return null
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle()
  if (result.error) throw result.error
  return result.data
}

async function editorialCard(supabase, item, type) {
  if (!item) return null
  const links = assertQuery(
    await supabase
      .from('editorial_content_links')
      .select('entity_id, is_primary')
      .eq('editorial_content_id', item.id)
      .order('is_primary', { ascending: false }),
    `No se pudieron consultar las relaciones del contenido ${type}`
  )
  const related = links[0]?.entity_id ? await entityById(supabase, links[0].entity_id) : null
  return {
    id: item.id,
    type,
    title: item.title,
    summary: item.summary || '',
    href: entityHref(related),
    linkLabel: type === 'fact' ? 'Descubrir →' : 'Seguir el hilo →',
  }
}

async function overrideCard(supabase, override, type) {
  if (!override) return null
  const related = override.entity_id ? await entityById(supabase, override.entity_id) : null
  return {
    id: override.id,
    type,
    title: override.title || related?.name || '',
    summary: override.summary || related?.summary || '',
    href: entityHref(related),
    linkLabel: type === 'ephemeris' ? 'Descubrir la relación →' : type === 'fact' ? 'Descubrir →' : 'Seguir el hilo →',
  }
}

async function marchCard(supabase, marchEntityId) {
  if (!marchEntityId) return null
  const entity = await entityById(supabase, marchEntityId)
  if (!entity) return null

  const marchResult = await supabase
    .from('marches')
    .select('entity_id, composition_year, composition_date_text, youtube_video_id, description')
    .eq('entity_id', marchEntityId)
    .maybeSingle()
  if (marchResult.error) throw marchResult.error
  const march = marchResult.data || {}

  const [authors, dedications, recordings] = await Promise.all([
    supabase.from('march_authors').select('agent_entity_id, author_role').eq('march_entity_id', marchEntityId),
    supabase.from('march_dedications').select('dedicatee_entity_id, dedication_text').eq('march_entity_id', marchEntityId).eq('status', 'published'),
    supabase.from('march_recordings').select('youtube_video_id, external_url, is_featured').eq('march_entity_id', marchEntityId).eq('status', 'published').order('is_featured', { ascending: false }).limit(1),
  ])
  if (authors.error) throw authors.error
  if (dedications.error) throw dedications.error
  if (recordings.error) throw recordings.error

  const composerLink = (authors.data || []).find((item) => item.author_role === 'composer') || authors.data?.[0]
  const composer = composerLink?.agent_entity_id ? await entityById(supabase, composerLink.agent_entity_id) : null
  const dedication = dedications.data?.[0]
  const dedicatee = dedication?.dedicatee_entity_id ? await entityById(supabase, dedication.dedicatee_entity_id) : null
  const recording = recordings.data?.[0]
  const videoId = recording?.youtube_video_id || march.youtube_video_id || ''
  const currentYear = madridYear()
  const compositionYear = Number(march.composition_year) || null
  const anniversary = compositionYear ? currentYear - compositionYear : 0
  const whyToday = anniversary >= 25 && anniversary % 25 === 0
    ? `En ${currentYear} se cumplen ${anniversary} años de su composición.`
    : ''

  return {
    id: entity.id,
    title: entity.name,
    composer: composer?.name || 'Autoría por documentar',
    year: march.composition_year || march.composition_date_text || '',
    dedicatee: dedicatee?.name || dedication?.dedication_text || '',
    videoId,
    listenUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : recording?.external_url || '',
    whyToday,
  }
}

async function loadTodayHomeContent(today) {
  try {
    const supabase = createPublicClient()
    const overrides = assertQuery(
      await supabase
        .from('daily_overrides')
        .select('id, publish_date, content_type, title, summary, entity_id, editorial_content_id, march_entity_id, event_entity_id, sort_order')
        .eq('publish_date', today)
        .eq('status', 'published')
        .order('sort_order'),
      'No se pudieron consultar las excepciones editoriales del día'
    )
    const overrideByType = new Map(overrides.map((item) => [item.content_type, item]))

    let ephemeris = await overrideCard(supabase, overrideByType.get('ephemeris'), 'ephemeris')
    if (!ephemeris) {
      const candidates = assertQuery(
        await supabase.from('today_ephemeris_candidates').select('*'),
        'No se pudieron consultar las efemérides del día'
      )
      const selected = chooseCandidate(candidates, `${today}:ephemeris`, 'event_date')
      if (selected) {
        const eventEntity = await entityById(supabase, selected.entity_id)
        ephemeris = {
          id: selected.entity_id,
          type: 'ephemeris',
          title: selected.title,
          summary: selected.description || selected.event_type || '',
          href: entityHref(eventEntity),
          linkLabel: 'Descubrir la relación →',
        }
      }
    }

    const editorialCandidates = assertQuery(
      await supabase.from('daily_editorial_candidates').select('*'),
      'No se pudieron consultar los contenidos diarios'
    )

    let fact = await overrideCard(supabase, overrideByType.get('fact'), 'fact')
    if (!fact) {
      const factCandidate = chooseCandidate(
        editorialCandidates.filter((item) => item.content_type === 'fact'),
        `${today}:fact`
      )
      fact = await editorialCard(supabase, factCandidate, 'fact')
    }

    let curiosity = await overrideCard(supabase, overrideByType.get('curiosity'), 'curiosity')
    if (!curiosity) {
      const curiosityCandidate = chooseCandidate(
        editorialCandidates.filter((item) => item.content_type === 'curiosity'),
        `${today}:curiosity`
      )
      curiosity = await editorialCard(supabase, curiosityCandidate, 'curiosity')
    }

    let marchEntityId = overrideByType.get('march')?.march_entity_id || null
    if (!marchEntityId) {
      const marchCandidates = assertQuery(
        await supabase.from('daily_march_candidates').select('*'),
        'No se pudieron consultar las marchas del día'
      )
      marchEntityId = chooseCandidate(marchCandidates, `${today}:march`)?.entity_id || null
    }
    const march = await marchCard(supabase, marchEntityId)

    return { ephemeris, fact, curiosity, march }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar Hoy en Hilo Cofrade', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

async function loadHomeDiscoveryThreads(limit = 3) {
  try {
    const supabase = createPublicClient()
    const entities = assertQuery(
      await supabase
        .from('entities')
        .select('id, entity_type, name, slug, updated_at')
        .in('entity_type', ['brotherhood', 'band'])
        .eq('status', 'published'),
      'No se pudieron consultar las entidades para los hilos de portada'
    )

    const brotherhoodEntities = entities.filter((item) => item.entity_type === 'brotherhood' && item.slug)
    const bandEntities = entities.filter((item) => item.entity_type === 'band' && item.slug)
    const brotherhoodIds = brotherhoodEntities.map((item) => item.id)
    const bandIds = bandEntities.map((item) => item.id)

    const [brotherhoodRows, physicalTitulars, conceptualTitulars, releases] = await Promise.all([
      brotherhoodIds.length
        ? supabase.from('brotherhoods').select('entity_id, popular_name').in('entity_id', brotherhoodIds)
        : Promise.resolve({ data: [], error: null }),
      brotherhoodIds.length
        ? supabase.from('brotherhood_images').select('brotherhood_entity_id, image_entity_id, created_at').in('brotherhood_entity_id', brotherhoodIds).eq('relation_type', 'titular').eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      brotherhoodIds.length
        ? supabase.from('entity_relations').select('source_entity_id, target_entity_id, created_at').in('source_entity_id', brotherhoodIds).eq('relation_type', 'has_titular').eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      bandIds.length
        ? supabase.from('band_releases').select('id, band_entity_id, created_at, updated_at').in('band_entity_id', bandIds).eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
    ])

    if (brotherhoodRows.error) throw brotherhoodRows.error
    if (physicalTitulars.error) throw physicalTitulars.error
    if (conceptualTitulars.error) throw conceptualTitulars.error
    if (releases.error) throw releases.error

    const releaseRows = releases.data || []
    const releaseIds = releaseRows.map((item) => item.id)
    const tracks = releaseIds.length
      ? await supabase.from('band_release_tracks').select('id, release_id, created_at').in('release_id', releaseIds)
      : { data: [], error: null }
    if (tracks.error) throw tracks.error

    const popularNameById = new Map((brotherhoodRows.data || []).map((item) => [item.entity_id, item.popular_name]))
    const titularsByBrotherhood = new Map()
    const conceptualCountByBrotherhood = new Map()
    const latestByBrotherhood = new Map()

    for (const relation of physicalTitulars.data || []) {
      if (!titularsByBrotherhood.has(relation.brotherhood_entity_id)) titularsByBrotherhood.set(relation.brotherhood_entity_id, new Set())
      titularsByBrotherhood.get(relation.brotherhood_entity_id).add(relation.image_entity_id)
      latestByBrotherhood.set(
        relation.brotherhood_entity_id,
        Math.max(latestByBrotherhood.get(relation.brotherhood_entity_id) || 0, timestamp(relation.created_at))
      )
    }

    for (const relation of conceptualTitulars.data || []) {
      if (!titularsByBrotherhood.has(relation.source_entity_id)) titularsByBrotherhood.set(relation.source_entity_id, new Set())
      titularsByBrotherhood.get(relation.source_entity_id).add(relation.target_entity_id)
      conceptualCountByBrotherhood.set(relation.source_entity_id, (conceptualCountByBrotherhood.get(relation.source_entity_id) || 0) + 1)
      latestByBrotherhood.set(
        relation.source_entity_id,
        Math.max(latestByBrotherhood.get(relation.source_entity_id) || 0, timestamp(relation.created_at))
      )
    }

    const releaseById = new Map(releaseRows.map((item) => [item.id, item]))
    const releaseCountByBand = new Map()
    const trackCountByBand = new Map()
    const latestByBand = new Map()

    for (const release of releaseRows) {
      releaseCountByBand.set(release.band_entity_id, (releaseCountByBand.get(release.band_entity_id) || 0) + 1)
      latestByBand.set(
        release.band_entity_id,
        Math.max(latestByBand.get(release.band_entity_id) || 0, maxTimestamp(release.created_at, release.updated_at))
      )
    }

    for (const track of tracks.data || []) {
      const release = releaseById.get(track.release_id)
      if (!release) continue
      trackCountByBand.set(release.band_entity_id, (trackCountByBand.get(release.band_entity_id) || 0) + 1)
      latestByBand.set(
        release.band_entity_id,
        Math.max(latestByBand.get(release.band_entity_id) || 0, timestamp(track.created_at))
      )
    }

    const brotherhoodThreads = brotherhoodEntities
      .map((entity) => {
        const titularCount = titularsByBrotherhood.get(entity.id)?.size || 0
        const conceptualCount = conceptualCountByBrotherhood.get(entity.id) || 0
        if (titularCount < 2) return null
        const displayName = popularNameById.get(entity.id) || entity.name
        return {
          id: `brotherhood:${entity.id}`,
          label: 'Hermandad → titularidad',
          title: displayName,
          metric: `${titularCount} titulares relacionados`,
          summary: conceptualCount
            ? 'Imágenes físicas e identidades devocionales conviven en una misma titularidad documentada.'
            : 'Sus titulares publicados están conectados con la Hermandad y preparados para seguir recorriendo relaciones.',
          path: ['Hermandad', 'Titularidad', conceptualCount ? 'Imágenes + devociones' : 'Imágenes'],
          href: `/hermandades/${entity.slug}#titulares`,
          cta: 'Descubrir titulares →',
          latestAt: Math.max(latestByBrotherhood.get(entity.id) || 0, timestamp(entity.updated_at)),
          richness: titularCount,
        }
      })
      .filter(Boolean)

    const bandThreads = bandEntities
      .map((entity) => {
        const releaseCount = releaseCountByBand.get(entity.id) || 0
        const trackCount = trackCountByBand.get(entity.id) || 0
        if (!releaseCount) return null
        return {
          id: `band:${entity.id}`,
          label: 'Banda → discografía',
          title: entity.name,
          metric: `${releaseCount} ${releaseCount === 1 ? 'trabajo' : 'trabajos'} · ${trackCount} ${trackCount === 1 ? 'grabación' : 'grabaciones'}`,
          summary: 'La discografía documentada permite entrar por la Banda y recorrer sus trabajos y grabaciones sin convertir cada pista en una ficha aislada.',
          path: ['Banda', 'Discografía', 'Grabaciones'],
          href: `/bandas/${entity.slug}#discografia`,
          cta: 'Abrir discografía →',
          latestAt: Math.max(latestByBand.get(entity.id) || 0, timestamp(entity.updated_at)),
          richness: releaseCount + trackCount,
        }
      })
      .filter(Boolean)

    return [...brotherhoodThreads, ...bandThreads]
      .sort((a, b) => b.latestAt - a.latestAt || b.richness - a.richness)
      .slice(0, limit)
      .map(({ latestAt, richness, ...thread }) => thread)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar los hilos de descubrimiento de la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

async function loadUpcomingExtraordinaryOutings(limit = 4) {
  try {
    const supabase = createPublicClient()
    const rows = assertQuery(
      await supabase
        .from('upcoming_extraordinary_outings')
        .select('*')
        .limit(limit),
      'No se pudieron consultar las próximas salidas extraordinarias'
    )

    return rows.map((item) => ({
      id: item.id,
      title: item.title || item.outing_type || 'Salida extraordinaria',
      brotherhoodName: item.brotherhood_name || item.organizer_name || 'Entidad organizadora por documentar',
      municipality: item.municipality_name || '',
      date: item.outing_date,
      dateParts: dateParts(item.outing_date),
      departureTime: timeLabel(item.departure_time),
      returnTime: timeLabel(item.return_time),
      reason: item.reason || '',
      origin: item.origin_place_name || '',
      destination: item.destination_place_name || '',
      routeSummary: item.route_summary || '',
      heroImagePath: item.hero_image_path || '',
      heroImageAlt: item.hero_image_alt || item.title || item.outing_type || 'Salida extraordinaria',
      heroImageCredit: item.hero_image_credit || '',
    }))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las extraordinarias de la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

const getTodayHomeContentForDate = cache((today) => getCachedPublicData({
  key: ['home-today', today],
  tags: [
    PUBLIC_CACHE_TAGS.HOME,
    PUBLIC_CACHE_TAGS.BROTHERHOODS,
    PUBLIC_CACHE_TAGS.BANDS,
    PUBLIC_CACHE_TAGS.IMAGES,
    PUBLIC_CACHE_TAGS.STEPS,
    PUBLIC_CACHE_TAGS.OUTINGS,
  ],
  loader: () => loadTodayHomeContent(today),
}))

export function getTodayHomeContent() {
  return getTodayHomeContentForDate(madridDateKey())
}

export const getHomeDiscoveryThreads = cache((limit = 3) => getCachedPublicData({
  key: ['home-discovery-threads', limit],
  tags: [PUBLIC_CACHE_TAGS.HOME, PUBLIC_CACHE_TAGS.BROTHERHOODS, PUBLIC_CACHE_TAGS.BANDS],
  loader: () => loadHomeDiscoveryThreads(limit),
}))

export const getUpcomingExtraordinaryOutings = cache((limit = 4) => getCachedPublicData({
  key: ['home-upcoming-outings', limit],
  tags: [PUBLIC_CACHE_TAGS.HOME, PUBLIC_CACHE_TAGS.OUTINGS, PUBLIC_CACHE_TAGS.BROTHERHOODS],
  loader: () => loadUpcomingExtraordinaryOutings(limit),
}))
