import 'server-only'

export const RELATION_SOURCE_CONFIG = {
  brotherhood_image: { targetField: 'brotherhood_image_id' },
  brotherhood_step: { targetField: 'brotherhood_step_id' },
  image_step: { targetField: 'image_step_id' },
  image_authorship: { targetField: 'image_authorship_id' },
  entity_relation: { targetField: 'entity_relation_id' },
  intervention: { targetField: 'intervention_id' },
  music_accompaniment_period: { targetField: 'music_accompaniment_period_id' },
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export function relationSourceScope(relationKind, relationId) {
  if (!RELATION_SOURCE_CONFIG[relationKind]) throw new Error('Tipo de relación no compatible con Fuentes.')
  return `relation:${relationKind}:${relationId}`
}

export function relationSourceTargetField(relationKind) {
  const config = RELATION_SOURCE_CONFIG[relationKind]
  if (!config) throw new Error('Tipo de relación no compatible con Fuentes.')
  return config.targetField
}

export async function loadRelationSourceSupport(supabase, relations, relationKind) {
  const targetField = relationSourceTargetField(relationKind)
  const relationIds = relations.map((relation) => relation.id).filter(Boolean)
  const scopes = relationIds.map((id) => relationSourceScope(relationKind, id))

  const [sourcesResult, directLinksResult, legacyLinksResult] = await Promise.all([
    supabase
      .from('sources')
      .select('id, name, url, source_type, author_or_publisher')
      .order('name'),
    relationIds.length
      ? supabase
          .from('source_links')
          .select(`id, source_id, ${targetField}, entity_id, scope, notes, created_at`)
          .in(targetField, relationIds)
          .order('created_at')
      : Promise.resolve({ data: [], error: null }),
    scopes.length
      ? supabase
          .from('source_links')
          .select(`id, source_id, ${targetField}, entity_id, scope, notes, created_at`)
          .in('scope', scopes)
          .order('created_at')
      : Promise.resolve({ data: [], error: null }),
  ])

  const sources = rows(sourcesResult, 'No se pudieron cargar las Fuentes')
  const directLinks = rows(directLinksResult, 'No se pudieron cargar las Fuentes directas de las relaciones')
  const legacyLinks = rows(legacyLinksResult, 'No se pudieron cargar las Fuentes legacy de las relaciones')
  const sourceById = new Map(sources.map((source) => [source.id, source]))
  const linksByRelationId = new Map()
  const seenLinks = new Set()

  for (const link of [...directLinks, ...legacyLinks]) {
    if (seenLinks.has(link.id)) continue
    seenLinks.add(link.id)
    const source = sourceById.get(link.source_id)
    if (!source) continue

    let relationId = link[targetField]
    if (!relationId && link.scope) {
      const prefix = `relation:${relationKind}:`
      if (link.scope.startsWith(prefix)) relationId = link.scope.slice(prefix.length)
    }
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
