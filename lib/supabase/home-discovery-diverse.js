import 'server-only'

import { getHomeDiscoveryThreads } from '@/lib/supabase/home'
import { createClient } from '@/lib/supabase/server'
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
  const stepIds = roots.filter((item) => item.entity_type === 'step').map((item) => item.id)

  const [imagesResult, stepsResult] = await Promise.all([
    imageIds.length
      ? supabase
          .from('brotherhood_images')
          .select('image_entity_id, brotherhood_entity_id')
          .in('image_entity_id', imageIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('brotherhood_steps')
          .select('step_entity_id, brotherhood_entity_id')
          .in('step_entity_id', stepIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
  ])

  if (imagesResult.error) throw imagesResult.error
  if (stepsResult.error) throw stepsResult.error

  const imageFamilies = new Map()
  for (const row of imagesResult.data || []) {
    if (!imageFamilies.has(row.image_entity_id) && row.brotherhood_entity_id) {
      imageFamilies.set(row.image_entity_id, row.brotherhood_entity_id)
    }
  }

  const stepFamilies = new Map()
  for (const row of stepsResult.data || []) {
    if (!stepFamilies.has(row.step_entity_id) && row.brotherhood_entity_id) {
      stepFamilies.set(row.step_entity_id, row.brotherhood_entity_id)
    }
  }

  return { imageFamilies, stepFamilies }
}

export async function getDiverseHomeDiscoveryThreads(limit = 3) {
  const fetchLimit = Math.max(12, limit * 5)
  const candidates = (await getHomeDiscoveryThreads(fetchLimit)).map((thread) => ({
    ...thread,
    activityStatus: publicStatusLabel(thread.activityStatus),
  }))

  if (candidates.length <= limit) return candidates.slice(0, limit)

  try {
    const supabase = await createClient()
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
