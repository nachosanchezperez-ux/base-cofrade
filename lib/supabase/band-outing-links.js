import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

export async function getBandOutingPublicLinks(outingIds = []) {
  const ids = unique(outingIds)
  if (!ids.length) return {}

  try {
    const supabase = createPublicClient()
    const { data: outings, error: outingsError } = await supabase
      .from('outings')
      .select('id, slug, brotherhood_entity_id')
      .in('id', ids)

    if (outingsError) throw outingsError

    const brotherhoodIds = unique((outings || []).map((outing) => outing.brotherhood_entity_id))
    const { data: brotherhoods, error: brotherhoodsError } = brotherhoodIds.length
      ? await supabase
          .from('entities')
          .select('id, slug')
          .in('id', brotherhoodIds)
      : { data: [], error: null }

    if (brotherhoodsError) throw brotherhoodsError

    const brotherhoodById = new Map((brotherhoods || []).map((item) => [item.id, item]))

    return Object.fromEntries((outings || []).map((outing) => {
      const brotherhood = brotherhoodById.get(outing.brotherhood_entity_id)
      return [outing.id, {
        outingSlug: outing.slug || '',
        brotherhoodSlug: brotherhood?.slug || '',
      }]
    }))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron resolver los enlaces de las salidas de la banda', {
      error: error instanceof Error ? error.message : String(error),
    })
    return {}
  }
}
