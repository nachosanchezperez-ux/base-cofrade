import 'server-only'

import { createClient } from '@/lib/supabase/server'

export async function getPublishedBandColors(bandEntityId) {
  if (!bandEntityId) return []

  try {
    const supabase = await createClient()
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
    return []
  }
}
