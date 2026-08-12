import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result
}

function count(result, label) {
  return assertQuery(result, label).count || 0
}

export async function getPanelDashboard() {
  const supabase = await createClient()
  const [published, review, draft, archived, media, outings, cults, heritage, activity] = await Promise.all([
    supabase.from('entities').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('entities').select('*', { count: 'exact', head: true }).eq('status', 'review'),
    supabase.from('entities').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('entities').select('*', { count: 'exact', head: true }).eq('status', 'archived'),
    supabase.from('media_assets').select('*', { count: 'exact', head: true }),
    supabase.from('outings').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
    supabase.from('cults').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
    supabase.from('heritage_updates').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
    supabase.from('audit_log').select('id, actor_label, action_type, object_type, summary, created_at').order('created_at', { ascending: false }).limit(6),
  ])

  return {
    entities: {
      published: count(published, 'No se pudo contar el contenido publicado'),
      review: count(review, 'No se pudo contar el contenido en revisión'),
      draft: count(draft, 'No se pudo contar los borradores'),
      archived: count(archived, 'No se pudo contar el contenido archivado'),
    },
    modules: {
      media: count(media, 'No se pudo contar el archivo visual'),
      outings: count(outings, 'No se pudo contar las salidas'),
      cults: count(cults, 'No se pudo contar los cultos'),
      heritage: count(heritage, 'No se pudo contar las novedades patrimoniales'),
    },
    activity: assertQuery(activity, 'No se pudo cargar la actividad').data || [],
  }
}

export async function getPanelUsers() {
  const supabase = await createClient()
  return assertQuery(
    await supabase
      .from('panel_users')
      .select('user_id, display_name, role, active, created_at, updated_at')
      .order('display_name'),
    'No se pudo cargar el equipo editorial'
  ).data || []
}

export async function getPanelBrotherhoods({ query = '', status = '' } = {}) {
  const supabase = await createClient()
  let entityQuery = supabase
    .from('entities')
    .select('id, name, slug, summary, status, updated_at')
    .eq('entity_type', 'brotherhood')
    .order('name')

  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)

  const entities = assertQuery(await entityQuery, 'No se pudieron cargar las hermandades').data || []
  if (!entities.length) return []

  const rows = assertQuery(
    await supabase
      .from('brotherhoods')
      .select('entity_id, official_name, popular_name, municipality_id, current_procession_day, crest_path')
      .in('entity_id', entities.map((entity) => entity.id)),
    'No se pudieron cargar las fichas'
  ).data || []
  const municipalityIds = [...new Set(rows.map((row) => row.municipality_id).filter(Boolean))]
  const municipalities = municipalityIds.length
    ? assertQuery(
        await supabase.from('municipalities').select('id, name').in('id', municipalityIds),
        'No se pudieron cargar las localidades'
      ).data || []
    : []
  const rowById = new Map(rows.map((row) => [row.entity_id, row]))
  const municipalityById = new Map(municipalities.map((item) => [item.id, item.name]))

  return entities.map((entity) => {
    const row = rowById.get(entity.id) || {}
    return {
      ...entity,
      officialName: row.official_name || entity.name,
      popularName: row.popular_name || entity.name,
      municipality: municipalityById.get(row.municipality_id) || 'Sin localidad',
      processionDay: row.current_procession_day || 'Por documentar',
      crestPath: row.crest_path || '',
    }
  })
}

export async function getBrotherhoodEditorData(id) {
  const supabase = await createClient()
  const entity = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug, summary, status, updated_at')
      .eq('id', id)
      .eq('entity_type', 'brotherhood')
      .maybeSingle(),
    'No se pudo cargar la entidad'
  ).data

  if (!entity) return null

  const [brotherhood, colors, series, cults, heritage, municipalities, places, mediaLinks] = await Promise.all([
    supabase.from('brotherhoods').select('*').eq('entity_id', id).maybeSingle(),
    supabase.from('brotherhood_colors').select('*').eq('brotherhood_entity_id', id).order('sort_order'),
    supabase.from('outing_series').select('*').eq('brotherhood_entity_id', id).order('display_order'),
    supabase.from('cults').select('*').eq('brotherhood_entity_id', id).order('display_order'),
    supabase.from('heritage_updates').select('*').eq('brotherhood_entity_id', id).order('year', { ascending: false }),
    supabase.from('municipalities').select('id, name, province').order('name'),
    supabase.from('places').select('id, name, municipality_id').order('name'),
    supabase.from('entity_media').select('id, media_asset_id, relation_type, sort_order, is_cover, notes, media_assets(id, storage_path, media_type, title, caption, alt_text, author_name, rights_status)').eq('entity_id', id).order('sort_order'),
  ])

  const seriesRows = assertQuery(series, 'No se pudieron cargar las salidas recurrentes').data || []
  const seriesIds = seriesRows.map((item) => item.id)
  const movementRows = seriesIds.length
    ? assertQuery(
        await supabase.from('outing_series_movements').select('*').in('outing_series_id', seriesIds).order('sequence_no'),
        'No se pudieron cargar los movimientos'
      ).data || []
    : []
  const movementsBySeries = new Map()
  movementRows.forEach((movement) => {
    const list = movementsBySeries.get(movement.outing_series_id) || []
    list.push(movement)
    movementsBySeries.set(movement.outing_series_id, list)
  })

  const media = (assertQuery(mediaLinks, 'No se pudo cargar el archivo visual').data || []).map((link) => {
    const asset = link.media_assets
    const publicUrl = asset?.storage_path
      ? supabase.storage.from('hilo-media').getPublicUrl(asset.storage_path).data.publicUrl
      : ''
    return { ...link, asset, publicUrl }
  })

  return {
    entity,
    brotherhood: assertQuery(brotherhood, 'No se pudo cargar la ficha').data,
    colors: assertQuery(colors, 'No se pudieron cargar los colores').data || [],
    series: seriesRows.map((item) => ({ ...item, movements: movementsBySeries.get(item.id) || [] })),
    cults: assertQuery(cults, 'No se pudieron cargar los cultos').data || [],
    heritage: assertQuery(heritage, 'No se pudieron cargar las novedades patrimoniales').data || [],
    municipalities: assertQuery(municipalities, 'No se pudieron cargar las localidades').data || [],
    places: assertQuery(places, 'No se pudieron cargar los lugares').data || [],
    media,
  }
}
