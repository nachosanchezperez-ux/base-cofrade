import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function rowsOrEmpty(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function phaseSortValue(item) {
  const label = item.date_from_text || item.date_to_text || ''
  const year = Number(String(label).match(/\b(1[0-9]{3}|20[0-9]{2})\b/)?.[1])
  return Number.isFinite(year) && year > 0 ? year : 9999
}

export async function getPublishedStepHeritage(stepEntityId) {
  try {
    const supabase = createPublicClient()
    const [phasesResult, piecesResult] = await Promise.all([
      supabase
        .from('step_phases')
        .select('id, phase_name, phase_type, date_from, date_from_text, date_to, date_to_text, description, notes')
        .eq('step_entity_id', stepEntityId)
        .eq('status', 'published'),
      supabase
        .from('heritage_assets')
        .select('entity_id, asset_type, description, current_condition, notes, date_from, date_from_text, date_to, date_to_text, is_current, technique, materials, historical_context, display_order')
        .eq('parent_entity_id', stepEntityId)
        .order('display_order', { ascending: true }),
    ])

    const phases = rowsOrEmpty(phasesResult, 'No se pudieron consultar las fases patrimoniales del Paso')
    const pieces = rowsOrEmpty(piecesResult, 'No se pudieron consultar las piezas patrimoniales del Paso')
    if (!phases.length && !pieces.length) return { phases: [], pieces: [], sources: [] }

    const phaseIds = phases.map((phase) => phase.id)
    const pieceIds = pieces.map((piece) => piece.entity_id)
    const [phaseAgentsResult, phaseSourceLinksResult, pieceSourceLinksResult, pieceEntitiesResult] = await Promise.all([
      phaseIds.length
        ? supabase
            .from('step_phase_agents')
            .select('id, step_phase_id, agent_entity_id, discipline, role_name, notes')
            .in('step_phase_id', phaseIds)
        : Promise.resolve({ data: [], error: null }),
      phaseIds.length
        ? supabase
            .from('source_links')
            .select('source_id, step_phase_id')
            .in('step_phase_id', phaseIds)
        : Promise.resolve({ data: [], error: null }),
      pieceIds.length
        ? supabase
            .from('source_links')
            .select('source_id, entity_id')
            .in('entity_id', pieceIds)
        : Promise.resolve({ data: [], error: null }),
      pieceIds.length
        ? supabase
            .from('entities')
            .select('id, name')
            .eq('status', 'published')
            .in('id', pieceIds)
        : Promise.resolve({ data: [], error: null }),
    ])

    const phaseAgents = rowsOrEmpty(phaseAgentsResult, 'No se pudieron consultar los responsables de las fases del Paso')
    const sourceLinks = [
      ...rowsOrEmpty(phaseSourceLinksResult, 'No se pudieron consultar las fuentes de las fases del Paso'),
      ...rowsOrEmpty(pieceSourceLinksResult, 'No se pudieron consultar las fuentes de las piezas del Paso'),
    ]
    const pieceEntities = rowsOrEmpty(pieceEntitiesResult, 'No se pudieron consultar los nombres de las piezas del Paso')
    const agentIds = unique(phaseAgents.map((item) => item.agent_entity_id))
    const sourceIds = unique(sourceLinks.map((item) => item.source_id))

    const [agentsResult, sourcesResult] = await Promise.all([
      agentIds.length
        ? supabase
            .from('entities')
            .select('id, name, slug')
            .eq('entity_type', 'agent')
            .eq('status', 'published')
            .in('id', agentIds)
        : Promise.resolve({ data: [], error: null }),
      sourceIds.length
        ? supabase
            .from('sources')
            .select('id, name, url, source_type')
            .in('id', sourceIds)
        : Promise.resolve({ data: [], error: null }),
    ])

    const agents = rowsOrEmpty(agentsResult, 'No se pudieron consultar las Personas y Talleres del Paso')
    const sources = rowsOrEmpty(sourcesResult, 'No se pudieron consultar las Fuentes del Paso')
    const agentById = new Map(agents.map((agent) => [agent.id, agent]))
    const pieceNameById = new Map(pieceEntities.map((entity) => [entity.id, entity.name]))

    const phaseItems = phases
      .map((phase) => {
        const dateFrom = phase.date_from_text || phase.date_from || ''
        const dateTo = phase.date_to_text || phase.date_to || ''
        const dateLabel = [dateFrom, dateTo].filter(Boolean).join('–')
        const responsibles = phaseAgents
          .filter((item) => item.step_phase_id === phase.id)
          .map((item) => {
            const agent = agentById.get(item.agent_entity_id)
            if (!agent) return null
            return {
              id: item.id,
              entityId: agent.id,
              name: agent.name,
              slug: agent.slug,
              discipline: item.discipline || '',
              role: item.role_name || '',
              notes: item.notes || '',
            }
          })
          .filter(Boolean)

        return {
          id: phase.id,
          title: phase.phase_name,
          type: phase.phase_type || 'Evolución',
          date: /fecha no documentada/i.test(dateLabel) ? '' : dateLabel,
          description: phase.description || '',
          notes: phase.notes || '',
          responsibles,
          sortValue: phaseSortValue(phase),
        }
      })
      .sort((a, b) => a.sortValue - b.sortValue || a.title.localeCompare(b.title, 'es'))

    const pieceItems = pieces.map((piece) => ({
      id: piece.entity_id,
      title: pieceNameById.get(piece.entity_id) || piece.asset_type,
      type: piece.asset_type || 'Pieza patrimonial',
      date: [piece.date_from_text || piece.date_from || '', piece.date_to_text || piece.date_to || ''].filter(Boolean).join('–'),
      description: piece.description || '',
      detail: [piece.technique, piece.materials].filter(Boolean).join(' · '),
      context: piece.historical_context || piece.notes || '',
      current: piece.is_current !== false,
    }))

    return {
      phases: phaseItems,
      pieces: pieceItems,
      sources: sources.map((source) => ({
        id: source.id,
        name: source.name,
        url: source.url || '',
        type: source.source_type || '',
      })),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la evolución patrimonial del Paso', {
      stepEntityId,
      error: error instanceof Error ? error.message : String(error),
    })
    return { phases: [], pieces: [], sources: [] }
  }
}
