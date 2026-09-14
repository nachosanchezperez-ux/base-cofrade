import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function relationOne(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
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

  const date = new Date(`${value}T12:00:00`)
  const formatter = (options) => new Intl.DateTimeFormat('es-ES', {
    ...options,
    timeZone: 'Europe/Madrid',
  }).format(date)
  const weekday = formatter({ weekday: 'long' })
  const monthLong = formatter({ month: 'long' })

  return {
    day: formatter({ day: '2-digit' }),
    month: formatter({ month: 'short' }).replace('.', '').toUpperCase(),
    year: formatter({ year: 'numeric' }),
    label: formatter({ day: 'numeric', month: 'long', year: 'numeric' }),
    weekdayLabel: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${formatter({ day: 'numeric', month: 'long' })}`,
    monthKey: value.slice(0, 7),
    monthLabel: `${monthLong} ${formatter({ year: 'numeric' })}`.toLocaleUpperCase('es'),
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

function rosaryMode(value) {
  const type = normalizeText(value)
  if (type.includes('aurora')) return 'Rosario de la Aurora'
  if (type.includes('matutino')) return 'Rosario matutino'
  if (type.includes('vespertino')) return 'Rosario vespertino'
  return 'Rosario público'
}

function entityHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function musicSection(type) {
  if (type === 'processional_music') return 'processional'
  if (type === 'liturgical_music') return 'liturgical'
  if (type === 'announcement_music') return 'announcement'
  return 'other'
}

async function fetchRosaryRows(supabase) {
  return assertRows(
    await supabase
      .from('outings')
      .select('id, brotherhood_entity_id, outing_type, character, title, outing_date, return_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, origin_text, destination_text, reason, route, route_summary, description, public_notes, organizer_name, event_status, status, updated_at, hero_image_path, hero_image_alt, hero_image_credit, slug')
      .eq('status', 'published')
      .ilike('outing_type', '%rosario%')
      .order('outing_date', { ascending: true, nullsFirst: false })
      .order('departure_time', { ascending: true, nullsFirst: false }),
    'No se pudieron consultar los rosarios públicos'
  )
}

export async function getRosaryOutings() {
  try {
    const supabase = createPublicClient()
    const rows = await fetchRosaryRows(supabase)
    const brotherhoodIds = [...new Set(rows.map((item) => item.brotherhood_entity_id).filter(Boolean))]
    const municipalityIds = [...new Set(rows.map((item) => item.municipality_id).filter(Boolean))]
    const placeIds = [...new Set(rows.flatMap((item) => [item.origin_place_id, item.destination_place_id]).filter(Boolean))]

    const [entities, brotherhoods, municipalities, places] = await Promise.all([
      brotherhoodIds.length
        ? assertRows(
            await supabase.from('entities').select('id, name, slug, entity_type, status').in('id', brotherhoodIds),
            'No se pudieron consultar las Hermandades de los rosarios'
          )
        : [],
      brotherhoodIds.length
        ? assertRows(
            await supabase.from('brotherhoods').select('entity_id, crest_path').in('entity_id', brotherhoodIds),
            'No se pudieron consultar los escudos de los rosarios'
          )
        : [],
      municipalityIds.length
        ? assertRows(
            await supabase.from('municipalities').select('id, name, slug, province').in('id', municipalityIds),
            'No se pudieron consultar las localidades de los rosarios'
          )
        : [],
      placeIds.length
        ? assertRows(
            await supabase.from('places').select('id, name, address').in('id', placeIds),
            'No se pudieron consultar los lugares de los rosarios'
          )
        : [],
    ])

    const entityById = new Map(entities.map((item) => [item.id, item]))
    const brotherhoodById = new Map(brotherhoods.map((item) => [item.entity_id, item]))
    const municipalityById = new Map(municipalities.map((item) => [item.id, item]))
    const placeById = new Map(places.map((item) => [item.id, item]))
    const today = madridDateKey()

    return rows.map((item) => {
      const date = item.outing_date || ''
      const dateInfo = dateMeta(date)
      const entity = entityById.get(item.brotherhood_entity_id) || null
      const municipality = municipalityById.get(item.municipality_id) || null
      const origin = placeById.get(item.origin_place_id) || null
      const destination = placeById.get(item.destination_place_id) || null
      const isCancelled = item.event_status === 'cancelled'
      const isPast = Boolean(date) && date < today
      const isUpcoming = !isCancelled
        && item.event_status !== 'held'
        && (!date || date >= today)

      return {
        id: item.id,
        slug: item.slug || '',
        title: item.title || rosaryMode(item.outing_type),
        outingType: item.outing_type || 'Rosario público',
        mode: rosaryMode(item.outing_type),
        character: item.character || 'ordinary',
        isExtraordinary: item.character === 'extraordinary' || normalizeText(item.outing_type).includes('extraordinario'),
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
        originAddress: origin?.address || '',
        destination: destination?.name || item.destination_text || '',
        reason: item.reason || '',
        route: item.route || null,
        routeSummary: item.route_summary || '',
        description: item.description || '',
        publicNotes: item.public_notes || '',
        eventStatus: item.event_status || 'announced',
        updatedAt: item.updated_at || '',
        isUpcoming,
        isPast: isPast || item.event_status === 'held',
        isCancelled,
        brotherhoodName: entity?.name || item.organizer_name || 'Hermandad organizadora',
        brotherhoodHref: entityHref(entity),
        crestPath: brotherhoodById.get(item.brotherhood_entity_id)?.crest_path || '',
        heroImagePath: item.hero_image_path || '',
        heroImageAlt: item.hero_image_alt || item.title || 'Rosario público',
        heroImageCredit: item.hero_image_credit || '',
        detailHref: item.slug ? `/agenda-cofrade/rosarios/${item.slug}` : '',
      }
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la agenda de rosarios', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

export async function getRosaryOutingDetail(slug) {
  if (!slug) return null

  try {
    const supabase = createPublicClient()
    const item = (await getRosaryOutings()).find((outing) => outing.slug === slug)
    if (!item) return null

    const [scheduleRows, musicRows, sourceLinkRows] = await Promise.all([
      assertRows(
        await supabase
          .from('outing_schedule_items')
          .select('id, sequence_no, label, item_date, item_time, time_text, place_text, notes')
          .eq('outing_id', item.id)
          .order('sequence_no'),
        'No se pudieron consultar los horarios del rosario'
      ),
      assertRows(
        await supabase
          .from('outing_music_details')
          .select('music_assignment_id, position_order, position_code, position_label, band_entity_id, band_name, segment_start_label, segment_end_label, notes')
          .eq('outing_id', item.id)
          .order('position_order'),
        'No se pudo consultar la música del rosario'
      ),
      assertRows(
        await supabase
          .from('source_links')
          .select('id, scope, notes, sources(id, name, url, source_type, author_or_publisher, publication_date, notes)')
          .eq('outing_id', item.id),
        'No se pudieron consultar las fuentes del rosario'
      ),
    ])

    const bandIds = [...new Set(musicRows.map((row) => row.band_entity_id).filter(Boolean))]
    const bands = bandIds.length
      ? assertRows(
          await supabase.from('entities').select('id, name, slug, entity_type, status').in('id', bandIds),
          'No se pudieron consultar las bandas del rosario'
        )
      : []
    const bandById = new Map(bands.map((band) => [band.id, band]))

    return {
      ...item,
      schedule: scheduleRows.map((row) => ({
        id: row.id,
        order: row.sequence_no,
        label: row.label || '',
        date: row.item_date || item.date,
        time: timeLabel(row.item_time),
        timeText: row.time_text || '',
        place: row.place_text || '',
        notes: row.notes || '',
      })),
      music: musicRows.map((row) => {
        const band = bandById.get(row.band_entity_id) || null
        return {
          id: row.music_assignment_id,
          section: musicSection(row.position_code),
          name: row.band_name || band?.name || '',
          href: entityHref(band),
          context: row.position_label || [row.segment_start_label, row.segment_end_label].filter(Boolean).join(' → '),
          notes: row.notes || '',
        }
      }).filter((row) => row.name),
      sources: sourceLinkRows.map((link) => {
        const source = relationOne(link.sources)
        if (!source) return null
        return {
          id: link.id,
          name: source.name || source.author_or_publisher || 'Fuente documental',
          url: source.url || '',
          publisher: source.author_or_publisher || '',
          publicationDate: source.publication_date || '',
          scope: link.scope || '',
          notes: link.notes || source.notes || '',
        }
      }).filter(Boolean),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la ficha del rosario', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
