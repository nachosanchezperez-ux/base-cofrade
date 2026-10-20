import { brotherhoodsCalendarItems, buildAgendaCalendar, icsResponseHeaders } from '@/lib/agenda-ics'
import { followedCalendarSlugs } from '@/lib/agenda-ics-links'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { getHermandadesDirectory } from '@/lib/supabase/public-directory-cache'

// Calendario «Mis hermandades»: webcal://hilocofrade.es/calendario/mis-hermandades/<a>~<b>.ics
// Reúne los actos de las Hermandades que sigues en este móvil. Solo se aceptan
// Hermandades del directorio (máximo 40). No se indexa ni entra en el sitemap.
export const revalidate = 900

export async function GET(_request, { params }) {
  const { slugs: rawSlugs } = await params
  const directory = await getHermandadesDirectory()
  const known = new Set(directory.map((item) => item.slug))
  const slugs = followedCalendarSlugs(rawSlugs).filter((slug) => known.has(slug))

  if (!slugs.length) {
    return new Response('Hermandades no encontradas', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } })
  }

  const { items } = await getAgendaCofrade()
  const body = buildAgendaCalendar({
    name: 'Mis hermandades · Hilo Cofrade',
    description: 'Próximos actos de las Hermandades que sigues en Hilo Cofrade.',
    items: brotherhoodsCalendarItems(items, slugs),
  })
  return new Response(body, { headers: icsResponseHeaders('mis-hermandades.ics') })
}
