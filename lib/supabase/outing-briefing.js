import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

function entityHref(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

export async function getOutingBriefing(outingId) {
  const fallback = { schedule: [], bands: [], liturgicalMusic: [], places: [] }
  if (!outingId) return fallback

  try {
    const supabase = await createClient()
    const [scheduleResult, musicResult, participantResult] = await Promise.all([
      supabase
        .from('outing_schedule_items')
        .select('id, sequence_no, label, item_time, time_text, place_id, notes')
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

    const placeIds = [...new Set(scheduleRows.map((item) => item.place_id).filter(Boolean))]
    const places = placeIds.length
      ? assertRows(
          await supabase.from('places').select('id, name, slug, place_type').in('id', placeIds),
          'No se pudieron consultar los lugares de la salida'
        )
      : []
    const placeById = new Map(places.map((place) => [place.id, place]))

    const bandIds = [...new Set(musicRows.map((item) => item.band_entity_id).filter(Boolean))]
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

    return {
      schedule: scheduleRows.map((item) => ({
        id: item.id,
        label: item.label,
        time: timeLabel(item.item_time) || item.time_text || '',
        place: placeById.get(item.place_id)?.name || '',
        notes: item.notes || '',
      })),
      bands: musicRows.map((item) => {
        const entity = bandById.get(item.band_entity_id)
        return {
          id: item.music_assignment_id,
          entityId: item.band_entity_id,
          name: item.band_name,
          href: entity?.status === 'published' ? entityHref(entity) : '',
          context: item.position_label || [item.segment_start_label, item.segment_end_label].filter(Boolean).join(' → '),
        }
      }),
      liturgicalMusic: participantRows
        .map((item) => ({
          id: item.entity_id,
          name: participantById.get(item.entity_id)?.name || '',
          notes: item.notes || '',
        }))
        .filter((item) => item.name),
      places: places.map((place) => ({ id: place.id, name: place.name, type: place.place_type || '' })),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el briefing de la salida', {
      outingId,
      error: error instanceof Error ? error.message : String(error),
    })
    return fallback
  }
}
