import { connection } from 'next/server'
import AgendaTemporalLanding from '@/components/AgendaTemporalLanding'
import { buildAgendaTemporalLanding, TEMPORAL_AGENDA_PAGES } from '@/lib/agenda-temporal-landing'
import { socialMetadata } from '@/lib/seo'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'

export const revalidate = 300

const config = TEMPORAL_AGENDA_PAGES.tomorrow

export const metadata = {
  title: config.title,
  description: config.description,
  ...socialMetadata({ title: config.title, description: config.description, path: `/agenda-cofrade/${config.slug}` }),
}

export default async function TemporalAgendaPage() {
  await connection()
  const agendaData = await getAgendaCofrade()
  const landing = buildAgendaTemporalLanding({
    period: 'tomorrow',
    items: agendaData.items,
    today: agendaData.today,
  })

  return <AgendaTemporalLanding landing={landing} />
}
