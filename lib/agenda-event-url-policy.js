import { preservedAgendaEventPaths } from './agenda-preserved-event-paths.js'
import { agendaEventAnchor } from './agenda-event-presentation.js'

const eventPage = /^\/(?:agenda-cofrade\/rosarios|extraordinarias|procesiones-de-gloria)\/[^/]+\/?$/

export function isPreservedAgendaEventPath(value) {
  const path = new URL(value, 'https://hilocofrade.es').pathname.replace(/\/$/, '')
  return preservedAgendaEventPaths.has(path)
}

export function agendaEventDetailHref(item, family) {
  const path = item.slug ? `/${family}/${item.slug}` : ''
  if (path && isPreservedAgendaEventPath(path)) return path
  const type = String(item.outingType || item.mode || '').toLocaleLowerCase('es')
  const category = family === 'agenda-cofrade/rosarios' || type.includes('rosario') ? 'rosaries' : type.includes('traslado') ? 'transfers' : 'processions'
  return `/agenda-cofrade#${agendaEventAnchor({ key: `${category}:${item.id}` })}`
}

// Enlace de una tarjeta del directorio de Extraordinarias. Las fichas que no se
// conservan redirigen con 308 a la Agenda (ver app/extraordinarias/[slug]):
// el directorio enlaza ya al destino final para no hacer pasar a lectores y
// buscadores por una redirección. Sin slug, el ancla de la propia tarjeta.
export function extraordinaryDetailHref(item = {}) {
  if (!item.slug) return `/extraordinarias#${item.anchor || item.id}`
  return agendaEventDetailHref(item, 'extraordinarias')
}

// Solo las fichas que se sirven como página propia van al ItemList.
export function isStandaloneExtraordinaryPath(href = '') {
  return /^\/extraordinarias\/[^/#?]+$/.test(String(href))
}

export function allowAgendaSitemapUrl(value) {
  const url = new URL(value, 'https://hilocofrade.es')
  if (url.pathname === '/agenda-cofrade' && url.hash) return false
  return !eventPage.test(url.pathname) || isPreservedAgendaEventPath(url.pathname)
}
