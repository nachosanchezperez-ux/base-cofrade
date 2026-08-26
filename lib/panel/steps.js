import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { mergeEditableEntities } from '@/lib/panel/reference-nodes'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function rows(result, label) {
  return assertQuery(result, label) || []
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

  const entities = rows(await entityQuery, 'No se pudieron cargar los pasos del panel')
  if (!entities.length) return []

  const stepRows = rows(
    await supabase
      .from('steps')
      .select('entity_id, step_type, current_condition')
      .in('entity_id', entities.map((entity) => entity.id)),
    'No se pudieron cargar las fichas de paso'
  )

  return mergeEditableEntities(entities, stepRows, 'paso', {
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

  const [
    stepResult,
    phasesResult,
    personnelResult,
    musicPeriodsResult,
    agentsResult,
    bandsResult,
    brotherhoodsResult,
    mediaResult,
    brotherhoodLinksResult,
    imageLinksResult,
    sourceLinksResult,
  ] = await Promise.all([
    supabase
      .from('steps')
      .select('entity_id, step_type, style, materials, dimensions_text, length_cm, width_cm, height_cm, workbenches_count, carrier_system, execution_date_text, current_condition, current_state_notes, description, notes')
      .eq('entity_id', id)
      .maybeSingle(),
    supabase
      .from('step_phases')
      .select('id, step_entity_id, phase_name, phase_type, date_from, date_from_text, date_to, date_to_text, description, notes, status, created_at')
      .eq('step_entity_id', id)
      .neq('status', 'archived')
      .order('created_at'),
    supabase
      .from('step_personnel_periods')
      .select('id, step_entity_id, agent_entity_id, role_name, date_from, date_from_text, year_from, date_to, date_to_text, year_to, is_current, notes, status, created_at')
      .eq('step_entity_id', id)
      .neq('status', 'archived')
      .order('is_current', { ascending: false })
      .order('year_from', { ascending: false, nullsFirst: false }),
    supabase
      .from('music_accompaniment_periods')
      .select('id, step_entity_id, band_entity_id, brotherhood_entity_id, position, outing_type, date_from, date_from_text, year_from, date_to, date_to_text, year_to, is_current, notes, status, created_at')
      .eq('step_entity_id', id)
      .neq('status', 'archived')
      .order('is_current', { ascending: false })
      .order('year_from', { ascending: false, nullsFirst: false }),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'agent')
      .neq('status', 'archived')
      .order('name'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'band')
      .neq('status', 'archived')
      .order('name'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'brotherhood')
      .neq('status', 'archived')
      .order('name'),
    supabase
      .from('entity_media')
      .select('id, relation_type, is_cover')
      .eq('entity_id', id),
    supabase
      .from('brotherhood_steps')
      .select('id, brotherhood_entity_id, relation_type, status')
      .eq('step_entity_id', id)
      .neq('status', 'archived'),
    supabase
      .from('image_steps')
      .select('id, image_entity_id, relation_type, status')
      .eq('step_entity_id', id)
      .neq('status', 'archived'),
    supabase
      .from('source_links')
      .select('id, source_id, scope')
      .eq('entity_id', id),
  ])

  const step = assertQuery(stepResult, 'No se pudo cargar la ficha de paso')
  if (!step) return null

  const phases = rows(phasesResult, 'No se pudieron cargar las fases del Paso')
  const personnel = rows(personnelResult, 'No se pudo cargar el personal del Paso')
  const musicPeriods = rows(musicPeriodsResult, 'No se pudo cargar la música del Paso')
  const agents = rows(agentsResult, 'No se pudieron cargar las Personas y talleres')
  const bands = rows(bandsResult, 'No se pudieron cargar las Bandas')
  const brotherhoods = rows(brotherhoodsResult, 'No se pudieron cargar las Hermandades')
  const media = rows(mediaResult, 'No se pudo cargar el multimedia del Paso')
  const brotherhoodLinks = rows(brotherhoodLinksResult, 'No se pudieron cargar las Hermandades del Paso')
  const imageLinks = rows(imageLinksResult, 'No se pudieron cargar las Imágenes del Paso')

  const phaseIds = phases.map((phase) => phase.id)
  const phaseAgents = phaseIds.length
    ? rows(
        await supabase
          .from('step_phase_agents')
          .select('id, step_phase_id, agent_entity_id, discipline, role_name, element_entity_id, notes')
          .in('step_phase_id', phaseIds),
        'No se pudieron cargar los responsables de las fases'
      )
    : []

  const [phaseSources, personnelSources, musicSources] = await Promise.all([
    loadRelationSourceSupport(supabase, phases, 'step_phase'),
    loadRelationSourceSupport(supabase, personnel, 'step_personnel'),
    loadRelationSourceSupport(supabase, musicPeriods, 'music_accompaniment_period'),
  ])

  const agentById = new Map(agents.map((agent) => [agent.id, agent]))
  const bandById = new Map(bands.map((band) => [band.id, band]))
  const brotherhoodById = new Map(brotherhoods.map((brotherhood) => [brotherhood.id, brotherhood]))

  const directSourceLinks = rows(sourceLinksResult, 'No se pudieron cargar las Fuentes directas del Paso')
    .filter((link) => !String(link.scope || '').startsWith('relation:'))
  const sourceIds = [...new Set(directSourceLinks.map((link) => link.source_id).filter(Boolean))]
  const sources = sourceIds.length
    ? rows(
        await supabase
          .from('sources')
          .select('id, name, url, source_type')
          .in('id', sourceIds)
          .order('name'),
        'No se pudieron cargar las Fuentes directas del Paso'
      )
    : []

  return {
    entity,
    step,
    phases: phaseSources.relations.map((phase) => ({
      ...phase,
      responsibles: phaseAgents
        .filter((item) => item.step_phase_id === phase.id)
        .map((item) => ({ ...item, agent: agentById.get(item.agent_entity_id) || null })),
    })),
    personnel: personnelSources.relations.map((item) => ({
      ...item,
      agent: agentById.get(item.agent_entity_id) || null,
    })),
    musicPeriods: musicSources.relations.map((item) => ({
      ...item,
      band: bandById.get(item.band_entity_id) || null,
      brotherhood: brotherhoodById.get(item.brotherhood_entity_id) || null,
    })),
    sourceOptions: phaseSources.sourceOptions,
    agentOptions: agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      slug: agent.slug || '',
      meta: agent.status === 'published' ? 'Publicado' : 'Borrador',
    })),
    bandOptions: bands.map((band) => ({
      id: band.id,
      name: band.name,
      slug: band.slug || '',
      meta: band.status === 'published' ? 'Publicada' : 'Borrador',
    })),
    brotherhoodOptions: brotherhoods.map((brotherhood) => ({
      id: brotherhood.id,
      name: brotherhood.name,
      slug: brotherhood.slug || '',
      meta: brotherhood.status === 'published' ? 'Publicada' : 'Borrador',
    })),
    sources,
    coverage: {
      media: media.length,
      cover: media.some((item) => item.is_cover),
      brotherhoods: brotherhoodLinks.length,
      images: imageLinks.length,
      phases: phases.length,
      personnel: personnel.length,
      music: musicPeriods.length,
      sources: sources.length,
    },
  }
}
