import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getDocumentableRelationsData() {
  const supabase = await createClient()
  const [periodsResult, entitiesResult] = await Promise.all([
    supabase
      .from('music_accompaniment_periods')
      .select('id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, date_to_text, year_to, is_current, notes, status')
      .neq('status', 'archived')
      .order('year_from', { ascending: false, nullsFirst: false }),
    supabase
      .from('entities')
      .select('id, name, entity_type, status')
      .in('entity_type', ['brotherhood', 'band', 'step']),
  ])

  const periods = rows(periodsResult, 'No se pudieron cargar los periodos de acompañamiento')
  const entities = rows(entitiesResult, 'No se pudieron cargar las entidades relacionadas')
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const sourceSupport = await loadRelationSourceSupport(supabase, periods, 'music_accompaniment_period')

  return {
    sourceOptions: sourceSupport.sourceOptions,
    musicPeriods: sourceSupport.relations.map((period) => ({
      ...period,
      brotherhood: entityById.get(period.brotherhood_entity_id) || null,
      band: entityById.get(period.band_entity_id) || null,
      step: period.step_entity_id ? entityById.get(period.step_entity_id) || null : null,
    })).filter((period) => period.brotherhood && period.band),
  }
}
