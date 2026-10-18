import 'server-only'

import { IMAGE_SUCCESSION_RELATION } from '@/lib/brotherhood-image-relations'

// Al publicar una Imagen, sus relaciones que quedaron en borrador solo porque la Imagen
// aún no estaba publicada pasan a publicadas, siguiendo la misma regla que aplica el panel
// al crearlas (publicada si ambos extremos lo están).
// - brotherhood_images: vínculo con la Hermandad (titular, antigua titular…).
// - entity_relations · succeeded_by: «La sustituyó». El disparador
//   entity_relations_guard_publication vuelve a borrador cualquier fila cuyo otro extremo
//   no esté publicado, así que no se puede publicar nada indebidamente.
// Solo toca filas en 'draft'; 'review' y 'archived' se respetan.
export async function republishImageRelations(supabase, imageId) {
  const brotherhoodLinks = await supabase
    .from('brotherhood_images')
    .select('id, brotherhood_entity_id')
    .eq('image_entity_id', imageId)
    .eq('status', 'draft')
  if (brotherhoodLinks.error) throw new Error(`No se pudieron consultar los vínculos con la Hermandad: ${brotherhoodLinks.error.message}`)

  const brotherhoodIds = [...new Set((brotherhoodLinks.data || []).map((row) => row.brotherhood_entity_id))]
  const publishedBrotherhoods = brotherhoodIds.length
    ? await supabase
        .from('entities')
        .select('id, slug')
        .in('id', brotherhoodIds)
        .eq('entity_type', 'brotherhood')
        .eq('status', 'published')
    : { data: [], error: null }
  if (publishedBrotherhoods.error) throw new Error(`No se pudieron comprobar las Hermandades: ${publishedBrotherhoods.error.message}`)

  const publishedIds = new Set((publishedBrotherhoods.data || []).map((row) => row.id))
  const linkIds = (brotherhoodLinks.data || [])
    .filter((row) => publishedIds.has(row.brotherhood_entity_id))
    .map((row) => row.id)

  if (linkIds.length) {
    const result = await supabase
      .from('brotherhood_images')
      .update({ status: 'published' })
      .in('id', linkIds)
      .eq('status', 'draft')
    if (result.error) throw new Error(`No se pudieron publicar los vínculos con la Hermandad: ${result.error.message}`)
  }

  const successions = await supabase
    .from('entity_relations')
    .update({ status: 'published' })
    .eq('relation_type', IMAGE_SUCCESSION_RELATION)
    .eq('status', 'draft')
    .or(`source_entity_id.eq.${imageId},target_entity_id.eq.${imageId}`)
    .select('id, status')
  if (successions.error) throw new Error(`No se pudieron publicar las sucesiones de la Imagen: ${successions.error.message}`)

  return {
    brotherhoodLinks: linkIds.length,
    successions: (successions.data || []).filter((row) => row.status === 'published').length,
    brotherhoodSlugs: (publishedBrotherhoods.data || []).map((row) => row.slug).filter(Boolean),
  }
}
