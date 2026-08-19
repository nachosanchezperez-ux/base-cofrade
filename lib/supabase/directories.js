import 'server-only'

import { cache } from 'react'
import { getCachedPublicData, PUBLIC_CACHE_TAGS } from '@/lib/cache/public-cache'
import { createPublicClient } from '@/lib/supabase/public'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function currentRelation(items = []) {
  return items.find((item) => item.is_current) || items[0] || null
}

function relationMap(rows, key) {
  return rows.reduce((map, row) => {
    const id = row[key]
    if (!id) return map
    const current = map.get(id) || []
    current.push(row)
    map.set(id, current)
    return map
  }, new Map())
}

async function commonContext(supabase) {
  const [entitiesResult, brotherhoodsResult, municipalitiesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug')
      .in('entity_type', ['brotherhood', 'agent'])
      .eq('status', 'published'),
    supabase.from('brotherhoods').select('entity_id, municipality_id'),
    supabase.from('municipalities').select('id, name, slug'),
  ])

  const entities = assertRows(entitiesResult, 'No se pudieron consultar las entidades relacionadas')
  const brotherhoods = assertRows(brotherhoodsResult, 'No se pudieron consultar las hermandades del directorio')
  const municipalities = assertRows(municipalitiesResult, 'No se pudieron consultar las localidades del directorio')

  return {
    entityById: new Map(entities.map((item) => [item.id, item])),
    brotherhoodById: new Map(brotherhoods.map((item) => [item.entity_id, item])),
    municipalityById: new Map(municipalities.map((item) => [item.id, item])),
  }
}

