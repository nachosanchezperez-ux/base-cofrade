import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'

function row(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getBrotherhoodHabitsEditorData(brotherhoodId) {
  const supabase = await createClient()
  const [entityResult, brotherhoodResult, habitsResult] = await Promise.all([
    supabase.from('entities').select('id, name, slug, status').eq('id', brotherhoodId).eq('entity_type', 'brotherhood').maybeSingle(),
    supabase.from('brotherhoods').select('entity_id, popular_name, official_name, brotherhood_types').eq('entity_id', brotherhoodId).maybeSingle(),
    supabase.from('brotherhood_habits').select('*').eq('brotherhood_entity_id', brotherhoodId).neq('status', 'archived').order('sort_order').order('name'),
  ])

  const entity = row(entityResult, 'No se pudo cargar la Hermandad')
  const brotherhood = row(brotherhoodResult, 'No se pudo cargar la ficha de la Hermandad')
  if (!entity || !brotherhood) return null

  const habits = rows(habitsResult, 'No se pudieron cargar los hábitos')
  const sourceSupport = await loadRelationSourceSupport(supabase, habits, 'brotherhood_habit')

  return {
    entity,
    brotherhood,
    sourceOptions: sourceSupport.sourceOptions,
    habits: sourceSupport.relations,
  }
}
