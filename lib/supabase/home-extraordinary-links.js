import 'server-only'

import { getUpcomingExtraordinaryOutings } from '@/lib/supabase/home'
import { createClient } from '@/lib/supabase/public-server'

export async function getNavigableHomeExtraordinaryOutings(limit = 5) {
  const outings = await getUpcomingExtraordinaryOutings(limit)
  if (!outings.length) return outings

  try {
    const supabase = createClient()
    const ids = outings.map((outing) => outing.id).filter(Boolean)
    if (!ids.length) return outings

    const result = await supabase
      .from('upcoming_extraordinary_outings')
      .select('id, slug')
      .in('id', ids)

    if (result.error) throw result.error

    const hrefById = new Map(
      (result.data || [])
        .filter((row) => row.id && row.slug)
        .map((row) => [row.id, `/extraordinarias/${row.slug}`])
    )

    return outings.map((outing) => ({
      ...outing,
      href: hrefById.get(outing.id) || '/extraordinarias',
    }))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron resolver los enlaces de Extraordinarias en la Home', {
      error: error instanceof Error ? error.message : String(error),
    })

    return outings.map((outing) => ({ ...outing, href: '/extraordinarias' }))
  }
}
