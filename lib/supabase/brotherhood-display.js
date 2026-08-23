import { getHermandadPageBySlug as getBaseHermandadPageBySlug } from '@/lib/supabase/brotherhoods'
import { resolveHiloMediaReference } from '@/lib/supabase/hilo-media-paths'
import { createPublicClient as createClient } from '@/lib/supabase/public'

const PUBLISHED_STATUS = 'published'
const MUSICAL_HERITAGE_TYPES = new Set([
  'musica de capilla',
  'copla',
  'marcha',
  'marcha procesional',
])

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function normalized(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function withoutMusicalHeritage(items = []) {
  return items.filter((item) => !MUSICAL_HERITAGE_TYPES.has(normalized(item?.tipo)))
}

function withoutDuplicateRecurringOutings(items = []) {
  const currentYear = String(new Date().getFullYear())
  const currentEditionKeys = new Set(
    items
      .filter((item) => item?.estado !== 'recurring')
      .filter((item) => `${item?.nombre || ''} ${item?.momento || ''}`.includes(currentYear))
      .map((item) => {
        const baseName = normalized(item?.nombre).replace(new RegExp(`\\b${currentYear}\\b`, 'g'), '').trim()
        return `${normalized(item?.tipo)}|${baseName}`
      })
      .filter((key) => key !== '|')
  )

  return items.filter((item) => {
    if (item?.estado !== 'recurring') return true
    const key = `${normalized(item?.tipo)}|${normalized(item?.nombre)}`
    return !currentEditionKeys.has(key)
  })
}

function formatAuthorship(authorship, agentName) {
  if (authorship.authorship_type === 'anonymous') return 'Autor desconocido'
  if (!agentName) return ''

  switch (authorship.authorship_type) {
    case 'attributed_to':
      return `Atribuido a ${agentName}`
    case 'workshop_of':
      return `Taller de ${agentName}`
    case 'circle_of':
      return `Círculo de ${agentName}`
    case 'school_of':
      return `Escuela de ${agentName}`
    default:
      return agentName
  }
}

async function loadSeatDetail(supabase, brotherhoodId, canonicalPlaceId) {
  if (!canonicalPlaceId) return null

  const placeResult = await supabase
    .from('places')
    .select('id, municipality_id, name, slug, place_type, address, latitude, longitude, opening_hours_text, opening_hours_verified_at')
    .eq('id', canonicalPlaceId)
    .maybeSingle()

  if (placeResult.error) {
    throw new Error(`No se pudo consultar la Sede canónica: ${placeResult.error.message}`)
  }
  const place = placeResult.data
  if (!place) return null

  const [municipalityResult, sharedBrotherhoodsResult, historicalLocationsResult] = await Promise.all([
    place.municipality_id
      ? supabase
          .from('municipalities')
          .select('id, name, slug, province, autonomous_community, country')
          .eq('id', place.municipality_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from('brotherhoods')
      .select('entity_id, popular_name')
      .eq('canonical_see_place_id', canonicalPlaceId)
      .neq('entity_id', brotherhoodId),
    supabase
      .from('entity_locations')
      .select('id, place_id, location_type, date_from, date_from_text, date_to, date_to_text')
      .eq('entity_id', brotherhoodId)
      .eq('is_current', false)
      .eq('status', PUBLISHED_STATUS)
      .order('date_from', { ascending: false, nullsFirst: false }),
  ])

  if (municipalityResult.error) {
    throw new Error(`No se pudo consultar la Localidad de la Sede: ${municipalityResult.error.message}`)
  }
  if (sharedBrotherhoodsResult.error) {
    throw new Error(`No se pudieron consultar las Hermandades de la misma Sede: ${sharedBrotherhoodsResult.error.message}`)
  }
  if (historicalLocationsResult.error) {
    throw new Error(`No se pudo consultar el histórico de Sedes: ${historicalLocationsResult.error.message}`)
  }

  const sharedRows = sharedBrotherhoodsResult.data || []
  const sharedIds = unique(sharedRows.map((item) => item.entity_id))
  const historicalRows = historicalLocationsResult.data || []
  const historicalPlaceIds = unique(historicalRows.map((item) => item.place_id))

  const [sharedEntitiesResult, historicalPlacesResult] = await Promise.all([
    sharedIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug')
          .eq('entity_type', 'brotherhood')
          .eq('status', PUBLISHED_STATUS)
          .in('id', sharedIds)
      : Promise.resolve({ data: [], error: null }),
    historicalPlaceIds.length
      ? supabase
          .from('places')
          .select('id, name, slug, place_type, address')
          .in('id', historicalPlaceIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (sharedEntitiesResult.error) {
    throw new Error(`No se pudieron resolver las Hermandades compartidas de la Sede: ${sharedEntitiesResult.error.message}`)
  }
  if (historicalPlacesResult.error) {
    throw new Error(`No se pudieron resolver las Sedes históricas: ${historicalPlacesResult.error.message}`)
  }

  const sharedNameById = new Map(sharedRows.map((item) => [item.entity_id, item.popular_name]))
  const historicalPlaceById = new Map((historicalPlacesResult.data || []).map((item) => [item.id, item]))
  const municipality = municipalityResult.data || null

  return {
    id: place.id,
    slug: place.slug || '',
    nombre: place.name,
    tipo: place.place_type || 'Lugar de culto',
    direccion: place.address || '',
    latitud: place.latitude === null || place.latitude === undefined ? null : Number(place.latitude),
    longitud: place.longitude === null || place.longitude === undefined ? null : Number(place.longitude),
    horarioApertura: place.opening_hours_text || '',
    horarioVerificadoEn: place.opening_hours_verified_at || '',
    localidad: municipality?.name || '',
    provincia: municipality?.province || '',
    comunidadAutonoma: municipality?.autonomous_community || '',
    pais: municipality?.country || '',
    hermandadesCompartidas: (sharedEntitiesResult.data || []).map((entity) => ({
      id: entity.id,
      nombre: sharedNameById.get(entity.id) || entity.name,
      slug: entity.slug,
    })),
    sedesHistoricas: historicalRows
      .map((item) => {
        const historicalPlace = historicalPlaceById.get(item.place_id)
        if (!historicalPlace) return null
        return {
          id: item.id,
          nombre: historicalPlace.name,
          slug: historicalPlace.slug || '',
          tipo: historicalPlace.place_type || item.location_type || 'Sede histórica',
          direccion: historicalPlace.address || '',
          desde: item.date_from_text || item.date_from || '',
          hasta: item.date_to_text || item.date_to || '',
          relacion: item.location_type || '',
        }
      })
      .filter(Boolean),
  }
}

async function enrichBrotherhoodDisplay(hermandad) {
  if (!hermandad?.id) return hermandad

  const supabase = await createClient()
  const imageIds = unique((hermandad.imagenes || []).map((imagen) => imagen.id))
  const stepIds = unique((hermandad.pasos || []).map((paso) => paso.id))

  const [authorshipsResult, stepImagesResult, brotherhoodResult] = await Promise.all([
    imageIds.length
      ? supabase
          .from('image_authorships')
          .select('image_entity_id, agent_entity_id, authorship_type, certainty')
          .in('image_entity_id', imageIds)
          .eq('status', PUBLISHED_STATUS)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('image_steps')
          .select('image_entity_id, step_entity_id, relation_type')
          .in('step_entity_id', stepIds)
          .eq('status', PUBLISHED_STATUS)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from('brotherhoods')
      .select('history_text, canonical_see_place_id')
      .eq('entity_id', hermandad.id)
      .maybeSingle(),
  ])

  if (authorshipsResult.error) {
    throw new Error(`No se pudieron consultar las autorías canónicas: ${authorshipsResult.error.message}`)
  }
  if (stepImagesResult.error) {
    throw new Error(`No se pudieron consultar las imágenes procesionales: ${stepImagesResult.error.message}`)
  }
  if (brotherhoodResult.error) {
    throw new Error(`No se pudo consultar la historia de la hermandad: ${brotherhoodResult.error.message}`)
  }

  const authorships = authorshipsResult.data || []
  const stepImageLinks = stepImagesResult.data || []
  const agentIds = unique(authorships.map((item) => item.agent_entity_id))
  const stepImageIds = unique(stepImageLinks.map((item) => item.image_entity_id))

  const [agentsResult, stepImageEntitiesResult, sedeDetalle] = await Promise.all([
    agentIds.length
      ? supabase
          .from('entities')
          .select('id, name')
          .in('id', agentIds)
          .eq('status', PUBLISHED_STATUS)
      : Promise.resolve({ data: [], error: null }),
    stepImageIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug')
          .in('id', stepImageIds)
          .eq('entity_type', 'image')
          .eq('status', PUBLISHED_STATUS)
      : Promise.resolve({ data: [], error: null }),
    loadSeatDetail(supabase, hermandad.id, brotherhoodResult.data?.canonical_see_place_id),
  ])

  if (agentsResult.error) {
    throw new Error(`No se pudieron consultar los autores publicados: ${agentsResult.error.message}`)
  }
  if (stepImageEntitiesResult.error) {
    throw new Error(`No se pudieron consultar las imágenes publicadas de los pasos: ${stepImageEntitiesResult.error.message}`)
  }

  const agentById = new Map((agentsResult.data || []).map((agent) => [agent.id, agent.name]))
  const stepImageById = new Map((stepImageEntitiesResult.data || []).map((image) => [image.id, image]))

  const imagenes = (hermandad.imagenes || []).map((imagen) => {
    const autoresCanonicos = unique(
      authorships
        .filter((item) => item.image_entity_id === imagen.id)
        .map((item) => formatAuthorship(item, agentById.get(item.agent_entity_id)))
    )

    return autoresCanonicos.length
      ? { ...imagen, autor: autoresCanonicos.join(' · ') }
      : imagen
  })

  const pasos = (hermandad.pasos || []).map((paso) => ({
    ...paso,
    imagenesDetalle: stepImageLinks
      .filter((link) => link.step_entity_id === paso.id)
      .map((link) => stepImageById.get(link.image_entity_id))
      .filter(Boolean)
      .map((imagen) => ({
        id: imagen.id,
        nombre: imagen.name,
        slug: imagen.slug,
        fichaDisponible: Boolean(imagen.slug),
      })),
  }))

  const historyText = brotherhoodResult.data?.history_text?.trim() || ''
  const historia = historyText || (
    hermandad.historia && hermandad.historia !== hermandad.resumen
      ? hermandad.historia
      : ''
  )

  return {
    ...hermandad,
    imagenes,
    pasos,
    historia,
    sedeDetalle,
  }
}

export async function getHermandadPageBySlug(slug) {
  const baseHermandad = await getBaseHermandadPageBySlug(slug)
  if (!baseHermandad) return baseHermandad

  const supabase = createClient()
  const hermandad = {
    ...baseHermandad,
    patrimonio: withoutMusicalHeritage(baseHermandad.patrimonio),
    salidas: withoutDuplicateRecurringOutings(baseHermandad.salidas),
    habitos: (baseHermandad.habitos || []).map((habit) => ({
      ...habit,
      imagenPath: resolveHiloMediaReference(supabase, habit.imagenPath),
    })),
  }

  try {
    return await enrichBrotherhoodDisplay(hermandad)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar la vista relacional de la hermandad', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return hermandad
  }
}
