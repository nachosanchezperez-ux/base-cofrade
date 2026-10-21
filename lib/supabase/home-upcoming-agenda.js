import 'server-only'

import { getAgendaCofradeSources } from '@/lib/supabase/agenda-cofrade'
import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { getGeneralPublicOutings } from '@/lib/supabase/general-public-outings'
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

function generalAgendaItem(item) {
  const isRomery = item.kind === 'romery'
  const isTransfer = item.kind === 'transfer'
  return {
    ...item,
    href: item.detailHref || item.brotherhoodHref || '/agenda-cofrade',
    agendaType: isRomery ? 'romery' : isTransfer ? 'transfer' : 'procession',
    typeLabel: isRomery ? 'Romería' : isTransfer ? 'Traslado' : 'Procesión',
    dateParts: item.dateInfo,
    calendarHref: isRomery
      ? '/agenda-cofrade?categoria=romeries#agenda'
      : isTransfer ? '/agenda-cofrade?categoria=transfers#agenda' : '/agenda-cofrade?categoria=processions#agenda',
    calendarLabel: isRomery ? 'Romerías' : 'Agenda Cofrade',
  }
}

// Glorias y procesiones generales salen de la misma caché diaria que la Agenda
// Cofrade (que la Home ya consulta), en lugar de releerlas sin caché en cada
// regeneración del snapshot. Si esa caché falla, se conserva la lectura directa.
async function getHomeAgendaSources() {
  try {
    const { glories, generalOutings } = await getAgendaCofradeSources()
    return { gloryDirectory: glories, generalOutings }
  } catch (error) {
    console.error('[Hilo Cofrade] Caché de la Agenda no disponible para la Home; lectura directa', {
      error: error instanceof Error ? error.message : String(error),
    })
    const [gloryDirectory, generalOutings] = await Promise.all([
      getGloryDirectory(),
      getGeneralPublicOutings(),
    ])
    return { gloryDirectory, generalOutings }
  }
}

// Todas las citas próximas o en curso, ordenadas. Los destacados editoriales se
// buscan aquí para no depender de que la salida esté entre las primeras.
export async function getHomeAgendaCandidates({ extraordinaryLimit = 8 } = {}) {
  const [extraordinaryOutings, { gloryDirectory, generalOutings }] = await Promise.all([
    getNavigableHomeExtraordinaryOutings(extraordinaryLimit),
    getHomeAgendaSources(),
  ])

  const now = new Date()

  return [
    ...extraordinaryOutings.map(extraordinaryAgendaItem),
    ...gloryDirectory
      .filter((item) => !item.isCancelled && !item.isPast)
      .map(gloryAgendaItem),
    ...generalOutings
      .filter((item) => !item.isCancelled && !item.isPast)
      .map(generalAgendaItem),
  ]
    .filter((item) => item.date)
    .map((item) => withProcessionLiveState(item, now))
    .filter((item) => item.liveState.state !== 'done')
    .sort(compareProcessionLiveItems)
}

export async function getHomeUpcomingAgenda(limit = 5) {
  const candidates = await getHomeAgendaCandidates({ extraordinaryLimit: Math.max(limit * 2, 8) })
  return candidates.slice(0, limit)
}
