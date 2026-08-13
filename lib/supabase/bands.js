import 'server-only'

import { createClient } from '@/lib/supabase/server'

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
  instagramUrl: '',
  primaryColor: '#63358B',
  secondaryColor: '#29272C',
  logoPath: '/bandas/las-cigarreras/imagotipo.svg',
  heroImagePath: '/bandas/las-cigarreras/cigarreras-corneta.jpg',
  heroImageAlt: 'Corneta de Las Cigarreras con la gala bordada de la formación',
  heroImageCredit: 'Fotografía facilitada por la banda',
  direction: [],
  accompaniments: [],
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
      composerName: 'Marco Frisina · Adaptación: Cristóbal López Gándara',
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
  sources: [
    { id: 'official-website', nombre: 'Web oficial de Las Cigarreras', url: 'https://lascigarreras.net/' },
    { id: 'b1500000-0000-0000-0000-000000000001', nombre: 'Yo soy la luz del mundo', url: 'https://www.youtube.com/watch?v=JiEroqM_31w' },
    { id: 'b2600000-0000-0000-0000-000000000001', nombre: 'Ánima Christi', url: 'https://www.youtube.com/watch?v=fJ7ID-pC9gI' },
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

  const [bands, names, relations] = await Promise.all([
    supabase.from('bands').select('*').in('entity_id', ids),
    supabase.from('band_names').select('*').in('band_entity_id', ids).order('is_current', { ascending: false }),
    supabase
      .from('entity_relations')
      .select('source_entity_id, target_entity_id')
      .in('source_entity_id', ids)
      .eq('relation_type', 'belongs_to_brotherhood')
      .eq('status', 'published'),
  ])
  const bandRows = assertQuery(bands, 'No se pudieron consultar las fichas de bandas')
  const nameRows = assertQuery(names, 'No se pudieron consultar los nombres de bandas')
  const relationRows = assertQuery(relations, 'No se pudieron consultar las vinculaciones de bandas')
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
    const linkedRelation = relationRows.find((item) => item.source_entity_id === entity.id)
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
      headquarters: band.headquarters_text || '',
      websiteUrl: band.website_url || '',
      instagramUrl: band.instagram_url || '',
      primaryColor: band.primary_color || '#63358B',
      secondaryColor: band.secondary_color || '#29272C',
      logoPath: band.logo_path || '',
      heroImagePath: band.hero_image_path || '',
      heroImageAlt: band.hero_image_alt || '',
      heroImageCredit: band.hero_image_credit || '',
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
  const [directionResult, periodResult, premiereResult, assignmentResult] = await Promise.all([
    supabase.from('band_agents').select('*').eq('band_entity_id', band.id).eq('is_current', true),
    supabase
      .from('music_accompaniment_periods')
      .select('*')
      .eq('band_entity_id', band.id)
      .eq('is_current', true)
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
  ])

  const directionRows = assertQuery(directionResult, 'No se pudo cargar la dirección')
  const periodRows = assertQuery(periodResult, 'No se pudieron cargar los acompañamientos')
  const premiereRows = assertQuery(premiereResult, 'No se pudieron cargar los estrenos')
  const assignmentRows = assertQuery(assignmentResult, 'No se pudieron cargar las salidas extraordinarias')
  const relatedEntityIds = unique([
    ...directionRows.map((item) => item.agent_entity_id),
    ...periodRows.map((item) => item.brotherhood_entity_id),
    ...periodRows.map((item) => item.step_entity_id),
  ])
  const relatedEntities = relatedEntityIds.length
    ? assertQuery(
        await supabase.from('entities').select('id, name, slug, entity_type').in('id', relatedEntityIds),
        'No se pudieron cargar las entidades relacionadas'
      )
    : []
  const entityById = byId(relatedEntities)

  const sourceIds = unique(premiereRows.map((item) => item.source_id))
  const sources = sourceIds.length
    ? assertQuery(
        await supabase.from('sources').select('*').in('id', sourceIds),
        'No se pudieron cargar las fuentes de los estrenos'
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

  return {
    direction: directionRows.map((item) => ({
      id: item.id,
      role: item.role_name,
      name: entityById.get(item.agent_entity_id)?.name || 'Responsable por documentar',
      notes: item.notes || '',
    })),
    accompaniments: periodRows.map((item) => ({
      id: item.id,
      brotherhoodName: entityById.get(item.brotherhood_entity_id)?.name || 'Hermandad por documentar',
      brotherhoodSlug: entityById.get(item.brotherhood_entity_id)?.slug || '',
      stepName: entityById.get(item.step_entity_id)?.name || '',
      outingType: item.outing_type || '',
      position: item.position,
      yearFrom: item.year_from,
      yearTo: item.year_to,
      notes: item.notes || '',
    })),
    premieres: premiereRows.map((item) => {
      const source = sourceById.get(item.source_id)
      return {
        id: item.id,
        title: item.title,
        composerName: item.composer_name,
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
    const sources = [
      band.websiteUrl ? { id: 'official-website', nombre: `Web oficial de ${band.popularName}`, url: band.websiteUrl } : null,
      ...relations.sources,
    ].filter(Boolean).filter((source, index, list) => list.findIndex((item) => item.url === source.url) === index)
    return { ...band, ...relations, sources }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la ficha de banda', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return slug === FALLBACK_BAND.slug ? FALLBACK_BAND : null
  }
}
