// Enlaces a las entidades de un acto de la Agenda con la etiqueta que corresponde
// a su destino real (#1264). En los conciertos `organizerHref` es la banda, no la
// Hermandad: la etiqueta sale de la ruta enlazada, nunca del campo de origen.
// Módulo puro, sin alias, para poder probarlo con node --test.

const ENTITY_ROUTES = [
  { prefix: '/hermandades/', kind: 'brotherhood', label: 'Ver Hermandad' },
  { prefix: '/bandas/', kind: 'band', label: 'Ver banda' },
]

export function agendaEntityLink(href = '') {
  const value = String(href || '').trim()
  const route = ENTITY_ROUTES.find((entry) => value.startsWith(entry.prefix) && value.length > entry.prefix.length)
  return route ? { kind: route.kind, label: route.label, href: value } : null
}

// Organizadora y Hermandad relacionada, sin repetir destinos. Una ruta que no es
// ficha de Hermandad ni de banda no se etiqueta como ninguna de las dos.
export function agendaEntityLinks(item = {}) {
  const seen = new Set()
  return [item.organizerHref, item.relatedBrotherhoodHref]
    .map(agendaEntityLink)
    .filter((link) => link && !seen.has(link.href) && seen.add(link.href))
}

// Enlace a la ficha de la Hermandad del acto, solo si de verdad es una Hermandad.
export function agendaBrotherhoodHref(item = {}) {
  return agendaEntityLinks(item).find((link) => link.kind === 'brotherhood')?.href || ''
}
