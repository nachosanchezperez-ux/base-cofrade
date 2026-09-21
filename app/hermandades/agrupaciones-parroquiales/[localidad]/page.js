import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import { labelFromSlug } from '@/lib/brotherhood-directory'
import { brotherhoodsForDirectoryRoute } from '@/lib/brotherhood-public-index'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

async function pageData(localidad) {
  const path = `/hermandades/agrupaciones-parroquiales/${localidad}`
  const items = brotherhoodsForDirectoryRoute(
    await getIndexableBrotherhoodDirectory(),
    'agrupaciones-parroquiales',
    path
  )
  const localityName = labelFromSlug(localidad)
  const title = `Agrupaciones Parroquiales de ${localityName}`
  const description = `Directorio de Agrupaciones Parroquiales de ${localityName}.`

  return { items, localityName, path, title, description }
}

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const data = await pageData(localidad)

  if (!data.items.length) {
    return {
      title: 'Directorio de Agrupaciones Parroquiales no encontrado',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function ParishGroupingsLocalityPage({ params }) {
  const { localidad } = await params
  const data = await pageData(localidad)

  if (!data.items.length) notFound()

  return (
    <DirectoryRoutePage
      eyebrow="Agrupaciones Parroquiales"
      title={data.title}
      description={`Corporaciones con carácter de Agrupación Parroquial documentadas en ${data.localityName}.`}
      hermandades={data.items}
      path={data.path}
      contextLabel="Agrupación Parroquial"
      itemSingular="agrupación"
      itemPlural="agrupaciones"
      breadcrumbs={[
        { label: 'Agrupaciones Parroquiales', href: '/hermandades/agrupaciones-parroquiales' },
        { label: data.localityName },
      ]}
    />
  )
}