async function loadImagesDirectory() {
  try {
    const supabase = createPublicClient()
    const [entitiesResult, imagesResult, historyResult, locationsResult, authorshipsResult, legacyAuthorsResult, context] = await Promise.all([
      supabase
        .from('entities')
        .select('id, name, slug, summary')
        .eq('entity_type', 'image')
        .eq('status', 'published')
        .not('slug', 'is', null)
        .order('name'),
      supabase
        .from('images')
        .select('entity_id, image_type, execution_date, execution_date_text, material, technique, current_condition, description'),
      supabase.from('image_brotherhood_history').select('*'),
      supabase.from('current_image_locations').select('*'),
      supabase.from('image_authorship_details').select('*'),
      supabase
        .from('entity_relations')
        .select('source_entity_id, target_entity_id, relation_type')
        .eq('relation_type', 'author_of')
        .eq('status', 'published'),
      commonContext(supabase),
    ])

    const entities = assertRows(entitiesResult, 'No se pudieron consultar las imágenes publicadas')
    const images = assertRows(imagesResult, 'No se pudieron consultar los datos de las imágenes')
    const history = assertRows(historyResult, 'No se pudo consultar la relación de imágenes y hermandades')
    const locations = assertRows(locationsResult, 'No se pudieron consultar las ubicaciones de las imágenes')
    const authorships = assertRows(authorshipsResult, 'No se pudieron consultar las autorías de las imágenes')
    const legacyAuthors = assertRows(legacyAuthorsResult, 'No se pudieron consultar las autorías heredadas')

    const imageById = new Map(images.map((item) => [item.entity_id, item]))
    const historyByImage = relationMap(history, 'image_entity_id')
    const locationByImage = new Map(locations.map((item) => [item.image_entity_id, item]))
    const authorshipByImage = relationMap(authorships, 'image_entity_id')
    const legacyByImage = relationMap(legacyAuthors, 'target_entity_id')

    return entities.map((entity) => {
      const image = imageById.get(entity.id) || {}
      const brotherhoodRelation = currentRelation(historyByImage.get(entity.id))
      const brotherhoodEntity = context.entityById.get(brotherhoodRelation?.brotherhood_entity_id)
      const brotherhoodRow = context.brotherhoodById.get(brotherhoodRelation?.brotherhood_entity_id)
      const brotherhoodMunicipality = context.municipalityById.get(brotherhoodRow?.municipality_id)
      const location = locationByImage.get(entity.id)
      const documentedAuthors = (authorshipByImage.get(entity.id) || []).map((item) => ({
        name: item.agent_name,
        slug: context.entityById.get(item.agent_entity_id)?.slug || '',
        type: item.authorship_type,
      }))
      const inheritedAuthors = (legacyByImage.get(entity.id) || []).map((item) => {
        const author = context.entityById.get(item.source_entity_id)
        return author ? { name: author.name, slug: author.slug || '', type: 'author' } : null
      }).filter(Boolean)
      const authors = [...documentedAuthors]
      for (const author of inheritedAuthors) {
        if (!authors.some((item) => item.name === author.name)) authors.push(author)
      }
      const municipality = location?.municipality_name || brotherhoodMunicipality?.name || ''

      return {
        id: entity.id,
        slug: entity.slug,
        name: entity.name,
        href: `/imagenes/${entity.slug}`,
        summary: entity.summary || image.description || '',
        type: image.image_type || 'Imagen',
        date: image.execution_date_text || image.execution_date || '',
        material: image.material || '',
        technique: image.technique || '',
        condition: image.current_condition || '',
        brotherhoodName: brotherhoodEntity?.name || brotherhoodRelation?.brotherhood_name || '',
        brotherhoodSlug: brotherhoodEntity?.slug || '',
        municipality,
        municipalitySlug: location?.municipality_id
          ? context.municipalityById.get(location.municipality_id)?.slug || ''
          : brotherhoodMunicipality?.slug || '',
        place: location?.place_name || '',
        authors,
        authorNames: unique(authors.map((item) => item.name)),
      }
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio de imágenes', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

async function loadStepsDirectory() {
  try {
    const supabase = createPublicClient()
    const [entitiesResult, stepsResult, historyResult, imageHistoryResult, phasesResult, context] = await Promise.all([
      supabase
        .from('entities')
        .select('id, name, slug, summary')
        .eq('entity_type', 'step')
        .eq('status', 'published')
        .not('slug', 'is', null)
        .order('name'),
      supabase
        .from('steps')
        .select('entity_id, step_type, style, materials, execution_date_text, current_condition, description'),
      supabase.from('step_brotherhood_history').select('*'),
      supabase.from('step_image_history').select('*'),
      supabase.from('step_phase_details').select('*'),
      commonContext(supabase),
    ])

    const entities = assertRows(entitiesResult, 'No se pudieron consultar los pasos publicados')
    const steps = assertRows(stepsResult, 'No se pudieron consultar los datos de los pasos')
    const history = assertRows(historyResult, 'No se pudo consultar la relación de pasos y hermandades')
    const imageHistory = assertRows(imageHistoryResult, 'No se pudieron consultar las imágenes de los pasos')
    const phases = assertRows(phasesResult, 'No se pudieron consultar los autores y talleres de los pasos')

    const stepById = new Map(steps.map((item) => [item.entity_id, item]))
    const historyByStep = relationMap(history, 'step_entity_id')
    const imagesByStep = relationMap(imageHistory, 'step_entity_id')
    const phasesByStep = relationMap(phases, 'step_entity_id')

    return entities.map((entity) => {
      const step = stepById.get(entity.id) || {}
      const brotherhoodRelation = currentRelation(historyByStep.get(entity.id))
      const brotherhoodEntity = context.entityById.get(brotherhoodRelation?.brotherhood_entity_id)
      const brotherhoodRow = context.brotherhoodById.get(brotherhoodRelation?.brotherhood_entity_id)
      const municipality = context.municipalityById.get(brotherhoodRow?.municipality_id)
      const imageRelations = (imagesByStep.get(entity.id) || []).filter((item) => item.is_current !== false)
      const phaseRelations = phasesByStep.get(entity.id) || []
      const agents = unique(phaseRelations.map((item) => item.agent_name))
      const disciplines = unique(phaseRelations.map((item) => item.discipline))

      return {
        id: entity.id,
        slug: entity.slug,
        name: entity.name,
        href: `/pasos/${entity.slug}`,
        summary: entity.summary || step.description || '',
        type: step.step_type || 'Paso procesional',
        style: step.style || '',
        materials: step.materials || '',
        date: step.execution_date_text || '',
        condition: step.current_condition || '',
        brotherhoodName: brotherhoodEntity?.name || brotherhoodRelation?.brotherhood_name || '',
        brotherhoodSlug: brotherhoodEntity?.slug || '',
        municipality: municipality?.name || '',
        municipalitySlug: municipality?.slug || '',
        imageNames: unique(imageRelations.map((item) => item.image_name)),
        authors: agents.map((name) => ({ name })),
        authorNames: agents,
        disciplines,
      }
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio de pasos', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export const getImagesDirectory = cache(() => getCachedPublicData({
  key: ['image-directory'],
  tags: [
    PUBLIC_CACHE_TAGS.IMAGES,
    PUBLIC_CACHE_TAGS.BROTHERHOODS,
    PUBLIC_CACHE_TAGS.AGENTS,
  ],
  loader: loadImagesDirectory,
}))

export const getStepsDirectory = cache(() => getCachedPublicData({
  key: ['step-directory'],
  tags: [
    PUBLIC_CACHE_TAGS.STEPS,
    PUBLIC_CACHE_TAGS.BROTHERHOODS,
    PUBLIC_CACHE_TAGS.IMAGES,
    PUBLIC_CACHE_TAGS.AGENTS,
  ],
  loader: loadStepsDirectory,
}))
