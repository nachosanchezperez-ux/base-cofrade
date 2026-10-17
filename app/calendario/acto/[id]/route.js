import { agendaEventAnchor } from '@/lib/agenda-event-presentation'
import { buildAgendaCalendar, icsResponseHeaders } from '@/lib/agenda-ics'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'

// «Añadir al calendario» de un acto de la Agenda: /calendario/acto/<ancla>.ics.
// El ancla es la de su tarjeta (acto-<categoría>-<id>). No es una página: no se
// indexa ni entra en el sitemap (política de URLs de la Agenda).
export const revalidate = 900

export async function GET(_request, { params }) {
  const { id } = await params
  const anchor = String(id || '').replace(/\.ics$/i, '')
  const { items } = await getAgendaCofrade()
  const item = items.find((entry) => agendaEventAnchor(entry) === anchor)

  if (!item || !item.date) {
    return new Response('Acto no encontrado', { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } })
  }

  const body = buildAgendaCalendar({ name: item.title, items: [item] })
  return new Response(body, { headers: icsResponseHeaders(`${anchor}.ics`, { attachment: true }) })
}
