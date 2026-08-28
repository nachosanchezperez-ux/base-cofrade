import 'server-only'

import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { getNavigableHomeExtraordinaryOutings } from '@/lib/supabase/home-extraordinary-links'

function agendaTime(item) {
  return item.departureTime || '23:59'
}

function compareAgendaItems(left, right) {
  const byDate = String(left.date || '').localeCompare(String(right.date || ''))
  if (byDate) return byDate
  return agendaTime(left).localeCompare(agendaTime(right))
}

function extraordinaryAgendaItem(item) {
  return {
    ...item,
    agendaType: 'extraordinary',
    typeLabel: 'Extraordinaria',
    calendarHref: '/extraordinarias',
    calendarLabel: 'Extraordinarias',
  }
}

function gloryAgendaItem(item) {
  return {
    ...item,
    href: item.detailHref || '/procesiones-de-gloria',
    agendaType: 'glory',
    typeLabel: 'Gloria',
    calendarHref: '/procesiones-de-gloria',
    calendarLabel: 'Procesiones de Gloria',
  }
}

export async function getHomeUpcomingAgenda(limit = 5) {
  const fetchLimit = Math.max(limit * 2, 8)
  const [extraordinaryOutings, gloryDirectory] = await Promise.all([
    getNavigableHomeExtraordinaryOutings(fetchLimit),
    getGloryDirectory(),
  ])

  const gloryOutings = gloryDirectory
    .filter((item) => item.isUpcoming && !item.isCancelled)
    .slice(0, fetchLimit)

  return [
    ...extraordinaryOutings.map(extraordinaryAgendaItem),
    ...gloryOutings.map(gloryAgendaItem),
  ]
    .filter((item) => item.date)
    .sort(compareAgendaItems)
    .slice(0, limit)
}
