import 'server-only'

import { unstable_cache } from 'next/cache'
import { getUpcomingExtraordinaryOutings } from '@/lib/supabase/home'
import { getDiverseHomeDiscoveryThreads } from '@/lib/supabase/home-discovery-diverse'
import { getHomeExploreStats } from '@/lib/supabase/home-v2'
import { getTodayHomeContentV2 } from '@/lib/supabase/home-effective-editorial'
import { getOutingBriefing } from '@/lib/supabase/outing-briefing'

async function loadHomeSnapshot() {
  const [
    todayContent,
    extraordinaryOutings,
    discoveryThreads,
    exploreStats,
  ] = await Promise.all([
    getTodayHomeContentV2(),
    getUpcomingExtraordinaryOutings(5),
    getDiverseHomeDiscoveryThreads(3),
    getHomeExploreStats(),
  ])

  const featuredExtraordinary = extraordinaryOutings[0] || null
  const featuredBriefing = featuredExtraordinary
    ? await getOutingBriefing(featuredExtraordinary.id, featuredExtraordinary.date)
    : { schedule: [], bands: [], liturgicalMusic: [], places: [] }

  return {
    todayContent,
    extraordinaryOutings,
    featuredBriefing,
    discoveryThreads,
    exploreStats,
  }
}

const getCachedHomeSnapshot = unstable_cache(
  loadHomeSnapshot,
  ['hilo-cofrade-home-public-snapshot-v1'],
  {
    revalidate: 60,
    tags: ['home-public'],
  }
)

export async function getHomeSnapshot() {
  return getCachedHomeSnapshot()
}
