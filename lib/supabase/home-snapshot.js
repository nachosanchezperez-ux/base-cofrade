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
import { getCrewEventDirectory, getPublicMusicChanges2027 } from '@/lib/supabase/public-directory-cache'
import { buildHomePulse, countOfficialSchedules } from '@/lib/home-pulse'
import { getHolyWeekProgramme } from '@/lib/supabase/holy-week-programme'
import { buildHomeCrewCalls, compactCrewEvent } from '@/lib/home-crew-calls'
import { discoveryCopy, threadTopicLabel } from '@/lib/home-discovery-copy'
import { getRecentNewEntities } from '@/lib/supabase/home-new-entities'
import { buildHomeLatestThreads, HOME_LATEST_LIMIT } from '@/lib/home-latest-threads'

// «Últimos hilos incorporados»: el feed de novedades completo más las fichas
// nuevas de Hermandades y bandas. Si una fuente falla, se sigue con la otra.
async function getHomeLatestSources() {
  const [updates, newEntities] = await Promise.all([
    getPublicPlatformUpdates().catch((error) => {
      console.error('[Hilo Cofrade] Novedades no disponibles para Últimos hilos', {
        error: error instanceof Error ? error.message : String(error),
      })
      return []
    }),
    getRecentNewEntities().catch((error) => {
      console.error('[Hilo Cofrade] Fichas nuevas no disponibles para Últimos hilos', {
        error: error instanceof Error ? error.message : String(error),
      })
      return []
    }),
  ])
  return { updates, newEntities }
}

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
  // Mismo criterio que la ficha del día: rótulo con el tema, titular con el dato.
  const copy = discoveryCopy(thread.copySource)

  return {
    id: `today:${thread.id}`,
    kind: 'discovery',
    label: copy?.label || threadTopicLabel(thread.label),
    kicker: Array.isArray(thread.path) ? thread.path.join(' → ') : '',
    title: copy?.title || thread.title,
    summary: copy?.summary || thread.summary,
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

// Igualás y ensayos: reutiliza la caché de /igualas-y-ensayos y guarda solo las
// convocatorias recientes y futuras; si falla, la portada omite el bloque.
async function getHomeCrewEvents() {
  try {
    const recent = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10)
    const upcoming = (await getCrewEventDirectory())
      .filter((item) => item.date && item.date >= recent)
    // Las fechas de todas (no solo de las 40 primeras) para la cifra de la semana.
    return {
      events: upcoming.slice(0, 40).map(compactCrewEvent),
      dates: upcoming.filter((item) => item.eventStatus !== 'cancelled').map((item) => item.date),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] Igualás y ensayos no disponibles en la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    return { events: [], dates: [] }
  }
}

