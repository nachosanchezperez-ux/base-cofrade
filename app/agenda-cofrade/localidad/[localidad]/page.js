import { cache } from 'react'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'
import MunicipalityAgendaHub from '@/components/MunicipalityAgendaHub'
import { buildMunicipalityAgendaHub } from '@/lib/municipality-agenda'
import { socialMetadata } from '@/lib/seo'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { getImagesDirectory, getStepsDirectory } from '@/lib/supabase/directories'
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

  // El patrimonio usa directorios cacheados y se carga después del bloque
  // temporal para no multiplicar el fan-out de Supabase en un cache miss.
  const images = await getImagesDirectory({ throwOnError: true }).catch((error) => {
    console.error('[Hilo Cofrade] Imágenes locales omitidas temporalmente en la guía municipal', { slug, error })
    return []
  })
  const steps = await getStepsDirectory({ throwOnError: true }).catch((error) => {
    console.error('[Hilo Cofrade] Pasos locales omitidos temporalmente en la guía municipal', { slug, error })
    return []
  })

  return buildMunicipalityAgendaHub({
    slug,
    agendaItems: agendaData.items,
    crewEvents,
    brotherhoods,
    bands,
    images,
    steps,
    today: agendaData.today,
  })
})

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const hub = await getHub(localidad)
  if (!hub.exists) return { title: 'Guía cofrade local no encontrada', robots: { index: false, follow: false } }

  const title = `Agenda cofrade de ${hub.label}: procesiones y hermandades`
  const description = `Guía cofrade de ${hub.label}: próximos actos, Hermandades, Bandas, Imágenes y Pasos relacionados en Hilo Cofrade.`
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
