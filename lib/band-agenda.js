import { agendaMunicipalityHref } from '@/lib/agenda-relations'

function dateInfo(value = '') {
  if (!value) return { day: '—', month: 'FECHA', year: '' }
  const date = new Date(`${value}T12:00:00`)
  const format = (options) => new Intl.DateTimeFormat('es-ES', { ...options, timeZone: 'Europe/Madrid' }).format(date)
  return {
    day: format({ day: '2-digit' }),
    month: format({ month: 'short' }).replace('.', '').toUpperCase(),
    year: format({ year: 'numeric' }),
  }
}

function normalized(value = '') {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
}

function outingCalendar(item, link = {}) {
  const text = normalized([item.type, link.outingType].filter(Boolean).join(' '))
  if (text.includes('gloria')) return { label: 'Glorias', href: '/procesiones-de-gloria' }
  if (link.character === 'extraordinary' || text.includes('extraordin') || text.includes('traslado')) {
    return { label: 'Extraordinarias', href: '/extraordinarias' }
  }
  if (text.includes('rosario')) return { label: 'Agenda Cofrade', href: '/agenda-cofrade?categoria=rosaries#agenda' }
  return { label: 'Agenda Cofrade', href: '/agenda-cofrade' }
}

function outingHref(item, link = {}) {
  if (!link.outingSlug) return link.brotherhoodSlug ? `/hermandades/${link.brotherhoodSlug}` : ''
  const calendar = outingCalendar(item, link)
  if (calendar.href === '/procesiones-de-gloria') return `/procesiones-de-gloria/${link.outingSlug}`
  if (calendar.href === '/extraordinarias') return `/extraordinarias/${link.outingSlug}`
  return link.brotherhoodSlug ? `/hermandades/${link.brotherhoodSlug}` : calendar.href
}

function compareItems(first, second) {
  return `${first.date || '9999-12-31'}T${first.startTime || '23:59'}`
    .localeCompare(`${second.date || '9999-12-31'}T${second.startTime || '23:59'}`)
}

export function buildBandUpcomingAgenda({ band, outingLinks = {}, concerts = [] } = {}) {
  if (!band?.id) return []

  const outings = (band.upcomingOutings || []).map((item) => {
    const link = outingLinks[item.id] || {}
    const calendar = outingCalendar(item, link)
    return {
      key: `outing:${item.id}`,
      id: item.id,
      date: item.date || '',
      dateInfo: dateInfo(item.date),
      startTime: item.time ? String(item.time).slice(0, 5) : '',
      title: item.title || item.type || 'Actuación procesional',
      categoryLabel: item.position || item.type || 'Acompañamiento procesional',
      calendarLabel: calendar.label,
      calendarHref: calendar.href,
      href: outingHref(item, link),
      actionLabel: 'Ver cita',
      municipality: item.municipality || '',
      municipalityHref: agendaMunicipalityHref(item.municipality),
      brotherhoodHref: link.brotherhoodSlug ? `/hermandades/${link.brotherhoodSlug}` : '',
      summary: item.reason || item.description || '',
      context: item.position || '',
    }
  })

  const concertItems = concerts
    .filter((event) => event?.isUpcoming && !event?.isCancelled && (event.bands || []).some((item) => item.id === band.id))
    .map((event) => ({
      key: `concert:${event.id}`,
      id: event.id,
      date: event.date || '',
      dateInfo: dateInfo(event.date),
      startTime: event.startTime || '',
      timeText: event.timeText || '',
      title: event.title,
      categoryLabel: event.eventTypeLabel || 'Concierto',
      calendarLabel: 'Agenda Cofrade',
      calendarHref: '/agenda-cofrade?categoria=concerts#agenda',
      href: '',
      actionLabel: 'Ver en Agenda',
      municipality: event.municipality || '',
      municipalityHref: agendaMunicipalityHref(event.municipality),
      brotherhoodHref: event.brotherhoodHref || '',
      place: event.placeName || '',
      summary: event.summary || event.description || '',
      context: (event.bands || []).find((item) => item.id === band.id)?.roleName || '',
    }))

  const seen = new Set()
  return [...outings, ...concertItems]
    .sort(compareItems)
    .filter((item) => {
      const key = item.href || item.key
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
}
