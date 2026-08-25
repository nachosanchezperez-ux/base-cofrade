import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { getBrotherhoodMediaWorkspaceData } from '@/lib/panel/brotherhood-media'

const PUBLICATION_RIGHTS = new Set(['owned', 'authorized', 'licensed', 'public_domain'])

function mediaAsset(value) {
  return Array.isArray(value) ? value[0] : value
}

function publicUrl(supabase, storagePath = '') {
  if (!storagePath) return ''
  if (storagePath.startsWith('/') || /^https?:\/\//i.test(storagePath)) return storagePath
  return supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl || ''
}

function candidate(link, sourceType, sourceName) {
  if (!link?.asset || link.asset.media_type !== 'image') return null
  if (!PUBLICATION_RIGHTS.has(link.asset.rights_status)) return null
  if (!link.publicUrl) return null

  return {
    ...link,
    sourceType,
    sourceName,
    sourceLabel: sourceName ? `${sourceType} · ${sourceName}` : sourceType,
  }
}

function candidatePriority(item) {
  if (item.relation_type === 'hero') return 100
  if (item.sourceType === 'Hermandad') return 90
  if (item.is_cover) return 80
  if (item.sourceType === 'Titular') return 70
  if (item.sourceType === 'Paso') return 60
  if (item.sourceType === 'Culto') return 50
  return 40
}

function collectCandidates(data) {
  const all = []
  const add = (link, sourceType, sourceName) => {
    const item = candidate(link, sourceType, sourceName)
    if (item) all.push(item)
  }

  data.brotherhoodMedia.forEach((link) => add(link, 'Hermandad', data.brotherhood.popular_name || data.entity.name))
  data.images.forEach((item) => item.media.forEach((link) => add(link, 'Titular', item.name)))
  data.steps.forEach((item) => item.media.forEach((link) => add(link, 'Paso', item.name)))
  data.cults.forEach((item) => item.media.forEach((link) => add(link, 'Culto', item.name)))
  data.heritage.forEach((item) => item.media.forEach((link) => add(link, item.isPoster ? 'Cartel' : 'Patrimonio', item.name)))

  const byAsset = new Map()
  all.forEach((item) => {
    const current = byAsset.get(item.media_asset_id)
    if (!current || candidatePriority(item) > candidatePriority(current)) {
      byAsset.set(item.media_asset_id, item)
    }
  })

  return [...byAsset.values()].sort((first, second) => {
    const priority = candidatePriority(second) - candidatePriority(first)
    if (priority) return priority
    return first.sourceLabel.localeCompare(second.sourceLabel, 'es')
  })
}

async function loadExplicitHero(supabase, brotherhoodId) {
  const result = await supabase
    .from('entity_media')
    .select('id, entity_id, media_asset_id, relation_type, sort_order, is_cover, notes, focus_x, focus_y, mobile_focus_x, mobile_focus_y, fit_mode, media_assets(id, storage_path, media_type, title, caption, alt_text, author_name, rights_status, license, width_px, height_px)')
    .eq('entity_id', brotherhoodId)
    .eq('relation_type', 'hero')
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (result.error) throw new Error(`No se pudo cargar la portada de la Hermandad: ${result.error.message}`)
  if (!result.data) return null

  const asset = mediaAsset(result.data.media_assets)
  if (!asset || asset.media_type !== 'image' || !PUBLICATION_RIGHTS.has(asset.rights_status)) return null

  return {
    ...result.data,
    asset,
    publicUrl: publicUrl(supabase, asset.storage_path),
    sourceType: 'Hermandad',
    sourceName: 'Portada actual',
    sourceLabel: 'Portada actual',
  }
}

export async function getBrotherhoodHeroWorkspace(brotherhoodId) {
  const data = await getBrotherhoodMediaWorkspaceData(brotherhoodId)
  if (!data) return null

  const supabase = await createClient()
  const hero = await loadExplicitHero(supabase, brotherhoodId)
  const candidates = collectCandidates(data)

  if (hero?.publicUrl) {
    const index = candidates.findIndex((item) => item.media_asset_id === hero.media_asset_id)
    if (index >= 0) candidates.splice(index, 1)
    candidates.unshift(hero)
  }

  return {
    ...data,
    hero,
    candidates,
  }
}
