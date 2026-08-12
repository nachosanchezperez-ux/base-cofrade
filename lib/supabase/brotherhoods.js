import { getHermandadBySlug } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'

const EMPTY_COLLECTIONS = {
  imagenes: [],
  pasos: [],
  participacionesConsejo: [],
  cronologia: [],
  habitos: [],
  salidas: [],
  cultos: [],
  estrenos: [],
  patrimonioMusical: [],
  acompanamientoActual: [],
  acompanamientos: [],
  noticias: [],
  curiosidades: [],
  fuentesFicha: [],
}

function assertQuery(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }

  return result.data
}

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function mergeBySlug(localItems = [], remoteItems = []) {
  const remoteBySlug = new Map(remoteItems.map((item) => [item.slug, item]))
  const merged = localItems.map((localItem) => {
    const remoteItem = remoteBySlug.get(localItem.slug) || {}
    const documentedRemoteValues = Object.fromEntries(
      Object.entries(remoteItem).filter(([, value]) => (
        value !== null && value !== undefined && value !== ''
      ))
    )

    return { ...localItem, ...documentedRemoteValues }
  })
  const localSlugs = new Set(localItems.map((item) => item.slug))

  return [
    ...merged,
    ...remoteItems.filter((item) => !localSlugs.has(item.slug)),
  ]
}

async function loadEntities(supabase, ids, label) {
  if (!ids.length) return []

  return assertQuery(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, summary, status')
      .in('id', ids)
      .eq('status', 'published'),
    label
  )
}

