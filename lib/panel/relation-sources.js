import 'server-only'

const RELATION_SOURCE_CONFIG = {
  brotherhood_image: { mode: 'scope' },
  brotherhood_step: { mode: 'scope' },
  image_step: { mode: 'scope' },
  image_authorship: { mode: 'scope' },
  step_phase: { mode: 'column', column: 'step_phase_id' },
  step_personnel: { mode: 'column', column: 'step_personnel_period_id' },
  music_accompaniment_period: { mode: 'column', column: 'music_accompaniment_period_id' },
  heritage_intervention: { mode: 'column', column: 'intervention_id' },
  outing: { mode: 'column', column: 'outing_id' },
  cult: { mode: 'column', column: 'cult_id' },
  outing_series: { mode: 'column', column: 'outing_series_id' },
  band_premiere: { mode: 'column', column: 'band_premiere_id' },
  brotherhood_habit: { mode: 'column', column: 'brotherhood_habit_id' },
  entity_relation: { mode: 'column', column: 'entity_relation_id' },
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function configFor(relationKind) {
  const config = RELATION_SOURCE_CONFIG[relationKind]
  if (!config) throw new Error('Tipo de relación no compatible con Fuentes.')
  return config
}

export function relationSourceScope(relationKind, relationId) {
  configFor(relationKind)
  return `relation:${relationKind}:${relationId}`
}

export function relationSourceConfig(relationKind) {
  return configFor(relationKind)
}

export async function loadRelationSourceSupport(supabase, relations, relationKind) {
  const config = configFor(relationKind)
  const relationIds = relations.map((relation) => relation.id).filter(Boolean)
  const [sourcesResult, linksResult] = await Promise.all([
    supabase
      .from('sources')
      .select('id, name, url, source_type, author_or_publisher')
      .order('name'),
    relationIds.length
      ? config.mode === 'scope'
        ? supabase
            .from('source_links')
            .select('id, source_id, entity_id, scope, created_at')
            .in('scope', relationIds.map((id) => relationSourceScope(relationKind, id)))
            .order('created_at')
        : supabase
            .from('source_links')
            .select(`id, source_id, ${config.column}, created_at`)
            .in(config.column, relationIds)
            .order('created_at')
      : Promise.resolve({ data: [], error: null }),
  ])

  const sources = rows(sourcesResult, 'No se pudieron cargar las Fuentes')
  const sourceLinks = rows(linksResult, 'No se pudieron cargar las Fuentes de las relaciones')
  const sourceById = new Map(sources.map((source) => [source.id, source]))
  const linksByRelationId = new Map()

  for (const link of sourceLinks) {
    const source = sourceById.get(link.source_id)
    if (!source) continue
    const relationId = config.mode === 'scope'
      ? String(link.scope || '').split(':').at(-1)
      : link[config.column]
    if (!relationId) continue
    const list = linksByRelationId.get(relationId) || []
    list.push({ ...link, source })
    linksByRelationId.set(relationId, list)
  }

  return {
    sourceOptions: sources.map((source) => ({
      id: source.id,
      name: source.name,
      meta: [source.source_type, source.author_or_publisher, source.url].filter(Boolean).join(' · '),
    })),
    relations: relations.map((relation) => ({
      ...relation,
      sourceLinks: linksByRelationId.get(relation.id) || [],
    })),
  }
}
