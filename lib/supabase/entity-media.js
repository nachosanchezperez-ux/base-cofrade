import 'server-only'

import { createClient } from '@/lib/supabase/server'

const PUBLIC_RIGHTS_STATUSES = ['owned', 'authorized', 'licensed', 'public_domain']

export async function getPublishedEntityCoverMedia(entityId) {
  if (!entityId) return null

  try {
    const supabase = await createClient()
    const { data: relation, error: relationError } = await supabase
      .from('entity_media')
      .select('media_asset_id')
      .eq('entity_id', entityId)
      .eq('is_cover', true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (relationError) throw relationError
    if (!relation?.media_asset_id) return null

    const { data: media, error: mediaError } = await supabase
      .from('media_assets')
      .select('storage_path, title, caption, alt_text, author_name, source_name, source_url, rights_status')
      .eq('id', relation.media_asset_id)
      .eq('media_type', 'image')
      .in('rights_status', PUBLIC_RIGHTS_STATUSES)
      .maybeSingle()

    if (mediaError) throw mediaError
    if (!media?.storage_path) return null

    return {
      path: media.storage_path,
      title: media.title || '',
      caption: media.caption || '',
      alt: media.alt_text || media.title || '',
      authorName: media.author_name || '',
      credit: media.author_name ? `Fotografía · ${media.author_name}` : '',
      sourceName: media.source_name || '',
      sourceUrl: media.source_url || '',
      rightsStatus: media.rights_status,
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la fotografía de portada de la entidad', {
      entityId,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
