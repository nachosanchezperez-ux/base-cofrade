import 'server-only'

import { getHermandadPageBySlug as getBrotherhoodDisplayBySlug } from '@/lib/supabase/brotherhood-display'
import { enrichBrotherhoodEditorialSections } from '@/lib/supabase/brotherhood-editorial-sections'
import { getExtraordinaryGuideSlugs } from '@/lib/supabase/extraordinary-guide-slugs'
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

  try {
    const guideSlugs = await getExtraordinaryGuideSlugs(
      (enriched.salidas || []).map((outing) => outing.slug)
    )
    enriched = {
      ...enriched,
      salidas: (enriched.salidas || []).map((outing) => ({
        ...outing,
        slug: guideSlugs.has(outing.slug) ? outing.slug : '',
      })),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo validar la disponibilidad de guías de salidas', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return enriched
}
