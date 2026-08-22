import 'server-only'

import { applyManagedBrotherhoodSections } from '@/lib/brotherhood-authority-core'
import { createClient } from '@/lib/supabase/server'

const OPTIONAL_SCHEMA_ERRORS = new Set(['42P01', 'PGRST205', '42703'])

function isOptionalSchemaError(error) {
  return OPTIONAL_SCHEMA_ERRORS.has(error?.code)
}

export async function applyBrotherhoodAuthority({ merged, local, remote }) {
  if (!merged || !remote?.entity?.id) return merged

  try {
    const supabase = await createClient()
    const [authorityResult, historyResult] = await Promise.all([
      supabase
        .from('brotherhood_section_authority')
        .select('section_key')
        .eq('brotherhood_entity_id', remote.entity.id),
      supabase
        .from('brotherhoods')
        .select('history_text')
        .eq('entity_id', remote.entity.id)
        .maybeSingle(),
    ])

    if (authorityResult.error) {
      if (isOptionalSchemaError(authorityResult.error)) return merged
      throw authorityResult.error
    }
    if (historyResult.error && !isOptionalSchemaError(historyResult.error)) throw historyResult.error

    return applyManagedBrotherhoodSections({
      merged,
      local,
      remote,
      managedSections: (authorityResult.data || []).map((item) => item.section_key),
      historyText: historyResult.data?.history_text || '',
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo aplicar la autoridad editorial de la Hermandad', {
      entityId: remote.entity.id,
      error: error instanceof Error ? error.message : String(error),
    })
    return merged
  }
}
