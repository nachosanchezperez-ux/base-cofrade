import 'server-only'

import { cache } from 'react'
import { createPublicClient } from '@/lib/supabase/public'

// Crucetas publicadas de una salida concreta, para enlazar el acto con lo que
// sonó en él. Lectura ligera: solo slug y banda. Un fallo devuelve [] y nunca
// tumba la página de la salida.
export const getOutingRepertoireLinks = cache(async function getOutingRepertoireLinks(outingId) {
  if (!outingId) return []
  try {
    const supabase = createPublicClient()
    const result = await supabase
      .from('musical_repertoires')
      .select('slug, band_entity_id')
      .eq('outing_id', outingId)
      .eq('repertoire_kind', 'performed')
      .eq('status', 'published')
    if (result.error) throw result.error
    const repertoires = result.data || []
    if (!repertoires.length) return []

    const bandIds = [...new Set(repertoires.map((item) => item.band_entity_id).filter(Boolean))]
    const bands = bandIds.length
      ? await supabase.from('entities').select('id, name').in('id', bandIds)
      : { data: [], error: null }
    if (bands.error) throw bands.error
    const bandName = new Map((bands.data || []).map((band) => [band.id, band.name]))

    return repertoires.map((item) => ({
      href: `/crucetas-musicales/${item.slug}`,
      bandName: bandName.get(item.band_entity_id) || '',
    }))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las crucetas de la salida', {
      outingId,
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
})
