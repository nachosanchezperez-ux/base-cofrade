import { brotherhoodCalendarItems, buildAgendaCalendar, icsResponseHeaders } from '@/lib/agenda-ics'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { getHermandadesDirectory } from '@/lib/supabase/public-directory-cache'

// Suscripción de calendario de una Hermandad: webcal://hilocofrade.es/calendario/hermandad/<slug>.ics
// Incluye los actos de la Agenda que organiza o en los que participa y se
// actualiza solo en el móvil. No se indexa ni entra en el sitemap.
export const revalidate = 900

export async function GET(_request, { params }) {
  const { slug: rawSlug } = await params
  const slug = String(rawSlug || '').replace(/\.ics$/i, '')
  const directory = await getHermandadesDirectory()
  const brotherhood = directory.find((item) => item.slug === slug)

  if (!brotherhood) {
    return new Response('Hermandad no encontrada', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } })
  }

  const { items } = await getAgendaCofrade()
  const name = brotherhood.nombrePopular || brotherhood.nombreOficial || brotherhood.name || slug
  const body = buildAgendaCalendar({
    name: `${name} · Hilo Cofrade`,
    description: `Próximos actos de ${name} en la Agenda de Hilo Cofrade.`,
    items: brotherhoodCalendarItems(items, slug),
  })
  return new Response(body, { headers: icsResponseHeaders(`${slug}.ics`) })
}
