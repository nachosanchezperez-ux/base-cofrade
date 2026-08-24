import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

const PUBLIC_RIGHTS_STATUSES = ['owned', 'authorized', 'licensed', 'public_domain']

function isMissingCultMediaTable(error) {
  const message = String(error?.message || '')
  return error?.code === '42P01'
    || error?.code === 'PGRST205'
    || /cult_media/i.test(message) && /does not exist|schema cache/i.test(message)
}

function resolvePublicMediaPath(supabase, storagePath) {
  if (!storagePath || storagePath.startsWith('/') || /^https?:\/\//i.test(storagePath)) return storagePath
  return supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl
}

function serializeCultMedia(media, relation = {}, publicPath = '') {
  if (!media?.storage_path) return null

  const sourceName = media.source_name || ''
  const creditName = media.author_name || (/^hermandad\b/i.test(sourceName) ? sourceName : '')
  const focusX = Number(relation.focus_x ?? 50)
  const focusY = Number(relation.focus_y ?? 50)
  const mobileFocusX = Number(relation.mobile_focus_x ?? relation.focus_x ?? 50)
  const mobileFocusY = Number(relation.mobile_focus_y ?? relation.focus_y ?? 50)

  return {
    path: publicPath || media.storage_path,
    title: media.title || '',
    caption: media.caption || '',
    alt: media.alt_text || media.title || '',
    authorName: media.author_name || '',
    credit: creditName ? `Fotografía · ${creditName}` : '',
    sourceName,
    sourceUrl: media.source_url || '',
    rightsStatus: media.rights_status,
    license: media.license || '',
    width: media.width_px || null,
    height: media.height_px || null,
    focusX,
    focusY,
    mobileFocusX,
    mobileFocusY,
    fitMode: relation.fit_mode || 'cover',
    focusPosition: `${focusX}% ${focusY}%`,
    mobileFocusPosition: `${mobileFocusX}% ${mobileFocusY}%`,
  }
}

export async function getPublishedCultCoverMediaMap(cultIds = []) {
  const ids = [...new Set(cultIds.filter(Boolean))]
  if (!ids.length) return new Map()

  try {
    const supabase = createPublicClient()
    const { data: relations, error: relationError } = await supabase
      .from('cult_media')
      .select('cult_id, media_asset_id, sort_order, focus_x, focus_y, mobile_focus_x, mobile_focus_y, fit_mode')
      .in('cult_id', ids)
      .eq('is_cover', true)
      .order('sort_order', { ascending: true })

    if (relationError) {
      if (isMissingCultMediaTable(relationError)) return new Map()
      throw relationError
    }
    if (!relations?.length) return new Map()

    const mediaIds = [...new Set(relations.map((relation) => relation.media_asset_id).filter(Boolean))]
    if (!mediaIds.length) return new Map()

    const { data: mediaRows, error: mediaError } = await supabase
      .from('media_assets')
      .select('id, storage_path, title, caption, alt_text, author_name, source_name, source_url, rights_status, license, width_px, height_px')
      .in('id', mediaIds)
      .eq('media_type', 'image')
      .in('rights_status', PUBLIC_RIGHTS_STATUSES)

    if (mediaError) throw mediaError

    const mediaById = new Map((mediaRows || []).map((media) => [media.id, media]))
    const covers = new Map()

    relations.forEach((relation) => {
      if (covers.has(relation.cult_id)) return
      const media = mediaById.get(relation.media_asset_id)
      const serialized = serializeCultMedia(
        media,
        relation,
        resolvePublicMediaPath(supabase, media?.storage_path)
      )
      if (serialized) covers.set(relation.cult_id, serialized)
    })

    return covers
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las fotografías de portada de los cultos', {
      cultIds: ids,
      error: error instanceof Error ? error.message : String(error),
    })
    return new Map()
  }
}
