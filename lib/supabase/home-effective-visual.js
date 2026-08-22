import 'server-only'

import { getTodayHomeContentV2 } from '@/lib/supabase/home-effective-editorial'
import { createClient } from '@/lib/supabase/public-server'
import { getHomeVisualsForEntityIds } from '@/lib/supabase/home-visuals'

export async function getTodayHomeContentVisual() {
  const content = await getTodayHomeContentV2()
  const cards = [content?.ephemeris, content?.editorial, content?.discovery].filter(Boolean)
  const ids = [...new Set(cards.map((card) => card.rootEntityId).filter(Boolean))]
  if (!ids.length) return content

  try {
    const supabase = createClient()
    const visualById = await getHomeVisualsForEntityIds(supabase, ids)
    const enrich = (card) => card
      ? { ...card, visual: visualById[card.rootEntityId] || null }
      : null

    return {
      ...content,
      ephemeris: enrich(content.ephemeris),
      editorial: enrich(content.editorial),
      discovery: enrich(content.discovery),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo enriquecer Hoy con identidad visual', {
      error: error instanceof Error ? error.message : String(error),
    })
    return content
  }
}
