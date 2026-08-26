import 'server-only'

import { getHomeDiscoveryThreads } from '@/lib/supabase/home'
import { createClient } from '@/lib/supabase/public-server'
import { selectDiverseHomeThreads } from '@/lib/home-discovery-diversity'

const HREF_TYPES = {
  hermandades: 'brotherhood',
  imagenes: 'image',
  pasos: 'step',
  bandas: 'band',
}

function threadRoot(thread) {
  const match = String(thread?.href || '').match(/^\/(hermandades|imagenes|pasos|bandas)\/([^/?#]+)/)
  if (!match) return null
  return {
    entityType: HREF_TYPES[match[1]],
    slug: match[2],
  }
}

function publicStatusLabel(value = '') {
  return value === 'RELACIONADO' ? 'NUEVA RELACIÓN' : value
}

function activityKind(thread) {
  const id = String(thread?.id || '')
  const separator = id.lastIndexOf(':')
  return separator >= 0 ? id.slice(separator + 1) : ''
}

async function publishedRoots(supabase, parsed = []) {
  const slugs = [...new Set(parsed.map((item) => item?.slug).filter(Boolean))]
  const types = [...new Set(parsed.map((item) => item?.entityType).filter(Boolean))]
  if (!slugs.length || !types.length) return []

  const result = await supabase
    .from('entities')
    .select('id, entity_type, slug')
    .in('slug', slugs)
    .in('entity_type', types)
    .eq('status', 'published')
  if (result.error) throw result.error
  return result.data || []
}

async function brotherhoodFamilyMaps(supabase, roots = []) {
  const imageIds = roots.filter((item) => item.entity_type === 'image').map((item) => item.id)
  const rootStepIds = roots.filter((item) => item.entity_type === 'step').map((item) => item.id)

  const [directImagesResult, imageStepsResult] = await Promise.all([
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
          .select('image_entity_id, step_entity_id, is_current')
          .in('image_entity_id', imageIds)
          .eq('is_current', true)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (directImagesResult.error) throw directImagesResult.error
  if (imageStepsResult.error) throw imageStepsResult.error

  const imageStepRows = imageStepsResult.data || []
  const linkedStepIds = imageStepRows.map((item) => item.step_entity_id).filter(Boolean)
  const stepIds = [...new Set([...rootStepIds, ...linkedStepIds])]
  const stepsResult = stepIds.length
    ? await supabase
        .from('brotherhood_steps')
        .select('step_entity_id, brotherhood_entity_id')
        .in('step_entity_id', stepIds)
        .eq('status', 'published')
    : { data: [], error: null }

  if (stepsResult.error) throw stepsResult.error

  const stepFamilies = new Map()
  for (const row of stepsResult.data || []) {
    if (!stepFamilies.has(row.step_entity_id) && row.brotherhood_entity_id) {
      stepFamilies.set(row.step_entity_id, row.brotherhood_entity_id)
    }
  }

  const imageFamilies = new Map()
  for (const row of directImagesResult.data || []) {
    if (!imageFamilies.has(row.image_entity_id) && row.brotherhood_entity_id) {
      imageFamilies.set(row.image_entity_id, row.brotherhood_entity_id)
    }
  }

  // Algunas imágenes no se vinculan directamente a una Hermandad, sino a un
  // paso procesional. En esos casos heredamos el universo de la Hermandad del paso.
  for (const row of imageStepRows) {
    if (imageFamilies.has(row.image_entity_id)) continue
    const brotherhoodId = stepFamilies.get(row.step_entity_id)
    if (brotherhoodId) imageFamilies.set(row.image_entity_id, brotherhoodId)
  }

  return { imageFamilies, stepFamilies }
}

export async function getDiverseHomeDiscoveryThreads(limit = 3) {
  const fetchLimit = Math.max(24, limit * 8)
  const candidates = (await getHomeDiscoveryThreads(fetchLimit)).map((thread) => ({
    ...thread,
    activityKind: activityKind(thread),
    activityStatus: publicStatusLabel(thread.activityStatus),
  }))

  if (candidates.length <= limit) return candidates.slice(0, limit)

  try {
    const supabase = createClient()
    const parsedByThread = new Map(candidates.map((thread) => [thread.id, threadRoot(thread)]))
    const roots = await publishedRoots(supabase, [...parsedByThread.values()].filter(Boolean))
    const rootByKey = new Map(roots.map((root) => [`${root.entity_type}:${root.slug}`, root]))
    const { imageFamilies, stepFamilies } = await brotherhoodFamilyMaps(supabase, roots)
    const familyByThreadId = new Map()

    for (const thread of candidates) {
      const parsed = parsedByThread.get(thread.id)
      if (!parsed) continue
      const root = rootByKey.get(`${parsed.entityType}:${parsed.slug}`)
      if (!root) continue

      let family = `${root.entity_type}:${root.id}`
      if (root.entity_type === 'brotherhood') family = `brotherhood:${root.id}`
      if (root.entity_type === 'image' && imageFamilies.get(root.id)) {
        family = `brotherhood:${imageFamilies.get(root.id)}`
      }
      if (root.entity_type === 'step' && stepFamilies.get(root.id)) {
        family = `brotherhood:${stepFamilies.get(root.id)}`
      }

      familyByThreadId.set(thread.id, family)
    }

    return selectDiverseHomeThreads(candidates, familyByThreadId, limit)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo diversificar Últimos hilos por universo', {
      error: error instanceof Error ? error.message : String(error),
    })
    return candidates.slice(0, limit)
  }
}
