import { compareProcessionLiveItems, withProcessionLiveState } from './procession-live-status.js'

export const HOME_UPCOMING_AGENDA_LIMIT = 6
export const HOME_BRIEFING_PREFETCH_LIMIT = 4

export const EMPTY_HOME_BRIEFING = { schedule: [], bands: [], liturgicalMusic: [], places: [] }

// Citas cuyo briefing se guarda junto al snapshot: las de hoy y las que ya están
// en curso. Solo ellas pueden pasar a "En curso" mientras la caché sigue vigente.
export function selectBriefingCandidates(pool = [], today = '') {
  return (Array.isArray(pool) ? pool : [])
    .filter((item) => item?.id && (
      (today && item.date === today)
      || item.liveState?.state === 'live'
      || item.liveState?.state === 'today'
    ))
    .slice(0, HOME_BRIEFING_PREFETCH_LIMIT)
}

// La portada guarda en caché varios minutos lo que cuesta pedir a la base de
// datos, pero "En curso" depende de la hora. Esta función se aplica en cada
// petición, con la hora actual, sobre el snapshot ya cacheado: recalcula el
// estado de cada cita, descarta las que han terminado, reordena y elige el
// briefing de la cita en curso. No hace ninguna lectura a la base de datos.
//
// Un snapshot sin `agendaPool` (generado por una versión anterior) se devuelve
// tal cual para no romper la portada.
export function refreshHomeLive(snapshot, now = new Date()) {
  if (!snapshot || !Array.isArray(snapshot.agendaPool)) return snapshot

  const pool = snapshot.agendaPool
    .map((item) => withProcessionLiveState(item, now))
    .filter((item) => item.liveState.state !== 'done')
    .sort(compareProcessionLiveItems)

  const featuredOuting = pool.find((item) => item.liveState.state === 'live') || null
  const briefings = snapshot.briefingsByOutingId || {}

  const editorialHighlights = (Array.isArray(snapshot.editorialHighlights) ? snapshot.editorialHighlights : [])
    .map((highlight) => ({ ...highlight, outing: withProcessionLiveState(highlight.outing, now) }))
    .filter((highlight) => highlight.outing.liveState.state !== 'done')

  return {
    ...snapshot,
    upcomingAgenda: pool.slice(0, HOME_UPCOMING_AGENDA_LIMIT),
    featuredBriefing: (featuredOuting && briefings[featuredOuting.id]) || EMPTY_HOME_BRIEFING,
    editorialHighlights,
  }
}
