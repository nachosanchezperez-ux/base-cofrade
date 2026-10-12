import 'server-only'

import { unstable_cache } from 'next/cache'
import { getDiverseHomeDiscoveryThreads } from '@/lib/supabase/home-discovery-diverse'
import { getHomeExploreStats } from '@/lib/supabase/home-v2'
import { getTodayHomeContentVisual } from '@/lib/supabase/home-effective-visual'
import { getHomeAgendaCandidates } from '@/lib/supabase/home-upcoming-agenda'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { buildHomeTemporalAgenda } from '@/lib/home-temporal-agenda'
import { enrichHomeDiscoveryThreadsVisual } from '@/lib/supabase/home-thread-visual'
import { getOutingBriefing } from '@/lib/supabase/outing-briefing'
import { getHomeEditorialFocuses } from '@/lib/home-editorial-focus'
import { getPublicPlatformUpdates } from '@/lib/supabase/platform-updates'
import { selectPlatformUpdatesForHome } from '@/lib/platform-updates'

async function getHomeUpdates() {
  try {
    return selectPlatformUpdatesForHome(await getPublicPlatformUpdates(), 4)
  } catch (error) {
    console.error('[Hilo Cofrade] Novedades no disponibles; se conservan los hilos de descubrimiento', {
      error: error instanceof Error ? error.message : String(error),
    })
    return getDiverseHomeDiscoveryThreads(4)
  }
}

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

async function loadHomeSnapshot() {
  const [
    todayContent,
    agendaData,
    rawDiscoveryThreads,
    exploreStats,
  ] = await Promise.all([
    getTodayHomeContentVisual(),
    getAgendaCofrade().catch((error) => {
      console.error('[Hilo Cofrade] Agenda temporal omitida de la Home', {
        error: error instanceof Error ? error.message : String(error),
      })
      return { today: '', items: [] }
    }),
    getHomeUpdates(),
    getHomeExploreStats({ throwOnError: true }),
  ])
  // Después de la Agenda: así reutiliza su caché ya caliente en lugar de lanzar
  // en paralelo una segunda lectura de las mismas fuentes cuando caduca.
  const allAgendaCandidates = await getHomeAgendaCandidates({ extraordinaryLimit: 24 })
  const homeTemporal = buildHomeTemporalAgenda({
    items: agendaData.items,
    today: agendaData.today,
    now: new Date(),
  })

  // Mismo recorte que antes para el resto de la portada; el foco editorial se
  // busca en la lista completa para que no desaparezca fuera de las 12 primeras.
  const upcomingAgendaCandidates = allAgendaCandidates.slice(0, 12)
  const editorialFocuses = getHomeEditorialFocuses(allAgendaCandidates, agendaData.today)
  const highlightedIds = new Set(editorialFocuses.map(({ outing }) => outing.id))
  const editorialHighlights = await Promise.all(editorialFocuses.map(async ({ outing }) => ({
    outing,
    briefing: await getOutingBriefing(outing.id, outing.date),
  })))
  const remainingCandidates = upcomingAgendaCandidates.filter((item) => !highlightedIds.has(item.id))
  const featuredOuting = remainingCandidates.find((item) => item.liveState?.state === 'live') || null
  const upcomingAgenda = remainingCandidates.slice(0, 6)
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
    homeTemporal,
    featuredBriefing,
    editorialFeaturedOutingId: '',
    editorialHighlights,
    discoveryThreads,
    exploreStats,
  }
}

const getCachedHomeSnapshot = unstable_cache(
  loadHomeSnapshot,
  ['hilo-cofrade-home-public-snapshot-v24'],
  {
    revalidate: 60,
    tags: ['home-public'],
  }
)

export async function getHomeSnapshot() {
  return getCachedHomeSnapshot()
}
