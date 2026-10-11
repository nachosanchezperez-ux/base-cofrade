import 'server-only'

import { unstable_cache } from 'next/cache'
import { buildPlatformUpdates, platformUpdateDateLabel, PLATFORM_UPDATES_LIMIT } from '@/lib/platform-updates'
import { presentMusicalRepertoireIdentity } from '@/lib/musical-repertoires/presentation'
import { getHomeDiscoveryThreads } from '@/lib/supabase/home'
import { getMusicChangesForYear } from '@/lib/supabase/music-changes'
import { createPublicClient } from '@/lib/supabase/public'

function publicRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

async function getRecentPublicRepertoires() {
  const supabase = createPublicClient()
  const repertoires = publicRows(await supabase
    .from('musical_repertoires')
    .select('id, slug, title, outing_id, band_entity_id, status, created_at')
    .eq('status', 'published')
    .eq('repertoire_kind', 'performed')
    .order('created_at', { ascending: false })
    .limit(PLATFORM_UPDATES_LIMIT),
  'No se pudieron consultar las nuevas crucetas')
  if (!repertoires.length) return []

  const outings = publicRows(await supabase
    .from('outings')
    .select('id, title, outing_type, outing_date, year, brotherhood_entity_id')
    .in('id', unique(repertoires.map((row) => row.outing_id)))
    .eq('status', 'published'),
  'No se pudieron consultar las procesiones de las nuevas crucetas')
  const brotherhoodIds = unique(outings.map((row) => row.brotherhood_entity_id))
  const entityIds = unique([...brotherhoodIds, ...repertoires.map((row) => row.band_entity_id)])
  const [entitiesResult, profilesResult] = await Promise.all([
    supabase.from('entities').select('id, name, entity_type').in('id', entityIds).eq('status', 'published'),
    brotherhoodIds.length
      ? supabase.from('brotherhoods').select('entity_id, popular_name').in('entity_id', brotherhoodIds)
      : Promise.resolve({ data: [], error: null }),
  ])
  const entities = publicRows(entitiesResult, 'No se pudieron consultar las entidades de las nuevas crucetas')
  const profiles = publicRows(profilesResult, 'No se pudieron consultar los nombres de Hermandad de las nuevas crucetas')
  const outingById = new Map(outings.map((row) => [row.id, row]))
  const entityById = new Map(entities.map((row) => [row.id, row]))
  const profileById = new Map(profiles.map((row) => [row.entity_id, row]))

  return repertoires.flatMap((repertoire) => {
    const outing = outingById.get(repertoire.outing_id)
    const band = entityById.get(repertoire.band_entity_id)
    if (!outing || band?.entity_type !== 'band') return []
    const brotherhood = entityById.get(outing.brotherhood_entity_id)
    const identity = presentMusicalRepertoireIdentity({
      brotherhoodName: brotherhood
        ? profileById.get(brotherhood.id)?.popular_name || brotherhood.name
        : '',
      outingTitle: outing.title,
      outingType: outing.outing_type,
      outingDate: outing.outing_date,
      year: outing.year || Number(String(outing.outing_date || '').slice(0, 4)) || null,
    })
    return [{
      id: repertoire.id,
      slug: repertoire.slug,
      status: repertoire.status,
      displayTitle: brotherhood ? identity.title : repertoire.title || identity.title,
      bandName: band.name,
      bandEntityId: band.id,
      brotherhoodEntityId: brotherhood?.id || '',
      outingId: outing.id,
      createdAt: repertoire.created_at,
    }]
  })
}

async function loadPublicPlatformUpdates() {
  // All sources are public reads. Reject partial snapshots so a transient
  // failure cannot replace the last successful feed with an empty result.
  const [discoveryThreads, musicChanges, repertoires] = await Promise.all([
    getHomeDiscoveryThreads(24, { throwOnError: true }),
    getMusicChangesForYear(2027, { throwOnError: true }),
    getRecentPublicRepertoires(),
  ])
  return buildPlatformUpdates({ discoveryThreads, musicChanges, repertoires })
}

const getCachedPublicPlatformUpdates = unstable_cache(
  loadPublicPlatformUpdates,
  ['hilo-cofrade-platform-updates-v1'],
  { revalidate: 60, tags: ['public-platform-updates'] },
)

export async function getPublicPlatformUpdates(limit = PLATFORM_UPDATES_LIMIT) {
  const target = Math.min(PLATFORM_UPDATES_LIMIT, Math.max(0, Number(limit) || 0))
  if (!target) return []
  const now = new Date()
  return (await getCachedPublicPlatformUpdates()).slice(0, target).map((update) => ({
    ...update,
    dateLabel: platformUpdateDateLabel(update.dateTime, now),
  }))
}
