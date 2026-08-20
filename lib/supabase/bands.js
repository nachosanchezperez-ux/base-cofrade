import 'server-only'

import { createClient } from '@/lib/supabase/server'

const CIGARRERAS_ACCOMPANIMENTS = [
  {
    id: 'c1300000-0000-0000-0000-000000000001',
    brotherhoodName: 'Hermandad de la Misión',
    brotherhoodSlug: 'hermandad-de-la-mision-sevilla',
    brotherhoodPageReady: false,
    stepName: 'Paso de misterio de Nuestro Padre Jesús de la Misión',
    outingType: 'Viernes de Dolores',
    position: 'Tras el paso de misterio',
    yearFrom: 2008,
    yearTo: null,
    notes: '',
    source: null,
  },
  {
    id: 'c1300000-0000-0000-0000-000000000002',
    brotherhoodName: 'Hermandad de la Sagrada Cena',
    brotherhoodSlug: 'hermandad-de-la-sagrada-cena-sevilla',
    brotherhoodPageReady: false,
    stepName: 'Paso de misterio del Señor de la Sagrada Cena',
    outingType: 'Domingo de Ramos',
    position: 'Tras el paso de misterio',
    yearFrom: 1980,
    yearTo: null,
    notes: '',
    source: null,
  },
  {
    id: 'c1300000-0000-0000-0000-000000000003',
    brotherhoodName: 'Hermandad de San Gonzalo',
    brotherhoodSlug: 'hermandad-de-san-gonzalo',
    brotherhoodPageReady: false,
    stepName: 'Paso de misterio de Nuestro Padre Jesús del Soberano Poder ante Caifás',
    outingType: 'Lunes Santo',
    position: 'Tras el paso de misterio',
    yearFrom: 1981,
    yearTo: null,
    notes: 'Con la excepción de 1984.',
    source: null,
  },
  {
    id: 'c1300000-0000-0000-0000-000000000004',
    brotherhoodName: 'Hermandad del Dulce Nombre',
    brotherhoodSlug: 'hermandad-del-dulce-nombre-sevilla',
    brotherhoodPageReady: false,
    stepName: 'Paso de misterio de Nuestro Padre Jesús ante Anás',
    outingType: 'Martes Santo',
    position: 'Tras el paso de misterio',
    yearFrom: 1982,
    yearTo: null,
    notes: '',
    source: null,
  },
  {
    id: 'c1300000-0000-0000-0000-000000000005',
    brotherhoodName: 'Hermandad de los Panaderos',
    brotherhoodSlug: 'hermandad-de-los-panaderos',
    brotherhoodPageReady: false,
    stepName: 'Paso de misterio de Nuestro Padre Jesús del Soberano Poder en su Prendimiento',
    outingType: 'Miércoles Santo',
    position: 'Tras el paso de misterio',
    yearFrom: 1981,
    yearTo: null,
    notes: 'Con un paréntesis entre 1993 y 2003.',
    source: null,
  },
  {
    id: 'c1300000-0000-0000-0000-000000000006',
    brotherhoodName: 'Hermandad de Las Cigarreras',
    brotherhoodSlug: 'hermandad-de-las-cigarreras',
    brotherhoodPageReady: false,
    stepName: 'Paso de misterio de Nuestro Señor Jesucristo Atado a la Columna',
    outingType: 'Jueves Santo',
    position: 'Tras el paso de misterio',
    yearFrom: 1979,
    yearTo: null,
    notes: '',
    source: null,
  },
  {
    id: 'c1300000-0000-0000-0000-000000000007',
    brotherhoodName: 'Hermandad de la Carretería',
    brotherhoodSlug: 'hermandad-de-la-carreteria',
    brotherhoodPageReady: false,
    stepName: 'Paso de misterio del Santísimo Cristo de la Salud y María Santísima de la Luz',
    outingType: 'Viernes Santo',
    position: 'Tras el paso de misterio',
    yearFrom: 1986,
    yearTo: null,
    notes: '',
    source: null,
  },
  {
    id: 'c1300000-0000-0000-0000-000000000008',
    brotherhoodName: 'Hermandad de la Trinidad',
    brotherhoodSlug: 'hermandad-de-la-trinidad-sevilla',
    brotherhoodPageReady: false,
    stepName: 'Paso de misterio del Sagrado Decreto de la Santísima Trinidad',
    outingType: 'Sábado Santo',
    position: 'Tras el paso de misterio',
    yearFrom: 1996,
    yearTo: null,
    notes: '',
    source: null,
  },
]

const CIGARRERAS_HISTORICAL_ACCOMPANIMENTS = [
  {
    id: 'e1300000-0000-0000-0000-000000000001',
    brotherhoodName: 'Hermandad de San Bernardo',
    brotherhoodSlug: 'hermandad-de-san-bernardo',
    brotherhoodPageReady: false,
    stepName: 'Paso de misterio del Santísimo Cristo de la Salud',
    outingType: 'Miércoles Santo',
    position: 'Tras el paso del Cristo de la Salud',
    yearFrom: 1993,
    yearTo: 2003,
    notes: '',
    source: null,
  },
]

