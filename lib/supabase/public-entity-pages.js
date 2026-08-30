import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'
import { getHermandadPageBySlug } from '@/lib/supabase/brotherhoods'

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
      .select('id, entity_type, name, slug, summary, status')
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
      .select('brotherhood_entity_id')
      .eq(relationColumn, entityId)
      .eq('status', 'published')
      .limit(1),
    'No se pudo consultar la Hermandad relacionada'
  )

  const brotherhoodId = relations[0]?.brotherhood_entity_id
  if (!brotherhoodId) return null

  const brotherhoodEntity = assertRow(
    await supabase
      .from('entities')
      .select('slug')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .eq('status', 'published')
      .maybeSingle(),
    'No se pudo consultar la Hermandad publicada'
  )

  return brotherhoodEntity?.slug
    ? getHermandadPageBySlug(brotherhoodEntity.slug)
    : null
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

async function loadImageAuthorNames(supabase, imageId) {
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
          .select('id, name')
          .eq('entity_type', 'agent')
          .eq('status', 'published')
          .in('id', agentIds),
        'No se pudieron consultar los Agentes de autoría'
      )
    : []
  const nameById = new Map(agents.map((agent) => [agent.id, agent.name]))

  if (authorships.length) {
    return unique(authorships.map((item) => formatImageAuthorship(item, nameById.get(item.agent_entity_id))))
  }

  return unique(legacyAgentIds.map((id) => nameById.get(id)))
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
          .select('id, name')
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
    loadImageAuthorNames(supabase, entity.id),
    loadDirectSources(supabase, entity.id),
    loadImageInterventions(supabase, entity.id),
  ])

  return {
    id: entity.id,
    slug: entity.slug,
    nombre: entity.name,
    tipo: image.image_type || 'Imagen',
    tipologia: image.anatomical_type || image.image_type || 'Imagen',
    autor: authors.join(' · '),
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

export async function getImagenPageBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const entity = await loadPublishedEntity(supabase, slug, 'image')
    if (!entity) return null

    const [imagen, hermandad, pasos] = await Promise.all([
      loadImageCard(supabase, entity),
      loadPublishedBrotherhood(supabase, entity.id, 'brotherhood_images', 'image_entity_id'),
      loadPublishedStepsForImage(supabase, entity.id),
    ])

    return imagen ? { imagen, hermandad, pasos } : null
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la Imagen pública desde Supabase', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

export async function getPasoPageBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const entity = await loadPublishedEntity(supabase, slug, 'step')
    if (!entity) return null

    const [step, imageLinks, hermandad, accompanimentPeriods] = await Promise.all([
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
          .select('id, band_entity_id, position, outing_type, year_from, year_to, date_from_text')
          .eq('step_entity_id', entity.id)
          .eq('is_current', true)
          .eq('status', 'published'),
        'No se pudo consultar el acompañamiento musical actual del Paso'
      ),
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
    const imagenes = (await Promise.all(imageEntities.map((imageEntity) => loadImageCard(supabase, imageEntity))))
      .filter(Boolean)
    const bandIds = unique(accompanimentPeriods.map((period) => period.band_entity_id))
    const [bandEntities, bandNames] = bandIds.length
      ? await Promise.all([
          assertRows(
            await supabase
              .from('entities')
              .select('id, name, slug')
              .eq('entity_type', 'band')
              .eq('status', 'published')
              .in('id', bandIds),
            'No se pudieron consultar las Bandas publicadas del Paso'
          ),
          assertRows(
            await supabase
              .from('band_names')
              .select('band_entity_id, name, name_type, is_current')
              .in('band_entity_id', bandIds),
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
        periodo: period.date_from_text
          || (period.year_from ? `Desde ${period.year_from}` : ''),
      }
    }).filter(Boolean)

    return {
      paso: {
        id: entity.id,
        slug: entity.slug,
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
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el Paso público desde Supabase', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
