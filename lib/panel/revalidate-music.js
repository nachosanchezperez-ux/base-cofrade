import 'server-only'

import { revalidatePath } from 'next/cache'

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

export async function revalidateMarchPages(supabase, marchIds = []) {
  const ids = unique(marchIds)
  if (!ids.length) return

  const [entitiesResult, entriesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, slug')
      .eq('entity_type', 'march')
      .in('id', ids),
    supabase
      .from('musical_repertoire_entries')
      .select('repertoire_id')
      .in('march_entity_id', ids),
  ])

  if (entitiesResult.error) {
    console.error('[Hilo Cofrade] No se pudieron invalidar las fichas de Marchas', entitiesResult.error)
  } else {
    for (const entity of entitiesResult.data || []) {
      if (entity.slug) revalidatePath(`/marchas/${entity.slug}`)
    }
  }

  if (entriesResult.error) {
    console.error('[Hilo Cofrade] No se pudieron consultar las Crucetas relacionadas', entriesResult.error)
    return
  }

  const repertoireIds = unique((entriesResult.data || []).map((entry) => entry.repertoire_id))
  if (!repertoireIds.length) return

  const repertoiresResult = await supabase
    .from('musical_repertoires')
    .select('slug')
    .in('id', repertoireIds)

  if (repertoiresResult.error) {
    console.error('[Hilo Cofrade] No se pudieron invalidar las Crucetas relacionadas', repertoiresResult.error)
    return
  }

  for (const repertoire of repertoiresResult.data || []) {
    if (repertoire.slug) revalidatePath(`/crucetas-musicales/${repertoire.slug}`)
  }
}
