import 'server-only'
import { unstable_cache } from 'next/cache'
import { HILO_MOVEMENTS } from '@/lib/hilo-movements-data'
import { buildHiloMovements } from '@/lib/hilo-movements'
import { createPublicClient } from '@/lib/supabase/public'
import { getPublishedBrotherhoodCrestPath } from '@/lib/supabase/brotherhood-public-authority'

async function loadVisibleEntities() {
  const ids = [...new Set(HILO_MOVEMENTS.filter((item) => item.status === 'published').flatMap((item) => [item.brotherhood.id, ...item.relations.map((relation) => relation.id)]))]
  if (!ids.length) return { entities: [], crests: {} }
  const { data, error } = await createPublicClient().from('entities').select('id, slug, entity_type, status').in('id', ids).eq('status', 'published')
  if (error) throw new Error('No se pudieron consultar los protagonistas de El Hilo se mueve')
  const entities = data || []
  const roots = entities.filter((entity) => entity.entity_type === 'brotherhood')
  const paths = await Promise.all(roots.map((root) => getPublishedBrotherhoodCrestPath(root.id)))
  return { entities, crests: Object.fromEntries(roots.map((root, index) => [root.id, paths[index] || ''])) }
}

// Reuses the public invalidation channel, never a privileged client.
const getVisibleEntities = unstable_cache(loadVisibleEntities, ['hilo-editorial-movements-v1'], { revalidate: 60, tags: ['public-platform-updates'] })

export async function getPublicHiloMovements() {
  const { entities, crests } = await getVisibleEntities()
  // Date gates are outside the data cache. A refresh does not date a story.
  return buildHiloMovements(HILO_MOVEMENTS, entities).map((item) => ({ ...item, crestPath: crests[item.brotherhood.id] || '' }))
}
