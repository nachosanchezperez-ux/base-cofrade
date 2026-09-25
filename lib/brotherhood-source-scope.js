function idSet(values = []) {
  return new Set((values || []).filter(Boolean))
}

export function classifyBrotherhoodSourceLinks(rows = [], {
  entityTargetIds = [],
  heritageUpdateIds = [],
  interventionIds = [],
  stepPhaseIds = [],
  cultIds = [],
  outingIds = [],
  outingSeriesTargetIds = [],
  musicPeriodIds = [],
  agentIds = [],
} = {}) {
  const entityTargets = idSet(entityTargetIds)
  const heritageUpdates = idSet(heritageUpdateIds)
  const interventions = idSet(interventionIds)
  const stepPhases = idSet(stepPhaseIds)
  const cults = idSet(cultIds)
  const outings = idSet(outingIds)
  const outingSeries = idSet(outingSeriesTargetIds)
  const musicPeriods = idSet(musicPeriodIds)
  const agents = idSet(agentIds)

  const scopedSourceIds = new Set()
  const agentSourceIds = new Set()

  for (const row of rows || []) {
    const sourceId = row?.source_id
    if (!sourceId) continue

    if (row.entity_id && agents.has(row.entity_id)) {
      agentSourceIds.add(sourceId)
    }

    if (
      (row.entity_id && entityTargets.has(row.entity_id))
      || (row.heritage_update_id && heritageUpdates.has(row.heritage_update_id))
      || (row.intervention_id && interventions.has(row.intervention_id))
      || (row.step_phase_id && stepPhases.has(row.step_phase_id))
      || (row.cult_id && cults.has(row.cult_id))
      || (row.outing_id && outings.has(row.outing_id))
      || (row.outing_series_id && outingSeries.has(row.outing_series_id))
      || (row.music_accompaniment_period_id && musicPeriods.has(row.music_accompaniment_period_id))
    ) {
      scopedSourceIds.add(sourceId)
    }
  }

  return { scopedSourceIds, agentSourceIds }
}