// Cambios de banda de 2027 (misma caché que /semana-santa/2027/cambios-musicales).
// Si falla, la portada omite esa cifra.
// Horarios oficiales de 2027 ya publicados (misma caché que el programa de mano).
async function getHomeOfficialSchedules() {
  try {
    return countOfficialSchedules(await getHolyWeekProgramme())
  } catch (error) {
    console.error('[Hilo Cofrade] Programa de mano 2027 no disponible en la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

async function getHomeMusicChangesCount() {
  try {
    return (await getPublicMusicChanges2027()).length
  } catch (error) {
    console.error('[Hilo Cofrade] Cambios musicales 2027 no disponibles en la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

async function loadHomeSnapshot() {
  const [
    todayContent,
    agendaData,
    rawDiscoveryThreads,
    exploreStats,
    news,
    crewData,
    latestSources,
    musicChangesCount,
    officialSchedules,
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
    getHomeCrewEvents(),
    getHomeLatestSources(),
    getHomeMusicChangesCount(),
    getHomeOfficialSchedules(),
  ])
  const crewEvents = crewData.events
  // Después de la Agenda: así reutiliza su caché ya caliente en lugar de lanzar
  // en paralelo una segunda lectura de las mismas fuentes cuando caduca.
  const [rawAgendaCandidates, featuredFocuses] = await Promise.all([
    getHomeAgendaCandidates({ extraordinaryLimit: 24 }),
    getActiveHomeFeaturedFocuses(agendaData.today),
  ])
  // Las extraordinarias de la Home no traen el enlace de su Hermandad: se toma
  // de la Agenda (ya leída) para que Destacados lleve a la ficha.
  const brotherhoodHrefById = new Map((agendaData.items || [])
    .filter((item) => item.brotherhoodId && item.organizerHref)
    .map((item) => [item.brotherhoodId, item.organizerHref]))
  const allAgendaCandidates = rawAgendaCandidates.map((item) => (
    item.brotherhoodHref || !item.brotherhoodId || !brotherhoodHrefById.has(item.brotherhoodId)
      ? item
      : { ...item, brotherhoodHref: brotherhoodHrefById.get(item.brotherhoodId) }
  ))
  const homeTemporal = buildHomeTemporalAgenda({
    items: agendaData.items,
    today: agendaData.today,
    now: new Date(),
  })

  // Mismo recorte que antes para el resto de la portada; el foco editorial se
  // busca en la lista completa para que no desaparezca fuera de las 12 primeras.
  const upcomingAgendaCandidates = allAgendaCandidates.slice(0, 12)
  const editorialFocuses = getHomeEditorialFocuses(allAgendaCandidates, agendaData.today, featuredFocuses)
  const highlightedIds = new Set(editorialFocuses.flatMap(({ outing, followUps = [] }) => [outing.id, ...followUps.map((item) => item.id)]))
  const editorialHighlights = await Promise.all(editorialFocuses.map(async ({ outing, followUps = [] }) => ({
    outing,
    followUps,
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
    // Una sola lectura de escudos y fotos para el «Hoy» de reserva y los últimos hilos.
    enrichHomeDiscoveryThreadsVisual([
      ...rawDiscoveryThreads,
      ...latestSources.updates.filter((update) => !rawDiscoveryThreads.some((thread) => thread.id === update.id)),
      ...latestSources.newEntities,
    ]),
  ])
  const briefingsByOutingId = Object.fromEntries(briefingEntries)
  const featuredBriefing = (featuredOuting && briefingsByOutingId[featuredOuting.id]) || EMPTY_HOME_BRIEFING
  const enrichedById = new Map(enrichedDiscoveryThreads.map((item) => [item.id, item]))
  const discoveryThreads = buildHomeLatestThreads({
    updates: latestSources.updates.map((update) => enrichedById.get(update.id) || update),
    newEntities: latestSources.newEntities.map((entity) => enrichedById.get(entity.id) || entity),
    limit: HOME_LATEST_LIMIT,
  })
  // La tarjeta de reserva de «Hoy» no repite ninguna ficha de la lista.
  const listedHrefs = new Set(discoveryThreads.flatMap((item) => [item.href, ...(item.links || []).map((link) => link.href)]).filter(Boolean))
  const discoverySecondary = todayCardFromThread(
    rawDiscoveryThreads.map((thread) => enrichedById.get(thread.id) || thread)
      .find((thread) => !listedHrefs.has(thread.href)),
  )

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
    crewEvents,
    crewDates: crewData.dates,
    musicChangesCount,
    officialSchedules,
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
  ['hilo-cofrade-home-public-snapshot-v30-pulso-horarios-2027'],
  {
    revalidate: 300,
    tags: ['home-public'],
  }
)

export async function getHomeSnapshot() {
  const snapshot = await getCachedHomeSnapshot()
  const now = new Date()
  // «Hoy», «Mañana» y lo ya celebrado dependen del día: se calcula en cada petición.
  const refreshed = { ...refreshHomeLive(snapshot, now), crewCalls: buildHomeCrewCalls(snapshot.crewEvents || [], { now }) }
  // Las cifras de «Semana Santa 2027 en datos» dependen del día: se calculan aquí.
  const pulseFor = (agendaData) => buildHomePulse({
    today: agendaData?.today || '',
    nowMs: now.getTime(),
    agendaItems: agendaData?.items || [],
    crewDates: snapshot.crewDates || [],
    musicChanges: snapshot.musicChangesCount,
    schedules: snapshot.officialSchedules,
  })

  // La Agenda tiene su propia caché de 5 minutos: aquí solo se lee. Se rehace el
  // bloque temporal con la hora actual para que "En curso" no llegue desfasado.
  try {
    const agendaData = await getAgendaCofrade()
    return {
      ...refreshed,
      pulse: pulseFor(agendaData),
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
    return { ...refreshed, pulse: [] }
  }
}
