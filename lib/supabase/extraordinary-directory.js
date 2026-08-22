import 'server-only'

import { createClient } from '@/lib/supabase/server'

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
    const supabase = await createClient()
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
    const musicRows = outingIds.length
      ? assertRows(
          await supabase
            .from('outing_music_details')
            .select('outing_id, music_assignment_id, position_order, position_label, band_name, segment_start_label, segment_end_label')
            .in('outing_id', outingIds)
            .order('position_order'),
          'No se pudo consultar la música de las extraordinarias'
        )
      : []

    const musicByOuting = new Map()
    for (const row of musicRows) {
      const current = musicByOuting.get(row.outing_id) || []
      current.push({
        id: row.music_assignment_id,
        name: row.band_name || 'Acompañamiento por documentar',
        context: row.position_label
          || [row.segment_start_label, row.segment_end_label].filter(Boolean).join(' → '),
      })
      musicByOuting.set(row.outing_id, current)
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
      const music = musicByOuting.get(item.id) || []

      return {
        id: item.id,
        slug: item.slug || '',
        anchor,
        anchorHref: `/extraordinarias#${anchor}`,
        title: item.title || item.outing_type || 'Salida extraordinaria',
        brotherhoodName: item.brotherhood_name || item.organizer_name || 'Entidad organizadora por documentar',
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
        returnTime: timeLabel(item.return_time),
        reason: item.reason || '',
        description: item.description || '',
        publicNotes: item.public_notes || '',
        origin: item.origin_place_name || '',
        destination: item.destination_place_name || '',
        routeSummary: item.route_summary || '',
        music,
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
