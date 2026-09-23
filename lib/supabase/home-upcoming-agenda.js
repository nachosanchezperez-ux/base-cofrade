import 'server-only'

import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { getNavigableHomeExtraordinaryOutings } from '@/lib/supabase/home-extraordinary-links'
import { compareProcessionLiveItems, withProcessionLiveState } from '@/lib/procession-live-status'

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

  const now = new Date()

  return [
    ...extraordinaryOutings.map(extraordinaryAgendaItem),
    ...gloryOutings.map(gloryAgendaItem),
  ]
    .filter((item) => item.date)
    .map((item) => withProcessionLiveState(item, now))
    .sort(compareProcessionLiveItems)
    .slice(0, limit)
}
