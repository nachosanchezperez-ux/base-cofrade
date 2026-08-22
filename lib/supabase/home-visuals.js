import 'server-only'

import { selectDiverseHomeSpotlights } from '@/lib/home-visual-diversity'

const VISUAL_TYPES = new Set(['brotherhood', 'image', 'step', 'band'])
const PUBLIC_RIGHTS = ['owned', 'authorized', 'licensed', 'public_domain']

function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

function hrefFor(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function rows(result) {
  return result?.error ? [] : result?.data || []
}

function publicMediaPath(supabase, value = '') {
  if (!value || value.startsWith('/') || /^https?:\/\//i.test(value)) return value
  return supabase.storage.from('hilo-media').getPublicUrl(value).data.publicUrl
}

function mediaCredit(media) {
  const name = String(media?.author_name || media?.source_name || '').trim()
  return name ? `Fotografía • ${name}` : ''
}

function safeFocus(value, fallback = 50) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : fallback
}

function photoVisual(supabase, entity, relation, media) {
  const path = publicMediaPath(supabase, media?.storage_path || '')
  if (!path) return null
  return {
    path,
    kind: 'photo',
    alt: media?.alt_text || media?.title || entity.name,
    credit: mediaCredit(media),
    focusPosition: `${safeFocus(relation?.focus_x)}% ${safeFocus(relation?.focus_y)}%`,
    contextName: entity.name,
    contextHref: hrefFor(entity),
  }
}

export async function getHomeVisualsForEntityIds(supabase, entityIds = []) {
  const ids = [...new Set((entityIds || []).filter(Boolean))]
  if (!ids.length) return {}

  const entityResult = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, updated_at')
    .in('id', ids)
    .eq('status', 'published')
  const entities = rows(entityResult).filter((entity) => VISUAL_TYPES.has(entity.entity_type))
  if (!entities.length) return {}

  const publishedIds = entities.map((entity) => entity.id)
  const brotherhoodIds = entities.filter((entity) => entity.entity_type === 'brotherhood').map((entity) => entity.id)
  const bandIds = entities.filter((entity) => entity.entity_type === 'band').map((entity) => entity.id)
  const imageIds = entities.filter((entity) => entity.entity_type === 'image').map((entity) => entity.id)
  const stepIds = entities.filter((entity) => entity.entity_type === 'step').map((entity) => entity.id)

  const [bandsResult, directImageResult, imageStepsResult, coverRelationResult] = await Promise.all([
    bandIds.length
      ? supabase.from('bands').select('entity_id, logo_path, hero_image_path, hero_image_alt').in('entity_id', bandIds)
      : Promise.resolve({ data: [], error: null }),
    imageIds.length
      ? supabase
          .from('brotherhood_images')
          .select('image_entity_id, brotherhood_entity_id')
          .in('image_entity_id', imageIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    imageIds.length
      ? supabase
          .from('step_image_history')
          .select('image_entity_id, step_entity_id')
          .in('image_entity_id', imageIds)
          .eq('is_current', true)
      : Promise.resolve({ data: [], error: null }),
    publishedIds.length
      ? supabase
          .from('entity_media')
          .select('entity_id, media_asset_id, sort_order, focus_x, focus_y')
          .in('entity_id', publishedIds)
          .eq('is_cover', true)
          .order('sort_order', { ascending: true })
      : Promise.resolve({ data: [], error: null }),
  ])

  const coverRelations = rows(coverRelationResult)
  const mediaIds = [...new Set(coverRelations.map((item) => item.media_asset_id).filter(Boolean))]
  const mediaResult = mediaIds.length
    ? await supabase
        .from('media_assets')
        .select('id, storage_path, media_type, title, alt_text, author_name, source_name, rights_status')
        .in('id', mediaIds)
        .eq('media_type', 'image')
        .in('rights_status', PUBLIC_RIGHTS)
    : { data: [], error: null }
  const mediaById = new Map(rows(mediaResult).map((media) => [media.id, media]))
  const directPhotoByEntity = new Map()

  for (const relation of coverRelations) {
    if (directPhotoByEntity.has(relation.entity_id)) continue
    const media = mediaById.get(relation.media_asset_id)
    if (media?.storage_path) directPhotoByEntity.set(relation.entity_id, { relation, media })
  }

  const directBrotherhoodByImage = new Map()
  for (const row of rows(directImageResult)) {
    if (!directBrotherhoodByImage.has(row.image_entity_id) && row.brotherhood_entity_id) {
      directBrotherhoodByImage.set(row.image_entity_id, row.brotherhood_entity_id)
    }
  }

  const stepByImage = new Map()
  for (const row of rows(imageStepsResult)) {
    if (!stepByImage.has(row.image_entity_id) && row.step_entity_id) {
      stepByImage.set(row.image_entity_id, row.step_entity_id)
    }
  }

  const allStepIds = [...new Set([...stepIds, ...stepByImage.values()].filter(Boolean))]
  const stepBrotherhoodResult = allStepIds.length
    ? await supabase
        .from('brotherhood_steps')
        .select('step_entity_id, brotherhood_entity_id')
        .in('step_entity_id', allStepIds)
        .eq('status', 'published')
    : { data: [], error: null }

  const brotherhoodByStep = new Map()
  for (const row of rows(stepBrotherhoodResult)) {
    if (!brotherhoodByStep.has(row.step_entity_id) && row.brotherhood_entity_id) {
      brotherhoodByStep.set(row.step_entity_id, row.brotherhood_entity_id)
    }
  }

  const inheritedBrotherhoodIds = []
  for (const imageId of imageIds) {
    const inherited = directBrotherhoodByImage.get(imageId) || brotherhoodByStep.get(stepByImage.get(imageId)) || ''
    if (inherited) inheritedBrotherhoodIds.push(inherited)
  }
  for (const stepId of stepIds) {
    const inherited = brotherhoodByStep.get(stepId)
    if (inherited) inheritedBrotherhoodIds.push(inherited)
  }

  const allBrotherhoodIds = [...new Set([...brotherhoodIds, ...inheritedBrotherhoodIds].filter(Boolean))]
  const [brotherhoodResult, brotherhoodEntityResult] = await Promise.all([
    allBrotherhoodIds.length
      ? supabase.from('brotherhoods').select('entity_id, crest_path').in('entity_id', allBrotherhoodIds)
      : Promise.resolve({ data: [], error: null }),
    allBrotherhoodIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug')
          .in('id', allBrotherhoodIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
  ])

  const crestByBrotherhood = new Map(rows(brotherhoodResult).map((row) => [row.entity_id, row.crest_path || '']))
  const brotherhoodEntityById = new Map(rows(brotherhoodEntityResult).map((row) => [row.id, row]))
  const bandById = new Map(rows(bandsResult).map((row) => [row.entity_id, row]))
  const visuals = {}

  for (const entity of entities) {
    const directPhoto = directPhotoByEntity.get(entity.id)

    if (entity.entity_type === 'brotherhood') {
      const crestPath = crestByBrotherhood.get(entity.id) || ''
      if (crestPath) {
        visuals[entity.id] = {
          path: crestPath,
          kind: 'crest',
          alt: `Escudo de ${entity.name}`,
          contextName: entity.name,
          contextHref: hrefFor(entity),
        }
      } else if (directPhoto) {
        visuals[entity.id] = photoVisual(supabase, entity, directPhoto.relation, directPhoto.media)
      }
      continue
    }

    if (entity.entity_type === 'band') {
      const band = bandById.get(entity.id)
      if (band?.hero_image_path) {
        visuals[entity.id] = {
          path: band.hero_image_path,
          kind: 'photo',
          alt: band.hero_image_alt || entity.name,
          contextName: entity.name,
          contextHref: hrefFor(entity),
        }
      } else if (directPhoto) {
        visuals[entity.id] = photoVisual(supabase, entity, directPhoto.relation, directPhoto.media)
      } else if (band?.logo_path) {
        visuals[entity.id] = {
          path: band.logo_path,
          kind: 'logo',
          alt: `Logotipo de ${entity.name}`,
          contextName: entity.name,
          contextHref: hrefFor(entity),
        }
      }
      continue
    }

    if (directPhoto) {
      visuals[entity.id] = photoVisual(supabase, entity, directPhoto.relation, directPhoto.media)
      continue
    }

    const brotherhoodId = entity.entity_type === 'image'
      ? directBrotherhoodByImage.get(entity.id) || brotherhoodByStep.get(stepByImage.get(entity.id)) || ''
      : brotherhoodByStep.get(entity.id) || ''
    const brotherhood = brotherhoodEntityById.get(brotherhoodId)
    const crestPath = crestByBrotherhood.get(brotherhoodId) || ''
    if (crestPath && brotherhood) {
      visuals[entity.id] = {
        path: crestPath,
        kind: 'context-crest',
        alt: `Escudo de ${brotherhood.name}`,
        contextName: brotherhood.name,
        contextHref: `/hermandades/${brotherhood.slug}`,
      }
    }
  }

  return visuals
}

export async function getHomeDirectorySpotlights(supabase, entities = []) {
  const candidates = (entities || []).filter((entity) => VISUAL_TYPES.has(entity.entity_type) && hrefFor(entity))
  if (!candidates.length) return {}

  const visualById = await getHomeVisualsForEntityIds(supabase, candidates.map((entity) => entity.id))
  const groups = {}
  const familyByEntityId = new Map()

  for (const type of ['brotherhood', 'image', 'step', 'band']) {
    groups[type] = candidates
      .filter((entity) => entity.entity_type === type && visualById[entity.id]?.path)
      .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
      .slice(0, 10)

    for (const entity of groups[type]) {
      const visual = visualById[entity.id]
      familyByEntityId.set(entity.id, visual?.contextHref || hrefFor(entity) || `entity:${entity.id}`)
    }
  }

  const selected = selectDiverseHomeSpotlights(groups, familyByEntityId, madridDateKey())
  const spotlights = {}

  for (const [type, entity] of Object.entries(selected)) {
    if (!entity) continue
    spotlights[type] = {
      name: entity.name,
      href: hrefFor(entity),
      visual: visualById[entity.id],
    }
  }

  return spotlights
}
