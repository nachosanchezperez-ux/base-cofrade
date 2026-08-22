import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

const PUBLIC_RIGHTS_STATUSES = ['owned', 'authorized', 'licensed', 'public_domain']

function serializeCoverMedia(media) {
  if (!media?.storage_path) return null
  const sourceName = media.source_name || ''
  const creditName = media.author_name || (/^hermandad\b/i.test(sourceName) ? sourceName : '')
  return { path: media.storage_path, title: media.title || '', caption: media.caption || '', alt: media.alt_text || media.title || '', authorName: media.author_name || '', credit: creditName ? `Fotografía • ${creditName}` : '', sourceName, sourceUrl: media.source_url || '', rightsStatus: media.rights_status }
}

export async function getPublishedEntityCoverMediaMap(entityIds = []) {
  const ids = [...new Set(entityIds.filter(Boolean))]
  if (!ids.length) return new Map()
  try {
    const supabase = createPublicClient()
    const { data: relations, error: relationError } = await supabase.from('entity_media').select('entity_id, media_asset_id, sort_order').in('entity_id', ids).eq('is_cover', true).order('sort_order', { ascending: true })
    if (relationError) throw relationError
    if (!relations?.length) return new Map()
    const mediaIds = [...new Set(relations.map((relation) => relation.media_asset_id).filter(Boolean))]
    if (!mediaIds.length) return new Map()
    const { data: mediaRows, error: mediaError } = await supabase.from('media_assets').select('id, storage_path, title, caption, alt_text, author_name, source_name, source_url, rights_status').in('id', mediaIds).eq('media_type', 'image').in('rights_status', PUBLIC_RIGHTS_STATUSES)
    if (mediaError) throw mediaError
    const mediaById = new Map((mediaRows || []).map((media) => [media.id, media]))
    const covers = new Map()
    relations.forEach((relation) => { if (!covers.has(relation.entity_id)) { const media = serializeCoverMedia(mediaById.get(relation.media_asset_id)); if (media) covers.set(relation.entity_id, media) } })
    return covers
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las fotografías de portada de las entidades', { entityIds: ids, error: error instanceof Error ? error.message : String(error) })
    return new Map()
  }
}

export async function getPublishedEntityCoverMedia(entityId) {
  if (!entityId) return null
  const mediaByEntity = await getPublishedEntityCoverMediaMap([entityId])
  return mediaByEntity.get(entityId) || null
}

export async function getPublishedEntityMedia(entityId) {
  if (!entityId) return []
  try {
    const supabase = createPublicClient()
    const { data: relations, error: relationError } = await supabase.from('entity_media').select('id, media_asset_id, relation_type, sort_order, is_cover, notes').eq('entity_id', entityId).order('is_cover', { ascending: false }).order('sort_order', { ascending: true })
    if (relationError) throw relationError
    if (!relations?.length) return []
    const mediaIds = [...new Set(relations.map((relation) => relation.media_asset_id).filter(Boolean))]
    if (!mediaIds.length) return []
    const { data: mediaRows, error: mediaError } = await supabase.from('media_assets').select('id, storage_path, title, caption, alt_text, author_name, source_name, source_url, rights_status').in('id', mediaIds).eq('media_type', 'image').in('rights_status', PUBLIC_RIGHTS_STATUSES)
    if (mediaError) throw mediaError
    const mediaById = new Map((mediaRows || []).map((media) => [media.id, media]))
    return relations.map((relation) => { const media = serializeCoverMedia(mediaById.get(relation.media_asset_id)); return media ? { ...media, id: relation.id, relationType: relation.relation_type, sortOrder: relation.sort_order, isCover: relation.is_cover, notes: relation.notes || '' } : null }).filter(Boolean)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la galería de la entidad', { entityId, error: error instanceof Error ? error.message : String(error) })
    return []
  }
}