async function loadBrotherhoodFromSupabase(slug) {
  const supabase = await createClient()
  const entity = assertQuery(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, summary, status')
      .eq('entity_type', 'brotherhood')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle(),
    'No se pudo consultar la hermandad'
  )

  if (!entity) return null

  const [brotherhoodResult, imageLinksResult, stepLinksResult] = await Promise.all([
    supabase
      .from('brotherhoods')
      .select('entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, neighborhood, website_url, instagram_url, crest_path, brotherhood_types, current_procession_day')
      .eq('entity_id', entity.id)
      .maybeSingle(),
    supabase
      .from('brotherhood_images')
      .select('image_entity_id, relation_type, date_from_text, date_to_text')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published'),
    supabase
      .from('brotherhood_steps')
      .select('step_entity_id, relation_type, date_from_text, date_to_text')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published'),
  ])

  const brotherhood = assertQuery(brotherhoodResult, 'No se pudieron consultar los datos de la hermandad')
  if (!brotherhood) return null

  const imageLinks = assertQuery(imageLinksResult, 'No se pudieron consultar los titulares')
  const stepLinks = assertQuery(stepLinksResult, 'No se pudieron consultar los pasos')
  const imageIds = unique(imageLinks.map((item) => item.image_entity_id))
  const stepIds = unique(stepLinks.map((item) => item.step_entity_id))

  const [
    imageEntities,
    imageRowsResult,
    stepEntities,
    stepRowsResult,
    imageStepLinksResult,
    authorLinksResult,
    eventLinksResult,
    municipalityResult,
    placeResult,
  ] = await Promise.all([
    loadEntities(supabase, imageIds, 'No se pudieron consultar las entidades de imagen'),
    imageIds.length
      ? supabase
          .from('images')
          .select('entity_id, image_type, execution_date, execution_date_text, material, current_condition, description')
          .in('entity_id', imageIds)
      : Promise.resolve({ data: [], error: null }),
    loadEntities(supabase, stepIds, 'No se pudieron consultar las entidades de paso'),
    stepIds.length
      ? supabase
          .from('steps')
          .select('entity_id, step_type, current_condition, description')
          .in('entity_id', stepIds)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('image_steps')
          .select('image_entity_id, step_entity_id, relation_type')
          .in('step_entity_id', stepIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    imageIds.length
      ? supabase
          .from('entity_relations')
          .select('source_entity_id, target_entity_id, relation_type')
          .in('target_entity_id', imageIds)
          .eq('relation_type', 'author_of')
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from('entity_relations')
      .select('source_entity_id, target_entity_id, relation_type')
      .in('target_entity_id', [entity.id, ...imageIds])
      .eq('relation_type', 'involves')
      .eq('status', 'published'),
    brotherhood.municipality_id
      ? supabase
          .from('municipalities')
          .select('id, name, slug, province')
          .eq('id', brotherhood.municipality_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    brotherhood.canonical_see_place_id
      ? supabase
          .from('places')
          .select('id, name, slug, place_type, address')
          .eq('id', brotherhood.canonical_see_place_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  const imageRows = assertQuery(imageRowsResult, 'No se pudieron consultar los datos de las imágenes')
  const stepRows = assertQuery(stepRowsResult, 'No se pudieron consultar los datos de los pasos')
  const imageStepLinks = assertQuery(imageStepLinksResult, 'No se pudieron consultar las imágenes de los pasos')
  const authorLinks = assertQuery(authorLinksResult, 'No se pudieron consultar las autorías')
  const eventLinks = assertQuery(eventLinksResult, 'No se pudieron consultar los acontecimientos')
  const municipality = assertQuery(municipalityResult, 'No se pudo consultar la localidad')
  const place = assertQuery(placeResult, 'No se pudo consultar la sede canónica')

  const authorIds = unique(authorLinks.map((item) => item.source_entity_id))
  const eventIds = unique(eventLinks.map((item) => item.source_entity_id))
  const [authorEntities, eventEntities, eventRowsResult] = await Promise.all([
    loadEntities(supabase, authorIds, 'No se pudieron consultar los autores'),
    loadEntities(supabase, eventIds, 'No se pudieron consultar los acontecimientos'),
    eventIds.length
      ? supabase
          .from('events')
          .select('entity_id, event_type, event_date, event_date_text, description')
          .in('entity_id', eventIds)
      : Promise.resolve({ data: [], error: null }),
  ])
  const eventRows = assertQuery(eventRowsResult, 'No se pudieron consultar los datos de los acontecimientos')

  const sourceTargetIds = unique([entity.id, ...imageIds, ...stepIds, ...eventIds])
  const sourceLinks = sourceTargetIds.length
    ? assertQuery(
        await supabase
          .from('source_links')
          .select('source_id, entity_id, scope')
          .in('entity_id', sourceTargetIds),
        'No se pudieron consultar los enlaces de fuentes'
      )
    : []
  const sourceIds = unique(sourceLinks.map((item) => item.source_id))
  const sources = sourceIds.length
    ? assertQuery(
        await supabase
          .from('sources')
          .select('id, name, url, source_type, author_or_publisher')
          .in('id', sourceIds),
        'No se pudieron consultar las fuentes'
      )
    : []

  const imageRowById = new Map(imageRows.map((item) => [item.entity_id, item]))
  const authorById = new Map(authorEntities.map((item) => [item.id, item]))
  const stepRowById = new Map(stepRows.map((item) => [item.entity_id, item]))
  const eventRowById = new Map(eventRows.map((item) => [item.entity_id, item]))

  const imagenes = imageEntities.map((imageEntity) => {
    const image = imageRowById.get(imageEntity.id) || {}
    const autores = authorLinks
      .filter((link) => link.target_entity_id === imageEntity.id)
      .map((link) => authorById.get(link.source_entity_id)?.name)
      .filter(Boolean)

    return {
      id: imageEntity.id,
      slug: imageEntity.slug,
      nombre: imageEntity.name,
      tipo: image.image_type || 'Imagen',
      autor: autores.join(' · '),
      fecha: image.execution_date_text || image.execution_date || '',
      descripcion: image.description || imageEntity.summary || '',
      iniciales: initials(imageEntity.name),
      procesiona: imageStepLinks.some((link) => link.image_entity_id === imageEntity.id),
    }
  })

  const pasos = stepEntities.map((stepEntity) => {
    const step = stepRowById.get(stepEntity.id) || {}

    return {
      id: stepEntity.id,
      slug: stepEntity.slug,
      nombre: stepEntity.name,
      tipo: step.step_type || 'Paso',
      descripcion: step.description || stepEntity.summary || '',
      imagenes: imageStepLinks
        .filter((link) => link.step_entity_id === stepEntity.id)
        .map((link) => link.image_entity_id),
    }
  })

  const acontecimientos = eventEntities.map((eventEntity) => {
    const event = eventRowById.get(eventEntity.id) || {}

    return {
      id: eventEntity.id,
      slug: eventEntity.slug,
      titulo: eventEntity.name,
      categoria: event.event_type || 'Acontecimiento',
      ano: event.event_date_text || event.event_date || '',
      resumen: event.description || eventEntity.summary || '',
      protagonistas: imagenes
        .filter((imagen) => eventLinks.some(
          (link) => link.source_entity_id === eventEntity.id && link.target_entity_id === imagen.id
        ))
        .map((imagen) => imagen.nombre)
        .join(' y '),
    }
  })

  return {
    entity,
    brotherhood,
    municipality,
    place,
    imagenes,
    pasos,
    acontecimientos,
    sources,
  }
}

function mergeBrotherhood(local, remote) {
  const base = local || {
    ...EMPTY_COLLECTIONS,
    colores: {
      primario: '#153B69',
      secundario: '#A71930',
      claro: '#FFFFFF',
    },
    resumen: remote.entity.summary || '',
    historia: 'La documentación histórica de esta hermandad está en preparación.',
    tipos: [],
  }

  const imagenes = mergeBySlug(base.imagenes, remote.imagenes).map((imagen) => ({
    ...imagen,
    autor: imagen.autor || 'Autoría pendiente de documentar',
    fecha: imagen.fecha || 'Fecha pendiente de documentar',
    iniciales: imagen.iniciales || initials(imagen.nombre),
  }))
  const remoteImageIdBySlug = new Map(imagenes.map((imagen) => [imagen.slug, imagen.id]))
  const localImageSlugById = new Map((base.imagenes || []).map((imagen) => [imagen.id, imagen.slug]))

  const pasos = mergeBySlug(base.pasos, remote.pasos).map((paso) => ({
    ...paso,
    imagenes: paso.imagenes?.length
      ? paso.imagenes.map((id) => remoteImageIdBySlug.get(localImageSlugById.get(id)) || id)
      : [],
  }))

  const remoteCouncilEvents = remote.acontecimientos.filter((event) =>
    event.categoria.toLowerCase().includes('vía crucis')
  )
  const localCouncilEvents = base.participacionesConsejo || []
  const participacionesConsejo = remoteCouncilEvents.map((remoteEvent) => ({
    ...(localCouncilEvents.find((localEvent) => localEvent.ano === remoteEvent.ano) || {}),
    ...remoteEvent,
  }))

  return {
    ...EMPTY_COLLECTIONS,
    ...base,
    id: remote.entity.id,
    slug: remote.entity.slug,
    nombrePopular: remote.brotherhood.popular_name || remote.entity.name,
    nombreOficial: remote.brotherhood.official_name,
    localidad: remote.municipality?.name || base.localidad,
    provincia: remote.municipality?.province || base.provincia,
    sede: remote.place?.name || base.sede,
    barrio: remote.brotherhood.neighborhood || base.barrio,
    fundacion: remote.brotherhood.foundation_text || base.fundacion,
    diaSalida: remote.brotherhood.current_procession_day || base.diaSalida,
    tipos: remote.brotherhood.brotherhood_types?.length
      ? remote.brotherhood.brotherhood_types
      : base.tipos,
    resumen: remote.entity.summary || base.resumen,
    imagenes,
    pasos,
    participacionesConsejo: remoteCouncilEvents.length
      ? participacionesConsejo
      : localCouncilEvents,
    fuentesFicha: remote.sources.length
      ? remote.sources.map((source) => ({
          id: source.id,
          nombre: source.name,
          url: source.url,
          descripcion: source.source_type,
        }))
      : base.fuentesFicha,
    datosDesdeSupabase: true,
  }
}

export async function getHermandadPageBySlug(slug) {
  const local = getHermandadBySlug(slug)

  try {
    const remote = await loadBrotherhoodFromSupabase(slug)
    return remote ? mergeBrotherhood(local, remote) : local
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la hermandad desde Supabase', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return local
  }
}
