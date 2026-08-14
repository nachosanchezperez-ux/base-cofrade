import 'server-only'

import { createClient } from '@/lib/supabase/server'

const ENTITY_TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  agent: 'Agente',
}

const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getPanelSourcesData() {
  const supabase = await createClient()
  const [sourcesResult, entitiesResult, linksResult] = await Promise.all([
    supabase
      .from('sources')
      .select('id, name, url, source_type, author_or_publisher, publication_date, accessed_at, license, notes, created_at')
      .order('name'),
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .in('entity_type', ['brotherhood', 'image', 'step', 'agent'])
      .neq('status', 'archived')
      .order('name'),
    supabase
      .from('source_links')
      .select('id, source_id, entity_id, scope, notes, created_at')
      .not('entity_id', 'is', null)
      .order('created_at', { ascending: false }),
  ])

  const sources = rows(sourcesResult, 'No se pudieron cargar las Fuentes')
  const entities = rows(entitiesResult, 'No se pudieron cargar las entidades')
  const sourceLinks = rows(linksResult, 'No se pudieron cargar los vínculos de Fuentes')
    .filter((link) => !String(link.scope || '').startsWith('relation:'))
  const sourceById = new Map(sources.map((source) => [source.id, source]))
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))

  return {
    sources,
    sourceOptions: sources.map((source) => ({
      id: source.id,
      name: source.name,
      meta: [source.source_type, source.url].filter(Boolean).join(' · '),
    })),
    entityOptions: entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      meta: `${ENTITY_TYPE_LABELS[entity.entity_type]} · ${STATUS_LABELS[entity.status] || entity.status}`,
    })),
    links: sourceLinks
      .map((link) => ({
        ...link,
        source: sourceById.get(link.source_id) || null,
        entity: entityById.get(link.entity_id) || null,
      }))
      .filter((link) => link.source && link.entity),
  }
}

export { ENTITY_TYPE_LABELS, STATUS_LABELS }
