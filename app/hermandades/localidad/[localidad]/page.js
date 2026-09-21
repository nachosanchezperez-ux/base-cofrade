import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import { brotherhoodsForLocality } from '@/lib/brotherhood-public-index'
import { localityLabel } from '@/lib/brotherhood-directory'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

function pageData(brotherhoods, localidad) {
  const items = brotherhoodsForLocality(brotherhoods, localidad)
  const label = items[0] ? localityLabel(items[0]) : ''
  const path = `/hermandades/localidad/${localidad}`
  const title = `Hermandades de ${label}`
  const description = `Directorio de hermandades de ${label}, con acceso a sus titulares, pasos, patrimonio, cultos, salidas y fuentes documentadas.`

  return { items, label, path, title, description }
}

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const data = pageData(await getIndexableBrotherhoodDirectory(), localidad)

  if (!data.items.length) {
    return {
      title: 'Localidad de hermandades no encontrada',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function BrotherhoodMunicipalityDirectoryPage({ params }) {
  const { localidad } = await params
  const data = pageData(await getIndexableBrotherhoodDirectory(), localidad)

  if (!data.items.length) notFound()

  return (
    <DirectoryRoutePage
      eyebrow="Directorio territorial"
      title={data.title}
      description={data.description}
      hermandades={data.items}
      path={data.path}
      breadcrumbs={[{ label: data.label }]}
    />
  )
}
