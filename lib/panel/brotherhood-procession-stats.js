import 'server-only'

import { createClient } from '@/lib/supabase/server'

function row(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getBrotherhoodProcessionStatsEditorData(brotherhoodId) {
  const supabase = await createClient()
  const [entityResult, brotherhoodResult, statsResult, sourcesResult] = await Promise.all([
    supabase.from('entities').select('id, name, slug, status').eq('id', brotherhoodId).eq('entity_type', 'brotherhood').maybeSingle(),
    supabase.from('brotherhoods').select('entity_id, popular_name, official_name, current_procession_day').eq('entity_id', brotherhoodId).maybeSingle(),
    supabase.from('brotherhood_procession_stats').select('*').eq('brotherhood_entity_id', brotherhoodId).neq('status', 'archived').order('year', { ascending: false }),
    supabase.from('sources').select('id, name, url, source_type, author_or_publisher').order('name'),
  ])

  const entity = row(entityResult, 'No se pudo cargar la Hermandad')
  const brotherhood = row(brotherhoodResult, 'No se pudo cargar la ficha de la Hermandad')
  if (!entity || !brotherhood) return null

  const stats = rows(statsResult, 'No se pudieron cargar los datos de jornada')
  const sources = rows(sourcesResult, 'No se pudieron cargar las Fuentes')
  const sourceById = new Map(sources.map((source) => [source.id, source]))

  return {
    entity,
    brotherhood,
    stats: stats.map((item) => ({ ...item, source: item.source_id ? sourceById.get(item.source_id) || null : null })),
    sourceOptions: sources.map((source) => ({
      id: source.id,
      name: source.name,
      meta: [source.source_type, source.author_or_publisher, source.url].filter(Boolean).join(' · '),
    })),
  }
}
