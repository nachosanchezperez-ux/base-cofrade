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

export async function getBrotherhoodStepRelations(brotherhoodId) {
  const supabase = await createClient()
  const [entityResult, brotherhoodResult, relationsResult, stepEntitiesResult] = await Promise.all([
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
      .from('brotherhood_steps')
      .select('id, step_entity_id, relation_type, date_from, date_from_text, date_to, date_to_text, status, created_at')
      .eq('brotherhood_entity_id', brotherhoodId)
      .order('created_at'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'step')
      .order('name'),
  ])

  const entity = assertRow(entityResult, 'No se pudo cargar la Hermandad')
  const brotherhood = assertRow(brotherhoodResult, 'No se pudo cargar la ficha de la Hermandad')
  if (!entity || !brotherhood) return null

  const relations = assertRows(relationsResult, 'No se pudieron cargar los Pasos relacionados')
  const stepEntities = assertRows(stepEntitiesResult, 'No se pudieron cargar los Pasos existentes')
  const stepIds = stepEntities.map((step) => step.id)
  const stepRows = stepIds.length
    ? assertRows(
        await supabase
          .from('steps')
          .select('entity_id, step_type, current_condition')
          .in('entity_id', stepIds),
        'No se pudieron cargar los tipos de Paso'
      )
    : []

  const stepRowById = new Map(stepRows.map((step) => [step.entity_id, step]))
  const steps = stepEntities.map((step) => {
    const row = stepRowById.get(step.id) || {}
    return {
      ...step,
      stepType: row.step_type || 'Paso',
      condition: row.current_condition || '',
      meta: [row.step_type || 'Paso', step.status === 'published' ? 'Publicado' : 'Borrador']
        .filter(Boolean)
        .join(' · '),
    }
  })
  const stepById = new Map(steps.map((step) => [step.id, step]))

  return {
    entity,
    brotherhood,
    relations: relations.map((relation) => ({
      ...relation,
      step: stepById.get(relation.step_entity_id) || null,
    })),
    candidates: steps.filter((step) => step.status !== 'archived'),
  }
}
