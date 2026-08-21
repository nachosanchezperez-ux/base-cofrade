import 'server-only'

import { createClient } from '@/lib/supabase/server'

export async function getPanelEntityCover(entityId) {
  if (!entityId) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('entity_media')
    .select(`
      id,
      entity_id,
      media_asset_id,
      focus_x,
      focus_y,
      mobile_focus_x,
      mobile_focus_y,
      fit_mode,
      media_assets(
        id,
        storage_path,
        title,
        caption,
        alt_text,
        author_name,
        source_name,
        source_url,
        rights_status,
        rights_holder,
        license,
        permission_notes,
        width_px,
        height_px
      )
    `)
    .eq('entity_id', entityId)
    .eq('is_cover', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`No se pudo cargar la portada: ${error.message}`)
  if (!data?.media_assets) return null

  const asset = data.media_assets
  const publicUrl = asset.storage_path
    ? asset.storage_path.startsWith('/')
      ? asset.storage_path
      : supabase.storage.from('hilo-media').getPublicUrl(asset.storage_path).data.publicUrl
    : ''

  return {
    id: data.id,
    assetId: data.media_asset_id,
    publicUrl,
    focusX: Number(data.focus_x ?? 50),
    focusY: Number(data.focus_y ?? 50),
    mobileFocusX: Number(data.mobile_focus_x ?? data.focus_x ?? 50),
    mobileFocusY: Number(data.mobile_focus_y ?? data.focus_y ?? 50),
    fitMode: data.fit_mode || 'auto',
    asset,
  }
}
