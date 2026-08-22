import 'server-only'

import { unstable_cache } from 'next/cache'
import { getUpcomingExtraordinaryOutings } from '@/lib/supabase/home'
import { getDiverseHomeDiscoveryThreads } from '@/lib/supabase/home-discovery-diverse'
import { enrichHomeExploreStats } from '@/lib/supabase/home-explore-visual'
import { getHomeExploreStats } from '@/lib/supabase/home-v2'
import { getTodayHomeContentV2 } from '@/lib/supabase/home-effective-editorial'
import {
  getHomeVisualMediaForHrefs,
  getHomeVisualMediaMap,
  homeVisualRouteKey,
} from '@/lib/supabase/home-visual-media'
import { getOutingBriefing } from '@/lib/supabase/outing-briefing'

function withVisual(card, visualByEntity) {
  if (!card?.rootEntityId) return card
  const media = visualByEntity.get(card.rootEntityId)
  return media ? { ...card, media } : card
}

async function loadHomeSnapshot() {
  const [
    todayContent,
    extraordinaryOutings,
    discoveryThreads,
    rawExploreStats,
  ] = await Promise.all([
    getTodayHomeContentV2(),
    getUpcomingExtraordinaryOutings(5),
    getDiverseHomeDiscoveryThreads(3),
    getHomeExploreStats(),
  ])

  const featuredExtraordinary = extraordinaryOutings[0] || null
  const todayRootIds = [
    todayContent?.ephemeris?.rootEntityId,
    todayContent?.editorial?.rootEntityId,
    todayContent?.discovery?.rootEntityId,
  ].filter(Boolean)
  const threadHrefs = discoveryThreads.map((thread) => thread.href).filter(Boolean)

  const [
    featuredBriefing,
    todayVisualByEntity,
    threadVisualByRoute,
    exploreStats,
  ] = await Promise.all([
    featuredExtraordinary
      ? getOutingBriefing(featuredExtraordinary.id, featuredExtraordinary.date)
      : { schedule: [], bands: [], liturgicalMusic: [], places: [] },
    getHomeVisualMediaMap(todayRootIds),
    getHomeVisualMediaForHrefs(threadHrefs),
    enrichHomeExploreStats(rawExploreStats),
  ])

  const visualTodayContent = {
    ...todayContent,
    ephemeris: withVisual(todayContent?.ephemeris, todayVisualByEntity),
    editorial: withVisual(todayContent?.editorial, todayVisualByEntity),
    discovery: withVisual(todayContent?.discovery, todayVisualByEntity),
  }
  const visualDiscoveryThreads = discoveryThreads.map((thread) => {
    const media = threadVisualByRoute.get(homeVisualRouteKey(thread.href))
    return media ? { ...thread, media } : thread
  })

  return {
    todayContent: visualTodayContent,
    extraordinaryOutings,
    featuredBriefing,
    discoveryThreads: visualDiscoveryThreads,
    exploreStats,
  }
}

const getCachedHomeSnapshot = unstable_cache(
  loadHomeSnapshot,
  ['hilo-cofrade-home-public-snapshot-v2'],
  {
    revalidate: 60,
    tags: ['home-public'],
  }
)

export async function getHomeSnapshot() {
  return getCachedHomeSnapshot()
}
