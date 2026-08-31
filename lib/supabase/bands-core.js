import 'server-only'

import { resolveAccompanimentLocation } from '@/lib/bands/accompaniments'
import { isPublicEntityPageReady } from '@/lib/supabase/public-entity-page'
import { createPublicClient } from '@/lib/supabase/public'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function byId(rows) {
  return new Map(rows.map((row) => [row.id, row]))
}

function currentName(names, type) {
  return names.find((item) => item.name_type === type && item.is_current)
    || names.find((item) => item.name_type === type)
}

export function youtubeEmbedUrl(url) {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    let id = ''
    if (parsed.hostname.includes('youtu.be')) id = parsed.pathname.split('/').filter(Boolean)[0] || ''
    if (parsed.hostname.includes('youtube.com')) {
      id = parsed.searchParams.get('v') || parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1] || ''
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : ''
  } catch {
    return ''
  }
}

async function loadCore(supabase, entities) {
  const ids = entities.map((item) => item.id)
  if (!ids.length) return []

  const [bands, names, relations, socialLinks] = await Promise.all([
    supabase.from('bands').select('*').in('entity_id', ids),
    supabase.from('band_names').select('*').in('band_entity_id', ids).order('is_current', { ascending: false }),
    supabase
      .from('entity_relations')
      .select('source_entity_id, target_entity_id, relation_type')
      .in('source_entity_id', ids)
      .in('relation_type', ['belongs_to_brotherhood', 'associated_with_brotherhood'])
      .eq('status', 'published'),
    supabase.from('entity_social_links').select('*').in('entity_id', ids).eq('is_public', true).order('display_order'),
  ])
  const bandRows = assertQuery(bands, 'No se pudieron consultar las fichas de bandas')
  const nameRows = assertQuery(names, 'No se pudieron consultar los nombres de bandas')
  const relationRows = assertQuery(relations, 'No se pudieron consultar las vinculaciones de bandas')
  const socialLinkRows = assertQuery(socialLinks, 'No se pudieron consultar los enlaces de interés')
  const municipalityIds = unique(bandRows.map((item) => item.municipality_id))
  const municipalities = municipalityIds.length
    ? assertQuery(
        await supabase.from('municipalities').select('id, name, slug, province').in('id', municipalityIds),
        'No se pudieron consultar las localidades'
      )
    : []
  const linkedBrotherhoodIds = unique(relationRows.map((item) => item.target_entity_id))
  const linkedBrotherhoods = linkedBrotherhoodIds.length
    ? assertQuery(
        await supabase.from('entities').select('id, name, slug, status').in('id', linkedBrotherhoodIds),
        'No se pudieron consultar las hermandades vinculadas'
      )
    : []
  const bandById = new Map(bandRows.map((row) => [row.entity_id, row]))
  const municipalityById = byId(municipalities)
  const linkedBrotherhoodById = byId(linkedBrotherhoods)

  return entities.map((entity) => {
    const band = bandById.get(entity.id) || {}
    const bandNames = nameRows.filter((name) => name.band_entity_id === entity.id)
    const official = currentName(bandNames, 'official')
    const popular = currentName(bandNames, 'popular')
    const municipality = municipalityById.get(band.municipality_id) || {}
    const entityRelations = relationRows.filter((item) => item.source_entity_id === entity.id)
    const linkedRelation = entityRelations.find((item) => item.relation_type === 'belongs_to_brotherhood')
      || entityRelations.find((item) => item.relation_type === 'associated_with_brotherhood')
    const linkedBrotherhood = linkedBrotherhoodById.get(linkedRelation?.target_entity_id) || null
    return {
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      popularName: popular?.name || entity.name,
      officialName: official?.name || entity.name,
      officialShortName: official?.short_name || '',
      summary: entity.summary || '',
      type: band.band_type || 'Formación musical',
      typeSlug: slugify(band.band_type || 'Formación musical'),
      municipality: municipality.name || '',
      municipalitySlug: municipality.slug || '',
      province: municipality.province || '',
      foundation: band.foundation_text || '',
      description: band.description || entity.summary || '',
      linkedBrotherhood: linkedBrotherhood?.name || band.linked_brotherhood_name || '',
      linkedBrotherhoodSlug: linkedBrotherhood?.status === 'published' ? linkedBrotherhood.slug || '' : '',
      linkedBrotherhoodRelationType: linkedRelation?.relation_type
        || (band.linked_brotherhood_name ? 'associated_with_brotherhood' : ''),
      headquarters: band.headquarters_text || '',
      websiteUrl: band.website_url || '',
      youtubeUrl: band.youtube_url || '',
      instagramUrl: band.instagram_url || '',
      interestLinks: socialLinkRows
        .filter((link) => link.entity_id === entity.id)
        .map((link) => ({ id: link.id, platform: link.platform, url: link.url, label: link.label || '' })),
      primaryColor: band.primary_color || '#63358B',
      secondaryColor: band.secondary_color || '#29272C',
      logoBackgroundColor: band.logo_background_color || '',
      logoPath: band.logo_path || '',
      heroImagePath: band.hero_image_path || '',
      heroImageAlt: band.hero_image_alt || '',
      heroImageCredit: band.hero_image_credit || '',
      banderinEntityId: band.banderin_entity_id || '',
    }
  })
}

