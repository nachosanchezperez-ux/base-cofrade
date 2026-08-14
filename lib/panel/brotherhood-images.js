import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getBrotherhoodImageRelations(brotherhoodId) {
  const supabase = await createClient()
  const [relationsResult, imagesResult] = await Promise.all([
    supabase
      .from('brotherhood_images')
      .select('id, image_entity_id, relation_type, date_from, date_from_text, date_to, date_to_text, status, created_at')
      .eq('brotherhood_entity_id', brotherhoodId)
      .neq('status', 'archived')
      .order('created_at'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'image')
      .neq('status', 'archived')
      .order('name'),
  ])

  const relations = assertRows(relationsResult, 'No se pudieron cargar las imágenes relacionadas')
  const images = assertRows(imagesResult, 'No se pudieron cargar las imágenes existentes')
  const imageById = new Map(images.map((image) => [image.id, image]))

  return {
    relations: relations.map((relation) => ({
      ...relation,
      image: imageById.get(relation.image_entity_id) || null,
    })),
    candidates: images,
  }
}
