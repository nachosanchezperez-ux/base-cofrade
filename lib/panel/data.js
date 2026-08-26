import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result
}

function optionalTable(result) {
  return ['PGRST205', '42P01'].includes(result.error?.code) ? [] : null
}

function count(result, label) {
  return assertQuery(result, label).count || 0
}

export async function getPanelDashboard() {
  const supabase = await createClient()
  const [published, review, draft, archived, media, outings, cults, heritageAssets, heritageUpdates, activity] = await Promise.all([
    supabase.from('entities').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('entities').select('*', { count: 'exact', head: true }).eq('status', 'review'),
    supabase.from('entities').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('entities').select('*', { count: 'exact', head: true }).eq('status', 'archived'),
    supabase.from('media_assets').select('*', { count: 'exact', head: true }),
    supabase.from('outings').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
    supabase.from('cults').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
    supabase.from('heritage_assets').select('*', { count: 'exact', head: true }),
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
      heritage: count(heritageAssets, 'No se pudieron contar las piezas patrimoniales')
        + count(heritageUpdates, 'No se pudieron contar las novedades patrimoniales'),
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

  const [brotherhood, colors, socialLinks, series, cults, heritage, heritageAssets, brotherhoodImages, brotherhoodSteps, municipalities, places] = await Promise.all([
    supabase.from('brotherhoods').select('*').eq('entity_id', id).maybeSingle(),
    supabase.from('brotherhood_colors').select('*').eq('brotherhood_entity_id', id).order('sort_order'),
    supabase.from('entity_social_links').select('*').eq('entity_id', id).order('display_order'),
    supabase.from('outing_series').select('*').eq('brotherhood_entity_id', id).order('display_order'),
    supabase.from('cults').select('*').eq('brotherhood_entity_id', id).order('display_order'),
    supabase.from('heritage_updates').select('*').eq('brotherhood_entity_id', id).order('year', { ascending: false }),
    supabase.from('heritage_assets').select('*').eq('parent_entity_id', id).order('display_order'),
    supabase.from('brotherhood_images').select('image_entity_id').eq('brotherhood_entity_id', id).neq('status', 'archived'),
    supabase.from('brotherhood_steps').select('step_entity_id').eq('brotherhood_entity_id', id).neq('status', 'archived'),
    supabase.from('municipalities').select('id, name, province').order('name'),
    supabase.from('places').select('id, name, municipality_id').order('name'),
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

  const assetRows = assertQuery(heritageAssets, 'No se pudieron cargar las piezas patrimoniales').data || []
  const assetIds = assetRows.map((item) => item.entity_id)
  const imageIds = (assertQuery(brotherhoodImages, 'No se pudieron cargar los titulares').data || []).map((item) => item.image_entity_id)
  const stepIds = (assertQuery(brotherhoodSteps, 'No se pudieron cargar los pasos').data || []).map((item) => item.step_entity_id)
  const relatedMediaEntityIds = [...new Set([...assetIds, ...imageIds, ...stepIds].filter(Boolean))]
  const [relatedEntities, interventions, agents, mediaLinks] = await Promise.all([
    relatedMediaEntityIds.length
      ? supabase.from('entities').select('id, name, slug, summary, status').in('id', relatedMediaEntityIds)
      : Promise.resolve({ data: [], error: null }),
    assetIds.length
      ? supabase.from('heritage_interventions').select('*').in('target_entity_id', assetIds).order('date_from', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'agent').neq('status', 'archived').order('name'),
    supabase
      .from('entity_media')
      .select('id, entity_id, media_asset_id, relation_type, sort_order, is_cover, notes, media_assets(id, storage_path, media_type, title, caption, alt_text, author_name, rights_status)')
      .in('entity_id', [id, ...relatedMediaEntityIds])
      .order('sort_order'),
  ])

  const relatedEntityRows = assertQuery(relatedEntities, 'No se pudieron cargar las entidades relacionadas').data || []
  const interventionRows = assertQuery(interventions, 'No se pudieron cargar las autorías patrimoniales').data || []
  const agentRows = assertQuery(agents, 'No se pudieron cargar los autores y talleres').data || []
  const relatedEntityById = new Map(relatedEntityRows.map((item) => [item.id, item]))
  const agentById = new Map(agentRows.map((item) => [item.id, item]))

  const media = (assertQuery(mediaLinks, 'No se pudo cargar el archivo visual').data || []).map((link) => {
    const asset = link.media_assets
    const publicUrl = asset?.storage_path
      ? asset.storage_path.startsWith('/')
        ? asset.storage_path
        : supabase.storage.from('hilo-media').getPublicUrl(asset.storage_path).data.publicUrl
      : ''
    return {
      ...link,
      asset,
      publicUrl,
      targetName: link.entity_id === id
        ? entity.name
        : relatedEntityById.get(link.entity_id)?.name || 'Entidad relacionada',
    }
  })

  const assets = assetRows
    .map((asset) => {
      const assetEntity = relatedEntityById.get(asset.entity_id)
      if (!assetEntity) return null

      return {
        ...asset,
        entity: assetEntity,
        contributions: interventionRows
          .filter((item) => item.target_entity_id === asset.entity_id)
          .map((item) => ({
            ...item,
            agentName: agentById.get(item.agent_entity_id)?.name || 'Agente no disponible',
          })),
        media: media.filter((item) => item.entity_id === asset.entity_id),
      }
    })
    .filter(Boolean)

  return {
    entity,
    brotherhood: assertQuery(brotherhood, 'No se pudo cargar la ficha').data,
    colors: assertQuery(colors, 'No se pudieron cargar los colores').data || [],
    socialLinks: optionalTable(socialLinks)
      || assertQuery(socialLinks, 'No se pudieron cargar la web y las redes sociales').data
      || [],
    series: seriesRows.map((item) => ({ ...item, movements: movementsBySeries.get(item.id) || [] })),
    cults: assertQuery(cults, 'No se pudieron cargar los cultos').data || [],
    heritage: assertQuery(heritage, 'No se pudieron cargar las novedades patrimoniales').data || [],
    assets,
    agents: agentRows,
    municipalities: assertQuery(municipalities, 'No se pudieron cargar las localidades').data || [],
    places: assertQuery(places, 'No se pudieron cargar los lugares').data || [],
    media,
  }
}

export async function getPanelBands({ query = '', status = '' } = {}) {
  const supabase = await createClient()
  let entityQuery = supabase
    .from('entities')
    .select('id, name, slug, summary, status, updated_at')
    .eq('entity_type', 'band')
    .order('name')

  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)

  const entities = assertQuery(await entityQuery, 'No se pudieron cargar las bandas').data || []
  if (!entities.length) return []
  const ids = entities.map((item) => item.id)
  const [bandsResult, namesResult] = await Promise.all([
    supabase.from('bands').select('*').in('entity_id', ids),
    supabase.from('band_names').select('*').in('band_entity_id', ids).eq('is_current', true),
  ])
  const bands = assertQuery(bandsResult, 'No se pudieron cargar las fichas de bandas').data || []
  const names = assertQuery(namesResult, 'No se pudieron cargar los nombres de bandas').data || []
  const municipalityIds = [...new Set(bands.map((item) => item.municipality_id).filter(Boolean))]
  const municipalities = municipalityIds.length
    ? assertQuery(
        await supabase.from('municipalities').select('id, name').in('id', municipalityIds),
        'No se pudieron cargar las localidades'
      ).data || []
    : []
  const bandById = new Map(bands.map((item) => [item.entity_id, item]))
  const municipalityById = new Map(municipalities.map((item) => [item.id, item.name]))

  return entities.map((entity) => {
    const band = bandById.get(entity.id) || {}
    const bandNames = names.filter((item) => item.band_entity_id === entity.id)
    return {
      ...entity,
      popularName: bandNames.find((item) => item.name_type === 'popular')?.name || entity.name,
      officialName: bandNames.find((item) => item.name_type === 'official')?.name || entity.name,
      type: band.band_type || 'Formación musical',
      municipality: municipalityById.get(band.municipality_id) || 'Sin localidad',
      logoPath: band.logo_path || '',
    }
  })
}

export async function getBandEditorData(id) {
  const supabase = await createClient()
  const entity = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug, summary, status, updated_at')
      .eq('id', id)
      .eq('entity_type', 'band')
      .maybeSingle(),
    'No se pudo cargar la banda'
  ).data
  if (!entity) return null

  const [bandResult, namesResult, directionResult, periodsResult, premieresResult, assignmentsResult, heritageAssetsResult, municipalitiesResult, brotherhoodEntitiesResult, agentEntitiesResult, linkedBrotherhoodRelationResult, socialLinksResult] = await Promise.all([
    supabase.from('bands').select('*').eq('entity_id', id).maybeSingle(),
    supabase.from('band_names').select('*').eq('band_entity_id', id).order('is_current', { ascending: false }),
    supabase.from('band_agents').select('*').eq('band_entity_id', id).order('is_current', { ascending: false }),
    supabase.from('music_accompaniment_periods').select('*').eq('band_entity_id', id).order('year_from', { ascending: false }),
    supabase.from('band_premieres').select('*').eq('band_entity_id', id).order('premiere_year', { ascending: false }).order('display_order'),
    supabase.from('outing_music_assignments').select('*').eq('band_entity_id', id).order('created_at', { ascending: false }),
    supabase.from('heritage_assets').select('*').eq('parent_entity_id', id).eq('asset_type', 'Banderín').order('display_order').limit(1),
    supabase.from('municipalities').select('id, name, province').order('name'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'brotherhood').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'agent').neq('status', 'archived').order('name'),
    supabase
      .from('entity_relations')
      .select('id, target_entity_id, status')
      .eq('source_entity_id', id)
      .eq('relation_type', 'belongs_to_brotherhood')
      .neq('status', 'archived')
      .limit(1)
      .maybeSingle(),
    supabase.from('entity_social_links').select('*').eq('entity_id', id).order('display_order'),
  ])

  const names = assertQuery(namesResult, 'No se pudieron cargar los nombres').data || []
  const direction = assertQuery(directionResult, 'No se pudo cargar la dirección').data || []
  const periods = assertQuery(periodsResult, 'No se pudieron cargar los acompañamientos').data || []
  const premieres = assertQuery(premieresResult, 'No se pudieron cargar los estrenos').data || []
  const assignments = assertQuery(assignmentsResult, 'No se pudieron cargar las salidas extraordinarias').data || []
  const heritageAssets = assertQuery(heritageAssetsResult, 'No se pudo cargar el patrimonio de la banda').data || []
  const agents = assertQuery(agentEntitiesResult, 'No se pudieron cargar los autores y talleres').data || []
  const relatedEntityIds = [...new Set([
    ...direction.map((item) => item.agent_entity_id),
    ...periods.map((item) => item.brotherhood_entity_id),
    ...periods.map((item) => item.step_entity_id),
  ].filter(Boolean))]
  const relatedEntities = relatedEntityIds.length
    ? assertQuery(
        await supabase.from('entities').select('id, name, slug, entity_type').in('id', relatedEntityIds),
        'No se pudieron cargar las entidades relacionadas'
      ).data || []
    : []
  const relatedById = new Map(relatedEntities.map((item) => [item.id, item]))
  const agentById = new Map(agents.map((item) => [item.id, item]))

  const marchIds = [...new Set(premieres.map((item) => item.march_entity_id).filter(Boolean))]
  const heritageAssetIds = heritageAssets.map((item) => item.entity_id)
  const [marchAuthorsResult, heritageEntitiesResult, heritageInterventionsResult] = await Promise.all([
    marchIds.length
      ? supabase.from('march_authors').select('*').in('march_entity_id', marchIds).neq('status', 'archived')
      : Promise.resolve({ data: [], error: null }),
    heritageAssetIds.length
      ? supabase.from('entities').select('id, name, slug, summary, status').in('id', heritageAssetIds)
      : Promise.resolve({ data: [], error: null }),
    heritageAssetIds.length
      ? supabase.from('heritage_interventions').select('*').in('target_entity_id', heritageAssetIds).neq('status', 'archived').order('date_from', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ])
  const marchAuthors = assertQuery(marchAuthorsResult, 'No se pudieron cargar las autorías musicales').data || []
  const heritageEntities = assertQuery(heritageEntitiesResult, 'No se pudieron cargar las entidades patrimoniales').data || []
  const heritageInterventions = assertQuery(heritageInterventionsResult, 'No se pudieron cargar las intervenciones patrimoniales').data || []
  const heritageEntityById = new Map(heritageEntities.map((item) => [item.id, item]))

  const sourceIds = [...new Set(premieres.map((item) => item.source_id).filter(Boolean))]
  const sources = sourceIds.length
    ? assertQuery(
        await supabase.from('sources').select('*').in('id', sourceIds),
        'No se pudieron cargar las fuentes'
      ).data || []
    : []
  const sourceById = new Map(sources.map((item) => [item.id, item]))

  const positionIds = [...new Set(assignments.map((item) => item.music_position_id).filter(Boolean))]
  const positions = positionIds.length
    ? assertQuery(
        await supabase.from('outing_music_positions').select('*').in('id', positionIds),
        'No se pudieron cargar las posiciones musicales'
      ).data || []
    : []
  const positionById = new Map(positions.map((item) => [item.id, item]))
  const outingIds = [...new Set(positions.map((item) => item.outing_id).filter(Boolean))]
  const outings = outingIds.length
    ? assertQuery(
        await supabase.from('outings').select('*').in('id', outingIds).order('outing_date', { ascending: false }),
        'No se pudieron cargar las salidas'
      ).data || []
    : []
  const outingById = new Map(outings.map((item) => [item.id, item]))

  return {
    entity,
    band: assertQuery(bandResult, 'No se pudo cargar la ficha de banda').data,
    officialName: names.find((item) => item.name_type === 'official' && item.is_current) || names.find((item) => item.name_type === 'official'),
    popularName: names.find((item) => item.name_type === 'popular' && item.is_current) || names.find((item) => item.name_type === 'popular'),
    direction: direction.map((item) => ({ ...item, agent: relatedById.get(item.agent_entity_id) || null })),
    periods: periods.map((item) => ({
      ...item,
      brotherhood: relatedById.get(item.brotherhood_entity_id) || null,
      step: relatedById.get(item.step_entity_id) || null,
    })),
    premieres: premieres.map((item) => {
      const credits = marchAuthors
        .filter((credit) => credit.march_entity_id === item.march_entity_id)
        .map((credit) => ({ ...credit, agent: agentById.get(credit.agent_entity_id) || null }))
      return {
        ...item,
        source: sourceById.get(item.source_id) || null,
        credits,
        composerName: credits.find((credit) => credit.author_role === 'composer')?.agent?.name || item.composer_name,
        adapterName: credits.find((credit) => credit.author_role === 'adapter')?.agent?.name || '',
      }
    }),
    assets: heritageAssets.map((item) => ({
      ...item,
      entity: heritageEntityById.get(item.entity_id) || null,
      contributions: heritageInterventions
        .filter((contribution) => contribution.target_entity_id === item.entity_id)
        .map((contribution) => ({ ...contribution, agentName: agentById.get(contribution.agent_entity_id)?.name || 'Agente no disponible' })),
    })).filter((item) => item.entity),
    outings: assignments.map((assignment) => {
      const position = positionById.get(assignment.music_position_id)
      const outing = position ? outingById.get(position.outing_id) : null
      return outing ? { ...outing, position, assignment } : null
    }).filter(Boolean),
    linkedBrotherhoodRelation: assertQuery(linkedBrotherhoodRelationResult, 'No se pudo cargar la hermandad vinculada').data,
    municipalities: assertQuery(municipalitiesResult, 'No se pudieron cargar las localidades').data || [],
    brotherhoods: assertQuery(brotherhoodEntitiesResult, 'No se pudieron cargar las hermandades').data || [],
    agents,
    socialLinks: assertQuery(socialLinksResult, 'No se pudieron cargar los enlaces de interés').data || [],
  }
}
