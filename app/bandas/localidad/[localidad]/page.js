import { cache } from 'react'
import { notFound } from 'next/navigation'
import BandDirectoryRoutePage from '@/components/BandDirectoryRoutePage'
import { bandsForDirectoryFacet } from '@/lib/band-directory'
import { socialMetadata } from '@/lib/seo'
import { getPublicBandsDirectory } from '@/lib/supabase/public-directory-cache'

export const revalidate = 900

const getBands = cache(getPublicBandsDirectory)

function pageData(bands, localidad) {
  const items = bandsForDirectoryFacet(bands, 'localidad', localidad)
  const label = items[0]?.municipality || ''
  const path = `/bandas/localidad/${localidad}`
  const title = `Bandas de ${label}`
  const description = `Directorio de bandas cofrades de ${label}, con sus fichas, historia, acompañamientos y relaciones documentadas.`
  return { items, label, path, title, description }
}

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const data = pageData(await getBands(), localidad)
  if (!data.items.length) return { title: 'Localidad de bandas no encontrada', robots: { index: false, follow: false } }
  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function BandMunicipalityDirectoryPage({ params }) {
  const { localidad } = await params
  const data = pageData(await getBands(), localidad)
  if (!data.items.length) notFound()

  return (
    <BandDirectoryRoutePage
      bands={data.items}
      title={data.title}
      description={data.description}
      path={data.path}
      contextLabel={data.label}
    />
  )
}
