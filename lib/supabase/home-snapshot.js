import 'server-only'

import { unstable_cache } from 'next/cache'
import { getDiverseHomeDiscoveryThreads } from '@/lib/supabase/home-discovery-diverse'
import { getHomeExploreStats } from '@/lib/supabase/home-v2'
import { getTodayHomeContentVisual } from '@/lib/supabase/home-effective-visual'
import { getHomeUpcomingAgenda } from '@/lib/supabase/home-upcoming-agenda'
import { enrichHomeDiscoveryThreadsVisual } from '@/lib/supabase/home-thread-visual'
import { getOutingBriefing } from '@/lib/supabase/outing-briefing'

async function loadHomeSnapshot() {
  const [
    todayContent,
    upcomingAgenda,
    rawDiscoveryThreads,
    exploreStats,
  ] = await Promise.all([
    getTodayHomeContentVisual(),
    getHomeUpcomingAgenda(6),
    getDiverseHomeDiscoveryThreads(3),
    getHomeExploreStats(),
  ])

  const featuredOuting = upcomingAgenda[0] || null
  const [featuredBriefing, discoveryThreads] = await Promise.all([
    featuredOuting
      ? getOutingBriefing(featuredOuting.id, featuredOuting.date)
      : Promise.resolve({ schedule: [], bands: [], liturgicalMusic: [], places: [] }),
    enrichHomeDiscoveryThreadsVisual(rawDiscoveryThreads),
  ])

  return {
    todayContent,
    upcomingAgenda,
    featuredBriefing,
    discoveryThreads,
    exploreStats,
  }
}

const getCachedHomeSnapshot = unstable_cache(
  loadHomeSnapshot,
  ['hilo-cofrade-home-public-snapshot-v10'],
  {
    revalidate: 60,
    tags: ['home-public'],
  }
)

export async function getHomeSnapshot() {
  return getCachedHomeSnapshot()
}
