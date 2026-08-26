import 'server-only'

import { createClient } from '@/lib/supabase/public-server'

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

function activityDateMeta(value) {
  const parsed = timestamp(value)
  if (!parsed) return { dateLabel: '', dateTime: '' }

  const date = new Date(parsed)
  const activityKey = madridDateKey(date)
  const todayKey = madridDateKey()
  const yesterdayKey = madridDateKey(new Date(Date.now() - (24 * 60 * 60 * 1000)))

  let dateLabel
  if (activityKey === todayKey) {
    dateLabel = 'Hoy'
  } else if (activityKey === yesterdayKey) {
    dateLabel = 'Ayer'
  } else {
    dateLabel = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      timeZone: 'Europe/Madrid',
    }).format(date).replace('.', '')
  }

  return { dateLabel, dateTime: date.toISOString() }
}

function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

function discoveryRootHref(row, anchor = '') {
  if (!row?.root_slug) return ''
  let base = ''
  if (row.root_type === 'brotherhood') base = `/hermandades/${row.root_slug}`
  if (row.root_type === 'image') base = `/imagenes/${row.root_slug}`
  if (row.root_type === 'step') base = `/pasos/${row.root_slug}`
  if (row.root_type === 'band') base = `/bandas/${row.root_slug}`
  return base ? `${base}${anchor}` : ''
}

