import 'server-only'

import { createClient } from '@/lib/supabase/server'

function relationOne(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

function assetPublicUrl(supabase, storagePath = '') {
  if (!storagePath) return ''
  if (storagePath.startsWith('/')) return storagePath
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) return storagePath
  return supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl || ''
}

function mapOutingMedia(supabase, rows = []) {
  return rows.map((row) => {
    const asset = relationOne(row.media_assets)
    return {
      id: row.id,
      role: row.role,
      sortOrder: row.sort_order || 0,
      mediaAssetId: row.media_asset_id,
      path: assetPublicUrl(supabase, asset?.storage_path || ''),
      storagePath: asset?.storage_path || '',
      title: asset?.title || '',
      alt: asset?.alt_text || '',
      credit: asset?.author_name || '',
      rightsStatus: asset?.rights_status || '',
    }
  })
}

async function loadExtraordinary(supabase, id, fields = '*') {
  const result = await supabase
    .from('outings')
    .select(fields)
    .eq('id', id)
    .eq('character', 'extraordinary')
    .maybeSingle()

  if (result.error) throw new Error(`No se pudo cargar la extraordinaria: ${result.error.message}`)
  return result.data || null
}

async function loadPlaceOptions(supabase) {
  const result = await supabase
    .from('places')
    .select('id, name, municipality_id, place_type, municipalities(name, province)')
    .order('name')
    .limit(1000)
  if (result.error) throw new Error(`No se pudieron cargar los lugares: ${result.error.message}`)
  return (result.data || [])
    .map((item) => ({
      id: item.id,
      name: item.name,
      municipalityId: item.municipality_id || '',
      municipality: relationOne(item.municipalities)?.name || '',
      province: relationOne(item.municipalities)?.province || '',
      placeType: item.place_type || '',
    }))
    .filter((item) => !item.province || item.province === 'Sevilla')
}

export async function getPanelExtraordinaryOutings({ query = '', eventStatus = '' } = {}) {
  const supabase = await createClient()
  let request = supabase
    .from('outings')
    .select('id, reference_code, slug, title, outing_type, outing_date, event_status, status, organizer_name, hero_image_path, municipalities(name)')
    .eq('character', 'extraordinary')
    .neq('status', 'archived')
    .order('outing_date', { ascending: true, nullsFirst: false })

  if (eventStatus) request = request.eq('event_status', eventStatus)

  const { data, error } = await request
  if (error) throw new Error(`No se pudieron cargar las extraordinarias del panel: ${error.message}`)

  const outingIds = (data || []).map((item) => item.id)
  const mediaRows = outingIds.length
    ? await supabase.from('outing_media').select('outing_id, role').in('outing_id', outingIds)
    : { data: [], error: null }
  if (mediaRows.error) throw new Error(`No se pudo comprobar la multimedia de las extraordinarias: ${mediaRows.error.message}`)

  const mediaCounts = new Map()
  for (const row of mediaRows.data || []) {
    const current = mediaCounts.get(row.outing_id) || { poster: false, gallery: 0 }
    if (row.role === 'poster') current.poster = true
    if (row.role === 'gallery') current.gallery += 1
    mediaCounts.set(row.outing_id, current)
  }

  const needle = normalize(query)
  return (data || [])
    .map((item) => ({
      ...item,
      municipality: relationOne(item.municipalities)?.name || '',
      hasPhoto: Boolean(item.hero_image_path),
      hasPoster: mediaCounts.get(item.id)?.poster || false,
      galleryCount: mediaCounts.get(item.id)?.gallery || 0,
    }))
    .filter((item) => {
      if (!needle) return true
      return normalize([
        item.title,
        item.organizer_name,
        item.municipality,
        item.reference_code,
        item.outing_type,
      ].filter(Boolean).join(' ')).includes(needle)
    })
}

export async function getPanelExtraordinaryOuting(id) {
  const supabase = await createClient()
  const data = await loadExtraordinary(
    supabase,
    id,
    'id, reference_code, slug, title, outing_type, outing_date, departure_time, return_date, return_time, reason, description, public_notes, event_status, status, organizer_name, hero_image_path, hero_image_alt, hero_image_credit, municipalities(name)'
  )
  if (!data) return null

  const [scheduleResult, musicResult, sourceResult, outingMediaResult] = await Promise.all([
    supabase.from('outing_schedule_items').select('id', { count: 'exact', head: true }).eq('outing_id', id),
    supabase.from('outing_music_positions').select('id', { count: 'exact', head: true }).eq('outing_id', id).neq('status', 'archived'),
    supabase.from('source_links').select('id', { count: 'exact', head: true }).eq('outing_id', id),
    supabase
      .from('outing_media')
      .select('id, role, sort_order, media_asset_id, media_assets(id, storage_path, title, alt_text, author_name, rights_status)')
      .eq('outing_id', id)
      .order('role')
      .order('sort_order'),
  ])

  if (scheduleResult.error) throw new Error(`No se pudieron contar los horarios: ${scheduleResult.error.message}`)
  if (musicResult.error) throw new Error(`No se pudo contar la música: ${musicResult.error.message}`)
  if (sourceResult.error) throw new Error(`No se pudieron contar las fuentes: ${sourceResult.error.message}`)
  if (outingMediaResult.error) throw new Error(`No se pudo cargar la multimedia: ${outingMediaResult.error.message}`)

  const media = mapOutingMedia(supabase, outingMediaResult.data || [])

  return {
    ...data,
    municipality: relationOne(data.municipalities)?.name || '',
    scheduleCount: scheduleResult.count || 0,
    musicCount: musicResult.count || 0,
    sourceCount: sourceResult.count || 0,
    poster: media.find((item) => item.role === 'poster') || null,
    gallery: media.filter((item) => item.role === 'gallery').sort((a, b) => a.sortOrder - b.sortOrder),
  }
}

