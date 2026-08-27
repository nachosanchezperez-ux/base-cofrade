import 'server-only'

import { getHermandadPageBySlug as getBrotherhoodDisplayBySlug } from '@/lib/supabase/brotherhood-display'
import { enrichBrotherhoodEditorialSections } from '@/lib/supabase/brotherhood-editorial-sections'
import { enrichBrotherhoodVisualSections } from '@/lib/supabase/brotherhood-visual-sections'

export async function getHermandadPageBySlug(slug) {
  const hermandad = await getBrotherhoodDisplayBySlug(slug)
  if (!hermandad) return hermandad

  let enriched = hermandad

  try {
    enriched = await enrichBrotherhoodVisualSections(enriched)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron completar los módulos visuales de la hermandad', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  try {
    enriched = await enrichBrotherhoodEditorialSections(enriched)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron completar los módulos editoriales de la hermandad', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return enriched
}
