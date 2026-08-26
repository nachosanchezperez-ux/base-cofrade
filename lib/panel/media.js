import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { resolveHiloMediaReference } from '@/lib/supabase/hilo-media-paths'

export const MEDIA_ENTITY_TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  agent: 'Persona / Agente',
  heritage_asset: 'Patrimonio',
  march: 'Marcha',
  event: 'Acontecimiento',
  advocation: 'Advocación',
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getPanelMediaData({ entityId = '', query = '' } = {}) {
  const supabase = await createClient()
  const [entitiesResult, assetsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .neq('status', 'archived')
      .order('entity_type')
      .order('name'),
    supabase
      .from('media_assets')
      .select('id, storage_path, media_type, title, caption, alt_text, author_name, source_name, source_url, rights_status, rights_holder, license, permission_notes, taken_or_created_date, width_px, height_px, created_at, updated_at')
      .order('updated_at', { ascending: false }),
  ])

  const entities = rows(entitiesResult, 'No se pudieron cargar las entidades del archivo multimedia')
  const assets = rows(assetsResult, 'No se pudo cargar el archivo multimedia')
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const assetById = new Map(assets.map((asset) => [asset.id, asset]))

  let linksQuery = supabase
    .from('entity_media')
    .select('id, entity_id, media_asset_id, relation_type, sort_order, is_cover, focus_x, focus_y, mobile_focus_x, mobile_focus_y, fit_mode, notes')
    .order('is_cover', { ascending: false })
    .order('sort_order')

  if (entityId) linksQuery = linksQuery.eq('entity_id', entityId)

  const links = rows(await linksQuery, 'No se pudieron cargar los vínculos multimedia')
    .map((link) => ({
      ...link,
      entity: entityById.get(link.entity_id) || null,
      asset: assetById.get(link.media_asset_id) || null,
    }))
    .filter((link) => link.entity && link.asset)
    .map((link) => ({
      ...link,
      publicUrl: resolveHiloMediaReference(supabase, link.asset.storage_path),
    }))

  const normalizedQuery = String(query || '').trim().toLocaleLowerCase('es')
  const filteredLinks = normalizedQuery
    ? links.filter((link) => (
        `${link.entity.name} ${link.entity.entity_type} ${link.asset.title || ''} ${link.asset.author_name || ''} ${link.relation_type}`
          .toLocaleLowerCase('es')
          .includes(normalizedQuery)
      ))
    : links

  return {
    entities,
    entityOptions: entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      slug: entity.slug || '',
      meta: `${MEDIA_ENTITY_TYPE_LABELS[entity.entity_type] || entity.entity_type} · ${entity.status}`,
    })),
    assets: assets.map((asset) => ({
      ...asset,
      publicUrl: resolveHiloMediaReference(supabase, asset.storage_path),
    })),
    assetOptions: assets.map((asset) => ({
      id: asset.id,
      name: asset.title || asset.alt_text || asset.storage_path,
      meta: [asset.author_name, asset.rights_status, asset.storage_path].filter(Boolean).join(' · '),
    })),
    links: filteredLinks,
  }
}
