import 'server-only'

import { createClient } from '@/lib/supabase/server'

const ENTITY_TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  agent: 'Persona / Agente',
  heritage_asset: 'Patrimonio',
  march: 'Marcha',
  event: 'Acontecimiento',
  advocation: 'Advocación',
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

const PAGE_SIZE = 1000

async function fetchAllPages(buildQuery, label) {
  const allRows = []

  for (let from = 0; ; from += PAGE_SIZE) {
    const page = rows(
      await buildQuery().range(from, from + PAGE_SIZE - 1),
      label,
    )
    allRows.push(...page)
    if (page.length < PAGE_SIZE) return allRows
  }
}

export async function getPanelSourcesData({ entityId = '' } = {}) {
  const supabase = await createClient()
  const [sources, entities, rawSourceLinks] = await Promise.all([
    fetchAllPages(
      () => supabase
        .from('sources')
        .select('id, name, url, source_type, author_or_publisher, publication_date, accessed_at, license, notes, created_at')
        .order('name')
        .order('id'),
      'No se pudieron cargar las Fuentes',
    ),
    fetchAllPages(
      () => supabase
        .from('entities')
        .select('id, entity_type, name, slug, status')
        .neq('status', 'archived')
        .order('entity_type')
        .order('name')
        .order('id'),
      'No se pudieron cargar las entidades',
    ),
    fetchAllPages(
      () => {
        let query = supabase
          .from('source_links')
          .select('id, source_id, entity_id, scope, notes, created_at')
          .not('entity_id', 'is', null)

        if (entityId) query = query.eq('entity_id', entityId)

        return query
          .order('created_at', { ascending: false })
          .order('id', { ascending: false })
      },
      'No se pudieron cargar los vínculos de Fuentes',
    ),
  ])

  const sourceLinks = rawSourceLinks
    .filter((link) => !String(link.scope || '').startsWith('relation:'))
  const sourceById = new Map(sources.map((source) => [source.id, source]))
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))

  return {
    sources,
    entities,
    sourceOptions: sources.map((source) => ({
      id: source.id,
      name: source.name,
      meta: [source.source_type, source.author_or_publisher, source.url].filter(Boolean).join(' · '),
    })),
    entityOptions: entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      slug: entity.slug || '',
      meta: `${ENTITY_TYPE_LABELS[entity.entity_type] || entity.entity_type} · ${STATUS_LABELS[entity.status] || entity.status}`,
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
