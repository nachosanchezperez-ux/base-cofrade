import 'server-only'

import { createClient } from '@/lib/supabase/server'

const NAVIGABLE_TYPES = ['brotherhood', 'image', 'step', 'band']
const DISCOVERY_KINDS = new Set([
  'musical_heritage',
  'posters',
  'band_brotherhoods',
  'step_personnel',
  'titularity',
  'brotherhood_steps',
  'discography',
  'image_authorship',
  'step_phases',
  'heritage_interventions',
  'heritage_updates',
])

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

function entityHref(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function rootHref(row, anchor = '') {
  if (!row?.root_slug) return ''
  let base = ''
  if (row.root_type === 'brotherhood') base = `/hermandades/${row.root_slug}`
  if (row.root_type === 'image') base = `/imagenes/${row.root_slug}`
  if (row.root_type === 'step') base = `/pasos/${row.root_slug}`
  if (row.root_type === 'band') base = `/bandas/${row.root_slug}`
  return base ? `${base}${anchor}` : ''
}

function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`
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

async function eventPrimaryEntity(supabase, eventEntityId) {
  if (!eventEntityId) return null

  const relations = assertQuery(
    await supabase
      .from('entity_relations')
      .select('target_entity_id, relation_type')
      .eq('source_entity_id', eventEntityId)
      .eq('status', 'published')
      .eq('relation_type', 'involves'),
    'No se pudieron consultar las relaciones de la efeméride'
  )
  const ids = [...new Set(relations.map((item) => item.target_entity_id).filter(Boolean))]
  if (!ids.length) return null

  const entities = assertQuery(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, summary')
      .in('id', ids)
      .in('entity_type', NAVIGABLE_TYPES)
      .eq('status', 'published'),
    'No se pudieron consultar las entidades de la efeméride'
  )

  const weight = { brotherhood: 0, image: 1, step: 2, band: 3 }
  return [...entities].sort((a, b) => (weight[a.entity_type] ?? 9) - (weight[b.entity_type] ?? 9))[0] || null
}

async function editorialCard(supabase, item, typeOverride = '') {
  if (!item) return null

  const type = typeOverride || item.content_type || 'curiosity'
  const links = assertQuery(
    await supabase
      .from('editorial_content_links')
      .select('entity_id, is_primary')
      .eq('editorial_content_id', item.id)
      .order('is_primary', { ascending: false }),
    'No se pudieron consultar las relaciones del contenido diario'
  )
  const related = links[0]?.entity_id ? await entityById(supabase, links[0].entity_id) : null

  return {
    id: item.id,
    kind: 'editorial',
    icon: type === 'fact' ? 'DC' : 'CU',
    label: type === 'fact' ? 'Dato Cofrade' : 'Curiosidad',
    title: item.title,
    summary: item.summary || '',
    href: entityHref(related),
    linkLabel: type === 'fact' ? 'Descubrir →' : 'Seguir el hilo →',
    rootEntityId: related?.id || '',
  }
}

async function editorialOverrideCard(supabase, override) {
  if (!override) return null
  const related = override.entity_id ? await entityById(supabase, override.entity_id) : null
  const type = override.content_type === 'fact' ? 'fact' : 'curiosity'
  return {
    id: override.id,
    kind: 'editorial',
    icon: type === 'fact' ? 'DC' : 'CU',
    label: type === 'fact' ? 'Dato Cofrade' : 'Curiosidad',
    title: override.title || related?.name || '',
    summary: override.summary || related?.summary || '',
    href: entityHref(related),
    linkLabel: type === 'fact' ? 'Descubrir →' : 'Seguir el hilo →',
    rootEntityId: related?.id || '',
  }
}

async function ephemerisCard(supabase, candidate, override = null) {
  const eventEntityId = override?.event_entity_id || candidate?.entity_id || null
  if (!eventEntityId && !override?.entity_id) return null

  const directRelated = override?.entity_id ? await entityById(supabase, override.entity_id) : null
  const related = directRelated || await eventPrimaryEntity(supabase, eventEntityId)

  return {
    id: override?.id || eventEntityId,
    kind: 'ephemeris',
    icon: 'EF',
    label: 'Efeméride',
    title: override?.title || candidate?.title || '',
    summary: override?.summary || candidate?.description || candidate?.event_type || '',
    href: entityHref(related),
    linkLabel: 'Descubrir la relación →',
    rootEntityId: related?.id || '',
  }
}

function discoveryCardFromRow(row) {
  if (!row) return null
  const count = Number(row.relation_count) || 0
  const secondary = Number(row.secondary_count) || 0
  const base = {
    id: `daily:${row.thread_key}`,
    kind: 'discovery',
    icon: 'HI',
    label: 'Hilo para descubrir',
    title: row.root_name,
    rootEntityId: row.root_entity_id,
  }

  if (row.activity_kind === 'musical_heritage') {
    return {
      ...base,
      kicker: 'Hermandad → patrimonio musical',
      summary: count && secondary
        ? `${count + secondary} composiciones documentadas permiten recorrer marchas, piezas, autores y grabaciones desde la Hermandad.`
        : 'Su patrimonio musical conecta repertorio, autorías y grabaciones dentro de una misma ficha.',
      href: rootHref(row, '#musica'),
      linkLabel: 'Seguir este hilo →',
    }
  }

  if (row.activity_kind === 'posters') {
    return {
      ...base,
      kicker: 'Hermandad → cartelería → autores',
      summary: `${plural(count, 'cartel', 'carteles')} forman una puerta de entrada a su memoria gráfica y a las autorías documentadas.`,
      href: rootHref(row, '#carteles'),
      linkLabel: 'Recorrer la cartelería →',
    }
  }

  if (row.activity_kind === 'band_brotherhoods') {
    return {
      ...base,
      kicker: 'Banda → hermandades → relaciones',
      summary: `La ficha conecta la formación con ${plural(count, 'hermandad', 'hermandades')} y permite seguir sus vínculos musicales e institucionales.`,
      href: rootHref(row),
      linkLabel: 'Seguir relaciones →',
    }
  }

  if (row.activity_kind === 'step_personnel') {
    return {
      ...base,
      kicker: 'Hermandad → pasos → capataces',
      summary: `${plural(count, 'paso', 'pasos')} quedan conectados con ${plural(secondary, 'capataz', 'capataces')} para ampliar el recorrido por sus responsables actuales.`,
      href: rootHref(row),
      linkLabel: 'Descubrir los pasos →',
    }
  }

  if (row.activity_kind === 'titularity') {
    return {
      ...base,
      kicker: 'Hermandad → titulares → imágenes',
      summary: `${plural(count, 'titular', 'titulares')} permiten continuar hacia imágenes, advocaciones y presencia procesional sin mezclar conceptos distintos.`,
      href: rootHref(row, '#titulares'),
      linkLabel: 'Descubrir titulares →',
    }
  }

  if (row.activity_kind === 'brotherhood_steps') {
    return {
      ...base,
      kicker: 'Hermandad → pasos → patrimonio',
      summary: `${plural(count, 'paso', 'pasos')} conectan la Hermandad con patrimonio, imágenes, autores, capataces y acompañamientos.`,
      href: rootHref(row),
      linkLabel: 'Recorrer sus pasos →',
    }
  }

  if (row.activity_kind === 'discography') {
    return {
      ...base,
      kicker: 'Banda → discografía → grabaciones',
      summary: `${plural(count, 'trabajo', 'trabajos')} y ${plural(secondary, 'grabación', 'grabaciones')} permiten recorrer el repertorio desde la propia formación.`,
      href: rootHref(row, '#discografia'),
      linkLabel: 'Abrir discografía →',
    }
  }

  if (row.activity_kind === 'image_authorship') {
    return {
      ...base,
      kicker: 'Imagen → autoría → otras obras',
      summary: `${plural(count, 'autor', 'autores')} conectan la imagen con su creación y con el resto de obras documentadas de sus responsables.`,
      href: rootHref(row),
      linkLabel: 'Abrir la imagen →',
    }
  }

  if (row.activity_kind === 'step_phases') {
    return {
      ...base,
      kicker: 'Paso → fases → autores',
      summary: `${plural(count, 'fase', 'fases')} permiten entender el paso como un conjunto que ha evolucionado con el tiempo.`,
      href: rootHref(row),
      linkLabel: 'Recorrer el paso →',
    }
  }

  if (row.activity_kind === 'heritage_interventions') {
    return {
      ...base,
      kicker: `${row.root_type === 'image' ? 'Imagen' : row.root_type === 'step' ? 'Paso' : 'Hermandad'} → patrimonio → autores`,
      summary: `${plural(count, 'intervención', 'intervenciones')} y ${plural(secondary, 'responsable', 'responsables')} permiten recorrer la evolución material de la entidad.`,
      href: rootHref(row),
      linkLabel: 'Explorar patrimonio →',
    }
  }

  if (row.activity_kind === 'heritage_updates') {
    return {
      ...base,
      kicker: 'Patrimonio → intervenciones → cronología',
      summary: `${plural(count, 'actualización', 'actualizaciones')} enriquecen la cronología patrimonial y conectan cada actuación con su contexto.`,
      href: rootHref(row),
      linkLabel: 'Ver cronología →',
    }
  }

  return null
}

function chooseDiscovery(rows, today, blockedRoots) {
  const candidates = rows
    .filter((row) => DISCOVERY_KINDS.has(row.activity_kind))
    .filter((row) => !blockedRoots.has(row.root_entity_id))
    .filter((row) => rootHref(row))
    .sort((a, b) => {
      const priority = (Number(b.priority) || 0) - (Number(a.priority) || 0)
      if (priority) return priority
      return `${a.root_name}:${a.activity_kind}`.localeCompare(`${b.root_name}:${b.activity_kind}`, 'es')
    })
    .slice(0, 24)

  if (!candidates.length) return null
  return candidates[stableIndex(`${today}:discovery`, candidates.length)]
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

  const [authorsResult, dedicationsResult, recordingsResult, tracksResult] = await Promise.all([
    supabase
      .from('march_authors')
      .select('agent_entity_id, author_role')
      .eq('march_entity_id', marchEntityId),
    supabase
      .from('march_dedications')
      .select('dedicatee_entity_id, dedication_text')
      .eq('march_entity_id', marchEntityId)
      .eq('status', 'published'),
    supabase
      .from('march_recordings')
      .select('youtube_video_id, external_url, is_featured')
      .eq('march_entity_id', marchEntityId)
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .limit(1),
    supabase
      .from('band_release_tracks')
      .select('release_id, spotify_url')
      .eq('march_entity_id', marchEntityId)
      .not('spotify_url', 'is', null),
  ])

  const authors = assertQuery(authorsResult, 'No se pudieron consultar los autores de la marcha')
  const dedications = assertQuery(dedicationsResult, 'No se pudieron consultar las dedicatorias de la marcha')
  const recordings = assertQuery(recordingsResult, 'No se pudieron consultar las grabaciones de la marcha')
  const tracks = assertQuery(tracksResult, 'No se pudieron consultar las pistas discográficas de la marcha')

  const composerLink = authors.find((item) => item.author_role === 'composer') || authors[0]
  const composer = composerLink?.agent_entity_id ? await entityById(supabase, composerLink.agent_entity_id) : null
  const dedication = dedications[0]
  const dedicatee = dedication?.dedicatee_entity_id ? await entityById(supabase, dedication.dedicatee_entity_id) : null
  const recording = recordings[0]

  let spotifyUrl = ''
  if (tracks.length) {
    const releaseIds = [...new Set(tracks.map((item) => item.release_id).filter(Boolean))]
    const releases = releaseIds.length
      ? assertQuery(
          await supabase
            .from('band_releases')
            .select('id')
            .in('id', releaseIds)
            .eq('status', 'published'),
          'No se pudieron validar los lanzamientos de la marcha'
        )
      : []
    const published = new Set(releases.map((item) => item.id))
    spotifyUrl = tracks.find((item) => published.has(item.release_id) && item.spotify_url)?.spotify_url || ''
  }

  const videoId = recording?.youtube_video_id || march.youtube_video_id || ''
  const listenUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : recording?.external_url || spotifyUrl || ''
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
    listenUrl,
    whyToday,
  }
}

export async function getTodayHomeContentV2() {
  const fallback = {
    ephemeris: null,
    editorial: null,
    discovery: null,
    march: null,
  }

  try {
    const supabase = await createClient()
    const today = madridDateKey()

    const [overridesResult, ephemerisResult, editorialResult, discoveryResult, marchesResult] = await Promise.all([
      supabase
        .from('daily_overrides')
        .select('id, publish_date, content_type, title, summary, entity_id, editorial_content_id, march_entity_id, event_entity_id, sort_order')
        .eq('publish_date', today)
        .eq('status', 'published')
        .order('sort_order'),
      supabase.from('today_ephemeris_candidates').select('*'),
      supabase.from('daily_editorial_candidates').select('*'),
      supabase
        .from('home_knowledge_threads')
        .select('thread_key, root_entity_id, root_type, root_name, root_slug, activity_kind, relation_count, secondary_count, priority'),
      supabase.from('daily_march_candidates').select('*'),
    ])

    const overrides = assertQuery(overridesResult, 'No se pudieron consultar las excepciones editoriales del día')
    const ephemerisCandidates = assertQuery(ephemerisResult, 'No se pudieron consultar las efemérides del día')
    const editorialCandidates = assertQuery(editorialResult, 'No se pudieron consultar los contenidos diarios')
    const discoveryRows = assertQuery(discoveryResult, 'No se pudieron consultar los hilos candidatos del día')
    const marchCandidates = assertQuery(marchesResult, 'No se pudieron consultar las marchas del día')

    const ephemerisOverride = overrides.find((item) => item.content_type === 'ephemeris') || null
    const ephemerisCandidate = ephemerisOverride
      ? null
      : ephemerisCandidates[stableIndex(`${today}:ephemeris`, ephemerisCandidates.length)] || null
    const ephemeris = await ephemerisCard(supabase, ephemerisCandidate, ephemerisOverride)

    const editorialOverride = overrides.find((item) => item.content_type === 'fact' || item.content_type === 'curiosity') || null
    let editorial = null
    if (editorialOverride) {
      editorial = await editorialOverrideCard(supabase, editorialOverride)
    } else {
      const selectedEditorial = chooseCandidate(editorialCandidates, `${today}:editorial`)
      editorial = await editorialCard(supabase, selectedEditorial)
    }

    const blockedRoots = new Set([
      ephemeris?.rootEntityId,
      editorial?.rootEntityId,
    ].filter(Boolean))
    const selectedDiscovery = chooseDiscovery(discoveryRows, today, blockedRoots)
    const discovery = discoveryCardFromRow(selectedDiscovery)

    const marchOverride = overrides.find((item) => item.content_type === 'march') || null
    const marchEntityId = marchOverride?.march_entity_id
      || chooseCandidate(marchCandidates, `${today}:march`)?.entity_id
      || null
    const march = await marchCard(supabase, marchEntityId)

    return { ephemeris, editorial, discovery, march }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar Hoy 2.0', {
      error: error instanceof Error ? error.message : String(error),
    })
    return fallback
  }
}

export async function getHomeExploreStats() {
  const empty = {
    directories: [
      { key: 'brotherhood', label: 'Hermandades', count: 0, href: '/hermandades', detail: 'Historia · titulares · cultos · pasos · música' },
      { key: 'image', label: 'Imágenes', count: 0, href: '/imagenes', detail: 'Autoría · cronología · restauraciones · pasos' },
      { key: 'step', label: 'Pasos', count: 0, href: '/pasos', detail: 'Patrimonio · fases · autores · capataces · música' },
      { key: 'band', label: 'Bandas', count: 0, href: '/bandas', detail: 'Trayectoria · acompañamientos · discografía · relaciones' },
    ],
    graph: [
      { key: 'march', count: 0, label: 'marchas documentadas' },
      { key: 'agent', count: 0, label: 'autores, artistas y profesionales' },
      { key: 'heritage_asset', count: 0, label: 'elementos patrimoniales' },
      { key: 'event', count: 0, label: 'acontecimientos' },
    ],
  }

  try {
    const supabase = await createClient()
    const types = ['brotherhood', 'image', 'step', 'band', 'march', 'agent', 'heritage_asset', 'event']
    const rows = assertQuery(
      await supabase
        .from('entities')
        .select('entity_type')
        .in('entity_type', types)
        .eq('status', 'published'),
      'No se pudieron consultar las magnitudes públicas de la enciclopedia'
    )

    const counts = rows.reduce((map, item) => {
      map.set(item.entity_type, (map.get(item.entity_type) || 0) + 1)
      return map
    }, new Map())

    return {
      directories: empty.directories.map((item) => ({ ...item, count: counts.get(item.key) || 0 })),
      graph: empty.graph.map((item) => ({ ...item, count: counts.get(item.key) || 0 })),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las magnitudes de la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    return empty
  }
}
