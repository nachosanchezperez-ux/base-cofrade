import 'server-only'

import { getHomeExploreStats } from '@/lib/supabase/home-v2'
import { createClient } from '@/lib/supabase/public-server'
import { getHomeDirectorySpotlights } from '@/lib/supabase/home-visuals'

export async function getHomeExploreStatsVisual() {
  const stats = await getHomeExploreStats()

  try {
    const supabase = createClient()
    const entityResult = await supabase
      .from('entities')
      .select('id, entity_type, name, slug, updated_at')
      .in('entity_type', ['brotherhood', 'image', 'step', 'band'])
      .eq('status', 'published')

    if (entityResult.error) return stats

    const spotlights = await getHomeDirectorySpotlights(supabase, entityResult.data || [])
    return {
      ...stats,
      directories: (stats?.directories || []).map((item) => ({
        ...item,
        spotlight: spotlights[item.key] || null,
      })),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar los focos visuales de Explorar', {
      error: error instanceof Error ? error.message : String(error),
    })
    return stats
  }
}
