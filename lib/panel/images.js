import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
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

  const entities = assertQuery(
    await entityQuery,
    'No se pudieron cargar las imágenes del panel'
  ) || []

  if (!entities.length) return []

  const rows = assertQuery(
    await supabase
      .from('images')
      .select('entity_id, image_type, current_condition')
      .in('entity_id', entities.map((entity) => entity.id)),
    'No se pudieron cargar las fichas de imagen'
  ) || []

  const imageById = new Map(rows.map((row) => [row.entity_id, row]))

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

  const image = assertQuery(
    await supabase
      .from('images')
      .select('entity_id, image_type')
      .eq('entity_id', id)
      .maybeSingle(),
    'No se pudo cargar la ficha de imagen'
  )

  if (!image) return null

  return { entity, image }
}
