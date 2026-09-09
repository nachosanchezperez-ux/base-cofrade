import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

async function resolvePublishedBrotherhoodCrest({ entityId = '', slug = '' } = {}) {
  if (!entityId && !slug) return ''

  try {
    const supabase = createPublicClient()
    let entityQuery = supabase
      .from('entities')
      .select('id')
      .eq('entity_type', 'brotherhood')
      .eq('status', 'published')

    entityQuery = entityId
      ? entityQuery.eq('id', entityId)
      : entityQuery.eq('slug', slug)

    const entityResult = await entityQuery.maybeSingle()

    if (entityResult.error) throw entityResult.error
    if (!entityResult.data) return ''

    const brotherhoodResult = await supabase
      .from('brotherhoods')
      .select('crest_path')
      .eq('entity_id', entityResult.data.id)
      .maybeSingle()

    if (brotherhoodResult.error) throw brotherhoodResult.error
    return brotherhoodResult.data?.crest_path || ''
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo resolver el escudo autoritativo de la Hermandad', {
      entityId,
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return ''
  }
}

export async function getPublishedBrotherhoodCrestPath(entityId) {
  return resolvePublishedBrotherhoodCrest({ entityId })
}

export async function getPublishedBrotherhoodCrestPathBySlug(slug) {
  return resolvePublishedBrotherhoodCrest({ slug })
}
