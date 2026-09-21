import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import { labelFromSlug } from '@/lib/brotherhood-directory'
import { brotherhoodsForDirectoryRoute } from '@/lib/brotherhood-public-index'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

async function pageData(localidad) {
  const path = `/hermandades/sacramentales/${localidad}`
  const items = brotherhoodsForDirectoryRoute(
    await getIndexableBrotherhoodDirectory(),
    'sacramentales',
    path
  )
  const localityName = labelFromSlug(localidad)
  const title = `Hermandades Sacramentales de ${localityName}`
  const description = `Directorio de Hermandades Sacramentales de ${localityName}.`

  return { items, localityName, path, title, description }
}

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const data = await pageData(localidad)

  if (!data.items.length) {
    return {
      title: 'Directorio sacramental no encontrado',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function SacramentalLocalityPage({ params }) {
  const { localidad } = await params
  const data = await pageData(localidad)

  if (!data.items.length) notFound()

  return (
    <DirectoryRoutePage
      eyebrow="Hermandades Sacramentales"
      title={`Sacramentales de ${data.localityName}`}
      description={`Corporaciones sacramentales documentadas en ${data.localityName}.`}
      hermandades={data.items}
      path={data.path}
      contextLabel="Sacramental"
      breadcrumbs={[
        { label: 'Sacramentales', href: '/hermandades/sacramentales' },
        { label: data.localityName },
      ]}
    />
  )
}
