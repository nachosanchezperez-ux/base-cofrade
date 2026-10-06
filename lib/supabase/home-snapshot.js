import 'server-only'

import { unstable_cache } from 'next/cache'
import { getDiverseHomeDiscoveryThreads } from '@/lib/supabase/home-discovery-diverse'
import { getHomeExploreStats } from '@/lib/supabase/home-v2'
import { getTodayHomeContentVisual } from '@/lib/supabase/home-effective-visual'
import { getHomeUpcomingAgendaCandidates } from '@/lib/supabase/home-upcoming-agenda'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { buildHomeTemporalAgenda } from '@/lib/home-temporal-agenda'
import { enrichHomeDiscoveryThreadsVisual } from '@/lib/supabase/home-thread-visual'
import { getOutingBriefing } from '@/lib/supabase/outing-briefing'
import { selectHomeUpcomingAgenda } from '@/lib/home-upcoming-selection'
import { madridDateKey } from '@/lib/home-clock'
import { getHomeEditorialFocus } from '@/lib/home-editorial-focus'

function todayCardFromThread(thread) {
  if (!thread?.title || !thread?.summary || !thread?.href) return null

  return {
    id: `today:${thread.id}`,
    kind: 'discovery',
    label: 'Hilo para descubrir',
    kicker: Array.isArray(thread.path) ? thread.path.join(' → ') : '',
    title: thread.title,
    summary: thread.summary,
    href: thread.href,
    linkLabel: thread.cta || 'Seguir el hilo →',
    visual: thread.visual || null,
  }
}

async function loadHomeData() {
  const [
    todayContent,
    upcomingAgendaCandidates,
    rawDiscoveryThreads,
    exploreStats,
  ] = await Promise.all([
    getTodayHomeContentVisual(),
    getHomeUpcomingAgendaCandidates(12),
    getDiverseHomeDiscoveryThreads(4),
    getHomeExploreStats({ throwOnError: true }),
  ])

  const enrichedDiscoveryThreads = await enrichHomeDiscoveryThreadsVisual(rawDiscoveryThreads)
  const discoveryThreads = enrichedDiscoveryThreads.slice(0, 3)
  const discoverySecondary = todayCardFromThread(enrichedDiscoveryThreads[3])

  return {
    todayContent: discoverySecondary
      ? { ...todayContent, discoverySecondary }
      : todayContent,
    upcomingAgendaCandidates,
    discoveryThreads,
    exploreStats,
  }
}

const getCachedHomeData = unstable_cache(
  loadHomeData,
  ['hilo-cofrade-home-public-data-v22'],
  {
    revalidate: 60,
    tags: ['home-public'],
  }
)

const getCachedFeaturedBriefing = unstable_cache(
  getOutingBriefing,
  ['hilo-cofrade-home-briefing-v1'],
  { revalidate: 60, tags: ['home-public'] }
)

export async function getHomeSnapshot(now = new Date()) {
  // El día forma parte de la clave: la primera visita de mañana no recibe
  // selecciones editoriales ni candidatos de ayer por stale-while-revalidate.
  const [data, agendaData] = await Promise.all([
    getCachedHomeData(madridDateKey(now)),
    getAgendaCofrade(now).catch((error) => {
      console.error('[Hilo Cofrade] Agenda temporal omitida de la Home', {
        error: error instanceof Error ? error.message : String(error),
      })
      return { today: madridDateKey(now), items: [] }
    }),
  ])
  const upcomingAgendaCandidates = selectHomeUpcomingAgenda(data.upcomingAgendaCandidates, 12, now)
  const homeTemporal = buildHomeTemporalAgenda({ items: agendaData.items, today: agendaData.today, now })
  const liveFeaturedOuting = upcomingAgendaCandidates.find((item) => item.liveState?.state === 'live') || null
  const editorialFocus = liveFeaturedOuting
    ? null
    : getHomeEditorialFocus(upcomingAgendaCandidates, agendaData.today)
  const featuredOuting = liveFeaturedOuting || editorialFocus?.outing || null
  const upcomingAgenda = editorialFocus
    ? [editorialFocus.outing, ...upcomingAgendaCandidates.filter((item) => item.id !== editorialFocus.outing.id)].slice(0, 6)
    : upcomingAgendaCandidates.slice(0, 6)
  const featuredBriefing = featuredOuting
    ? await getCachedFeaturedBriefing(featuredOuting.id, featuredOuting.date)
    : { schedule: [], bands: [], liturgicalMusic: [], places: [] }

  return {
    todayContent: data.todayContent,
    discoveryThreads: data.discoveryThreads,
    exploreStats: data.exploreStats,
    upcomingAgenda,
    homeTemporal,
    featuredBriefing,
    editorialFeaturedOutingId: editorialFocus?.outing?.id || '',
  }
}
