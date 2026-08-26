import 'server-only'

import { runWithPublicSupabaseRead } from '@/lib/supabase/public-read-context'
import { searchHiloEntities } from '@/lib/supabase/search-live'
import { askHiloCofradeV12 } from '@/lib/supabase/tira-del-hilo-v12'

export function searchPublicHiloEntities(term, limit = 8) {
  return runWithPublicSupabaseRead(() => searchHiloEntities(term, limit))
}

export function askPublicHiloCofrade(question, context = null) {
  return runWithPublicSupabaseRead(() => askHiloCofradeV12(question, context))
}
