import { agendaEventAnchor } from './agenda-event-presentation.js'
import { outingRouteStops } from './brotherhood-featured-outing.js'
import { agendaItemShare } from './share.js'

// Enlaces de las acciones de una salida de Gloria (ficha de Hermandad y página
// de la procesión en la Agenda): calendario, compartir, imagen para estados y
// cómo llegar. El calendario y la imagen solo para salidas por celebrar.
export function outingActionLinks(outing = {}) {
  const route = outingRouteStops(outing.routeSummary, { origin: outing.origin, destination: outing.destination })
  const upcoming = Boolean(outing.isUpcoming && !outing.isCancelled)
  const type = String(outing.outingType || '')
  const category = /rosario/i.test(type) ? 'rosaries' : /traslado/i.test(type) ? 'transfers' : 'processions'
  return {
    upcoming,
    calendarHref: upcoming && outing.date && outing.id ? `/calendario/acto/${agendaEventAnchor({ key: `${category}:${outing.id}` })}.ics` : '',
    storyHref: upcoming && outing.id ? `/salidas/${outing.id}/estado` : '',
    storyName: `${outing.slug || 'salida'}-hilo-cofrade.png`,
    directionsHref: route.origin
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([route.origin, outing.municipality].filter(Boolean).join(', '))}`
      : '',
    share: agendaItemShare({
      title: outing.title,
      organizer: outing.brotherhoodName,
      categoryLabel: outing.outingType || 'Procesión de Gloria',
      date: outing.date,
      startTime: outing.departureTime,
      place: route.origin,
      municipality: outing.municipality,
      href: outing.detailHref,
    }),
  }
}
