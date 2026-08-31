import 'server-only'

import { getTodayHomeContentV2 } from '@/lib/supabase/home-effective-editorial'
import { createClient } from '@/lib/supabase/public-server'
import { getHomeVisualsForEntityIds } from '@/lib/supabase/home-visuals'

function bandSlugFromHref(value = '') {
  return String(value).match(/^\/bandas\/([^/?#]+)/)?.[1] || ''
}

async function enrichMarchBandLogo(supabase, march) {
  if (!march) return march

  const bandSlug = bandSlugFromHref(march.bandHref)
  if (!bandSlug) return march

  const bandEntityResult = await supabase
    .from('entities')
    .select('id, name')
    .eq('entity_type', 'band')
    .eq('slug', bandSlug)
    .eq('status', 'published')
    .maybeSingle()

  if (bandEntityResult.error) throw bandEntityResult.error
  if (!bandEntityResult.data?.id) return march

  const bandResult = await supabase
    .from('bands')
    .select('logo_path')
    .eq('entity_id', bandEntityResult.data.id)
    .maybeSingle()

  if (bandResult.error) throw bandResult.error
  if (!bandResult.data?.logo_path) return march

  return {
    ...march,
    bandLogoPath: bandResult.data.logo_path,
    bandLogoAlt: `Logotipo de ${bandEntityResult.data.name || march.performedBy || 'la banda intérprete'}`,
  }
}

export async function getTodayHomeContentVisual() {
  const content = await getTodayHomeContentV2()
  const cards = [content?.ephemeris, content?.editorial, content?.fact, content?.discovery].filter(Boolean)
  const ids = [...new Set(cards.map((card) => card.rootEntityId).filter(Boolean))]

  try {
    const supabase = createClient()
    const [visualById, march] = await Promise.all([
      ids.length ? getHomeVisualsForEntityIds(supabase, ids) : Promise.resolve({}),
      enrichMarchBandLogo(supabase, content?.march),
    ])
    const enrich = (card) => card
      ? { ...card, visual: visualById[card.rootEntityId] || null }
      : null

    return {
      ...content,
      ephemeris: enrich(content.ephemeris),
      editorial: enrich(content.editorial),
      fact: enrich(content.fact),
      discovery: enrich(content.discovery),
      march,
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo enriquecer Hoy con identidad visual', {
      error: error instanceof Error ? error.message : String(error),
    })
    return content
  }
}