export async function getBandsDirectory() {
  try {
    const supabase = createPublicClient()
    const entities = assertQuery(
      await supabase
        .from('entities')
        .select('id, name, slug, summary')
        .eq('entity_type', 'band')
        .eq('status', 'published')
        .order('name'),
      'No se pudo consultar el directorio de bandas'
    )
    return loadCore(supabase, entities)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio de bandas', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

async function loadBandRelations(supabase, band) {
  const banderinQuery = band.banderinEntityId
    ? supabase
        .from('heritage_assets')
        .select('*')
        .eq('entity_id', band.banderinEntityId)
        .eq('parent_entity_id', band.id)
        .eq('asset_type', 'Banderín')
        .limit(1)
    : supabase
        .from('heritage_assets')
        .select('*')
        .eq('parent_entity_id', band.id)
        .eq('asset_type', 'Banderín')
        .order('display_order')
        .limit(1)
  const [directionResult, periodResult, premiereResult, assignmentResult, heritageResult, curiosityLinksResult] = await Promise.all([
    supabase.from('band_agents').select('*').eq('band_entity_id', band.id).eq('is_current', true),
    supabase
      .from('music_accompaniment_periods')
      .select('*')
      .eq('band_entity_id', band.id)
      .eq('status', 'published')
      .order('year_from', { ascending: false }),
    supabase
      .from('band_premieres')
      .select('*')
      .eq('band_entity_id', band.id)
      .eq('status', 'published')
      .order('premiere_year', { ascending: false })
      .order('display_order'),
    supabase
      .from('outing_music_assignments')
      .select('*')
      .eq('band_entity_id', band.id)
      .eq('status', 'published'),
    banderinQuery,
    supabase
      .from('editorial_content_links')
      .select('editorial_content_id')
      .eq('entity_id', band.id)
      .in('relation_type', ['about', 'historical_accompaniment']),
  ])

  const directionRows = assertQuery(directionResult, 'No se pudo cargar la dirección')
  const periodRows = assertQuery(periodResult, 'No se pudieron cargar los acompañamientos')
  const premiereRows = assertQuery(premiereResult, 'No se pudieron cargar los estrenos')
  const assignmentRows = assertQuery(assignmentResult, 'No se pudieron cargar las salidas extraordinarias')
  const heritageRows = assertQuery(heritageResult, 'No se pudo cargar el banderín de la banda')
  const curiosityLinkRows = assertQuery(curiosityLinksResult, 'No se pudieron cargar las curiosidades de la banda')
  const curiosityIds = unique(curiosityLinkRows.map((item) => item.editorial_content_id))
  const accompanimentBrotherhoodIds = unique(periodRows.map((item) => item.brotherhood_entity_id))
  const accompanimentBrotherhoods = accompanimentBrotherhoodIds.length
    ? assertQuery(
        await supabase
          .from('brotherhoods')
          .select('entity_id, municipality_id, brotherhood_types')
          .in('entity_id', accompanimentBrotherhoodIds),
        'No se pudieron cargar las localidades de los acompañamientos'
      )
    : []
  const accompanimentMunicipalityIds = unique(accompanimentBrotherhoods.map((item) => item.municipality_id))
  const accompanimentMunicipalities = accompanimentMunicipalityIds.length
    ? assertQuery(
        await supabase
          .from('municipalities')
          .select('id, name, slug, province')
          .in('id', accompanimentMunicipalityIds),
        'No se pudieron cargar los municipios de los acompañamientos'
      )
    : []
  const accompanimentBrotherhoodById = new Map(accompanimentBrotherhoods.map((row) => [row.entity_id, row]))
  const accompanimentMunicipalityById = byId(accompanimentMunicipalities)
  const curiosityRows = curiosityIds.length
    ? assertQuery(
        await supabase
          .from('editorial_content')
          .select('id, title, subtitle, summary, body, publish_date')
          .in('id', curiosityIds)
          .eq('content_type', 'curiosity')
          .eq('status', 'published')
          .order('publish_date', { ascending: false, nullsFirst: false }),
        'No se pudo cargar el contenido de las curiosidades'
      )
    : []
  const relatedEntityIds = unique([
    ...directionRows.map((item) => item.agent_entity_id),
    ...periodRows.map((item) => item.brotherhood_entity_id),
    ...periodRows.map((item) => item.step_entity_id),
  ])
  const relatedEntities = relatedEntityIds.length
    ? assertQuery(
        await supabase.from('entities').select('id, name, slug, entity_type, status').in('id', relatedEntityIds),
        'No se pudieron cargar las entidades relacionadas'
      )
    : []
  const entityById = byId(relatedEntities)

  const marchIds = unique(premiereRows.map((item) => item.march_entity_id))
  const heritageAssetIds = unique(heritageRows.map((item) => item.entity_id))
  const [marchAuthorsResult, heritageEntitiesResult, heritageInterventionsResult] = await Promise.all([
    marchIds.length
      ? supabase
          .from('march_authors')
          .select('id, march_entity_id, agent_entity_id, author_role, notes, status')
          .in('march_entity_id', marchIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    heritageAssetIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug, summary, status')
          .in('id', heritageAssetIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    heritageAssetIds.length
      ? supabase
          .from('heritage_interventions')
          .select('id, target_entity_id, agent_entity_id, discipline, intervention_type, phase, date_from, date_from_text, description')
          .in('target_entity_id', heritageAssetIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
  ])
  const marchAuthors = assertQuery(marchAuthorsResult, 'No se pudieron cargar las autorías de las marchas')
  const heritageEntities = assertQuery(heritageEntitiesResult, 'No se pudieron cargar las piezas patrimoniales')
  const heritageInterventions = assertQuery(heritageInterventionsResult, 'No se pudieron cargar las intervenciones patrimoniales')
  const creativeAgentIds = unique([
    ...marchAuthors.map((item) => item.agent_entity_id),
    ...heritageInterventions.map((item) => item.agent_entity_id),
  ])
  const [creativeAgentsResult, agentNamesResult] = await Promise.all([
    creativeAgentIds.length
      ? supabase.from('entities').select('id, name, slug, status').in('id', creativeAgentIds).eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    creativeAgentIds.length
      ? supabase.from('agent_names').select('agent_entity_id, name, name_type, is_current').in('agent_entity_id', creativeAgentIds)
      : Promise.resolve({ data: [], error: null }),
  ])
  const creativeAgents = assertQuery(creativeAgentsResult, 'No se pudieron cargar los autores y talleres')
  const agentNames = assertQuery(agentNamesResult, 'No se pudieron cargar los nombres de autores y talleres')
  const creativeAgentById = byId(creativeAgents)
  const heritageEntityById = byId(heritageEntities)

  const periodIds = periodRows.map((item) => item.id)
  const periodSourceLinks = periodIds.length
    ? assertQuery(
        await supabase
          .from('source_links')
          .select('source_id, music_accompaniment_period_id')
          .in('music_accompaniment_period_id', periodIds),
        'No se pudieron cargar las fuentes de los acompañamientos'
      )
    : []
  const entitySourceLinks = assertQuery(
    await supabase
      .from('source_links')
      .select('source_id')
      .eq('entity_id', band.id),
    'No se pudieron cargar las fuentes de identidad de la banda'
  )
  const sourceIds = unique([
    ...premiereRows.map((item) => item.source_id),
    ...periodSourceLinks.map((item) => item.source_id),
    ...entitySourceLinks.map((item) => item.source_id),
  ])
  const sources = sourceIds.length
    ? assertQuery(
        await supabase.from('sources').select('*').in('id', sourceIds),
        'No se pudieron cargar las fuentes de la banda'
      )
    : []
  const sourceById = byId(sources)

  const positionIds = unique(assignmentRows.map((item) => item.music_position_id))
  const positions = positionIds.length
    ? assertQuery(
        await supabase.from('outing_music_positions').select('*').in('id', positionIds).eq('status', 'published'),
        'No se pudieron cargar las posiciones musicales'
      )
    : []
  const positionById = byId(positions)
  const outingIds = unique(positions.map((item) => item.outing_id))
  const today = new Date().toISOString().slice(0, 10)
  const outings = outingIds.length
    ? assertQuery(
        await supabase
          .from('outings')
          .select('*')
          .in('id', outingIds)
          .gte('outing_date', today)
          .eq('status', 'published')
          .neq('event_status', 'cancelled')
          .order('outing_date'),
        'No se pudieron cargar las próximas salidas'
      )
    : []
  const municipalityIds = unique(outings.map((item) => item.municipality_id))
  const municipalities = municipalityIds.length
    ? assertQuery(
        await supabase.from('municipalities').select('id, name').in('id', municipalityIds),
        'No se pudieron cargar las localidades de las salidas'
      )
    : []
  const municipalityById = byId(municipalities)

  const serializePeriod = (item) => {
    const brotherhood = entityById.get(item.brotherhood_entity_id)
    const brotherhoodProfile = accompanimentBrotherhoodById.get(item.brotherhood_entity_id)
    const municipality = accompanimentMunicipalityById.get(brotherhoodProfile?.municipality_id)
    const location = resolveAccompanimentLocation(item, brotherhoodProfile, municipality)
    const step = entityById.get(item.step_entity_id)
    const sourceLink = periodSourceLinks.find((link) => link.music_accompaniment_period_id === item.id)
    const source = sourceById.get(sourceLink?.source_id)
    return {
      id: item.id,
      brotherhoodName: item.public_brotherhood_name || brotherhood?.name || '',
      brotherhoodSlug: item.public_brotherhood_slug || brotherhood?.slug || '',
      brotherhoodPageReady: isPublicEntityPageReady(brotherhood, brotherhoodProfile),
      brotherhoodTypes: location.brotherhoodTypes,
      municipality: location.municipality,
      municipalitySlug: location.municipalitySlug,
      province: location.province,
      stepName: item.public_step_name || step?.name || '',
      stepSlug: step?.status === 'published' ? step.slug || '' : '',
      stepPageReady: step?.status === 'published' && Boolean(step.slug),
      outingType: item.outing_type || '',
      position: item.position,
      yearFrom: item.year_from,
      yearTo: item.year_to,
      periodText: item.date_from_text || '',
      notes: item.notes || '',
      source: source ? { id: source.id, name: source.name, url: source.url } : null,
    }
  }

  const historicalAccompaniments = periodRows.filter((item) => !item.is_current).map(serializePeriod)
  const curiosities = curiosityRows.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle || '',
    summary: item.summary || '',
    body: item.body || '',
    publishDate: item.publish_date,
  }))

  return {
    direction: directionRows
      .map((item) => ({
        id: item.id,
        role: item.role_name,
        name: entityById.get(item.agent_entity_id)?.name || '',
        notes: item.notes || '',
      }))
      .filter((item) => item.name),
    accompaniments: periodRows.filter((item) => item.is_current).map(serializePeriod),
    historicalAccompaniments,
    curiosities,
    premieres: premiereRows.map((item) => {
      const source = sourceById.get(item.source_id)
      const credits = marchAuthors
        .filter((credit) => credit.march_entity_id === item.march_entity_id)
        .map((credit) => {
          const agent = creativeAgentById.get(credit.agent_entity_id)
          if (!agent) return null
          return {
            id: agent.id,
            slug: agent.slug || '',
            name: agent.name,
            role: credit.author_role,
            label: credit.author_role === 'adapter' ? 'Adaptación' : 'Composición',
            notes: credit.notes || '',
          }
        })
        .filter(Boolean)
        .sort((first, second) => (first.role === 'composer' ? -1 : 1) - (second.role === 'composer' ? -1 : 1))
      return {
        id: item.id,
        title: item.title,
        composerName: item.composer_name,
        credits,
        year: item.premiere_year,
        date: item.premiere_date,
        venue: item.venue_text || '',
        municipality: item.municipality_text || '',
        videoUrl: item.video_url || '',
        description: item.description || '',
        source: source ? {
          id: source.id,
          name: source.name,
          url: source.url,
          publisher: source.author_or_publisher || '',
          publicationDate: source.publication_date,
        } : null,
      }
    }),
    heritage: heritageRows
      .map((item) => {
        const entity = heritageEntityById.get(item.entity_id)
        if (!entity) return null
        return {
          id: entity.id,
          slug: entity.slug || '',
          name: entity.name,
          type: item.asset_type || 'Pieza patrimonial',
          description: item.description || entity.summary || '',
          year: item.date_from_text || item.date_from || '',
          imagePath: item.public_image_path || '',
          imageAlt: item.public_image_alt || entity.name,
          imageCredit: item.public_image_credit || '',
          contributions: heritageInterventions
            .filter((contribution) => contribution.target_entity_id === item.entity_id)
            .map((contribution) => {
              const agent = creativeAgentById.get(contribution.agent_entity_id)
              if (!agent) return null
              return {
                id: contribution.id,
                name: agent.name,
                slug: agent.slug || '',
                aliases: agentNames
                  .filter((alias) => alias.agent_entity_id === agent.id && alias.is_current && alias.name !== agent.name)
                  .map((alias) => alias.name),
                discipline: contribution.discipline,
                interventionType: contribution.intervention_type || 'Intervención',
                phase: contribution.phase || '',
                year: contribution.date_from_text || contribution.date_from || '',
                description: contribution.description || '',
              }
            })
            .filter(Boolean),
        }
      })
      .filter(Boolean),
    sources: sources.map((source) => ({
      id: source.id,
      nombre: source.name,
      url: source.url,
    })),
    outings: outings.map((outing) => {
      const position = positions.find((item) => item.outing_id === outing.id)
      return {
        id: outing.id,
        title: outing.title || outing.outing_type,
        type: outing.outing_type,
        date: outing.outing_date,
        time: outing.departure_time,
        reason: outing.reason || '',
        description: outing.description || '',
        municipality: municipalityById.get(outing.municipality_id)?.name || '',
        organizerName: outing.organizer_name || '',
        position: position?.position_label || '',
      }
    }),
  }
}

export async function getBandBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const entity = await supabase
      .from('entities')
      .select('id, name, slug, summary')
      .eq('entity_type', 'band')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    if (entity.error) throw entity.error
    if (!entity.data) return null
    const [band] = await loadCore(supabase, [entity.data])
    if (!band) return null
    const relations = await loadBandRelations(supabase, band)
    const officialSources = [
      band.websiteUrl ? { id: 'official-website', nombre: `Página web ${band.popularName}`, url: band.websiteUrl } : null,
      band.youtubeUrl ? { id: 'official-youtube', nombre: `Canal YouTube ${band.popularName}`, url: band.youtubeUrl } : null,
    ].filter(Boolean)
    const sources = [...(relations.sources || []), ...officialSources]
      .filter((source, index, items) => (
        items.findIndex((item) => item.url === source.url) === index
      ))
    return { ...band, ...relations, sources }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la ficha de banda', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
