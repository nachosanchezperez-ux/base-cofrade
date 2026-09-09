import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function isCapatazRole(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .includes('capataz')
}

export default async function StepCrewFacts({ stepId }) {
  if (!stepId) return null

  try {
    const supabase = createPublicClient()
    const [stepResult, personnelResult] = await Promise.all([
      supabase
        .from('steps')
        .select('workbenches_count')
        .eq('entity_id', stepId)
        .maybeSingle(),
      supabase
        .from('step_personnel_periods')
        .select('id, agent_entity_id, role_name, created_at')
        .eq('step_entity_id', stepId)
        .eq('is_current', true)
        .eq('status', 'published')
        .order('created_at', { ascending: true }),
    ])

    if (stepResult.error) throw stepResult.error
    if (personnelResult.error) throw personnelResult.error

    const workbenches = stepResult.data?.workbenches_count || null
    const capatazPeriods = (personnelResult.data || []).filter((period) => isCapatazRole(period.role_name))
    const agentIds = [...new Set(capatazPeriods.map((period) => period.agent_entity_id).filter(Boolean))]
    const agentsResult = agentIds.length
      ? await supabase
          .from('entities')
          .select('id, name')
          .eq('entity_type', 'agent')
          .eq('status', 'published')
          .in('id', agentIds)
      : { data: [], error: null }

    if (agentsResult.error) throw agentsResult.error

    const nameById = new Map((agentsResult.data || []).map((agent) => [agent.id, agent.name]))
    const capataces = capatazPeriods
      .map((period) => nameById.get(period.agent_entity_id))
      .filter(Boolean)

    if (!workbenches && !capataces.length) return null

    return (
      <>
        {workbenches ? (
          <div>
            <small>Trabajaderas</small>
            <strong>{workbenches}</strong>
          </div>
        ) : null}
        {capataces.length ? (
          <div>
            <small>Capataces</small>
            <strong>{capataces.join(' · ')}</strong>
          </div>
        ) : null}
      </>
    )
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la cuadrilla actual del Paso', {
      stepId,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
