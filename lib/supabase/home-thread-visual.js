import 'server-only'

import { createClient } from '@/lib/supabase/public-server'
import { getHomeVisualsForEntityIds } from '@/lib/supabase/home-visuals'

const ROUTE_TYPES = {
  hermandades: 'brotherhood',
  imagenes: 'image',
  pasos: 'step',
  bandas: 'band',
}

function threadRoute(thread) {
  const match = String(thread?.href || '').match(/^\/(hermandades|imagenes|pasos|bandas)\/([^/?#]+)/)
  if (!match) return null
  return {
    entityType: ROUTE_TYPES[match[1]],
    slug: match[2],
    key: `${ROUTE_TYPES[match[1]]}:${match[2]}`,
  }
}

export async function enrichHomeDiscoveryThreadsVisual(threads = []) {
  const items = (threads || []).filter(Boolean)
  if (!items.length) return items

  try {
    const supabase = createClient()
    const parsedById = new Map(items.map((thread) => [thread.id, threadRoute(thread)]))
    const parsed = [...parsedById.values()].filter(Boolean)
    const slugs = [...new Set(parsed.map((item) => item.slug))]
    const types = [...new Set(parsed.map((item) => item.entityType))]
    if (!slugs.length || !types.length) return items

    const entityResult = await supabase
      .from('entities')
      .select('id, entity_type, slug')
      .in('slug', slugs)
      .in('entity_type', types)
      .eq('status', 'published')
    if (entityResult.error) throw entityResult.error

    const entities = entityResult.data || []
    const entityByKey = new Map(entities.map((entity) => [`${entity.entity_type}:${entity.slug}`, entity]))
    const visualById = await getHomeVisualsForEntityIds(supabase, entities.map((entity) => entity.id))

    return items.map((thread) => {
      const route = parsedById.get(thread.id)
      const entity = route ? entityByKey.get(route.key) : null
      const visual = entity ? visualById[entity.id] || null : null
      return visual ? { ...thread, visual } : thread
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron enriquecer visualmente los Últimos hilos', {
      error: error instanceof Error ? error.message : String(error),
    })
    return items
  }
}
