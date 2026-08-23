import 'server-only'

import { unstable_cache } from 'next/cache'
import { getUpcomingExtraordinaryOutings } from '@/lib/supabase/home'
import { getDiverseHomeDiscoveryThreads } from '@/lib/supabase/home-discovery-diverse'
import { getHomeExploreStats } from '@/lib/supabase/home-v2'
import { getTodayHomeContentVisual } from '@/lib/supabase/home-effective-visual'
import { enrichHomeDiscoveryThreadsVisual } from '@/lib/supabase/home-thread-visual'
import { getOutingBriefing } from '@/lib/supabase/outing-briefing'

async function loadHomeSnapshot() {
  const [
    todayContent,
    extraordinaryOutings,
    rawDiscoveryThreads,
    exploreStats,
  ] = await Promise.all([
    getTodayHomeContentVisual(),
    getUpcomingExtraordinaryOutings(5),
    getDiverseHomeDiscoveryThreads(3),
    getHomeExploreStats(),
  ])

  const featuredExtraordinary = extraordinaryOutings[0] || null
  const [featuredBriefing, discoveryThreads] = await Promise.all([
    featuredExtraordinary
      ? getOutingBriefing(featuredExtraordinary.id, featuredExtraordinary.date)
      : Promise.resolve({ schedule: [], bands: [], liturgicalMusic: [], places: [] }),
    enrichHomeDiscoveryThreadsVisual(rawDiscoveryThreads),
  ])

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
  ['hilo-cofrade-home-public-snapshot-v6'],
  {
    revalidate: 60,
    tags: ['home-public'],
  }
)

export async function getHomeSnapshot() {
  return getCachedHomeSnapshot()
}
