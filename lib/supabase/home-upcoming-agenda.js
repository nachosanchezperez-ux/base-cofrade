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

  const now = new Date()

  return [
    ...extraordinaryOutings.map(extraordinaryAgendaItem),
    ...gloryDirectory
      .filter((item) => !item.isCancelled && !item.isPast)
      .map(gloryAgendaItem),
  ]
    .filter((item) => item.date)
    .map((item) => withProcessionLiveState(item, now))
    .filter((item) => item.liveState.state !== 'done')
    .sort(compareProcessionLiveItems)
    .slice(0, limit)
}
