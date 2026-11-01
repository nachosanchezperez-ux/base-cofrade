import 'server-only'
import { agendaEventDetailHref } from '@/lib/agenda-event-url-policy'

import { unstable_cache } from 'next/cache'
import { getConcertEventDirectory } from '@/lib/supabase/concert-events'
import { getGeneralPublicOutings } from '@/lib/supabase/general-public-outings'
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { getKissingDevotions } from '@/lib/supabase/kissing-devotions'
import { getRosaryOutings } from '@/lib/supabase/rosary-outings'
import { withAgendaOutingContext } from '@/lib/supabase/agenda-outing-context'
import { withAgendaRelations } from '@/lib/supabase/agenda-relations'
import { withAgendaPhotos } from '@/lib/supabase/agenda-photos'
import { pickAgendaPhoto } from '@/lib/agenda-event-photo'
import { withProcessionLiveState } from '@/lib/procession-live-status'
import { agendaMunicipalityHref } from '@/lib/agenda-relations'

function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

function dateInfo(value, supplied = {}) {
  if (!value) return { day: 'â€”', month: 'FECHA', year: '', label: 'Fecha por confirmar', weekdayLabel: 'Fecha por confirmar', ¶»§q«^