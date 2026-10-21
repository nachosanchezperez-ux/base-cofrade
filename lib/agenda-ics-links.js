import { SITE_URL } from './seo.js'

// Enlaces de suscripción a un calendario .ics publicado en Hilo Cofrade.
// `path` es la ruta del calendario (/calendario/hermandad/<slug>.ics).
export function calendarSubscribeLinks(path = '') {
  const value = String(path || '').trim()
  if (!/^\/calendario\/(?:(?:hermandad|localidad)\/[a-z0-9-]+|mis-hermandades\/[a-z0-9-]+(?:~[a-z0-9-]+)*)\.ics$/.test(value)) return null
  const https = new URL(value, SITE_URL).toString()
  const webcal = https.replace(/^https:/, 'webcal:')
  return {
    https,
    webcal,
    google: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`,
  }
}

export function brotherhoodCalendarPath(slug = '') {
  const value = String(slug || '').trim()
  return /^[a-z0-9-]+$/.test(value) ? `/calendario/hermandad/${value}.ics` : ''
}

// «Mis hermandades» (#agenda-mi-agenda): un único calendario con todas las que
// sigues. La lista va en la ruta (no en la query), que algunos calendarios
// descartan; ordenada para que la misma selección dé la misma URL.
export const FOLLOWED_CALENDAR_MAX = 40

export function followedCalendarPath(slugs = []) {
  const clean = [...new Set((Array.isArray(slugs) ? slugs : []).map((slug) => String(slug || '').trim()).filter((slug) => /^[a-z0-9-]+$/.test(slug)))]
    .sort()
    .slice(0, FOLLOWED_CALENDAR_MAX)
  return clean.length ? `/calendario/mis-hermandades/${clean.join('~')}.ics` : ''
}

export function followedCalendarSlugs(segment = '') {
  return [...new Set(String(segment || '').replace(/\.ics$/i, '').split('~').filter((slug) => /^[a-z0-9-]+$/.test(slug)))].slice(0, FOLLOWED_CALENDAR_MAX)
}

export function localityCalendarPath(slug = '') {
  const value = String(slug || '').trim()
  return /^[a-z0-9-]+$/.test(value) ? `/calendario/localidad/${value}.ics` : ''
}
