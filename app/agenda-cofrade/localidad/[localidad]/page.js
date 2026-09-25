import { cache } from 'react'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'
import MunicipalityAgendaHub from '@/components/MunicipalityAgendaHub'
import { buildMunicipalityAgendaHub } from '@/lib/municipality-agenda'
import { socialMetadata } from '@/lib/seo'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'
import {
  getCrewEventDirectory,
  getPublicBandsDirectory,
} from '@/lib/supabase/public-directory-cache'

export const revalidate = 300

const getHub = cache(async (slug) => {
  const [agendaData, crewEvents, brotherhoods, bands] = await Promise.all([
    getAgendaCofrade(),
    getCrewEventDirectory(),
    getIndexableBrotherhoodDirectory(),
    getPublicBandsDirectory(),
  ])

  return buildMunicipalityAgendaHub({
    slug,
    agendaItems: agendaData.items,
    crewEvents,
    brotherhoods,
    bands,
  })
})

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const hub = await getHub(localidad)
  if (!hub.exists) return { title: 'Agenda local no encontrada', robots: { index: false, follow: false } }

  const title = `Agenda cofrade de ${hub.label}`
  const description = `Próximos actos cofrades de ${hub.label}: procesiones, Glorias, Extraordinarias, cultos, conciertos e Igualás y ensayos relacionados con sus entidades.`
  const path = `/agenda-cofrade/localidad/${hub.slug}`
  return { title, description, ...socialMetadata({ title, description, path }) }
}

export default async function MunicipalityAgendaPage({ params }) {
  await connection()
  const { localidad } = await params
  const hub = await getHub(localidad)
  if (!hub.exists) notFound()
  return <MunicipalityAgendaHub hub={hub} />
}
