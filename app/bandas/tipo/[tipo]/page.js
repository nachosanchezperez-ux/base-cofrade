import { cache } from 'react'
import { notFound } from 'next/navigation'
import BandDirectoryRoutePage from '@/components/BandDirectoryRoutePage'
import { bandsForDirectoryFacet } from '@/lib/band-directory'
import { socialMetadata } from '@/lib/seo'
import { getPublicBandsDirectory } from '@/lib/supabase/public-directory-cache'

export const revalidate = 900

const getBands = cache(getPublicBandsDirectory)

function pageData(bands, tipo) {
  const items = bandsForDirectoryFacet(bands, 'tipo', tipo)
  const label = items[0]?.type || ''
  const path = `/bandas/tipo/${tipo}`
  const title = `Bandas de ${label} de Sevilla y provincia`
  const description = `Directorio de bandas de ${label} de Sevilla capital y provincia, con sus fichas, historia y relaciones cofrades documentadas.`
  return { items, label, path, title, description }
}

export async function generateMetadata({ params }) {
  const { tipo } = await params
  const data = pageData(await getBands(), tipo)
  if (!data.items.length) return { title: 'Tipología de banda no encontrada', robots: { index: false, follow: false } }
  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function BandTypeDirectoryPage({ params }) {
  const { tipo } = await params
  const data = pageData(await getBands(), tipo)
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
