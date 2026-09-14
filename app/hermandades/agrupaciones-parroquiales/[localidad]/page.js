import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import {
  hasDirectoryType,
  labelFromSlug,
  localitySlug,
} from '@/lib/brotherhood-directory'
import { socialMetadata } from '@/lib/seo'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const localityName = labelFromSlug(localidad)
  const title = `Agrupaciones Parroquiales de ${localityName}`
  const description = `Directorio de Agrupaciones Parroquiales de ${localityName}.`
  const path = `/hermandades/agrupaciones-parroquiales/${localidad}`

  return {
    title,
    description,
    ...socialMetadata({ title, description, path }),
  }
}

export default async function ParishGroupingsLocalityPage({ params }) {
  const { localidad } = await params
  const hermandades = await getHermandadesDirectory()
  const items = hermandades.filter((item) => (
    hasDirectoryType(item, 'agrupaciones-parroquiales') && localitySlug(item) === localidad
  ))

  if (!items.length) notFound()

  const localityName = labelFromSlug(localidad)
  const path = `/hermandades/agrupaciones-parroquiales/${localidad}`
  return (
    <DirectoryRoutePage
      eyebrow="Agrupaciones Parroquiales"
      title={`Agrupaciones Parroquiales de ${localityName}`}
      description={`Corporaciones con carácter de Agrupación Parroquial documentadas en ${localityName}.`}
      hermandades={items}
      path={path}
      contextLabel="Agrupación Parroquial"
      itemSingular="agrupación"
      itemPlural="agrupaciones"
      breadcrumbs={[
        { label: 'Agrupaciones Parroquiales', href: '/hermandades/agrupaciones-parroquiales' },
        { label: localityName },
      ]}
    />
  )
}
