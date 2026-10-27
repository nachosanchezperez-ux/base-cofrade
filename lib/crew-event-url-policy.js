import { preservedCrewEventPaths } from './crew-event-preserved-paths.js'

export const CREW_EVENT_CALENDAR_PATH = '/igualas-y-ensayos'

export function crewEventAnchor(slug = '') {
  return `convocatoria-${String(slug).replace(/[^a-zA-Z0-9_-]/g, '-')}`
}

export function isPreservedCrewEventPath(value) {
  const path = new URL(value, 'https://hilocofrade.es').pathname.replace(/\/$/, '')
  return preservedCrewEventPaths.has(path)
}

// Each igualá or rehearsal is a dated, one-off convocatoria: only the pages
// that already existed keep a URL; every other one points to its card in the
// shared calendar.
export function crewEventDetailHref(slug = '') {
  if (!slug) return ''
  const path = `${CREW_EVENT_CALENDAR_PATH}/${slug}`
  return isPreservedCrewEventPath(path)
    ? path
    : `${CREW_EVENT_CALENDAR_PATH}#${crewEventAnchor(slug)}`
}

export function hasCrewEventPage(href = '') {
  return String(href).startsWith(`${CREW_EVENT_CALENDAR_PATH}/`)
}

// Las fichas conservadas de convocatorias ya celebradas dejan de ofrecerse a
// Google (noindex, follow y fuera del sitemap): siguen abiertas para quien tenga
// el enlace, pero no gastan rastreo en una cita pasada (27/10/2026).
export function isIndexableCrewEventPage(event = {}) {
  return hasCrewEventPage(event.detailHref) && !event.isPast
}
