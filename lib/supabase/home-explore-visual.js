import 'server-only'

import { createClient } from '@/lib/supabase/public-server'
import { getHomeVisualMediaMap } from '@/lib/supabase/home-visual-media'

const DIRECTORY_TYPES = ['brotherhood', 'image', 'step', 'band']

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

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

function stableIndex(key, length) {
  if (!length) return 0
  const hash = [...key].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 7)
  return hash % length
}

export async function enrichHomeExploreStats(stats) {
  if (!stats?.directories?.length) return stats

  try {
    const supabase = createClient()
    const entities = assertRows(
      await supabase
        .from('entities')
        .select('id, entity_type, name, slug')
        .in('entity_type', DIRECTORY_TYPES)
        .eq('status', 'published')
        .not('slug', 'is', null)
        .order('name'),
      'No se pudieron consultar las muestras visuales de Explorar'
    )

    const visualByEntity = await getHomeVisualMediaMap(entities.map((entity) => entity.id))
    const today = madridDateKey()
    const sampleByType = new Map()

    for (const type of DIRECTORY_TYPES) {
      const candidates = entities
        .filter((entity) => entity.entity_type === type && visualByEntity.has(entity.id))
        .map((entity) => ({ entity, visual: visualByEntity.get(entity.id) }))
      if (!candidates.length) continue
      sampleByType.set(type, candidates[stableIndex(`${today}:home-explore:${type}`, candidates.length)])
    }

    return {
      ...stats,
      directories: stats.directories.map((item) => {
        const sample = sampleByType.get(item.key)
        if (!sample) return item
        return {
          ...item,
          sample: {
            name: sample.entity.name,
            href: sample.visual.href || item.href,
            media: sample.visual,
          },
        }
      }),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron enriquecer visualmente los accesos de Explorar', {
      error: error instanceof Error ? error.message : String(error),
    })
    return stats
  }
}
