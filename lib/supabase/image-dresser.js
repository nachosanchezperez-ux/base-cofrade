import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getPublishedImageDresser(imageId) {
  if (!imageId) return null

  try {
    const supabase = createPublicClient()
    const relations = assertRows(
      await supabase
        .from('entity_relations')
        .select('source_entity_id, created_at')
        .eq('target_entity_id', imageId)
        .eq('relation_type', 'dresser_of')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(1),
      'No se pudo consultar el vestidor actual de la Imagen'
    )

    const agentId = relations[0]?.source_entity_id
    if (!agentId) return null

    const { data, error } = await supabase
      .from('entities')
      .select('id, name, slug')
      .eq('id', agentId)
      .eq('entity_type', 'agent')
      .eq('status', 'published')
      .maybeSingle()

    if (error) throw new Error(`No se pudo consultar el Agente vestidor: ${error.message}`)
    return data ? { id: data.id, name: data.name, slug: data.slug || '' } : null
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el vestidor de la Imagen', {
      imageId,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
