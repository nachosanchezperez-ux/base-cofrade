import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

export async function getPublishedBrotherhoodCrestPath(entityId) {
  if (!entityId) return ''

  try {
    const supabase = createPublicClient()
    const entityResult = await supabase
      .from('entities')
      .select('id')
      .eq('id', entityId)
      .eq('entity_type', 'brotherhood')
      .eq('status', 'published')
      .maybeSingle()

    if (entityResult.error) throw entityResult.error
    if (!entityResult.data) return ''

    const brotherhoodResult = await supabase
      .from('brotherhoods')
      .select('crest_path')
      .eq('entity_id', entityId)
      .maybeSingle()

    if (brotherhoodResult.error) throw brotherhoodResult.error
    return brotherhoodResult.data?.crest_path || ''
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo resolver el escudo autoritativo de la Hermandad', {
      entityId,
      error: error instanceof Error ? error.message : String(error),
    })
    return ''
  }
}
