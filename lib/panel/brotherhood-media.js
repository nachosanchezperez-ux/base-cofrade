import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function mediaAsset(value) {
  return Array.isArray(value) ? value[0] : value
}

function publicUrl(supabase, storagePath = '') {
  if (!storagePath) return ''
  if (storagePath.startsWith('/')) return storagePath
  return supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl || ''
}

function yearFrom(...values) {
  for (const value of values) {
    const match = String(value || '').match(/\b(1[6-9]\d{2}|20\d{2}|21\d{2})\b/)
    if (match) return Number.parseInt(match[1], 10)
  }
  return null
}

function isPoster(item) {
  return /cartel|pregon|anunciador/i.test(`${item.asset_type || ''} ${item.name || ''}`)
}

function isMissingCultMediaTable(error) {
  const message = String(error?.message || '')
  return error?.code === '42P01'
    || error?.code === 'PGRST205'
    || /cult_media/i.test(message) && /does not exist|schema cache/i.test(message)
}

export async function getBrotherhoodMediaWorkspaceData(id) {
  const supabase = await createClient()
  const entityResult = await supabase
    .from('entities')
    .select('id, name, slug, status')
    .eq('id', id)
    .eq('entity_type', 'brotherhood')
    .neq('status', 'archived')
    .maybeSingle()

  if (entityResult.error) throw new Error(`No se pudo cargar la Hermandad: ${entityResult.error.message}`)
  if (!entityResult.data) return null

  const entity = entityResult.data
  const [brotherhoodResult, stepLinksResult, imageLinksResult, heritageResult, cultsResult] = await Promise.all([
    supabase
      .from('brotherhoods')
      .select('entity_id, popular_name, official_name')
      .eq('entity_id', id)
      .maybeSingle(),
    supabase
      .from('brotherhood_steps')
      .select('step_entity_id, relation_type, status')
      .eq('brotherhood_entity_id', id)
      .neq('status', 'archived'),
    supabase
      .from('brotherhood_images')
      .select('image_entity_id, relation_type, status')
      .eq('brotherhood_entity_id', id)
      .neq('status', 'archived'),
    supabase
      .from('heritage_assets')
      .select('entity_id, asset_type, date_from, date_from_text, display_order, public_image_path, public_image_alt, public_image_credit')
      .eq('parent_entity_id', id)
      .order('display_order'),
    supabase
      .from('cults')
      .select('id, cult_type, title, cult_date, date_rule, month, time_text, description, display_order, status')
      .eq('brotherhood_entity_id', id)
      .neq('status', 'archived')
      .order('display_order'),
  ])

  if (brotherhoodResult.error) throw new Error(`No se pudo cargar la ficha de la Hermandad: ${brotherhoodResult.error.message}`)

  const stepLinks = assertQuery(stepLinksResult, 'No se pudieron cargar los Pasos relacionados')
  const imageLinks = assertQuery(imageLinksResult, 'No se pudieron cargar los Titulares relacionados')
  const heritageRows = assertQuery(heritageResult, 'No se pudo cargar el patrimonio relacionado')
  const cultRows = assertQuery(cultsResult, 'No se pudieron cargar los cultos relacionados')
  const stepIds = stepLinks.map((item) => item.step_entity_id).filter(Boolean)
  const imageIds = imageLinks.map((item) => item.image_entity_id).filter(Boolean)
  const assetIds = heritageRows.map((item) => item.entity_id).filter(Boolean)
  const cultIds = cultRows.map((item) => item.id).filter(Boolean)
  const targetIds = [...new Set([id, ...stepIds, ...imageIds, ...assetIds])]

  const [targetEntitiesResult, mediaLinksResult, cultMediaLinksResult] = await Promise.all([
    targetIds.length
      ? supabase
          .from('entities')
          .select('id, entity_type, name, slug, summary, status')
          .in('id', targetIds)
          .neq('status', 'archived')
      : Promise.resolve({ data: [], error: null }),
    targetIds.length
      ? supabase
          .from('entity_media')
          .select('id, entity_id, media_asset_id, relation_type, sort_order, is_cover, notes, media_assets(id, storage_path, media_type, title, caption, alt_text, author_name, rights_status)')
          .in('entity_id', targetIds)
          .order('is_cover', { ascending: false })
          .order('sort_order')
      : Promise.resolve({ data: [], error: null }),
    cultIds.length
      ? supabase
          .from('cult_media')
          .select('id, cult_id, media_asset_id, role, sort_order, is_cover, media_assets(id, storage_path, media_type, title, caption, alt_text, author_name, rights_status)')
          .in('cult_id', cultIds)
          .order('is_cover', { ascending: false })
          .order('sort_order')
      : Promise.resolve({ data: [], error: null }),
  ])

  const targetEntities = assertQuery(targetEntitiesResult, 'No se pudieron cargar las entidades relacionadas')
  const rawMediaLinks = assertQuery(mediaLinksResult, 'No se pudo cargar el archivo visual relacionado')
  const rawCultMediaLinks = cultMediaLinksResult.error && isMissingCultMediaTable(cultMediaLinksResult.error)
    ? []
    : assertQuery(cultMediaLinksResult, 'No se pudieron cargar las fotografías de los cultos')
  const entityById = new Map(targetEntities.map((item) => [item.id, item]))
  const mediaByEntityId = new Map()
  const mediaByCultId = new Map()

  rawMediaLinks.forEach((link) => {
    const asset = mediaAsset(link.media_assets)
    if (!asset) return
    const list = mediaByEntityId.get(link.entity_id) || []
    list.push({
      ...link,
      asset,
      publicUrl: publicUrl(supabase, asset.storage_path),
    })
    mediaByEntityId.set(link.entity_id, list)
  })

  rawCultMediaLinks.forEach((link) => {
    const asset = mediaAsset(link.media_assets)
    if (!asset) return
    const list = mediaByCultId.get(link.cult_id) || []
    list.push({
      ...link,
      relation_type: link.role,
      asset,
      publicUrl: publicUrl(supabase, asset.storage_path),
    })
    mediaByCultId.set(link.cult_id, list)
  })

  function target(entityId, extra = {}) {
    const targetEntity = entityById.get(entityId)
    if (!targetEntity) return null
    const media = mediaByEntityId.get(entityId) || []
    const cover = media.find((item) => item.is_cover)
      || media.find((item) => ['cover', 'hero', 'principal'].includes(item.relation_type))
      || media[0]
      || null

    return {
      ...targetEntity,
      ...extra,
      media,
      cover,
    }
  }

  const steps = stepLinks
    .map((link) => target(link.step_entity_id, { relationType: link.relation_type }))
    .filter(Boolean)
    .sort((first, second) => first.name.localeCompare(second.name, 'es'))

  const images = imageLinks
    .map((link) => target(link.image_entity_id, { relationType: link.relation_type }))
    .filter(Boolean)
    .sort((first, second) => first.name.localeCompare(second.name, 'es'))

  const heritage = heritageRows
    .map((row) => {
      const item = target(row.entity_id, {
        ...row,
        year: yearFrom(row.date_from_text, row.date_from, entityById.get(row.entity_id)?.name),
      })
      return item ? { ...item, isPoster: isPoster(item) } : null
    })
    .filter(Boolean)
    .sort((first, second) => {
      if (first.isPoster !== second.isPoster) return first.isPoster ? -1 : 1
      if ((first.year || 0) !== (second.year || 0)) return (second.year || 0) - (first.year || 0)
      return (first.display_order || 0) - (second.display_order || 0)
    })

  const cults = cultRows.map((row) => {
    const media = mediaByCultId.get(row.id) || []
    const cover = media.find((item) => item.is_cover)
      || media.find((item) => ['cover', 'principal'].includes(item.relation_type))
      || media[0]
      || null

    return {
      id: row.id,
      name: row.title,
      asset_type: row.cult_type || 'Culto',
      description: row.description || '',
      dateLabel: row.cult_date || row.date_rule || row.month || '',
      timeText: row.time_text || '',
      display_order: row.display_order || 0,
      media,
      cover,
    }
  })

  return {
    entity,
    brotherhood: brotherhoodResult.data || {},
    brotherhoodMedia: target(id)?.media || [],
    steps,
    images,
    heritage,
    cults,
  }
}
