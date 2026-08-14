import 'server-only'

import { createClient } from '@/lib/supabase/server'

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
      .select('id, image_entity_id, relation_type, date_from, date_from_text, date_to, date_to_text, status, created_at')
      .eq('brotherhood_entity_id', brotherhoodId)
      .order('created_at'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'image')
      .neq('status', 'archived')
      .order('name'),
  ])

  const entity = assertRow(entityResult, 'No se pudo cargar la Hermandad')
  const brotherhood = assertRow(brotherhoodResult, 'No se pudo cargar la ficha de la Hermandad')
  if (!entity || !brotherhood) return null

  const relations = assertRows(relationsResult, 'No se pudieron cargar las imágenes relacionadas')
  const imageEntities = assertRows(imageEntitiesResult, 'No se pudieron cargar las imágenes existentes')
  const imageIds = imageEntities.map((image) => image.id)
  const imageRows = imageIds.length
    ? assertRows(
        await supabase
          .from('images')
          .select('entity_id, image_type')
          .in('entity_id', imageIds),
        'No se pudieron cargar los tipos de imagen'
      )
    : []

  const imageTypeById = new Map(imageRows.map((image) => [image.entity_id, image.image_type]))
  const images = imageEntities.map((image) => ({
    ...image,
    imageType: imageTypeById.get(image.id) || 'Imagen',
  }))
  const imageById = new Map(images.map((image) => [image.id, image]))

  return {
    entity,
    brotherhood,
    relations: relations.map((relation) => ({
      ...relation,
      image: imageById.get(relation.image_entity_id) || null,
    })),
    candidates: images,
  }
}
