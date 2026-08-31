import 'server-only'

import { unstable_cache } from 'next/cache'
import { getDiverseHomeDiscoveryThreads } from '@/lib/supabase/home-discovery-diverse'
import { getHomeExploreStats } from '@/lib/supabase/home-v2'
import { getTodayHomeContentVisual } from '@/lib/supabase/home-effective-visual'
import { getHomeUpcomingAgenda } from '@/lib/supabase/home-upcoming-agenda'
import { enrichHomeDiscoveryThreadsVisual } from '@/lib/supabase/home-thread-visual'
import { getOutingBriefing } from '@/lib/supabase/outing-briefing'

function todayCardFromThread(thread) {
  if (!thread?.title || !thread?.summary || !thread?.href) return null

  return {
    id: `today:${thread.id}`,
    kind: 'discovery',
    icon: 'HI',
    label: 'Hilo para descubrir',
    kicker: Array.isArray(thread.path) ? thread.path.join(' → ') : '',
    title: thread.title,
    summary: thread.summary,
    href: thread.href,
    linkLabel: thread.cta || 'Seguir el hilo →',
    visual: thread.visual || null,
  }
}

async function loadHomeSnapshot() {
  const [
    todayContent,
    upcomingAgenda,
    rawDiscoveryThreads,
    exploreStats,
  ] = await Promise.all([
    getTodayHomeContentVisual(),
    getHomeUpcomingAgenda(6),
    getDiverseHomeDiscoveryThreads(4),
    getHomeExploreStats(),
  ])

  const featuredOuting = upcomingAgenda[0] || null
  const [featuredBriefing, enrichedDiscoveryThreads] = await Promise.all([
    featuredOuting
      ? getOutingBriefing(featuredOuting.id, featuredOuting.date)
      : Promise.resolve({ schedule: [], bands: [], liturgicalMusic: [], places: [] }),
    enrichHomeDiscoveryThreadsVisual(rawDiscoveryThreads),
  ])
  const discoveryThreads = enrichedDiscoveryThreads.slice(0, 3)
  const discoverySecondary = todayCardFromThread(enrichedDiscoveryThreads[3])

  return {
    todayContent: discoverySecondary
      ? { ...todayContent, discoverySecondary }
      : todayContent,
    upcomingAgenda,
    featuredBriefing,
    discoveryThreads,
    exploreStats,
  }
}

const getCachedHomeSnapshot = unstable_cache(
  loadHomeSnapshot,
  ['hilo-cofrade-home-public-snapshot-v12'],
  {
    revalidate: 60,
    tags: ['home-public'],
  }
)

export async function getHomeSnapshot() {
  return getCachedHomeSnapshot()
}
