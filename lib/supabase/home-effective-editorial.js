import 'server-only'

import { createClient } from '@/lib/supabase/public-server'
import { getTodayHomeContentV2 as getBaseTodayHomeContentV2 } from '@/lib/supabase/home-v2'

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

function entityHref(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

export async function getTodayHomeContentV2() {
  const base = await getBaseTodayHomeContentV2()

  try {
    const supabase = createClient()
    const today = madridDateKey()
    const overrideResult = await supabase
      .from('daily_overrides')
      .select('editorial_content_id')
      .eq('publish_date', today)
      .in('content_type', ['fact', 'curiosity'])
      .eq('status', 'published')
      .not('editorial_content_id', 'is', null)
      .order('sort_order')
      .limit(1)
      .maybeSingle()

    if (overrideResult.error || !overrideResult.data?.editorial_content_id) return base

    const contentResult = await supabase
      .from('editorial_content')
      .select('id, content_type, title, summary, status')
      .eq('id', overrideResult.data.editorial_content_id)
      .eq('status', 'published')
      .maybeSingle()
    if (contentResult.error || !contentResult.data) return base

    const content = contentResult.data
    const linksResult = await supabase
      .from('editorial_content_links')
      .select('entity_id, is_primary')
      .eq('editorial_content_id', content.id)
      .order('is_primary', { ascending: false })
      .limit(1)
    if (linksResult.error) return base

    const entityId = linksResult.data?.[0]?.entity_id || null
    let related = null
    if (entityId) {
      const entityResult = await supabase
        .from('entities')
        .select('id, entity_type, name, slug, summary')
        .eq('id', entityId)
        .eq('status', 'published')
        .maybeSingle()
      if (!entityResult.error) related = entityResult.data || null
    }

    const type = content.content_type === 'fact' ? 'fact' : 'curiosity'
    return {
      ...base,
      editorial: {
        id: content.id,
        kind: 'editorial',
        icon: type === 'fact' ? 'DC' : 'CU',
        label: type === 'fact' ? 'Dato Cofrade' : 'Curiosidad',
        title: content.title,
        summary: content.summary || '',
        href: entityHref(related),
        linkLabel: type === 'fact' ? 'Descubrir →' : 'Seguir el hilo →',
        rootEntityId: related?.id || '',
      },
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo resolver el contenido editorial programado desde el Banco', {
      error: error instanceof Error ? error.message : String(error),
    })
    return base
  }
}
