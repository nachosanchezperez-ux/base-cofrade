import 'server-only'

import { unstable_cache } from 'next/cache'
import { runWithPublicSupabaseRead } from '@/lib/supabase/public-read-context'
import { searchHiloEntities } from '@/lib/supabase/search-live'
import { askHiloCofradeV12 } from '@/lib/supabase/tira-del-hilo-v12'

async function loadCachedPublicHiloEntities(term, limit) {
  return runWithPublicSupabaseRead(() => searchHiloEntities(
    term,
    limit,
    { throwOnPartial: true }
  ))
}

const getCachedPublicHiloEntities = unstable_cache(
  loadCachedPublicHiloEntities,
  ['hilo-cofrade-autocomplete-result-v1'],
  { revalidate: 15 }
)

export async function searchPublicHiloEntities(term, limit = 8) {
  try {
    return await getCachedPublicHiloEntities(term, limit)
  } catch (error) {
    console.warn('[Hilo Cofrade] No se pudo usar la caché completa del autocompletado', {
      error: error instanceof Error ? error.name : 'search_cache_failed',
    })

    return runWithPublicSupabaseRead(() => searchHiloEntities(term, limit))
  }
}

export function askPublicHiloCofrade(question, context = null) {
  return runWithPublicSupabaseRead(() => askHiloCofradeV12(question, context))
}
