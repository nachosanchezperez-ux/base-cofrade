import 'server-only'
import { classifyBrotherhoodImageRelation, isFormerTitularRelation, publicRelationLabel } from '@/lib/brotherhood-image-relations'

import { unstable_cache } from 'next/cache'
import { after } from 'next/server'
import { createLastGoodReader, PUBLIC_DETAIL_LAST_GOOD_REVALIDATE } from '@/lib/public-detail-last-good'
import { PUBLIC_DETAIL_DATA_REVALIDATE, publicDetailCacheDay } from '@/lib/public-detail-cache'
import { getPublishedEntityCoverMedia } from '@/lib/supabase/entity-media'
import { createPublicClient } from '@/lib/supabase/public'
import { publicErrorMessage } from '@/lib/supabase/public-error'
import { getPublishedStepHeritage } from '@/lib/supabase/step-heritage'
import { loadPublishedBrotherhoodPalette } from '@/lib/supabase/brotherhood-palette'
import { accompanimentStartLabel, findDocumentedPredecessor, predecessorLabel, resolvePredecessor, stepMusicHistory } from '@/lib/music-lineage'

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
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

function displayDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

async function loadPublishedEntity(supabase, slug, entityType) {
  return assertRow(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, summary, status, updated_at, content_updated_at, editorial_reviewed_at')
      .eq('entity_type', entityType)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle(),
    `No se pudo consultar la entidad ${entityType}`
  )
}

async function loadDirectSources(supabase, entityId) {
  const links = assertRows(
    await supabase
      .from('source_links')
      .select('source_id, scope')
      .eq('entity_id', entityId),
    'No se pudieron consultar los enlaces de Fuentes'
  ).filter((link) => !String(link.scope || '').startsWith('relation:'))

  const sourceIds = unique(links.map((link) => link.source_id))
  if (!sourceIds.length) return []

  return assertRows(
    await supabase
      .from('sources')
      .select('id, name, url')
      .in('id', sourceIds)
      .order('name'),
    'No se pudieron consultar las Fuentes'
  ).map((source) => ({
    id: source.id,
    nombre: source.name,
    url: source.url,
  }))
}

async function loadPublishedBrotherhood(supabase, entityId, relationTable, relationColumn) {
  const relations = assertRows(
    await supabase
      .from(relationTable)
      .select('brotherhood_entity_id, relation_type')
      .eq(relationColumn, entityId)
      .eq('status', 'published')
      .limit(5),
    'No se pudo consultar la Hermandad relacionada'
  )

  // Si la imagen tiene varias relaciones, prevalece la vigente sobre la de antigua titular.
  const rank = { titular: 3, former: 2, other: 1 }
  const relation = [...relations].sort((a, b) => (
    rank[classifyBrotherhoodImageRelation(b.relation_type)] - rank[classifyBrotherhoodImageRelation(a.relation_type)]
  ))[0]
  const brotherhoodId = relation?.brotherhood_entity_id
  if (!brotherhoodId) return null

  const [brotherhoodEntityResult, brotherhoodResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .eq('status', 'published')
      .maybeSingle(),
    supabase
      .from('brotherhoods')
      .select('entity_id, official_name, popular_name, municipality_id, crest_path')
      .eq('entity_id', brotherhoodId)
      .maybeSingle(),
  ])
  const brotherhoodEntity = assertRow(
    brotherhoodEntityResult,
    'No se pudo consultar la Hermandad publicada'
  )
  const brotherhood = assertRow(
    brotherhoodResult,
    'No se pudo consultar la identidad de la Hermandad relacionada'
  )

  if (!brotherhoodEntity || !brotherhood) return null
  const [municipalityResult, colores] = await Promise.all([
    brotherhood.municipality_id
      ? supabase
          .from('municipalities')
          .select('name')
          .eq('id', brotherhood.municipality_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    loadPublishedBrotherhoodPalette(supabase, brotherhoodEntity),
  ])
  const municipality = assertRow(
    municipalityResult,
    'No se pudo consultar la localidad de la Hermandad relacionada'
  )

  return {
    id: brotherhoodEntity.id,
    slug: brotherhoodEntity.slug,
    nombrePopular: brotherhood.popular_name || brotherhoodEntity.name,
    nombreOficial: brotherhood.official_name || brotherhoodEntity.name,
    localidad: municipality?.name || '',
    escudoPath: brotherhood.crest_path || '',
    colores,
    antiguaTitular: isFormerTitularRelation(relation?.relation_type),
    relacionImagen: relation?.relation_type === undefined ? '' : publicRelationLabel(relation.relation_type),
  }
}