export async function getExtraordinaryGeneralEditorData(id) {
  const supabase = await createClient()
  const [outing, municipalitiesResult, brotherhoodsResult, places] = await Promise.all([
    loadExtraordinary(
      supabase,
      id,
      'id, reference_code, slug, title, outing_type, outing_date, year, departure_time, return_date, return_time, municipality_id, brotherhood_entity_id, origin_place_id, destination_place_id, origin_text, destination_text, reason, route_summary, description, public_notes, organizer_name, organizer_notes, event_status, status, hero_image_path, municipalities(name)'
    ),
    supabase.from('municipalities').select('id, name, province').eq('province', 'Sevilla').order('name'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'brotherhood').neq('status', 'archived').order('name'),
    loadPlaceOptions(supabase),
  ])

  if (!outing) return null
  if (municipalitiesResult.error) throw new Error(`No se pudieron cargar los municipios: ${municipalitiesResult.error.message}`)
  if (brotherhoodsResult.error) throw new Error(`No se pudieron cargar las Hermandades: ${brotherhoodsResult.error.message}`)

  return {
    outing: {
      ...outing,
      municipality: relationOne(outing.municipalities)?.name || '',
    },
    municipalities: municipalitiesResult.data || [],
    brotherhoods: brotherhoodsResult.data || [],
    places,
  }
}

export async function getExtraordinaryScheduleEditorData(id) {
  const supabase = await createClient()
  const outing = await loadExtraordinary(
    supabase,
    id,
    'id, slug, title, outing_date, municipality_id, organizer_name, event_status, status, municipalities(name)'
  )
  if (!outing) return null

  const [itemsResult, places] = await Promise.all([
    supabase
      .from('outing_schedule_items')
      .select('id, sequence_no, label, item_date, item_time, time_text, place_id, place_text, notes, places(name)')
      .eq('outing_id', id)
      .order('sequence_no'),
    loadPlaceOptions(supabase),
  ])
  if (itemsResult.error) throw new Error(`No se pudieron cargar los horarios: ${itemsResult.error.message}`)

  return {
    outing: { ...outing, municipality: relationOne(outing.municipalities)?.name || '' },
    items: (itemsResult.data || []).map((item) => ({
      ...item,
      placeName: relationOne(item.places)?.name || item.place_text || '',
    })),
    places,
  }
}

export async function getExtraordinaryMusicEditorData(id) {
  const supabase = await createClient()
  const outing = await loadExtraordinary(
    supabase,
    id,
    'id, slug, title, organizer_name, event_status, status, municipalities(name)'
  )
  if (!outing) return null

  const [positionsResult, bandsResult] = await Promise.all([
    supabase
      .from('outing_music_positions')
      .select('id, outing_id, step_entity_id, position_code, position_label, sequence_no, notes, status')
      .eq('outing_id', id)
      .order('sequence_no'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'band')
      .neq('status', 'archived')
      .order('name'),
  ])
  if (positionsResult.error) throw new Error(`No se pudieron cargar los momentos musicales: ${positionsResult.error.message}`)
  if (bandsResult.error) throw new Error(`No se pudieron cargar las bandas: ${bandsResult.error.message}`)

  const positions = positionsResult.data || []
  const positionIds = positions.map((item) => item.id)
  const assignmentsResult = positionIds.length
    ? await supabase
        .from('outing_music_assignments')
        .select('id, music_position_id, band_entity_id, band_name_text, participation_mode, sequence_no, segment_start_label, segment_end_label, notes, status, entities(name, slug, status)')
        .in('music_position_id', positionIds)
        .order('sequence_no')
    : { data: [], error: null }
  if (assignmentsResult.error) throw new Error(`No se pudieron cargar los acompañamientos: ${assignmentsResult.error.message}`)

  const assignmentsByPosition = new Map()
  for (const assignment of assignmentsResult.data || []) {
    const current = assignmentsByPosition.get(assignment.music_position_id) || []
    const entity = relationOne(assignment.entities)
    current.push({
      ...assignment,
      bandName: entity?.name || assignment.band_name_text || 'Formación por documentar',
    })
    assignmentsByPosition.set(assignment.music_position_id, current)
  }

  return {
    outing: { ...outing, municipality: relationOne(outing.municipalities)?.name || '' },
    positions: positions.map((position) => ({
      ...position,
      assignments: assignmentsByPosition.get(position.id) || [],
    })),
    bands: bandsResult.data || [],
  }
}

export async function getExtraordinarySourceEditorData(id) {
  const supabase = await createClient()
  const outing = await loadExtraordinary(
    supabase,
    id,
    'id, slug, title, organizer_name, event_status, status, municipalities(name)'
  )
  if (!outing) return null

  const linksResult = await supabase
    .from('source_links')
    .select('id, source_id, scope, notes, sources(id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)')
    .eq('outing_id', id)
    .order('created_at', { ascending: false })
  if (linksResult.error) throw new Error(`No se pudieron cargar las fuentes: ${linksResult.error.message}`)

  const sourceTypesResult = await supabase.from('sources').select('source_type').order('source_type').limit(1000)
  if (sourceTypesResult.error) throw new Error(`No se pudieron cargar los tipos de fuente: ${sourceTypesResult.error.message}`)

  return {
    outing: { ...outing, municipality: relationOne(outing.municipalities)?.name || '' },
    links: (linksResult.data || []).map((link) => ({
      ...link,
      source: relationOne(link.sources),
    })),
    sourceTypes: [...new Set((sourceTypesResult.data || []).map((item) => item.source_type).filter(Boolean))],
  }
}
