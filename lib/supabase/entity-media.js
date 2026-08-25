import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

const PUBLIC_RIGHTS_STATUSES = ['owned', 'authorized', 'licensed', 'public_domain']

function resolvePublicMediaPath(supabase, storagePath) {
  if (!storagePath || storagePath.startsWith('/') || /^https?:\/\//i.test(storagePath)) return storagePath
  return supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl
}

function normalizePhotoCredit(value = '') {
  return String(value || '')
    .replace(/^fotograf[ií]a\s*[•·:|\-]\s*/i, '')
    .trim()
}

function serializeCoverMedia(media, relation = {}, publicPath = '') {
  if (!media?.storage_path) return null

  const sourceName = media.source_name || ''
  const rawCreditName = media.author_name || (/^hermandad\b/i.test(sourceName) ? sourceName : '')
  const creditName = normalizePhotoCredit(rawCreditName)
  const licenseLabel = media.license || ''
  const creditParts = [
    creditName ? `Fotografía · ${creditName}` : '',
    licenseLabel,
  ].filter(Boolean)
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
    credit: creditParts.join(' · '),
    sourceName,
    sourceUrl: media.source_url || '',
    rightsStatus: media.rights_status,
    license: licenseLabel,
    width: media.width_px || null,
    height: media.height_px || null,
    focusX,
    focusY,
    mobileFocusX,
    mobileFocusY,
    fitMode: relation.fit_mode || 'auto',
    focusPosition: `${focusX}% ${focusY}%`,
  }
}

export async function getPublishedEntityCoverMediaMap(entityIds = []) {
  const ids = [...new Set(entityIds.filter(Boolean))]
  if (!ids.length) return new Map()

  try {
    const supabase = createPublicClient()
    const [entityResult, relationResult] = await Promise.all([
      supabase
        .from('entities')
        .select('id, entity_type')
        .in('id', ids),
      supabase
        .from('entity_media')
        .select('entity_id, media_asset_id, relation_type, is_cover, sort_order, focus_x, focus_y, mobile_focus_x, mobile_focus_y, fit_mode')
        .in('entity_id', ids)
        .or('is_cover.eq.true,relation_type.eq.hero')
        .order('sort_order', { ascending: true }),
    ])

    if (relationResult.error) throw relationResult.error
    if (!relationResult.data?.length) return new Map()

    const entityTypeById = entityResult.error
      ? new Map()
      : new Map((entityResult.data || []).map((entity) => [entity.id, entity.entity_type]))
    const relationsByEntity = new Map()

    relationResult.data.forEach((relation) => {
      const list = relationsByEntity.get(relation.entity_id) || []
      list.push(relation)
      relationsByEntity.set(relation.entity_id, list)
    })

    const selectedRelations = ids.map((entityId) => {
      const relations = relationsByEntity.get(entityId) || []
      const entityType = entityTypeById.get(entityId)
      if (entityType === 'brotherhood') {
        return relations.find((relation) => relation.relation_type === 'hero')
          || relations.find((relation) => relation.is_cover)
          || null
      }
      return relations.find((relation) => relation.is_cover) || null
    }).filter(Boolean)

    if (!selectedRelations.length) return new Map()

    const mediaIds = [...new Set(selectedRelations.map((relation) => relation.media_asset_id).filter(Boolean))]
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

    selectedRelations.forEach((relation) => {
      const media = mediaById.get(relation.media_asset_id)
      const serialized = serializeCoverMedia(
        media,
        relation,
        resolvePublicMediaPath(supabase, media?.storage_path)
      )
      if (serialized) covers.set(relation.entity_id, serialized)
    })

    return covers
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las fotografías de portada de las entidades', {
      entityIds: ids,
      error: error instanceof Error ? error.message : String(error),
    })
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
    const { data: relations, error: relationError } = await supabase
      .from('entity_media')
      .select('id, media_asset_id, relation_type, sort_order, is_cover, notes, focus_x, focus_y, mobile_focus_x, mobile_focus_y, fit_mode')
      .eq('entity_id', entityId)
      .order('is_cover', { ascending: false })
      .order('sort_order', { ascending: true })

    if (relationError) throw relationError
    if (!relations?.length) return []

    const mediaIds = [...new Set(relations.map((relation) => relation.media_asset_id).filter(Boolean))]
    if (!mediaIds.length) return []

    const { data: mediaRows, error: mediaError } = await supabase
      .from('media_assets')
      .select('id, storage_path, title, caption, alt_text, author_name, source_name, source_url, rights_status, license, width_px, height_px')
      .in('id', mediaIds)
      .eq('media_type', 'image')
      .in('rights_status', PUBLIC_RIGHTS_STATUSES)

    if (mediaError) throw mediaError

    const mediaById = new Map((mediaRows || []).map((media) => [media.id, media]))

    return relations
      .map((relation) => {
        const media = mediaById.get(relation.media_asset_id)
        const serialized = serializeCoverMedia(
          media,
          relation,
          resolvePublicMediaPath(supabase, media?.storage_path)
        )
        return serialized
          ? {
              ...serialized,
              id: relation.id,
              relationType: relation.relation_type,
              sortOrder: relation.sort_order,
              isCover: relation.is_cover,
              notes: relation.notes || '',
            }
          : null
      })
      .filter(Boolean)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la galería de la entidad', {
      entityId,
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