function formatImageAuthorship(authorship, agentName) {
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

async function loadImageAuthors(supabase, imageId) {
  const [authorshipResult, legacyResult] = await Promise.all([
    supabase
      .from('image_authorships')
      .select('agent_entity_id, authorship_type, certainty')
      .eq('image_entity_id', imageId)
      .eq('status', 'published'),
    supabase
      .from('entity_relations')
      .select('source_entity_id')
      .eq('target_entity_id', imageId)
      .eq('relation_type', 'author_of')
      .eq('status', 'published'),
  ])

  const authorships = assertRows(authorshipResult, 'No se pudieron consultar las autorías de la Imagen')
  const legacy = assertRows(legacyResult, 'No se pudieron consultar las autorías históricas de la Imagen')
  const canonicalAgentIds = unique(authorships.map((item) => item.agent_entity_id))
  const legacyAgentIds = authorships.length ? [] : unique(legacy.map((item) => item.source_entity_id))
  const agentIds = unique([...canonicalAgentIds, ...legacyAgentIds])

  const agents = agentIds.length
    ? assertRows(
        await supabase
          .from('entities')
          .select('id, name, slug')
          .eq('entity_type', 'agent')
          .eq('status', 'published')
          .in('id', agentIds),
        'No se pudieron consultar los Agentes de autoría'
      )
    : []
  const agentById = new Map(agents.map((agent) => [agent.id, agent]))
  // Each author keeps its public label ("Atribuido a …") and, when the Agent is
  // published, the slug of its ficha so the Imagen can link to /autores/.
  const toAuthor = (agentId, label) => {
    if (!label) return null
    const agent = agentById.get(agentId)
    return { label, name: agent?.name || '', slug: agent?.slug || '' }
  }
  const uniqueAuthors = (items) => {
    const seen = new Set()
    return items.filter((item) => item && !seen.has(item.label) && seen.add(item.label))
  }

  if (authorships.length) {
    return uniqueAuthors(authorships.map((item) => toAuthor(
      item.agent_entity_id,
      formatImageAuthorship(item, agentById.get(item.agent_entity_id)?.name)
    )))
  }

  return uniqueAuthors(legacyAgentIds.map((id) => toAuthor(id, agentById.get(id)?.name)))
}

async function loadImageInterventions(supabase, imageId) {
  const interventions = assertRows(
    await supabase
      .from('heritage_interventions')
      .select('id, agent_entity_id, discipline, intervention_type, phase, date_from, date_from_text, date_to, date_to_text, description')
      .eq('target_entity_id', imageId)
      .eq('status', 'published')
      .order('date_from', { ascending: false, nullsFirst: false }),
    'No se pudieron consultar las intervenciones de la Imagen'
  )

  const agentIds = unique(interventions.map((item) => item.agent_entity_id))
  const agents = agentIds.length
    ? assertRows(
        await supabase
          .from('entities')
          .select('id, name, slug')
          .eq('entity_type', 'agent')
          .eq('status', 'published')
          .in('id', agentIds),
        'No se pudieron consultar los responsables de las intervenciones'
      )
    : []
  const agentById = new Map(agents.map((agent) => [agent.id, agent]))

  return interventions.map((item) => {
    const agentName = item.agent_entity_id
      ? agentById.get(item.agent_entity_id)?.name || ''
      : ''
    const dateFrom = item.date_from_text || displayDate(item.date_from)
    const dateTo = item.date_to_text || displayDate(item.date_to)
    const dateLabel = [dateFrom, dateTo].filter(Boolean).join('–')
    const titleParts = [item.intervention_type || item.discipline || 'Intervención', item.phase]
      .filter(Boolean)

    return {
      id: item.id,
      fecha: dateLabel,
      titulo: titleParts.join(' · '),
      texto: [agentName, item.description].filter(Boolean).join(' · '),
      responsable: agentName,
      responsableSlug: item.agent_entity_id ? agentById.get(item.agent_entity_id)?.slug || '' : '',
      disciplina: item.discipline || '',
    }
  })
}

async function loadImageCard(supabase, entity) {
  const image = assertRow(
    await supabase
      .from('images')
      .select('entity_id, image_type, execution_date, execution_date_text, material, technique, dimensions_text, iconography, anatomical_type, is_dress_image, current_condition, current_state_notes, description, notes')
      .eq('entity_id', entity.id)
      .maybeSingle(),
    'No se pudieron consultar los datos de la Imagen'
  )

  if (!image) return null

  const [authors, sources, interventions] = await Promise.all([
    loadImageAuthors(supabase, entity.id),
    loadDirectSources(supabase, entity.id),
    loadImageInterventions(supabase, entity.id),
  ])

  return {
    id: entity.id,
    slug: entity.slug,
    updatedAt: entity.content_updated_at || entity.updated_at || null,
    nombre: entity.name,
    tipo: image.image_type || 'Imagen',
    tipologia: image.anatomical_type || image.image_type || 'Imagen',
    autor: authors.map((author) => author.label).join(' · '),
    autores: authors,
    fecha: image.execution_date_text || image.execution_date || '',
    descripcion: image.description || entity.summary || '',
    material: image.material || '',
    tecnica: image.technique || '',
    dimensiones: image.dimensions_text || '',
    iconografia: image.iconography || '',
    estadoActual: image.current_state_notes || '',
    iniciales: initials(entity.name),
    fuentes: sources,
    restauraciones: interventions,
  }
}

async function loadStepImageCards(supabase, entities) {
  const imageIds = entities.map((entity) => entity.id)
  if (!imageIds.length) return []

  const [imagesResult, authorshipsResult] = await Promise.all([
    supabase
      .from('images')
      .select('entity_id, image_type, execution_date, execution_date_text, description')
      .in('entity_id', imageIds),
    supabase
      .from('image_authorship_details')
      .select('image_entity_id, agent_name, authorship_type')
      .in('image_entity_id', imageIds),
  ])
  const images = assertRows(imagesResult, 'No se pudieron consultar los datos resumidos de las Imágenes del Paso')
  const authorships = assertRows(authorshipsResult, 'No se pudieron consultar las autorías resumidas de las Imágenes del Paso')
  const imageById = new Map(images.map((image) => [image.entity_id, image]))

  return entities.map((entity) => {
    const image = imageById.get(entity.id) || {}
    const authors = unique(
      authorships
        .filter((authorship) => authorship.image_entity_id === entity.id)
        .map((authorship) => formatImageAuthorship(authorship, authorship.agent_name))
    )

    return {
      id: entity.id,
      slug: entity.slug,
      nombre: entity.name,
      tipo: image.image_type || 'Imagen',
      autor: authors.join(' · '),
      fecha: image.execution_date_text || image.execution_date || '',
      descripcion: image.description || entity.summary || '',
    }
  })
}

async function loadPublishedStepsForImage(supabase, imageId) {
  const links = assertRows(
    await supabase
      .from('image_steps')
      .select('step_entity_id')
      .eq('image_entity_id', imageId)
      .eq('status', 'published'),
    'No se pudieron consultar los Pasos relacionados con la Imagen'
  )
  const stepIds = unique(links.map((link) => link.step_entity_id))
  if (!stepIds.length) return []

  const [entitiesResult, stepsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug')
      .eq('entity_type', 'step')
      .eq('status', 'published')
      .in('id', stepIds),
    supabase
      .from('steps')
      .select('entity_id, step_type, execution_date_text')
      .in('entity_id', stepIds),
  ])
  const entities = assertRows(entitiesResult, 'No se pudieron consultar las fichas de los Pasos relacionados')
  const steps = assertRows(stepsResult, 'No se pudieron consultar los datos de los Pasos relacionados')
  const stepById = new Map(steps.map((step) => [step.entity_id, step]))

  return entities.map((entity) => ({
    id: entity.id,
    nombre: entity.name,
    slug: entity.slug,
    tipo: stepById.get(entity.id)?.step_type || 'Paso procesional',
    ejecucion: stepById.get(entity.id)?.execution_date_text || '',
  }))
}

