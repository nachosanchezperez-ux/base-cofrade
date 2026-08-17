import 'server-only'

import { createClient } from '@/lib/supabase/server'
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
  const preferredIds = authorships
    .filter((item) => item.authorship_type === 'author')
    .map((item) => item.agent_entity_id)
  const authorshipIds = preferredIds.length
    ? preferredIds
    : authorships.map((item) => item.agent_entity_id)
  const agentIds = unique([...authorshipIds, ...legacy.map((item) => item.source_entity_id)])

  if (!agentIds.length) return []

  const agents = assertRows(
    await supabase
      .from('entities')
      .select('id, name')
      .eq('entity_type', 'agent')
      .eq('status', 'published')
      .in('id', agentIds),
    'No se pudieron consultar los Agentes de autoría'
  )
  const nameById = new Map(agents.map((agent) => [agent.id, agent.name]))

  return unique(agentIds.map((id) => nameById.get(id)))
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
      ? agentById.get(item.agent_entity_id)?.name || 'Responsable pendiente de publicación'
      : 'Responsable desconocido'
    const dateFrom = item.date_from_text || displayDate(item.date_from)
    const dateTo = item.date_to_text || displayDate(item.date_to)
    const dateLabel = [dateFrom, dateTo].filter(Boolean).join('–')
    const titleParts = [item.intervention_type || item.discipline || 'Intervención', item.phase]
      .filter(Boolean)

    return {
      id: item.id,
      fecha: dateLabel || 'Fecha no determinada',
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
    autor: authors.join(' · ') || (/autor desconocido/i.test(image.notes || '') ? 'Autor desconocido' : ''),
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

export async function getImagenPageBySlug(slug) {
  try {
    const supabase = await createClient()
    const entity = await loadPublishedEntity(supabase, slug, 'image')
    if (!entity) return null

    const [imagen, hermandad] = await Promise.all([
      loadImageCard(supabase, entity),
      loadPublishedBrotherhood(supabase, entity.id, 'brotherhood_images', 'image_entity_id'),
    ])

    return imagen ? { imagen, hermandad } : null
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
    const supabase = await createClient()
    const entity = await loadPublishedEntity(supabase, slug, 'step')
    if (!entity) return null

    const [step, imageLinks, hermandad] = await Promise.all([
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
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el Paso público desde Supabase', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
