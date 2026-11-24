import { connection } from 'next/server'
import AgendaTemporalLanding from '@/components/AgendaTemporalLanding'
import { buildAgendaTemporalLanding, TEMPORAL_AGENDA_PAGES } from '@/lib/agenda-temporal-landing'
import { socialMetadata } from '@/lib/seo'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'

// Especial de Adviento y Navidad (24/11/2026): la Agenda del primer domingo de
// Adviento a la Epifanía, día a día, con accesos a la Inmaculada, la Esperanza
// (18 de diciembre), Navidad y Epifanía. URL permanente: vale cada año.
export const revalidate = 300

const config = TEMPORAL_AGENDA_PAGES.advent

export const metadata = {
  title: config.title,
  description: config.description,
  ...socialMetadata({ title: config.title, description: config.description, path: `/agenda-cofrade/${config.slug}`, images: null }),
}

export default async function AdventAgendaPage() {
  await connection()
  const agendaData = await getAgendaCofrade()
  const landing = buildAgendaTemporalLanding({
    period: 'advent',
    items: agendaData.items,
    today: agendaData.today,
    now: new Date(),
  })

  return <AgendaTemporalLanding landing={landing} />
}
