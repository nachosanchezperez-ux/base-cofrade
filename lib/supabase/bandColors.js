import 'server-only'

import { cache } from 'react'
import {
  getCachedPublicData,
  PUBLIC_CACHE_TAGS,
  publicEntityTag,
} from '@/lib/cache/public-cache'
import { createPublicClient } from '@/lib/supabase/public'

async function loadPublishedBandColors(bandEntityId) {
  if (!bandEntityId) return []

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('published_band_colors')
      .select('id, color_name, hex_value, color_role, sort_order, notes')
      .eq('band_entity_id', bandEntityId)
      .order('sort_order')

    if (error) throw error

    return (data || []).map((item) => ({
      id: item.id,
      name: item.color_name,
      hexValue: item.hex_value || '',
      role: item.color_role,
      sortOrder: item.sort_order,
      notes: item.notes || '',
    }))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar los colores de la banda', {
      bandEntityId,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export const getPublishedBandColors = cache((bandEntityId) => {
  if (!bandEntityId) return []

  return getCachedPublicData({
    key: ['band-colors', bandEntityId],
    tags: [PUBLIC_CACHE_TAGS.BANDS, publicEntityTag('band-id', bandEntityId)],
    loader: () => loadPublishedBandColors(bandEntityId),
  })
})
