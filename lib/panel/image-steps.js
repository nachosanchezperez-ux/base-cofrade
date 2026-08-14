import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getImageStepRelations() {
  const supabase = await createClient()
  const [relationsResult, imageEntitiesResult, stepEntitiesResult] = await Promise.all([
    supabase
      .from('image_steps')
      .select('id, image_entity_id, step_entity_id, relation_type, date_from, date_from_text, date_to, date_to_text, status, created_at')
      .order('created_at'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'image')
      .order('name'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'step')
      .order('name'),
  ])

  const relations = assertRows(relationsResult, 'No se pudieron cargar las relaciones Imagen-Paso')
  const imageEntities = assertRows(imageEntitiesResult, 'No se pudieron cargar las Imágenes')
  const stepEntities = assertRows(stepEntitiesResult, 'No se pudieron cargar los Pasos')

  const [imageRows, stepRows] = await Promise.all([
    imageEntities.length
      ? supabase
          .from('images')
          .select('entity_id, image_type')
          .in('entity_id', imageEntities.map((item) => item.id))
      : Promise.resolve({ data: [], error: null }),
    stepEntities.length
      ? supabase
          .from('steps')
          .select('entity_id, step_type')
          .in('entity_id', stepEntities.map((item) => item.id))
      : Promise.resolve({ data: [], error: null }),
  ])

  const imageTypeById = new Map(
    assertRows(imageRows, 'No se pudieron cargar los tipos de Imagen')
      .map((item) => [item.entity_id, item.image_type])
  )
  const stepTypeById = new Map(
    assertRows(stepRows, 'No se pudieron cargar los tipos de Paso')
      .map((item) => [item.entity_id, item.step_type])
  )

  const images = imageEntities.map((image) => ({
    ...image,
    imageType: imageTypeById.get(image.id) || 'Imagen',
    meta: [
      imageTypeById.get(image.id) || 'Imagen',
      image.status === 'published' ? 'Publicada' : 'Borrador',
    ].join(' · '),
  }))
  const steps = stepEntities.map((step) => ({
    ...step,
    stepType: stepTypeById.get(step.id) || 'Paso',
    meta: [
      stepTypeById.get(step.id) || 'Paso',
      step.status === 'published' ? 'Publicado' : 'Borrador',
    ].join(' · '),
  }))
  const imageById = new Map(images.map((item) => [item.id, item]))
  const stepById = new Map(steps.map((item) => [item.id, item]))

  return {
    relations: relations.map((relation) => ({
      ...relation,
      image: imageById.get(relation.image_entity_id) || null,
      step: stepById.get(relation.step_entity_id) || null,
    })),
    images: images.filter((item) => item.status !== 'archived'),
    steps: steps.filter((item) => item.status !== 'archived'),
  }
}
