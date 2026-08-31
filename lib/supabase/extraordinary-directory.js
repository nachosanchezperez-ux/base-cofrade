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
  if (!value) return { day: '', month: '', year: '', label: '', weekdayLabel: '', weekday: '' }

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

  return {
    day,
    month,
    year,
    label,
    weekday,
    weekdayLabel: `${weekday} ${dayMonth}`,
  }
}

function monthMeta(value) {
  if (!value) return { key: 'sin-fecha', label: 'Sin fecha' }
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

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

function scheduleReturnLabel(rows = []) {
  const entry = rows.find((item) => {
    const label = normalizeText(item.label)
    return label.includes('entrada')
      || label.includes('recogida')
      || label.includes('fin de la procesion')
      || label.includes('final de la procesion')
  })
  return timeLabel(entry?.item_time) || entry?.time_text || ''
}

function daysBetween(first, second) {
  if (!first || !second) return null
  const start = Date.parse(`${first}T12:00:00Z`)
  const end = Date.parse(`${second}T12:00:00Z`)
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null
  return Math.round((end - start) / 86400000)
}

function urgencyLabel(date, today, parts) {
  const days = daysBetween(today, date)
  if (days === null || days < 0) return ''
  if (days === 0) return 'HOY'
  if (days === 1) return 'MAÑANA'
  if (days <= 7 && parts.weekday) return `ESTE ${parts.weekday.toLocaleUpperCase('es')}`
  if (days <= 31) return `EN ${days} DÍAS`
  return 'PRÓXIMA'
}

export async function getExtraordinaryDirectory() {
  try {
    const supabase = createPublicClient()
    const today = madridDateKey()
    const rows = assertRows(
      await supabase
        .from('extraordinary_outings_directory')
        .select('*')
        .eq('province', 'Sevilla')
        .order('outing_date', { ascending: true })
        .order('departure_time', { ascending: true, nullsFirst: false }),
      'No se pudo consultar el directorio de extraordinarias'
    )

    const outingIds = rows.map((item) => item.id).filter(Boolean)
    const [musicRows, scheduleRows] = outingIds.length
      ? await Promise.all([
          supabase
            .from('outing_music_details')
            .select('outing_id, music_assignment_id, position_order, position_code, position_label, band_name, segment_start_label, segment_end_label')
            .in('outing_id', outingIds)
            .order('position_order'),
          supabase
            .from('outing_schedule_items')
            .select('outing_id, sequence_no, label, item_time, time_text')
            .in('outing_id', outingIds)
            .order('sequence_no'),
        ]).then(([musicResult, scheduleResult]) => [
          assertRows(musicResult, 'No se pudo consultar la música de las extraordinarias'),
          assertRows(scheduleResult, 'No se pudieron consultar los hitos horarios de las extraordinarias'),
        ])
      : [[], []]

    const allMusicByOuting = new Map()
    for (const row of musicRows) {
      const current = allMusicByOuting.get(row.outing_id) || []
      current.push({
        id: row.music_assignment_id,
        type: row.position_code || '',
        name: row.band_name || '',
        context: row.position_label
          || [row.segment_start_label, row.segment_end_label].filter(Boolean).join(' → '),
      })
      allMusicByOuting.set(row.outing_id, current)
    }

    const scheduleByOuting = new Map()
    for (const row of scheduleRows) {
      const current = scheduleByOuting.get(row.outing_id) || []
      current.push(row)
      scheduleByOuting.set(row.outing_id, current)
    }

    return rows.map((item) => {
      const date = item.outing_date || ''
      const parts = dateParts(date)
      const month = monthMeta(date)
      const isUpcoming = item.event_status === 'announced' && Boolean(date) && date >= today
      const isCelebrated = item.event_status === 'held' || (Boolean(date) && date < today)
      const municipality = item.municipality_name || ''
      const scope = municipality.toLocaleLowerCase('es') === 'sevilla' ? 'capital' : 'province'
      const anchor = item.slug || item.id
      const allMusic = allMusicByOuting.get(item.id) || []
      const processionalMusic = allMusic.filter((item) => item.type === 'processional_music')
      const music = processionalMusic.length ? processionalMusic : allMusic.filter((item) => item.type !== 'liturgical_music' && item.type !== 'announcement_music')
      const fallbackReturnLabel = scheduleReturnLabel(scheduleByOuting.get(item.id) || [])

      return {
        id: item.id,
        slug: item.slug || '',
        anchor,
        anchorHref: `/extraordinarias#${anchor}`,
        title: item.title || item.outing_type || 'Salida extraordinaria',
        brotherhoodName: item.brotherhood_name || item.organizer_name || '',
        municipality,
        province: item.province || '',
        scope,
        date,
        dateParts: parts,
        monthKey: month.key,
        monthLabel: month.label,
        urgencyLabel: isUpcoming ? urgencyLabel(date, today, parts) : '',
        year: Number(item.year) || Number(date.slice(0, 4)) || null,
        departureTime: timeLabel(item.departure_time),
        returnTime: timeLabel(item.return_time) || fallbackReturnLabel,
        reason: item.reason || '',
        description: item.description || '',
        publicNotes: item.public_notes || '',
        origin: item.origin_place_name || '',
        destination: item.destination_place_name || '',
        routeSummary: item.route_summary || '',
        music: music.filter((band) => band.name),
        allMusic: allMusic.filter((band) => band.name),
        musicSummary: music.map((band) => band.name).join(' · '),
        eventStatus: item.event_status || 'announced',
        isUpcoming,
        isCelebrated,
        isCancelled: item.event_status === 'cancelled',
        heroImagePath: item.hero_image_path || '',
        heroImageAlt: item.hero_image_alt || item.title || item.outing_type || 'Salida extraordinaria',
        heroImageCredit: item.hero_image_credit || '',
      }
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio de extraordinarias', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
