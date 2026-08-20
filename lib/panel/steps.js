import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { mergeEditableEntities } from '@/lib/panel/reference-nodes'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

export async function getPanelSteps({ query = '', status = '' } = {}) {
  const supabase = await createClient()
  let entityQuery = supabase
    .from('entities')
    .select('id, name, slug, status, updated_at')
    .eq('entity_type', 'step')
    .order('name')

  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)

  const entities = assertQuery(
    await entityQuery,
    'No se pudieron cargar los pasos del panel'
  ) || []

  if (!entities.length) return []

  const rows = assertQuery(
    await supabase
      .from('steps')
      .select('entity_id, step_type, current_condition')
      .in('entity_id', entities.map((entity) => entity.id)),
    'No se pudieron cargar las fichas de paso'
  ) || []

  return mergeEditableEntities(entities, rows, 'paso', {
    step_type: 'Tipo por documentar',
    current_condition: '',
  }).map((item) => ({
    ...item,
    type: item.step_type || 'Tipo por documentar',
    condition: item.current_condition || '',
  }))
}

export async function getStepEditorData(id) {
  const supabase = await createClient()
  const entity = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug, summary, status, updated_at')
      .eq('id', id)
      .eq('entity_type', 'step')
      .maybeSingle(),
    'No se pudo cargar la entidad de paso'
  )

  if (!entity) return null

  const step = assertQuery(
    await supabase
      .from('steps')
      .select('entity_id, step_type')
      .eq('entity_id', id)
      .maybeSingle(),
    'No se pudo cargar la ficha de paso'
  )

  if (!step) return null

  return { entity, step }
}
