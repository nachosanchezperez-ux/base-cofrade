import 'server-only'

import { askDiscoveryHilo } from '@/lib/supabase/tira-del-hilo-discovery'
import { askHiloCofradeV10 } from '@/lib/supabase/tira-del-hilo-v10'

export async function askHiloCofradeV11(question, context = null) {
  const discovery = await askDiscoveryHilo(question)
  if (discovery) return discovery
  return askHiloCofradeV10(question, context)
}
