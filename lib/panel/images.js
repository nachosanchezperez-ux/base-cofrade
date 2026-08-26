import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function rows(result, label) {
  return assertQuery(result, label) || []
}

export async function getPanelImages({ query = '', status = '' } = {}) {
  const supabase = await createClient()
  let entityQuery = supabase
    .from('entities')
    .select('id, name, slug, status, updated_at')
    .eq('entity_type', 'image')
    .order('name')

  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)

  const entities = rows(await entityQuery, 'No se pudieron cargar las imágenes del panel')
  if (!entities.length) return []

  const imageRows = rows(
    await supabase
      .from('images')
      .select('entity_id, image_type, current_condition')
      .in('entity_id', entities.map((entity) => entity.id)),
    'No se pudieron cargar las fichas de imagen'
  )

  const imageById = new Map(imageRows.map((row) => [row.entity_id, row]))

  return entities.map((entity) => {
    const image = imageById.get(entity.id) || {}
    return {
      ...entity,
      type: image.image_type || 'Tipo por documentar',
      condition: image.current_condition || '',
    }
  })
}

export async function getImageEditorData(id) {
  const supabase = await createClient()
  const entity = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug, summary, status, updated_at')
      .eq('id', id)
      .eq('entity_type', 'image')
      .maybeSingle(),
    'No se pudo cargar la entidad de imagen'
  )

  if (!entity) return null

  const [imageResult, mediaResult, brotherhoodLinksResult, stepLinksResult, sourceLinksResult, advocationEntitiesResult, advocationsResult] = await Promise.all([
    supabase
      .from('images')
      .select('entity_id, advocation_entity_id, image_type, execution_date, execution_date_text, material, technique, polychromy, dimensions_text, height_cm, width_cm, depth_cm, iconography, anatomical_type, is_dress_image, current_condition, current_state_notes, description, notes')
      .eq('entity_id', id)
      .maybeSingle(),
    supabase
      .from('entity_media')
      .select('id, relation_type, is_cover')
      .eq('entity_id', id),
    supabase
      .from('brotherhood_images')
      .select('id, brotherhood_entity_id, relation_type, status')
      .eq('image_entity_id', id)
      .neq('status', 'archived'),
    supabase
      .from('image_steps')
      .select('id, step_entity_id, relation_type, status')
      .eq('image_entity_id', id)
      .neq('status', 'archived'),
    supabase
      .from('source_links')
      .select('id, source_id, scope')
      .eq('entity_id', id),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'advocation')
      .neq('status', 'archived')
      .order('name'),
    supabase
      .from('advocations')
      .select('entity_id, advocation_type'),
  ])

  const image = assertQuery(imageResult, 'No se pudo cargar la ficha de imagen')
  if (!image) return null

  const media = rows(mediaResult, 'No se pudo cargar el multimedia de la Imagen')
  const brotherhoodLinks = rows(brotherhoodLinksResult, 'No se pudieron cargar las Hermandades de la Imagen')
  const stepLinks = rows(stepLinksResult, 'No se pudieron cargar los Pasos de la Imagen')
  const advocationEntities = rows(advocationEntitiesResult, 'No se pudieron cargar las Advocaciones')
  const advocationRows = rows(advocationsResult, 'No se pudieron cargar los tipos de Advocación')
  const advocationById = new Map(advocationRows.map((item) => [item.entity_id, item]))
  const directSourceLinks = rows(sourceLinksResult, 'No se pudieron cargar las Fuentes de la Imagen')
    .filter((link) => !String(link.scope || '').startsWith('relation:'))
  const sourceIds = [...new Set(directSourceLinks.map((link) => link.source_id).filter(Boolean))]
  const sources = sourceIds.length
    ? rows(
        await supabase
          .from('sources')
          .select('id, name, url, source_type')
          .in('id', sourceIds)
          .order('name'),
        'No se pudieron cargar las Fuentes de la Imagen'
      )
    : []

  return {
    entity,
    image,
    advocationOptions: advocationEntities.map((item) => ({
      ...item,
      type: advocationById.get(item.id)?.advocation_type || 'Advocación',
    })),
    coverage: {
      media: media.length,
      hero: media.some((item) => item.relation_type === 'hero'),
      cover: media.some((item) => item.is_cover),
      brotherhoods: brotherhoodLinks.length,
      steps: stepLinks.length,
      sources: sources.length,
    },
    sources,
  }
}