async function loadImagenPageBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const entity = await loadPublishedEntity(supabase, slug, 'image')
    if (!entity) return null

    const [imagen, hermandad, pasos] = await Promise.all([
      loadImageCard(supabase, entity),
      loadPublishedBrotherhood(supabase, entity.id, 'brotherhood_images', 'image_entity_id'),
      loadPublishedStepsForImage(supabase, entity.id),
    ])

    if (!imagen) return null
    return {
      imagen: hermandad
        ? { ...imagen, antiguaTitular: Boolean(hermandad.antiguaTitular), relacionHermandad: hermandad.relacionImagen || 'Titular' }
        : imagen,
      hermandad,
      pasos,
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la Imagen pública desde Supabase', {
      slug,
      error: publicErrorMessage(error),
    })
    throw error instanceof Error ? error : new Error(publicErrorMessage(error))
  }
}

async function loadPasoPageBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const entity = await loadPublishedEntity(supabase, slug, 'step')
    if (!entity) return null

    const [step, imageLinks, hermandad, stepPeriods, coverMedia, heritage] = await Promise.all([
      assertRow(
        await supabase
          .from('steps')
          .select('entity_id, step_type, style, materials, dimensions_text, carrier_system, execution_date_text, current_condition, current_state_notes, description, notes')
          .eq('entity_id', entity.id)
          .maybeSingle(),
        'No se pudieron consultar los datos del Paso'
      ),
      assertRows(
        await supabase
          .from('image_steps')
          .select('image_entity_id')
          .eq('step_entity_id', entity.id)
          .eq('status', 'published'),
        'No se pudieron consultar las Imágenes del Paso'
      ),
      loadPublishedBrotherhood(supabase, entity.id, 'brotherhood_steps', 'step_entity_id'),
      assertRows(
        await supabase
          .from('music_accompaniment_periods')
          .select('id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, year_to, is_current, date_from_text, notes, public_band_name, public_band_slug')
          .eq('step_entity_id', entity.id)
          .eq('status', 'published'),
        'No se pudo consultar el acompañamiento musical actual del Paso'
      ),
      getPublishedEntityCoverMedia(entity.id),
      getPublishedStepHeritage(entity.id),
    ])

    if (!step) return null

    const imageIds = unique(imageLinks.map((link) => link.image_entity_id))
    const imageEntities = imageIds.length
      ? assertRows(
          await supabase
            .from('entities')
            .select('id, entity_type, name, slug, summary, status')
            .eq('entity_type', 'image')
            .eq('status', 'published')
            .in('id', imageIds),
          'No se pudieron consultar las Imágenes publicadas del Paso'
        )
      : []
    const imagenes = await loadStepImageCards(supabase, imageEntities)
    // Vigentes para la sección; finalizados del mismo paso para la formación anterior.
    const accompanimentPeriods = stepPeriods.filter((period) => period.is_current === true)
    const predecessorByPeriodId = new Map(
      accompanimentPeriods
        .map((period) => [period.id, findDocumentedPredecessor(period, stepPeriods)])
        .filter(([, predecessor]) => predecessor)
    )
    const bandIds = unique(accompanimentPeriods.map((period) => period.band_entity_id))
    const historicalBandIds = stepPeriods.filter((period) => period.is_current !== true).map((period) => period.band_entity_id)
    const nameIds = unique([...bandIds, ...historicalBandIds, ...[...predecessorByPeriodId.values()].map((item) => item.bandEntityId)])
    const [bandEntities, bandNames] = nameIds.length
      ? await Promise.all([
          assertRows(
            await supabase
              .from('entities')
              .select('id, name, slug')
              .eq('entity_type', 'band')
              .eq('status', 'published')
              .in('id', nameIds),
            'No se pudieron consultar las Bandas publicadas del Paso'
          ),
          assertRows(
            await supabase
              .from('band_names')
              .select('band_entity_id, name, name_type, is_current')
              .in('band_entity_id', bandIds.length ? bandIds : nameIds),
            'No se pudieron consultar los nombres de las Bandas del Paso'
          ),
        ])
      : [[], []]
    const bandById = new Map(bandEntities.map((band) => [band.id, band]))
    const bandas = accompanimentPeriods.map((period) => {
      const band = bandById.get(period.band_entity_id)
      if (!band) return null
      const names = bandNames.filter((name) => name.band_entity_id === band.id)
      const popularName = names.find((name) => name.name_type === 'popular' && name.is_current)?.name
        || names.find((name) => name.name_type === 'popular')?.name
        || band.name

      return {
        id: period.id,
        nombre: popularName,
        slug: band.slug,
        posicion: period.position || 'Acompañamiento musical',
        salida: period.outing_type || '',
        periodo: accompanimentStartLabel(period),
        anterior: predecessorLabel(resolvePredecessor(predecessorByPeriodId.get(period.id), bandById)),
      }
    }).filter(Boolean)
    const historicoMusical = stepMusicHistory(stepPeriods, bandById)

    return {
      paso: {
        id: entity.id,
        slug: entity.slug,
        updatedAt: entity.content_updated_at || entity.updated_at || null,
        nombre: entity.name,
        tipo: step.step_type || 'Paso',
        descripcion: step.description || entity.summary || '',
        materiales: step.materials || '',
        sistemaPortadores: step.carrier_system || '',
        ejecucion: step.execution_date_text || '',
        estadoActual: step.current_state_notes || '',
        imagenes: imagenes.map((imagen) => imagen.id),
      },
      hermandad,
      imagenes,
      bandas,
      historicoMusical,
      coverMedia,
      heritage,
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el Paso público desde Supabase', {
      slug,
      error: publicErrorMessage(error),
    })
    throw error instanceof Error ? error : new Error(publicErrorMessage(error))
  }
}

