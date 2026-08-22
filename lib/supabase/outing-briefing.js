import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
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

function shortDateLabel(value) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  const raw = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
  return `${raw.charAt(0).toUpperCase()}${raw.slice(1)}`
}

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function entityHref(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function scheduleChronologicalSort(a, b, outingDate) {
  const dateA = a.item_date || outingDate || ''
  const dateB = b.item_date || outingDate || ''
  if (dateA !== dateB) return dateA.localeCompare(dateB)

  const timeA = timeLabel(a.item_time)
  const timeB = timeLabel(b.item_time)
  if (timeA && timeB && timeA !== timeB) return timeA.localeCompare(timeB)
  return (Number(a.sequence_no) || 0) - (Number(b.sequence_no) || 0)
}

function positionMatchesExpiredSchedule(positionLabel, expiredLabels) {
  const position = normalize(positionLabel)
  if (!position) return false
  return [...expiredLabels].some((label) => label && (position.includes(label) || label.includes(position)))
}

export async function getOutingBriefing(outingId, outingDate = '') {
  const fallback = { schedule: [], bands: [], liturgicalMusic: [], places: [] }
  if (!outingId) return fallback

  try {
    const supabase = await createClient()
    const [scheduleResult, musicResult, participantResult] = await Promise.all([
      supabase
        .from('outing_schedule_items')
        .select('id, sequence_no, label, item_date, item_time, time_text, place_id, place_text, notes')
        .eq('outing_id', outingId)
        .order('sequence_no'),
      supabase
        .from('outing_music_details')
        .select('music_assignment_id, position_order, position_label, band_entity_id, band_name, participation_mode, segment_start_label, segment_end_label, notes')
        .eq('outing_id', outingId)
        .order('position_order'),
      supabase
        .from('outing_entities')
        .select('entity_id, role, notes')
        .eq('outing_id', outingId)
        .eq('role', 'liturgical_music'),
    ])

    const scheduleRows = assertRows(scheduleResult, 'No se pudieron consultar los hitos de la salida')
    const musicRows = assertRows(musicResult, 'No se pudieron consultar las bandas de la salida')
    const participantRows = assertRows(participantResult, 'No se pudo consultar la música litúrgica de la salida')
    const todayKey = madridDateKey()

    const expiredScheduleRows = scheduleRows.filter((item) => item.item_date && item.item_date < todayKey)
    const expiredLabels = new Set(expiredScheduleRows.map((item) => normalize(item.label)).filter(Boolean))
    const visibleScheduleRows = scheduleRows
      .filter((item) => !item.item_date || item.item_date >= todayKey)
      .sort((a, b) => scheduleChronologicalSort(a, b, outingDate))

    const placeIds = [...new Set(visibleScheduleRows.map((item) => item.place_id).filter(Boolean))]
    const places = placeIds.length
      ? assertRows(
          await supabase.from('places').select('id, name, slug, place_type').in('id', placeIds),
          'No se pudieron consultar los lugares de la salida'
        )
      : []
    const placeById = new Map(places.map((place) => [place.id, place]))

    const assignmentIds = [...new Set(musicRows.map((item) => item.music_assignment_id).filter(Boolean))]
    let assignmentNameById = new Map()
    if (assignmentIds.length) {
      const assignmentResult = await supabase
        .from('outing_music_assignments')
        .select('id, band_name_text, status')
        .in('id', assignmentIds)
        .eq('status', 'published')
      if (!assignmentResult.error) {
        assignmentNameById = new Map((assignmentResult.data || []).map((item) => [item.id, item.band_name_text || '']))
      }
    }

    const activeMusicRows = musicRows.filter((item) => !positionMatchesExpiredSchedule(item.position_label, expiredLabels))
    const bandIds = [...new Set(activeMusicRows.map((item) => item.band_entity_id).filter(Boolean))]
    const bandEntities = bandIds.length
      ? assertRows(
          await supabase
            .from('entities')
            .select('id, name, entity_type, slug, status')
            .in('id', bandIds),
          'No se pudieron consultar las entidades de las bandas'
        )
      : []
    const bandById = new Map(bandEntities.map((entity) => [entity.id, entity]))

    const participantIds = [...new Set(participantRows.map((item) => item.entity_id).filter(Boolean))]
    const participantEntities = participantIds.length
      ? assertRows(
          await supabase
            .from('entities')
            .select('id, name, entity_type, slug')
            .eq('status', 'published')
            .in('id', participantIds),
          'No se pudieron consultar los participantes musicales'
        )
      : []
    const participantById = new Map(participantEntities.map((entity) => [entity.id, entity]))

    const groupedBands = new Map()
    activeMusicRows
      .filter((item) => item.band_entity_id)
      .forEach((item) => {
        const entity = bandById.get(item.band_entity_id)
        const fallbackName = assignmentNameById.get(item.music_assignment_id) || ''
        const name = item.band_name || entity?.name || fallbackName
        if (!name) return

        const key = item.band_entity_id || normalize(name)
        const current = groupedBands.get(key) || {
          id: item.music_assignment_id,
          entityId: item.band_entity_id,
          name,
          href: entity?.status === 'published' ? entityHref(entity) : '',
          contexts: [],
        }
        const context = item.position_label || [item.segment_start_label, item.segment_end_label].filter(Boolean).join(' → ')
        if (context && !current.contexts.includes(context)) current.contexts.push(context)
        groupedBands.set(key, current)
      })

    const placeEntries = new Map()
    visibleScheduleRows.forEach((item) => {
      const resolved = placeById.get(item.place_id)
      const name = resolved?.name || String(item.place_text || '').trim()
      if (!name) return
      const key = item.place_id || `text:${normalize(name)}`
      if (!placeEntries.has(key)) {
        placeEntries.set(key, {
          id: key,
          name,
          type: resolved?.place_type || '',
        })
      }
    })

    return {
      schedule: visibleScheduleRows.map((item) => ({
        id: item.id,
        label: item.label,
        itemDate: item.item_date || outingDate || '',
        dayLabel: item.item_date && outingDate && item.item_date !== outingDate ? shortDateLabel(item.item_date) : '',
        time: timeLabel(item.item_time) || item.time_text || '',
        place: placeById.get(item.place_id)?.name || item.place_text || '',
        notes: item.notes || '',
      })),
      bands: [...groupedBands.values()].map((item) => ({
        id: item.id,
        entityId: item.entityId,
        name: item.name,
        href: item.href,
        context: item.contexts.join(' · '),
      })),
      liturgicalMusic: participantRows
        .map((item) => ({
          id: item.entity_id,
          name: participantById.get(item.entity_id)?.name || '',
          notes: item.notes || '',
        }))
        .filter((item) => item.name),
      places: [...placeEntries.values()],
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el briefing de la salida', {
      outingId,
      error: error instanceof Error ? error.message : String(error),
    })
    return fallback
  }
}
