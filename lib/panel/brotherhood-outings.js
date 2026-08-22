import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'

function row(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function entityOption(entity, label = '') {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug || '',
    meta: [label || entity.entity_type, entity.status].filter(Boolean).join(' · '),
  }
}

export async function getBrotherhoodOutingsEditorData(brotherhoodId) {
  const supabase = await createClient()
  const [
    entityResult,
    brotherhoodResult,
    outingsResult,
    municipalitiesResult,
    placesResult,
    seriesResult,
    imagesResult,
    bandsResult,
    stepsResult,
    participantEntitiesResult,
  ] = await Promise.all([
    supabase.from('entities').select('id, name, slug, status').eq('id', brotherhoodId).eq('entity_type', 'brotherhood').maybeSingle(),
    supabase.from('brotherhoods').select('entity_id, popular_name, official_name, municipality_id, current_procession_day').eq('entity_id', brotherhoodId).maybeSingle(),
    supabase.from('outings').select('*').eq('brotherhood_entity_id', brotherhoodId).neq('status', 'archived').order('outing_date', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }),
    supabase.from('municipalities').select('id, name, province').order('name'),
    supabase.from('places').select('id, name, municipality_id, place_type').order('name'),
    supabase.from('outing_series').select('id, title, outing_type, status').eq('brotherhood_entity_id', brotherhoodId).neq('status', 'archived').order('display_order'),
    supabase.from('entities').select('id, entity_type, name, slug, status').eq('entity_type', 'image').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, entity_type, name, slug, status').eq('entity_type', 'band').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, entity_type, name, slug, status').eq('entity_type', 'step').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, entity_type, name, slug, status').in('entity_type', ['image', 'band', 'agent', 'brotherhood']).neq('status', 'archived').order('name'),
  ])

  const entity = row(entityResult, 'No se pudo cargar la Hermandad')
  const brotherhood = row(brotherhoodResult, 'No se pudo cargar la ficha de la Hermandad')
  if (!entity || !brotherhood) return null

  const outings = rows(outingsResult, 'No se pudieron cargar las salidas concretas')
  const outingIds = outings.map((outing) => outing.id)
  const [participantsResult, scheduleResult, positionsResult] = outingIds.length
    ? await Promise.all([
        supabase.from('outing_entities').select('*').in('outing_id', outingIds).order('role'),
        supabase.from('outing_schedule_items').select('*').in('outing_id', outingIds).order('sequence_no'),
        supabase.from('outing_music_positions').select('*').in('outing_id', outingIds).neq('status', 'archived').order('sequence_no'),
      ])
    : [{ data: [], error: null }, { data: [], error: null }, { data: [], error: null }]

  const participants = rows(participantsResult, 'No se pudieron cargar los participantes de las salidas')
  const schedule = rows(scheduleResult, 'No se pudieron cargar los hitos horarios de las salidas')
  const positions = rows(positionsResult, 'No se pudieron cargar las posiciones musicales')
  const positionIds = positions.map((position) => position.id)
  const assignments = positionIds.length
    ? rows(
        await supabase.from('outing_music_assignments').select('*').in('music_position_id', positionIds).neq('status', 'archived').order('sequence_no'),
        'No se pudieron cargar las asignaciones musicales'
      )
    : []

  const participantEntities = rows(participantEntitiesResult, 'No se pudieron cargar las entidades participantes')
  const participantById = new Map(participantEntities.map((item) => [item.id, item]))
  const bands = rows(bandsResult, 'No se pudieron cargar las Bandas')
  const bandById = new Map(bands.map((item) => [item.id, item]))
  const steps = rows(stepsResult, 'No se pudieron cargar los Pasos')
  const stepById = new Map(steps.map((item) => [item.id, item]))
  const places = rows(placesResult, 'No se pudieron cargar los lugares')
  const placeById = new Map(places.map((item) => [item.id, item]))
  const sourceSupport = await loadRelationSourceSupport(supabase, outings, 'outing')

  const positionsByOuting = new Map()
  for (const position of positions) {
    const list = positionsByOuting.get(position.outing_id) || []
    list.push({
      ...position,
      step: position.step_entity_id ? stepById.get(position.step_entity_id) || null : null,
      assignments: assignments
        .filter((assignment) => assignment.music_position_id === position.id)
        .map((assignment) => ({ ...assignment, band: bandById.get(assignment.band_entity_id) || null })),
    })
    positionsByOuting.set(position.outing_id, list)
  }

  return {
    entity,
    brotherhood,
    municipalities: rows(municipalitiesResult, 'No se pudieron cargar las localidades'),
    places,
    series: rows(seriesResult, 'No se pudieron cargar las series de salidas'),
    imageOptions: rows(imagesResult, 'No se pudieron cargar las Imágenes').map((item) => entityOption(item, 'Imagen')),
    bandOptions: bands.map((item) => entityOption(item, 'Banda')),
    stepOptions: steps.map((item) => entityOption(item, 'Paso')),
    participantOptions: participantEntities.map((item) => entityOption(item)),
    sourceOptions: sourceSupport.sourceOptions,
    outings: sourceSupport.relations.map((outing) => ({
      ...outing,
      originPlace: outing.origin_place_id ? placeById.get(outing.origin_place_id) || null : null,
      destinationPlace: outing.destination_place_id ? placeById.get(outing.destination_place_id) || null : null,
      participants: participants
        .filter((participant) => participant.outing_id === outing.id)
        .map((participant) => ({ ...participant, entity: participantById.get(participant.entity_id) || null })),
      schedule: schedule.filter((item) => item.outing_id === outing.id).map((item) => ({ ...item, place: item.place_id ? placeById.get(item.place_id) || null : null })),
      musicPositions: positionsByOuting.get(outing.id) || [],
    })),
  }
}