const CIGARRERAS_CURIOSITIES = [
  {
    id: 'e1600000-0000-0000-0000-000000000001',
    title: '¿Sabías que…?',
    summary: 'De esta vinculación nació la marcha «Refúgiame», compuesta por Francis González Ríos.',
    body: 'De esta vinculación nació la marcha «Refúgiame», compuesta por Francis González Ríos.',
  },
]

const FALLBACK_BAND = {
  id: 'b1000000-0000-0000-0000-000000000001',
  slug: 'las-cigarreras',
  name: 'Las Cigarreras',
  popularName: 'Las Cigarreras',
  officialName: 'Banda de Cornetas y Tambores Nuestra Señora de la Victoria',
  officialShortName: 'BCT Ntra. Sra. de la Victoria',
  summary: 'Banda sevillana de cornetas y tambores vinculada a la Hermandad de Las Cigarreras.',
  type: 'Cornetas y Tambores',
  typeSlug: 'cornetas-y-tambores',
  municipality: 'Sevilla',
  municipalitySlug: 'sevilla',
  province: 'Sevilla',
  foundation: '1979',
  description: 'Formación musical sevillana conocida popularmente como Las Cigarreras. Su ficha reúne identidad, trayectoria, acompañamientos, dirección, salidas extraordinarias y estrenos documentados.',
  linkedBrotherhood: 'Hermandad de Las Cigarreras',
  linkedBrotherhoodSlug: '',
  headquarters: 'Sevilla',
  websiteUrl: 'https://lascigarreras.net/',
  youtubeUrl: 'https://www.youtube.com/lascigarreras',
  instagramUrl: '',
  interestLinks: [],
  primaryColor: '#63358B',
  secondaryColor: '#29272C',
  logoPath: '/bandas/las-cigarreras/imagotipo.svg',
  heroImagePath: '/bandas/las-cigarreras/cigarreras-corneta.jpg',
  heroImageAlt: 'Corneta de Las Cigarreras con la gala bordada de la formación',
  heroImageCredit: 'Foto · Las Cigarreras',
  direction: [],
  accompaniments: CIGARRERAS_ACCOMPANIMENTS,
  historicalAccompaniments: CIGARRERAS_HISTORICAL_ACCOMPANIMENTS,
  curiosities: CIGARRERAS_CURIOSITIES,
  outings: [
    {
      id: 'b1700000-0000-0000-0000-000000000001',
      title: 'Salida extraordinaria de Nuestro Padre Jesús Preso',
      type: 'Procesión extraordinaria',
      date: '2026-09-19',
      time: null,
      reason: '125.º aniversario de su primera salida procesional',
      description: '',
      municipality: 'Moriles',
      organizerName: 'Hermandad de Nuestro Padre Jesús Preso',
      position: '',
    },
  ],
  premieres: [
    {
      id: 'b1400000-0000-0000-0000-000000000001',
      title: 'Yo soy la luz del mundo',
      composerName: 'Manuel Alejandro González Cruz',
      credits: [
        { id: 'manuel-alejandro-gonzalez-cruz', name: 'Manuel Alejandro González Cruz', role: 'composer', label: 'Composición' },
      ],
      year: 2026,
      date: null,
      venue: '',
      municipality: '',
      videoUrl: 'https://www.youtube.com/watch?v=JiEroqM_31w',
      description: '',
      source: {
        id: 'b1500000-0000-0000-0000-000000000001',
        name: 'Yo soy la luz del mundo',
        url: 'https://www.youtube.com/watch?v=JiEroqM_31w',
        publisher: 'Banda de Cornetas y Tambores Nuestra Señora de la Victoria',
      },
    },
    {
      id: 'b1400000-0000-0000-0000-000000000002',
      title: 'Ánima Christi',
      composerName: 'Marco Frisina',
      credits: [
        { id: 'marco-frisina', name: 'Marco Frisina', role: 'composer', label: 'Composición' },
        { id: 'cristobal-lopez-gandara', name: 'Cristóbal López Gándara', role: 'adapter', label: 'Adaptación' },
      ],
      year: 2026,
      date: null,
      venue: '',
      municipality: '',
      videoUrl: 'https://www.youtube.com/watch?v=fJ7ID-pC9gI',
      description: '',
      source: {
        id: 'b1500000-0000-0000-0000-000000000002',
        name: 'Ánima Christi',
        url: 'https://www.youtube.com/watch?v=fJ7ID-pC9gI',
        publisher: 'Banda de Cornetas y Tambores Nuestra Señora de la Victoria',
      },
    },
  ],
  heritage: [
    {
      id: 'banderin-de-las-cigarreras',
      name: 'Banderín de Las Cigarreras',
      type: 'Banderín',
      description: 'Banderín corporativo realizado en 1999 y restaurado en 2017.',
      year: '1999',
      imagePath: '/bandas/las-cigarreras/banderin-cigarreras-2017.jpg',
      imageAlt: 'Banderín bordado de Las Cigarreras tras su restauración de 2017',
      imageCredit: 'Foto · Alejandro Mármol',
      contributions: [
        { id: 'banderin-1999-bordados', name: 'Antonio Garduño Navas', aliases: [], discipline: 'Bordados', interventionType: 'Realización', phase: 'Bordado', year: '1999' },
        { id: 'banderin-1999-orfebreria', name: 'Manuel de los Ríos e hijos', aliases: ['Orfebrería Andaluza'], discipline: 'Orfebrería', interventionType: 'Realización', phase: 'Orfebrería', year: '1999' },
        { id: 'banderin-2017-bordados', name: 'Luis Miguel Garduño Lara', aliases: [], discipline: 'Bordados', interventionType: 'Restauración', phase: 'Restauración textil', year: '2017' },
        { id: 'banderin-2017-orfebreria', name: 'Manuel de los Ríos e hijos', aliases: ['Orfebrería Andaluza'], discipline: 'Orfebrería', interventionType: 'Restauración', phase: 'Restauración de orfebrería', year: '2017' },
      ],
    },
  ],
  sources: [
    { id: 'official-website', nombre: 'Página web Las Cigarreras', url: 'https://lascigarreras.net/' },
    { id: 'official-youtube', nombre: 'Canal YouTube Las Cigarreras', url: 'https://www.youtube.com/lascigarreras' },
  ],
}

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
      municipality: municipality.name || 'Localidad por documentar',
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
    const supabase = await createClient()
    const entities = assertQuery(
      await supabase
        .from('entities')
        .select('id, name, slug, summary')
        .eq('entity_type', 'band')
        .eq('status', 'published')
        .order('name'),
      'No se pudo consultar el directorio de bandas'
    )
    const bands = await loadCore(supabase, entities)
    return bands.length ? bands : [FALLBACK_BAND]
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio de bandas', {
      error: error instanceof Error ? error.message : String(error),
    })
    return [FALLBACK_BAND]
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
      .eq('relation_type', 'historical_accompaniment'),
  ])

  const directionRows = assertQuery(directionResult, 'No se pudo cargar la dirección')
  const periodRows = assertQuery(periodResult, 'No se pudieron cargar los acompañamientos')
  const premiereRows = assertQuery(premiereResult, 'No se pudieron cargar los estrenos')
  const assignmentRows = assertQuery(assignmentResult, 'No se pudieron cargar las salidas extraordinarias')
  const heritageRows = assertQuery(heritageResult, 'No se pudo cargar el banderín de la banda')
  const curiosityLinkRows = assertQuery(curiosityLinksResult, 'No se pudieron cargar las curiosidades de la banda')
  const curiosityIds = unique(curiosityLinkRows.map((item) => item.editorial_content_id))
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
    const publicItem = CIGARRERAS_ACCOMPANIMENTS.find((row) => row.id === item.id)
    const brotherhood = entityById.get(item.brotherhood_entity_id)
    const step = entityById.get(item.step_entity_id)
    const sourceLink = periodSourceLinks.find((link) => link.music_accompaniment_period_id === item.id)
    const source = sourceById.get(sourceLink?.source_id)
    return {
      id: item.id,
      brotherhoodName: item.public_brotherhood_name || brotherhood?.name || publicItem?.brotherhoodName || 'Hermandad por documentar',
      brotherhoodSlug: item.public_brotherhood_slug || brotherhood?.slug || publicItem?.brotherhoodSlug || '',
      brotherhoodPageReady: brotherhood?.status === 'published',
      stepName: item.public_step_name || step?.name || publicItem?.stepName || '',
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
    summary: item.id === CIGARRERAS_CURIOSITIES[0].id ? CIGARRERAS_CURIOSITIES[0].summary : item.summary || '',
    body: item.id === CIGARRERAS_CURIOSITIES[0].id ? CIGARRERAS_CURIOSITIES[0].body : item.body || '',
    publishDate: item.publish_date,
  }))
  const isCigarreras = band.slug === FALLBACK_BAND.slug

  return {
    direction: directionRows.map((item) => ({
      id: item.id,
      role: item.role_name,
      name: entityById.get(item.agent_entity_id)?.name || 'Responsable por documentar',
      notes: item.notes || '',
    })),
    accompaniments: periodRows.filter((item) => item.is_current).map(serializePeriod),
    historicalAccompaniments: historicalAccompaniments.length || !isCigarreras
      ? historicalAccompaniments
      : CIGARRERAS_HISTORICAL_ACCOMPANIMENTS,
    curiosities: curiosities.length || !isCigarreras ? curiosities : CIGARRERAS_CURIOSITIES,
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
    const supabase = await createClient()
    const entity = await supabase
      .from('entities')
      .select('id, name, slug, summary')
      .eq('entity_type', 'band')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    if (entity.error) throw entity.error
    if (!entity.data) return slug === FALLBACK_BAND.slug ? FALLBACK_BAND : null
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
    return slug === FALLBACK_BAND.slug ? FALLBACK_BAND : null
  }
}
