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
  const weekday = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Madrid',
  }).format(date)

  return {
    day,
    month,
    year,
    label,
    weekdayLabel: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`,
  }
}

function monthMeta(value) {
  if (!value) return { key: 'sin-fecha', label: 'SIN FECHA' }
  const date = new Date(`${value}T12:00:00`)
  const label = new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
  return {
    key: value.slice(0, 7),
    label: label.toLocaleUpperCase('es'),
  }
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function publicEntityHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function fallbackSlug(row, brotherhood) {
  if (row.slug) return row.slug
  const base = [brotherhood?.slug || row.title || 'procesion-de-gloria', row.outing_date].filter(Boolean).join('-')
  return slugify(base) || `procesion-de-gloria-${String(row.id || '').slice(0, 8)}`
}

function urgencyLabel(date, today) {
  if (!date || date < today) return ''
  const start = Date.parse(`${today}T12:00:00Z`)
  const end = Date.parse(`${date}T12:00:00Z`)
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 'PRÓXIMA'
  const days = Math.round((end - start) / 86400000)
  if (days === 0) return 'HOY'
  if (days === 1) return 'MAÑANA'
  if (days <= 31) return `EN ${days} DÍAS`
  return 'PRÓXIMA'
}

export async function getGloryDirectory() {
  try {
    const supabase = createPublicClient()
    const today = madridDateKey()
    const rows = assertRows(
      await supabase
        .from('outings')
        .select('id, slug, brotherhood_entity_id, outing_type, character, title, outing_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, origin_text, destination_text, reason, route_summary, description, public_notes, event_status, status, hero_image_path, hero_image_alt, hero_image_credit, return_date')
        .eq('character', 'ordinary')
        .ilike('outing_type', 'Procesión de Gloria')
        .eq('status', 'published')
        .order('outing_date', { ascending: true, nullsFirst: false })
        .order('departure_time', { ascending: true, nullsFirst: false }),
      'No se pudieron consultar las procesiones de Gloria'
    )

    const brotherhoodIds = [...new Set(rows.map((row) => row.brotherhood_entity_id).filter(Boolean))]
    const municipalityIds = [...new Set(rows.map((row) => row.municipality_id).filter(Boolean))]

    const [entities, municipalities, brotherhoodRows] = await Promise.all([
      brotherhoodIds.length
        ? assertRows(
            await supabase
              .from('entities')
              .select('id, name, slug, entity_type, status')
              .in('id', brotherhoodIds),
            'No se pudieron consultar las hermandades de las procesiones de Gloria'
          )
        : [],
      municipalityIds.length
        ? assertRows(
            await supabase
              .from('municipalities')
              .select('id, name, province')
              .in('id', municipalityIds),
            'No se pudieron consultar las localidades de las procesiones de Gloria'
          )
        : [],
      brotherhoodIds.length
        ? assertRows(
            await supabase
              .from('brotherhoods')
              .select('entity_id, crest_path')
              .in('entity_id', brotherhoodIds),
            'No se pudieron consultar los escudos de las hermandades de Gloria'
          )
        : [],
    ])

    const entityById = new Map(entities.map((entity) => [entity.id, entity]))
    const municipalityById = new Map(municipalities.map((municipality) => [municipality.id, municipality]))
    const crestByEntityId = new Map(brotherhoodRows.map((brotherhood) => [brotherhood.entity_id, brotherhood.crest_path || '']))

    return rows
      .map((row) => {
        const brotherhood = entityById.get(row.brotherhood_entity_id) || null
        const municipality = municipalityById.get(row.municipality_id) || null
        const province = municipality?.province || ''
        const date = row.outing_date || ''
        const parts = dateParts(date)
        const month = monthMeta(date)
        const slug = fallbackSlug(row, brotherhood)
        const isUpcoming = row.event_status === 'announced' && Boolean(date) && date >= today
        const isCelebrated = row.event_status === 'held'
        const isPast = Boolean(date) && date < today
        const municipalityName = municipality?.name || ''
        const scope = municipalityName.toLocaleLowerCase('es') === 'sevilla' ? 'capital' : 'province'

        return {
          id: row.id,
          slug,
          detailHref: `/procesiones-de-gloria/${slug}`,
          outingType: row.outing_type || 'Procesión de Gloria',
          title: row.title || row.outing_type || 'Procesión de Gloria',
          brotherhoodName: brotherhood?.name || 'Hermandad por documentar',
          brotherhoodHref: publicEntityHref(brotherhood),
          crestPath: crestByEntityId.get(row.brotherhood_entity_id) || '',
          municipality: municipalityName,
          province,
          scope,
          date,
          dateParts: parts,
          monthKey: month.key,
          monthLabel: month.label,
          urgencyLabel: isUpcoming ? urgencyLabel(date, today) : '',
          year: Number(row.year) || Number(date.slice(0, 4)) || null,
          departureTime: timeLabel(row.departure_time),
          returnTime: timeLabel(row.return_time),
          returnDate: row.return_date || '',
          reason: row.reason || '',
          description: row.description || '',
          publicNotes: row.public_notes || '',
          origin: row.origin_text || '',
          destination: row.destination_text || '',
          routeSummary: row.route_summary || '',
          eventStatus: row.event_status || 'announced',
          isUpcoming,
          isCelebrated,
          isPast,
          isCancelled: row.event_status === 'cancelled',
          heroImagePath: row.hero_image_path || '',
          heroImageAlt: row.hero_image_alt || row.title || 'Procesión de Gloria',
          heroImageCredit: row.hero_image_credit || '',
        }
      })
      .filter((item) => item.province === 'Sevilla')
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio de procesiones de Gloria', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

export async function getGloryDetail(slug) {
  if (!slug) return null

  try {
    const directory = await getGloryDirectory()
    const item = directory.find((outing) => outing.slug === slug) || null
    if (!item) return null

    const supabase = createPublicClient()
    const [outingResult, scheduleRows, musicRows, sourceLinkRows] = await Promise.all([
      supabase
        .from('outings')
        .select('route, origin_text, destination_text, return_date, public_notes')
        .eq('id', item.id)
        .maybeSingle(),
      assertRows(
        await supabase
          .from('outing_schedule_items')
          .select('id, sequence_no, label, item_date, item_time, time_text, place_id, place_text, notes')
          .eq('outing_id', item.id)
          .order('sequence_no'),
        'No se pudieron consultar los horarios de la procesión de Gloria'
      ),
      assertRows(
        await supabase
          .from('outing_music_details')
          .select('music_assignment_id, position_order, position_code, position_label, band_entity_id, band_name, segment_start_label, segment_end_label, notes')
          .eq('outing_id', item.id)
          .order('position_order'),
        'No se pudo consultar la música de la procesión de Gloria'
      ),
      assertRows(
        await supabase
          .from('source_links')
          .select('id, source_id, scope, notes')
          .eq('outing_id', item.id),
        'No se pudieron consultar las fuentes de la procesión de Gloria'
      ),
    ])

    if (outingResult.error) throw new Error(`No se pudo consultar el recorrido de la procesión de Gloria: ${outingResult.error.message}`)
    const outing = outingResult.data || {}
    const sourceIds = [...new Set(sourceLinkRows.map((row) => row.source_id).filter(Boolean))]
    const bandIds = [...new Set(musicRows.map((row) => row.band_entity_id).filter(Boolean))]

    const [sources, bands] = await Promise.all([
      sourceIds.length
        ? assertRows(
            await supabase
              .from('sources')
              .select('id, name, url, source_type, author_or_publisher, publication_date')
              .in('id', sourceIds),
            'No se pudieron consultar las fuentes documentales de la procesión de Gloria'
          )
        : [],
      bandIds.length
        ? assertRows(
            await supabase
              .from('entities')
              .select('id, name, slug, entity_type, status')
              .in('id', bandIds),
            'No se pudieron consultar las bandas relacionadas con la procesión de Gloria'
          )
        : [],
    ])

    const sourceById = new Map(sources.map((source) => [source.id, source]))
    const bandById = new Map(bands.map((band) => [band.id, band]))

    const schedule = scheduleRows.map((row) => ({
      id: row.id,
      order: row.sequence_no,
      label: row.label || '',
      date: row.item_date || item.date,
      time: timeLabel(row.item_time),
      timeText: row.time_text || '',
      place: row.place_text || '',
      notes: row.notes || '',
    }))

    const music = musicRows.map((row) => {
      const band = bandById.get(row.band_entity_id) || null
      return {
        id: row.music_assignment_id,
        order: row.position_order,
        type: row.position_code || '',
        name: row.band_name || band?.name || 'Acompañamiento por documentar',
        href: publicEntityHref(band),
        context: row.position_label || [row.segment_start_label, row.segment_end_label].filter(Boolean).join(' → '),
        notes: row.notes || '',
      }
    })

    const sourcesResolved = sourceLinkRows
      .map((link) => {
        const source = sourceById.get(link.source_id)
        if (!source) return null
        return {
          id: link.id,
          name: source.name || 'Fuente documental',
          url: source.url || '',
          type: source.source_type || '',
          publisher: source.author_or_publisher || '',
          publicationDate: source.publication_date || '',
          scope: link.scope || '',
          notes: link.notes || '',
        }
      })
      .filter(Boolean)

    return {
      ...item,
      origin: outing.origin_text || item.origin,
      destination: outing.destination_text || item.destination,
      route: outing.route || null,
      returnDate: outing.return_date || item.returnDate,
      publicNotes: outing.public_notes || item.publicNotes,
      schedule,
      music,
      processionalMusic: music.filter((row) => row.type === 'processional_music'),
      sources: sourcesResolved,
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la ficha de la procesión de Gloria', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
