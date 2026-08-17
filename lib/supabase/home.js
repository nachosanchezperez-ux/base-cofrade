import 'server-only'

import { createClient } from '@/lib/supabase/server'

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
  const weekdayLabelRaw = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const weekdayLabel = `${weekdayLabelRaw.charAt(0).toUpperCase()}${weekdayLabelRaw.slice(1)}`

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

  return {
    id: entity.id,
    title: entity.name,
    composer: composer?.name || 'Autoría por documentar',
    year: march.composition_year || march.composition_date_text || '',
    dedicatee: dedicatee?.name || dedication?.dedication_text || '',
    videoId,
    videoUrl: videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : '',
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
