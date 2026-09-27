import 'server-only'

import { getHermandadBySlug } from '@/lib/data'
import { resolveBrotherhoodPalette } from '@/lib/brotherhood-palette'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

// The caller has already resolved the published brotherhood. Load only its
// colors, never the full brotherhood page or its musical/patrimonial graph.
export async function loadPublishedBrotherhoodPalette(supabase, { id, slug } = {}) {
  const fallback = getHermandadBySlug(slug)?.colores || {}
  if (!UUID_PATTERN.test(String(id || ''))) return resolveBrotherhoodPalette([], fallback)

  const result = await supabase
    .from('brotherhood_colors')
    .select('id, color_name, hex_value, color_role, sort_order')
    .eq('brotherhood_entity_id', id)
    .eq('status', 'published')
    .order('sort_order')
    .order('id')

  if (result.error) {
    throw new Error(`No se pudo consultar la paleta de la Hermandad: ${result.error.message}`)
  }

  return resolveBrotherhoodPalette(result.data || [], fallback)
}
