import { agendaMunicipalityRouteSlug } from '@/lib/agenda-cofrade-location'

export function agendaMunicipalityHref(value = '') {
  const slug = agendaMunicipalityRouteSlug(value)
  return slug ? `/agenda-cofrade/localidad/${slug}` : ''
}

export function brotherhoodAgendaHref(brotherhoodHref = '') {
  const href = String(brotherhoodHref || '').trim()
  return href ? `${href}#agenda` : ''
}

export function uniqueAgendaRelations(items = [], limit = 4) {
  const seen = new Set()
  const result = []

  for (const item of items) {
    const href = String(item?.href || '').trim()
    const name = String(item?.name || item?.title || '').trim()
    if (!href || !name || seen.has(href)) continue

    seen.add(href)
    result.push({ ...item, href, name })
    if (result.length >= limit) break
  }

  return result
}
