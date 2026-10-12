import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'
import { homeEditorialFocusesFromRows } from '@/lib/home-editorial-focus'

// Destacados de portada con ventana abierta en `todayKey` (fecha de Madrid).
// Un fallo nunca rompe la portada: sin destacados, la Home sigue funcionando.
export async function getActiveHomeFeaturedFocuses(todayKey = '') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(todayKey))) return []

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('outings')
      .select('id, home_featured_starts_on, home_featured_ends_on, home_featured_priority')
      .eq('status', 'published')
      .not('home_featured_starts_on', 'is', null)
      .lte('home_featured_starts_on', todayKey)
      .gte('home_featured_ends_on', todayKey)
      .limit(12)

    if (error) throw new Error(error.message)
    return homeEditorialFocusesFromRows(data)
  } catch (error) {
    console.error('[Hilo Cofrade] Destacados de portada no disponibles', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
