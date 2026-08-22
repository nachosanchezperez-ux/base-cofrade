import 'server-only'

import { askHiloCofradeV5 } from '@/lib/supabase/tira-del-hilo-v5'
import { withTiraEvidence } from '@/lib/tira-evidence'

export async function askHiloCofradeV6(question, context = null) {
  const response = await askHiloCofradeV5(question, context)
  return withTiraEvidence(response)
}
