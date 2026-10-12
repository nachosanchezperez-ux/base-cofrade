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
import {
  EMPTY_HOME_BRIEFING,
  HOME_UPCOMING_AGENDA_LIMIT,
  refreshHomeLive,
  selectBriefingCandidates,
} from '@/lib/home-live-refresh'
import { getActiveHomeFeaturedFocuses } from '@/lib/supabase/home-featured-outings'
import { getPublicPlatformUpdates } from '@/lib/supabase/platform-updates'
import { getPublicHiloMovements } from '@/lib/supabase/hilo-movements'
import { buildHomeNews } from '@/lib/home-news'
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

// Titulares de El Hilo se mueve. Reutiliza la caché de la propia sección
// (hilo-editorial-movements-v1); si falla, la portada muestra solo el acceso.
async function getHomeNews() {
  try {
    return buildHomeNews(await getPublicHiloMovements())
  } catch (error) {
    console.error('[Hilo Cofrade] Titulares de El Hilo se mueve no disponibles en la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

async function loadHomeSnapshot() {
  const [
    todayContent,
    agendaData,
    rawDiscoveryThreads,
    exploreStats,
    news,
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
    getHomeNews(),
  ])
  // Después de la Agenda: así reutiliza su caché ya caliente en lugar de lanzar
  // en paralelo una segunda lectura de las mismas fuentes cuando caduca.
  const [allAgendaCandidates, featuredFocuses] = await Promise.all([
    getHomeAgendaCandidates({ extraordinaryLimit: 24 }),
    getActiveHomeFeaturedFocuses(agendaData.today),
  ])
  const homeTemporal = buildHomeTemporalAgenda({
    items: agendaData.items,
    today: agendaData.today,
    now: new Date(),
  })

  // Mismo recorte que antes para el resto de la portada; el foco editorial se
  // busca en la lista completa para que no desaparezca fuera de las 12 primeras.
  const upcomingAgendaCandidates = allAgendaCandidates.slice(0, 12)
  const editorialFocuses = getHomeEditorialFocuses(allAgendaCandidates, agendaData.today, featuredFocuses)
  const highlightedIds = new Set(editorialFocuses.map(({ outing }) => outing.id))
  const editorialHighlights = await Promise.all(editorialFocuses.map(async ({ outing }) => ({
    outing,
    briefing: await getOutingBriefing(outing.id, outing.date),
  })))
  const remainingCandidates = upcomingAgendaCandidates.filter((item) => !highlightedIds.has(item.id))
  const featuredOuting = remainingCandidates.find((item) => item.liveState?.state === 'live') || null
  const upcomingAgenda = remainingCandidates.slice(0, HOME_UPCOMING_AGENDA_LIMIT)
  // La caché dura varios minutos y "En curso" depende de la hora: se guarda el
  // briefing de todas las citas de hoy (no solo de la que ya está en curso) para
  // que getHomeSnapshot pueda elegir la correcta en cada petición sin leer la base.
  const briefingCandidates = selectBriefingCandidates(remainingCandidates, agendaData.today)
  const [briefingEntries, enrichedDiscoveryThreads] = await Promise.all([
    Promise.all(briefingCandidates.map(async (item) => {
      try {
        return [item.id, await getOutingBriefing(item.id, item.date)]
      } catch (error) {
        console.error('[Hilo Cofrade] Briefing de la portada no disponible', {
          outingId: item.id,
          error: error instanceof Error ? error.message : String(error),
        })
        return [item.id, EMPTY_HOME_BRIEFING]
      }
    })),
    enrichHomeDiscoveryThreadsVisual(rawDiscoveryThreads),
  ])
  const briefingsByOutingId = Object.fromEntries(briefingEntries)
  const featuredBriefing = (featuredOuting && briefingsByOutingId[featuredOuting.id]) || EMPTY_HOME_BRIEFING
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
    news,
    // Insumos para refreshHomeLive: citas candidatas y briefings de las de hoy.
    agendaPool: remainingCandidates,
    briefingsByOutingId,
  }
}

// 5 minutos: el contenido cambia desde el Panel, que invalida la etiqueta
// 'home-public' al guardar. Lo que depende de la hora ("En curso") no se cachea:
// se recalcula en cada petición en getHomeSnapshot.
const getCachedHomeSnapshot = unstable_cache(
  loadHomeSnapshot,
  ['hilo-cofrade-home-public-snapshot-v25'],
  {
    revalidate: 300,
    tags: ['home-public'],
  }
)

export async function getHomeSnapshot() {
  const snapshot = await getCachedHomeSnapshot()
  const now = new Date()
  const refreshed = refreshHomeLive(snapshot, now)

  // La Agenda tiene su propia caché de 5 minutos: aquí solo se lee. Se rehace el
  // bloque temporal con la hora actual para que "En curso" no llegue desfasado.
  try {
    const agendaData = await getAgendaCofrade()
    return {
      ...refreshed,
      homeTemporal: buildHomeTemporalAgenda({
        items: agendaData.items,
        today: agendaData.today,
        now,
      }),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] Agenda temporal de la Home sin refrescar; se usa la del snapshot', {
      error: error instanceof Error ? error.message : String(error),
    })
    return refreshed
  }
}
