import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'
import { loadPublicRowsInBatches, loadPublicRowsInPages } from '@/lib/supabase/public-query-batches'
import { IMAGE_SUCCESSION_RELATION, isFormerTitularRelation } from '@/lib/brotherhood-image-relations'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

export async function getBrotherhoodImageRelations(brotherhoodId) {
  const supabase = await createClient()
  const [entityResult, brotherhoodResult, relationsResult, imageEntitiesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .maybeSingle(),
    supabase
      .from('brotherhoods')
      .select('entity_id, popular_name, official_name')
      .eq('entity_id', brotherhoodId)
      .maybeSingle(),
    supabase
      .from('brotherhood_images')
      .select('id, image_entity_id, relation_type, date_from, date_from_text, date_to, date_to_text, notes, status, created_at')
      .eq('brotherhood_entity_id', brotherhoodId)
      .order('created_at'),
    // Todas las Imágenes por páginas: una sola consulta se corta en 1.000 filas.
    loadPublicRowsInPages(
      (from, to) => supabase
        .from('entities')
        .select('id, name, slug, status')
        .eq('entity_type', 'image')
        .order('name')
        .order('id')
        .range(from, to),
      'No se pudieron cargar las imágenes existentes'
    ).then((data) => ({ data, error: null }), (error) => ({ data: null, error })),
  ])

  const entity = assertRow(entityResult, 'No se pudo cargar la Hermandad')
  const brotherhood = assertRow(brotherhoodResult, 'No se pudo cargar la ficha de la Hermandad')
  if (!entity || !brotherhood) return null

  const relations = assertRows(relationsResult, 'No se pudieron cargar las imágenes relacionadas')
  const imageEntities = assertRows(imageEntitiesResult, 'No se pudieron cargar las imágenes existentes')
  const imageIds = imageEntities.map((image) => image.id)
  // Por lotes: con cientos de Imágenes, un único filtro «in» supera el tamaño de URL admitido
  // y la consulta falla con «Bad Request» (el editor dejaba de abrirse).
  const imageRows = await loadPublicRowsInBatches(
    imageIds,
    (ids) => supabase.from('images').select('entity_id, image_type').in('entity_id', ids),
    'No se pudieron cargar los tipos de imagen',
    { batchSize: 200 }
  )

  const imageTypeById = new Map(imageRows.map((image) => [image.entity_id, image.image_type]))
  const images = imageEntities.map((image) => ({
    ...image,
    imageType: imageTypeById.get(image.id) || 'Imagen',
  }))
  const imageById = new Map(images.map((image) => [image.id, image]))
  const formerImageIds = relations
    .filter((relation) => isFormerTitularRelation(relation.relation_type))
    .map((relation) => relation.image_entity_id)
  const successions = formerImageIds.length
    ? assertRows(
        await supabase
          .from('entity_relations')
          .select('source_entity_id, target_entity_id, date_from_text')
          .in('source_entity_id', formerImageIds)
          .eq('relation_type', IMAGE_SUCCESSION_RELATION)
          .neq('status', 'archived'),
        'No se pudo cargar la sucesión de las antiguas imágenes titulares'
      )
    : []
  const successorBySource = new Map(successions.map((item) => [item.source_entity_id, item.target_entity_id]))
  const hydratedRelations = relations.map((relation) => ({
    ...relation,
    image: imageById.get(relation.image_entity_id) || null,
    successorImageId: successorBySource.get(relation.image_entity_id) || '',
  }))
  const sourceSupport = await loadRelationSourceSupport(supabase, hydratedRelations, 'brotherhood_image')

  return {
    entity,
    brotherhood,
    relations: sourceSupport.relations,
    candidates: images.filter((image) => image.status !== 'archived'),
    sourceOptions: sourceSupport.sourceOptions,
  }
}
