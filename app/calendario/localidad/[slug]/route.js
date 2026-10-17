import { agendaMunicipalityRouteSlug } from '@/lib/agenda-cofrade-location'
import { buildAgendaCalendar, icsResponseHeaders } from '@/lib/agenda-ics'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'

// Suscripción de calendario de una localidad: webcal://hilocofrade.es/calendario/localidad/<slug>.ics
// Mismo slug que /agenda-cofrade/localidad/<slug>. Solo existe para localidades
// con actos en la Agenda. No se indexa ni entra en el sitemap.
export const revalidate = 900

export async function GET(_request, { params }) {
  const { slug: rawSlug } = await params
  const slug = String(rawSlug || '').replace(/\.ics$/i, '')
  const { items } = await getAgendaCofrade()
  const local = items.filter((item) => agendaMunicipalityRouteSlug(item.municipality) === slug)

  if (!slug || !local.length) {
    return new Response('Localidad sin actos en la Agenda', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } })
  }

  const municipality = slug === 'sevilla-capital' ? 'Sevilla' : local[0].municipality
  const upcoming = local.filter((item) => !item.isPast)
  const body = buildAgendaCalendar({
    name: `Agenda cofrade de ${municipality} · Hilo Cofrade`,
    description: `Próximos actos cofrades en ${municipality} según la Agenda de Hilo Cofrade.`,
    items: upcoming,
  })
  return new Response(body, { headers: icsResponseHeaders(`agenda-${slug}.ics`) })
}
