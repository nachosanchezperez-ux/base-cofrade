import 'server-only'

import { getHermandadPageBySlug as getBrotherhoodDisplayBySlug } from '@/lib/supabase/brotherhood-display'
import { enrichBrotherhoodVisualSections } from '@/lib/supabase/brotherhood-visual-sections'

export async function getHermandadPageBySlug(slug) {
  const hermandad = await getBrotherhoodDisplayBySlug(slug)
  if (!hermandad) return hermandad

  try {
    return await enrichBrotherhoodVisualSections(hermandad)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron completar los módulos visuales de la hermandad', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return hermandad
  }
}