const getCachedImagenPageBySlug = unstable_cache(
  loadImagenPageBySlug,
  ['hilo-cofrade-public-image-detail-v7-autores'],
  { revalidate: PUBLIC_DETAIL_DATA_REVALIDATE, tags: ['public-image-detail', 'public-brotherhood-detail'] }
)

// El histórico musical del Paso usa el año en curso: el día entra en la clave.
const getCachedPasoPageBySlug = unstable_cache(
  (slug) => loadPasoPageBySlug(slug),
  ['hilo-cofrade-public-step-detail-v7-hc09'],
  { revalidate: PUBLIC_DETAIL_DATA_REVALIDATE, tags: ['public-step-detail', 'public-brotherhood-detail'] }
)

// Copias de respaldo sin etiquetas (ver lib/public-detail-last-good.js).
const getLastGoodImagenPageBySlug = unstable_cache(
  (slug) => loadImagenPageBySlug(slug),
  ['hilo-cofrade-public-image-detail-last-good-v1'],
  { revalidate: PUBLIC_DETAIL_LAST_GOOD_REVALIDATE }
)

const getLastGoodPasoPageBySlug = unstable_cache(
  (slug) => loadPasoPageBySlug(slug),
  ['hilo-cofrade-public-step-detail-last-good-v1'],
  { revalidate: PUBLIC_DETAIL_LAST_GOOD_REVALIDATE }
)

const readImagenPage = createLastGoodReader({
  label: 'la Imagen',
  readCurrent: getCachedImagenPageBySlug,
  readLastGood: getLastGoodImagenPageBySlug,
  schedule: after,
})

const readPasoPage = createLastGoodReader({
  label: 'el Paso',
  readCurrent: getCachedPasoPageBySlug,
  readLastGood: getLastGoodPasoPageBySlug,
  schedule: after,
})

export async function getImagenPageBySlug(slug) {
  return readImagenPage(slug)
}

export async function getPasoPageBySlug(slug) {
  return readPasoPage(slug, publicDetailCacheDay())
}