function discoveryThreadFromRow(row) {
  const count = Number(row.relation_count) || 0
  const secondaryCount = Number(row.secondary_count) || 0
  const { dateLabel, dateTime } = activityDateMeta(row.latest_at)
  const common = {
    id: row.thread_key,
    title: row.root_name,
    dateLabel,
    dateTime,
  }

  if (row.activity_kind === 'musical_heritage') {
    const total = count + secondaryCount
    return {
      ...common,
      activityStatus: 'AMPLIADO',
      label: 'Hermandad → patrimonio musical',
      metric: count && secondaryCount
        ? `${total} composiciones · ${count} marchas · ${secondaryCount} piezas`
        : count
          ? plural(count, 'marcha documentada', 'marchas documentadas')
          : plural(secondaryCount, 'pieza documentada', 'piezas documentadas'),
      summary: count && secondaryCount
        ? `El patrimonio musical publicado reúne ya ${count} marchas y ${secondaryCount} piezas de capilla o coplas, conectadas con sus autorías y relaciones.`
        : 'El repertorio dedicado ya forma parte del recorrido relacional de la Hermandad y puede seguirse desde su ficha.',
      path: ['Hermandad', 'Patrimonio musical', 'Autores + grabaciones'],
      href: discoveryRootHref(row, '#musica'),
      cta: 'Recorrer patrimonio musical →',
    }
  }

  if (row.activity_kind === 'posters') {
    return {
      ...common,
      activityStatus: 'AMPLIADO',
      label: 'Hermandad → cartelería',
      metric: plural(count, 'cartel documentado', 'carteles documentados'),
      summary: `La memoria gráfica reúne ya ${plural(count, 'cartel', 'carteles')}, con sus obras y autorías conectadas dentro de la ficha.`,
      path: ['Hermandad', 'Cartelería', 'Autores'],
      href: discoveryRootHref(row, '#carteles'),
      cta: 'Descubrir carteles →',
    }
  }

  if (row.activity_kind === 'band_brotherhoods') {
    return {
      ...common,
      activityStatus: 'RELACIONADO',
      label: 'Banda → hermandades',
      metric: plural(count, 'hermandad relacionada', 'hermandades relacionadas'),
      summary: `La Banda queda conectada con ${plural(count, 'hermandad', 'hermandades')} para seguir sus vínculos institucionales y musicales desde una misma ficha.`,
      path: ['Banda', 'Hermandades', 'Relaciones'],
      href: discoveryRootHref(row),
      cta: 'Seguir relaciones →',
    }
  }

  if (row.activity_kind === 'step_personnel') {
    return {
      ...common,
      activityStatus: 'RELACIONADO',
      label: 'Hermandad → pasos → capataces',
      metric: `${plural(count, 'paso', 'pasos')} · ${plural(secondaryCount, 'capataz', 'capataces')}`,
      summary: 'Los pasos de la Hermandad quedan conectados con sus capataces actuales, preparando además el recorrido transversal por otros pasos dirigidos por cada profesional.',
      path: ['Hermandad', 'Pasos', 'Capataces'],
      href: discoveryRootHref(row),
      cta: 'Descubrir los pasos →',
    }
  }

  if (row.activity_kind === 'titularity') {
    return {
      ...common,
      activityStatus: 'RELACIONADO',
      label: 'Hermandad → titularidad',
      metric: plural(count, 'titular relacionado', 'titulares relacionados'),
      summary: 'La titularidad publicada queda conectada con la Hermandad para continuar el recorrido hacia imágenes, advocaciones y otras relaciones documentadas.',
      path: ['Hermandad', 'Titularidad', 'Imágenes'],
      href: discoveryRootHref(row, '#titulares'),
      cta: 'Descubrir titulares →',
    }
  }

  if (row.activity_kind === 'brotherhood_steps') {
    return {
      ...common,
      activityStatus: 'RELACIONADO',
      label: 'Hermandad → pasos',
      metric: plural(count, 'paso relacionado', 'pasos relacionados'),
      summary: 'Los pasos publicados quedan unidos a su Hermandad y preparados para recorrer patrimonio, autores, imágenes, capataces y acompañamientos.',
      path: ['Hermandad', 'Pasos', 'Patrimonio'],
      href: discoveryRootHref(row),
      cta: 'Recorrer sus pasos →',
    }
  }

  if (row.activity_kind === 'discography') {
    return {
      ...common,
      activityStatus: 'AMPLIADO',
      label: 'Banda → discografía',
      metric: `${plural(count, 'trabajo', 'trabajos')} · ${plural(secondaryCount, 'grabación', 'grabaciones')}`,
      summary: 'La discografía publicada reúne trabajos y grabaciones dentro de la propia Banda, conectando el catálogo sin convertir cada pista en una ficha aislada.',
      path: ['Banda', 'Discografía', 'Grabaciones'],
      href: discoveryRootHref(row, '#discografia'),
      cta: 'Abrir discografía →',
    }
  }

  if (row.activity_kind === 'image_authorship') {
    return {
      ...common,
      activityStatus: 'RELACIONADO',
      label: 'Imagen → autoría',
      metric: plural(count, 'autor relacionado', 'autores relacionados'),
      summary: 'La imagen queda conectada con su autoría documentada para poder seguir el hilo hacia autores, intervenciones y otras obras relacionadas.',
      path: ['Imagen', 'Autoría', 'Obras'],
      href: discoveryRootHref(row),
      cta: 'Abrir la imagen →',
    }
  }

  if (row.activity_kind === 'step_phases') {
    return {
      ...common,
      activityStatus: 'AMPLIADO',
      label: 'Paso → evolución patrimonial',
      metric: plural(count, 'fase documentada', 'fases documentadas'),
      summary: 'La evolución material del paso gana contexto cronológico y permite recorrer sus distintas fases, talleres y autorías documentadas.',
      path: ['Paso', 'Cronología', 'Autores'],
      href: discoveryRootHref(row),
      cta: 'Recorrer el paso →',
    }
  }

  if (row.activity_kind === 'heritage_interventions') {
    return {
      ...common,
      activityStatus: 'AMPLIADO',
      label: `${row.root_type === 'image' ? 'Imagen' : row.root_type === 'step' ? 'Paso' : 'Hermandad'} → patrimonio`,
      metric: `${plural(count, 'intervención', 'intervenciones')} · ${plural(secondaryCount, 'autor', 'autores')}`,
      summary: 'Se amplía la lectura patrimonial con intervenciones y responsables conectados a la entidad, conservando la cronología y la autoría de cada trabajo.',
      path: [row.root_type === 'image' ? 'Imagen' : row.root_type === 'step' ? 'Paso' : 'Hermandad', 'Patrimonio', 'Autores'],
      href: discoveryRootHref(row),
      cta: 'Explorar patrimonio →',
    }
  }

  if (row.activity_kind === 'heritage_updates') {
    return {
      ...common,
      activityStatus: 'ACTUALIZADO',
      label: `${row.root_type === 'image' ? 'Imagen' : row.root_type === 'step' ? 'Paso' : 'Hermandad'} → intervenciones`,
      metric: plural(count, 'actualización documentada', 'actualizaciones documentadas'),
      summary: 'La cronología patrimonial incorpora nuevas actuaciones documentadas para mantener la ficha conectada con su evolución histórica.',
      path: [row.root_type === 'image' ? 'Imagen' : row.root_type === 'step' ? 'Paso' : 'Hermandad', 'Intervenciones', 'Cronología'],
      href: discoveryRootHref(row),
      cta: 'Ver cronología →',
    }
  }

  if (row.activity_kind === 'entity_new') {
    const entityLabel = row.root_type === 'brotherhood'
      ? 'Hermandad'
      : row.root_type === 'image'
        ? 'Imagen'
        : row.root_type === 'step'
          ? 'Paso'
          : 'Banda'
    return {
      ...common,
      activityStatus: 'NUEVO',
      label: `${entityLabel} → nueva ficha`,
      metric: 'Nueva ficha publicada',
      summary: 'La entidad ya forma parte de la enciclopedia y queda preparada para crecer a medida que se documenten nuevas relaciones.',
      path: [entityLabel, 'Ficha pública', 'Relaciones'],
      href: discoveryRootHref(row),
      cta: 'Abrir ficha →',
    }
  }

  return null
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

export async function getTodayHomeContent() {
  const fallback = {
    ephemeris: null,
    fact: null,
    curiosity: null,
    march: null,
  }

  try {
    const supabase = await createClient()
    const today = madridDateKey()
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
    return fallback
  }
}

export async function getHomeDiscoveryThreads(limit = 3) {
  try {
    const supabase = await createClient()
    const fetchLimit = Math.max(36, limit * 12)
    const rows = assertQuery(
      await supabase
        .from('home_knowledge_threads')
        .select('thread_key, root_entity_id, root_type, root_name, root_slug, activity_kind, relation_count, secondary_count, latest_at, priority')
        .order('latest_at', { ascending: false })
        .order('priority', { ascending: false })
        .limit(fetchLimit),
      'No se pudo consultar la actividad de conocimiento de la Home'
    )

    const threads = []
    const seenRoots = new Set()

    for (const row of rows) {
      if (seenRoots.has(row.root_entity_id)) continue
      const thread = discoveryThreadFromRow(row)
      if (!thread?.href) continue

      seenRoots.add(row.root_entity_id)
      threads.push(thread)
      if (threads.length >= limit) break
    }

    return threads
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar los hilos de descubrimiento de la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

export async function getUpcomingExtraordinaryOutings(limit = 4) {
  try {
    const supabase = await createClient()
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
    return []
  }
}
