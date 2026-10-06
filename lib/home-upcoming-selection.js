import { compareProcessionLiveItems, withProcessionLiveState } from './procession-live-status.js'

// Las fechas/horas se guardan como datos; nunca persistimos la decisión «en curso».
export function selectHomeUpcomingAgenda(items = [], limit = 5, now = new Date()) {
  return items
    .filter((item) => item.date && !item.isCancelled && item.eventStatus !== 'held')
    .map((item) => withProcessionLiveState(item, now))
    .filter((item) => item.liveState.state !== 'done')
    .sort(compareProcessionLiveItems)
    .slice(0, limit)
}
