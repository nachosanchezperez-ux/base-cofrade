import 'server-only'

import { askHiloCofradeV6 } from '@/lib/supabase/tira-del-hilo-v6'
import { createClient } from '@/lib/supabase/server'
import { rankTiraReferences } from '@/lib/tira-references'

const HREF_TYPES = {
  hermandades: 'brotherhood',
  imagenes: 'image',
  pasos: 'step',
  bandas: 'band',
}

function hrefEntity(value = '') {
  const match = String(value || '').match(/^\/(hermandades|imagenes|pasos|bandas)\/([^/?#]+)/)
  if (!match) return null
  return { entityType: HREF_TYPES[match[1]], slug: match[2] }
}

function initialEntityIds(response = {}) {
  const ids = new Set()
  for (const entity of response.entities || []) {
    if (entity?.id) ids.add(entity.id)
  }
  if (response?.context?.entityId) ids.add(response.context.entityId)
  for (const id of response?.context?.resultSet?.entityIds || []) {
    if (id) ids.add(id)
  }
  return ids
}

async function resolveItemEntityIds(supabase, response = {}) {
  const groups = new Map()
  for (const item of response.items || []) {
    const parsed = hrefEntity(item?.href)
    if (!parsed) continue
    const slugs = groups.get(parsed.entityType) || new Set()
    slugs.add(parsed.slug)
    groups.set(parsed.entityType, slugs)
  }

  const queries = [...groups.entries()].map(async ([entityType, slugSet]) => {
    const slugs = [...slugSet].slice(0, 12)
    const result = await supabase
      .from('entities')
      .select('id')
      .eq('entity_type', entityType)
      .eq('status', 'published')
      .in('slug', slugs)
    if (result.error) throw result.error
    return (result.data || []).map((row) => row.id)
  })

  const nested = await Promise.all(queries)
  return nested.flat()
}

async function referencesForResponse(supabase, response) {
  if (response?.kind !== 'answer') return []

  const ids = initialEntityIds(response)
  const fromItems = await resolveItemEntityIds(supabase, response)
  fromItems.forEach((id) => ids.add(id))
  const entityIds = [...ids].filter(Boolean).slice(0, 24)
  if (!entityIds.length) return []

  const linksResult = await supabase
    .from('source_links')
    .select('source_id, entity_id, scope')
    .in('entity_id', entityIds)
  if (linksResult.error) throw linksResult.error
  const links = linksResult.data || []
  const sourceIds = [...new Set(links.map((link) => link.source_id).filter(Boolean))]
  if (!sourceIds.length) return []

  const sourcesResult = await supabase
    .from('sources')
    .select('id, name, url, source_type, author_or_publisher, publication_date')
    .in('id', sourceIds)
  if (sourcesResult.error) throw sourcesResult.error

  return rankTiraReferences(sourcesResult.data || [], links, 4)
}

export async function askHiloCofradeV7(question, context = null) {
  const response = await askHiloCofradeV6(question, context)
  if (response?.kind !== 'answer') return response

  try {
    const supabase = await createClient()
    const references = await referencesForResponse(supabase, response)
    return references.length
      ? {
          ...response,
          references,
          referencesNote: 'Fuentes asociadas a las entidades implicadas; la base de la respuesta indica qué relaciones y datos concretos se han usado.',
        }
      : response
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron adjuntar fuentes a la respuesta', {
      error: error instanceof Error ? error.message : String(error),
    })
    return response
  }
}
