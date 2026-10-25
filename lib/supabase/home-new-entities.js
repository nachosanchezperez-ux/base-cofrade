import 'server-only'

import { createClient } from '@/lib/supabase/public-server'

// Fichas nuevas de Hermandades y bandas para «Últimos hilos incorporados».
// El feed de novedades no las recoge (isEditorialHomeThread descarta
// entity_new); aquí solo entran estos dos tipos, de los últimos días, y cada
// Hermandad con sus titulares para anunciarla en una sola línea.
const NEW_ENTITY_DAYS = 14
const ROUTES = { brotherhood: 'hermandades', band: 'bandas' }

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getRecentNewEntities({ days = NEW_ENTITY_DAYS, limit = 24 } = {}) {
  const supabase = createClient()
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const threads = rows(await supabase
    .from('home_knowledge_threads')
    .select('root_entity_id, root_type, root_name, root_slug, latest_at')
    .eq('activity_kind', 'entity_new')
    .in('root_type', Object.keys(ROUTES))
    .gte('latest_at', since)
    .order('latest_at', { ascending: false })
    .limit(limit),
  'No se pudieron consultar las fichas nuevas')
  if (!threads.length) return []

  const brotherhoodIds = threads.filter((row) => row.root_type === 'brotherhood').map((row) => row.root_entity_id)
  const links = brotherhoodIds.length
    ? rows(await supabase
      .from('brotherhood_images')
      .select('brotherhood_entity_id, image_entity_id, relation_type')
      .in('brotherhood_entity_id', brotherhoodIds)
      .eq('status', 'published'),
    'No se pudieron consultar los titulares de las fichas nuevas')
      .filter((row) => String(row.relation_type || '').toLowerCase() === 'titular')
    : []
  const imageIds = [...new Set(links.map((row) => row.image_entity_id))]
  const images = imageIds.length
    ? rows(await supabase.from('entities').select('id, name').in('id', imageIds).eq('status', 'published'),
      'No se pudieron consultar los nombres de los titulares')
    : []
  const imageName = new Map(images.map((row) => [row.id, row.name]))

  return threads.flatMap((row) => {
    if (!row.root_slug || !row.root_name) return []
    const titularLinks = links.filter((link) => link.brotherhood_entity_id === row.root_entity_id && imageName.has(link.image_entity_id))
    return [{
      id: `new:${row.root_type}:${row.root_entity_id}`,
      entityType: row.root_type,
      rootEntityId: row.root_entity_id,
      title: row.root_name,
      href: `/${ROUTES[row.root_type]}/${row.root_slug}`,
      dateTime: row.latest_at,
      titulares: titularLinks.map((link) => imageName.get(link.image_entity_id)),
      // Las novedades de sus titulares no se anuncian aparte.
      relatedIds: titularLinks.map((link) => link.image_entity_id),
    }]
  })
}
