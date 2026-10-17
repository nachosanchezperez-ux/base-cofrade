import { SITE_URL } from './seo.js'

// Enlaces de suscripción a un calendario .ics publicado en Hilo Cofrade.
// `path` es la ruta del calendario (/calendario/hermandad/<slug>.ics).
export function calendarSubscribeLinks(path = '') {
  const value = String(path || '').trim()
  if (!/^\/calendario\/(?:hermandad|localidad)\/[a-z0-9-]+\.ics$/.test(value)) return null
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

export function localityCalendarPath(slug = '') {
  const value = String(slug || '').trim()
  return /^[a-z0-9-]+$/.test(value) ? `/calendario/localidad/${value}.ics` : ''
}
