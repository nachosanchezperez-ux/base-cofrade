import 'server-only'

const RELATION_KINDS = new Set([
  'brotherhood_image',
  'brotherhood_step',
  'image_step',
  'image_authorship',
])

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export function relationSourceScope(relationKind, relationId) {
  if (!RELATION_KINDS.has(relationKind)) throw new Error('Tipo de relación no compatible con Fuentes.')
  return `relation:${relationKind}:${relationId}`
}

export async function loadRelationSourceSupport(supabase, relations, relationKind) {
  if (!RELATION_KINDS.has(relationKind)) throw new Error('Tipo de relación no compatible con Fuentes.')

  const scopes = relations.map((relation) => relationSourceScope(relationKind, relation.id))
  const [sourcesResult, linksResult] = await Promise.all([
    supabase
      .from('sources')
      .select('id, name, url, source_type, author_or_publisher')
      .order('name'),
    scopes.length
      ? supabase
          .from('source_links')
          .select('id, source_id, entity_id, scope, created_at')
          .in('scope', scopes)
          .order('created_at')
      : Promise.resolve({ data: [], error: null }),
  ])

  const sources = rows(sourcesResult, 'No se pudieron cargar las Fuentes')
  const sourceLinks = rows(linksResult, 'No se pudieron cargar las Fuentes de las relaciones')
  const sourceById = new Map(sources.map((source) => [source.id, source]))
  const linksByScope = new Map()

  for (const link of sourceLinks) {
    const source = sourceById.get(link.source_id)
    if (!source) continue
    const list = linksByScope.get(link.scope) || []
    list.push({ ...link, source })
    linksByScope.set(link.scope, list)
  }

  return {
    sourceOptions: sources.map((source) => ({
      id: source.id,
      name: source.name,
      meta: [source.source_type, source.author_or_publisher, source.url].filter(Boolean).join(' · '),
    })),
    relations: relations.map((relation) => ({
      ...relation,
      sourceLinks: linksByScope.get(relationSourceScope(relationKind, relation.id)) || [],
    })),
  }
}
