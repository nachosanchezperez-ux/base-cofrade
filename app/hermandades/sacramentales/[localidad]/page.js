import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import JsonLd from '@/components/JsonLd'
import {
  hasDirectoryType,
  labelFromSlug,
  localitySlug,
} from '@/lib/brotherhood-directory'
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  directoryRobots,
  socialMetadata,
} from '@/lib/seo'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const localityName = labelFromSlug(localidad)
  const path = `/hermandades/sacramentales/${localidad}`
  const title = `Hermandades Sacramentales de ${localityName}`
  const description = `Directorio de Hermandades Sacramentales de ${localityName}.`
  const items = (await getHermandadesDirectory()).filter((item) => (
    hasDirectoryType(item, 'sacramentales') && localitySlug(item) === localidad
  ))

  return {
    title,
    description,
    robots: directoryRobots(items),
    ...socialMetadata({ title, description, path }),
  }
}

export default async function SacramentalLocalityPage({ params }) {
  const { localidad } = await params
  const hermandades = await getHermandadesDirectory()
  const items = hermandades.filter((item) => (
    hasDirectoryType(item, 'sacramentales') && localitySlug(item) === localidad
  ))

  if (!items.length) notFound()

  const localityName = labelFromSlug(localidad)
  const path = `/hermandades/sacramentales/${localidad}`
  const title = `Sacramentales de ${localityName}`
  const description = `Corporaciones sacramentales documentadas en ${localityName}.`
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        { name: 'Sacramentales', path: '/hermandades/sacramentales' },
        { name: title, path },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path,
        name: title,
        description,
        items: items.map((item) => ({ name: item.nombrePopular, path: `/hermandades/${item.slug}` })),
      })} />
      <DirectoryRoutePage
        eyebrow="Hermandades Sacramentales"
        title={title}
        description={description}
        hermandades={items}
        contextLabel="Sacramental"
        breadcrumbs={[
          { label: 'Sacramentales', href: '/hermandades/sacramentales' },
          { label: localityName },
        ]}
      />
    </>
  )
}
