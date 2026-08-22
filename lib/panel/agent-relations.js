import 'server-only'

import { createClient } from '@/lib/supabase/server'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function row(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

function dateLabel(item) {
  return [
    item.date_from_text || item.year_from || item.date_from,
    item.date_to_text || item.year_to || item.date_to,
  ].filter(Boolean).join(' → ')
}

export async function getAgentRelationsData(agentId) {
  const supabase = await createClient()
  const entity = row(
    await supabase.from('entities').select('id, name, slug, status').eq('id', agentId).eq('entity_type', 'agent').maybeSingle(),
    'No se pudo cargar la Persona'
  )
  if (!entity) return null

  const [authorshipsResult, interventionsResult, personnelResult, phaseAgentsResult, bandAgentsResult, marchAuthorsResult] = await Promise.all([
    supabase
      .from('image_authorships')
      .select('id, image_entity_id, authorship_type, role_name, date_from, date_from_text, date_to, date_to_text, certainty, notes, status')
      .eq('agent_entity_id', agentId)
      .neq('status', 'archived'),
    supabase
      .from('heritage_interventions')
      .select('id, target_entity_id, discipline, intervention_type, phase, element_name, date_from, date_from_text, date_to, date_to_text, description, status')
      .eq('agent_entity_id', agentId)
      .neq('status', 'archived'),
    supabase
      .from('step_personnel_periods')
      .select('id, step_entity_id, role_name, date_from, date_from_text, year_from, date_to, date_to_text, year_to, is_current, notes, status')
      .eq('agent_entity_id', agentId)
      .neq('status', 'archived'),
    supabase
      .from('step_phase_agents')
      .select('id, step_phase_id, discipline, role_name, element_entity_id, notes')
      .eq('agent_entity_id', agentId),
    supabase
      .from('band_agents')
      .select('id, band_entity_id, role_name, date_from, date_to, is_current, notes')
      .eq('agent_entity_id', agentId),
    supabase
      .from('march_authors')
      .select('id, march_entity_id, author_role, notes, status')
      .eq('agent_entity_id', agentId)
      .neq('status', 'archived'),
  ])

  const authorships = rows(authorshipsResult, 'No se pudieron cargar las autorías de Imágenes')
  const interventions = rows(interventionsResult, 'No se pudieron cargar las intervenciones patrimoniales')
  const personnel = rows(personnelResult, 'No se pudieron cargar las responsabilidades en Pasos')
  const phaseAgents = rows(phaseAgentsResult, 'No se pudieron cargar las fases de Pasos')
  const bandAgents = rows(bandAgentsResult, 'No se pudo cargar la trayectoria en Bandas')
  const marchAuthors = rows(marchAuthorsResult, 'No se pudieron cargar las autorías de Marchas')

  const phaseIds = [...new Set(phaseAgents.map((item) => item.step_phase_id).filter(Boolean))]
  const phases = phaseIds.length
    ? rows(
        await supabase.from('step_phases').select('id, step_entity_id, phase_name, phase_type, status').in('id', phaseIds),
        'No se pudieron resolver las fases de Pasos'
      )
    : []
  const phaseById = new Map(phases.map((item) => [item.id, item]))

  const targetIds = [...new Set([
    ...authorships.map((item) => item.image_entity_id),
    ...interventions.map((item) => item.target_entity_id),
    ...personnel.map((item) => item.step_entity_id),
    ...phases.map((item) => item.step_entity_id),
    ...bandAgents.map((item) => item.band_entity_id),
    ...marchAuthors.map((item) => item.march_entity_id),
  ].filter(Boolean))]

  const heritageTargetIds = [...new Set(interventions.map((item) => item.target_entity_id).filter(Boolean))]
  const heritageAssets = heritageTargetIds.length
    ? rows(
        await supabase.from('heritage_assets').select('entity_id, parent_entity_id, asset_type').in('entity_id', heritageTargetIds),
        'No se pudo resolver el patrimonio relacionado'
      )
    : []
  const heritageById = new Map(heritageAssets.map((item) => [item.entity_id, item]))
  const parentIds = [...new Set(heritageAssets.map((item) => item.parent_entity_id).filter(Boolean))]

  const entities = [...new Set([...targetIds, ...parentIds])].length
    ? rows(
        await supabase.from('entities').select('id, name, slug, entity_type, status').in('id', [...new Set([...targetIds, ...parentIds])]),
        'No se pudieron resolver las entidades relacionadas'
      )
    : []
  const entityById = new Map(entities.map((item) => [item.id, item]))

  const heritageHref = (targetId) => {
    const target = entityById.get(targetId)
    if (!target) return null
    if (target.entity_type === 'image') return `/panel/imagenes/${target.id}/intervenciones`
    if (target.entity_type === 'step') return `/panel/pasos/${target.id}/patrimonio`
    if (target.entity_type !== 'heritage_asset') return null
    const heritage = heritageById.get(targetId)
    const parent = heritage ? entityById.get(heritage.parent_entity_id) : null
    if (parent?.entity_type === 'brotherhood') return `/panel/hermandades/${parent.id}/patrimonio`
    if (parent?.entity_type === 'band') return `/panel/bandas/${parent.id}/patrimonio`
    return null
  }

  const relations = {
    images: authorships.map((item) => {
      const target = entityById.get(item.image_entity_id)
      return {
        id: `image-${item.id}`,
        title: target?.name || 'Imagen no disponible',
        relation: item.role_name || item.authorship_type || 'Autoría',
        meta: [dateLabel(item), item.certainty].filter(Boolean).join(' · '),
        href: target ? `/panel/imagenes/${target.id}/autorias` : null,
      }
    }),
    heritage: interventions.map((item) => {
      const target = entityById.get(item.target_entity_id)
      return {
        id: `heritage-${item.id}`,
        title: target?.name || item.element_name || 'Elemento patrimonial',
        relation: [item.intervention_type, item.discipline].filter(Boolean).join(' · ') || 'Intervención',
        meta: dateLabel(item),
        href: heritageHref(item.target_entity_id),
      }
    }),
    steps: [
      ...personnel.map((item) => {
        const target = entityById.get(item.step_entity_id)
        return {
          id: `personnel-${item.id}`,
          title: target?.name || 'Paso no disponible',
          relation: item.role_name || 'Responsabilidad',
          meta: [item.is_current ? 'Actual' : 'Histórico', dateLabel(item)].filter(Boolean).join(' · '),
          href: target ? `/panel/pasos/${target.id}/responsables` : null,
        }
      }),
      ...phaseAgents.map((item) => {
        const phase = phaseById.get(item.step_phase_id)
        const target = phase ? entityById.get(phase.step_entity_id) : null
        return {
          id: `phase-${item.id}`,
          title: target?.name || 'Paso no disponible',
          relation: [item.discipline, item.role_name].filter(Boolean).join(' · ') || phase?.phase_name || 'Fase patrimonial',
          meta: phase?.phase_name || phase?.phase_type || '',
          href: target ? `/panel/pasos/${target.id}/patrimonio` : null,
        }
      }),
    ],
    bands: bandAgents.map((item) => {
      const target = entityById.get(item.band_entity_id)
      return {
        id: `band-${item.id}`,
        title: target?.name || 'Banda no disponible',
        relation: item.role_name || 'Dirección / responsabilidad',
        meta: [item.is_current ? 'Actual' : 'Histórico', dateLabel(item)].filter(Boolean).join(' · '),
        href: target ? `/panel/bandas/${target.id}/direccion` : null,
      }
    }),
    marches: marchAuthors.map((item) => {
      const target = entityById.get(item.march_entity_id)
      return {
        id: `march-${item.id}`,
        title: target?.name || 'Marcha no disponible',
        relation: item.author_role || 'Autoría musical',
        meta: item.notes || '',
        href: target ? `/panel/marchas/${target.id}` : null,
      }
    }),
  }

  return {
    entity,
    relations,
    total: Object.values(relations).reduce((sum, items) => sum + items.length, 0),
  }
}
