import 'server-only'

import { createPublicClient as createClient } from '@/lib/supabase/public'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function uuidIds(values = []) {
  return unique(values.filter((value) => UUID_PATTERN.test(String(value || ''))))
}

export async function filterInheritedAgentSources(hermandad) {
  const sources = hermandad?.fuentesFicha || []
  const sourceIds = uuidIds(sources.map((source) => source.id))
  if (!hermandad?.id || !sourceIds.length) return hermandad

  const supabase = await createClient()
  const linksResult = await supabase
    .from('source_links')
    .select('source_id, entity_id, image_authorship_id, step_phase_id, step_personnel_period_id, cult_id, outing_id, heritage_update_id, intervention_id, music_accompaniment_period_id, brotherhood_step_id, image_step_id, editorial_content_id')
    .in('source_id', sourceIds)

  if (linksResult.error) {
    throw new Error(`No se pudieron revisar las fuentes heredadas de agentes: ${linksResult.error.message}`)
  }

  const links = linksResult.data || []
  const linkedEntityIds = uuidIds(links.map((link) => link.entity_id))
  if (!linkedEntityIds.length) return hermandad

  const authorshipIds = uuidIds(links.map((link) => link.image_authorship_id))
  const stepPhaseIds = uuidIds(links.map((link) => link.step_phase_id))
  const personnelIds = uuidIds(links.map((link) => link.step_personnel_period_id))
  const imageStepIds = uuidIds(links.map((link) => link.image_step_id))
  const brotherhoodStepIds = uuidIds(links.map((link) => link.brotherhood_step_id))

  const [agentsResult, authorshipsResult, phasesResult, personnelResult, imageStepsResult, brotherhoodStepsResult] = await Promise.all([
    supabase.from('agents').select('entity_id').in('entity_id', linkedEntityIds),
    authorshipIds.length
      ? supabase.from('image_authorships').select('id, image_entity_id').in('id', authorshipIds)
      : Promise.resolve({ data: [], error: null }),
    stepPhaseIds.length
      ? supabase.from('step_phases').select('id, step_entity_id').in('id', stepPhaseIds)
      : Promise.resolve({ data: [], error: null }),
    personnelIds.length
      ? supabase.from('step_personnel_periods').select('id, step_entity_id').in('id', personnelIds)
      : Promise.resolve({ data: [], error: null }),
    imageStepIds.length
      ? supabase.from('image_steps').select('id, image_entity_id, step_entity_id').in('id', imageStepIds)
      : Promise.resolve({ data: [], error: null }),
    brotherhoodStepIds.length
      ? supabase.from('brotherhood_steps').select('id, brotherhood_entity_id, step_entity_id').in('id', brotherhoodStepIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  for (const result of [agentsResult, authorshipsResult, phasesResult, personnelResult, imageStepsResult, brotherhoodStepsResult]) {
    if (result.error) {
      throw new Error(`No se pudo resolver el ámbito relacional de las fuentes: ${result.error.message}`)
    }
  }

  const agentEntityIds = new Set(uuidIds((agentsResult.data || []).map((agent) => agent.entity_id)))
  if (!agentEntityIds.size) return hermandad

  const imageIds = new Set(uuidIds((hermandad.imagenes || []).map((item) => item.id)))
  const stepIds = new Set(uuidIds((hermandad.pasos || []).map((item) => item.id)))
  const entityTargetIds = new Set(uuidIds([
    hermandad.id,
    ...(hermandad.imagenes || []).map((item) => item.id),
    ...(hermandad.pasos || []).map((item) => item.id),
    ...(hermandad.patrimonio || []).map((item) => item.id),
    ...(hermandad.cronologia || []).map((item) => item.id),
  ]))
  const cultIds = new Set(uuidIds((hermandad.cultos || []).map((item) => item.id)))
  const outingIds = new Set(uuidIds((hermandad.salidas || []).map((item) => item.id)))
  const heritageUpdateIds = new Set(uuidIds((hermandad.estrenos || []).map((item) => item.id)))
  const musicPeriodIds = new Set(uuidIds([
    ...(hermandad.acompanamientoActual || []).map((item) => item.id),
    ...(hermandad.acompanamientos || []).map((item) => item.id),
  ]))

  const relevantAuthorshipIds = new Set(
    (authorshipsResult.data || [])
      .filter((item) => imageIds.has(item.image_entity_id))
      .map((item) => item.id)
  )
  const relevantPhaseIds = new Set(
    (phasesResult.data || [])
      .filter((item) => stepIds.has(item.step_entity_id))
      .map((item) => item.id)
  )
  const relevantPersonnelIds = new Set(
    (personnelResult.data || [])
      .filter((item) => stepIds.has(item.step_entity_id))
      .map((item) => item.id)
  )
  const relevantImageStepIds = new Set(
    (imageStepsResult.data || [])
      .filter((item) => imageIds.has(item.image_entity_id) && stepIds.has(item.step_entity_id))
      .map((item) => item.id)
  )
  const relevantBrotherhoodStepIds = new Set(
    (brotherhoodStepsResult.data || [])
      .filter((item) => item.brotherhood_entity_id === hermandad.id && stepIds.has(item.step_entity_id))
      .map((item) => item.id)
  )

  const inheritedAgentSourceIds = new Set(
    links
      .filter((link) => agentEntityIds.has(link.entity_id))
      .map((link) => link.source_id)
  )

  const scopedSourceIds = new Set(
    links
      .filter((link) => (
        entityTargetIds.has(link.entity_id)
        || relevantAuthorshipIds.has(link.image_authorship_id)
        || relevantPhaseIds.has(link.step_phase_id)
        || relevantPersonnelIds.has(link.step_personnel_period_id)
        || cultIds.has(link.cult_id)
        || outingIds.has(link.outing_id)
        || heritageUpdateIds.has(link.heritage_update_id)
        || musicPeriodIds.has(link.music_accompaniment_period_id)
        || relevantBrotherhoodStepIds.has(link.brotherhood_step_id)
        || relevantImageStepIds.has(link.image_step_id)
        || Boolean(link.intervention_id)
        || Boolean(link.editorial_content_id)
      ))
      .map((link) => link.source_id)
  )

  return {
    ...hermandad,
    fuentesFicha: sources.filter((source) => (
      !inheritedAgentSourceIds.has(source.id)
      || scopedSourceIds.has(source.id)
    )),
  }
}
