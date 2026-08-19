import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import JsonLd from '@/components/JsonLd'
import {
  directorySlug,
  gloryMonth,
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
  const { localidad, mes } = await params
  const localityName = labelFromSlug(localidad)
  const monthName = labelFromSlug(mes)
  const path = `/hermandades/gloria/${localidad}/${mes}`
  const title = `Hermandades de Gloria de ${monthName} en ${localityName}`
  const description = `Hermandades de Gloria vinculadas al mes de ${monthName} en ${localityName}.`
  const items = (await getHermandadesDirectory()).filter((item) => (
    hasDirectoryType(item, 'gloria')
    && localitySlug(item) === localidad
    && directorySlug(gloryMonth(item)) === mes
  ))

  return {
    title,
    description,
    robots: directoryRobots(items),
    ...socialMetadata({ title, description, path }),
  }
}

export default async function GloryLocalityMonthPage({ params }) {
  const { localidad, mes } = await params
  const hermandades = await getHermandadesDirectory()
  const items = hermandades.filter((item) => (
    hasDirectoryType(item, 'gloria')
    && localitySlug(item) === localidad
    && directorySlug(gloryMonth(item)) === mes
  ))

  if (!items.length) notFound()

  const localityName = labelFromSlug(localidad)
  const monthName = labelFromSlug(mes)
  const path = `/hermandades/gloria/${localidad}/${mes}`
  const title = `${monthName} en ${localityName}`
  const description = `Hermandades cuya celebración o salida principal se sitúa en el mes de ${monthName}.`
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        { name: 'Glorias', path: '/hermandades/gloria' },
        { name: title, path },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path,
        name: title,
        description,
        items: items.map((item) => ({ name: item.nombrePopular, path: `/hermandades/${item.slug}` })),
      })} />
      <DirectoryRoutePage
        eyebrow="Hermandades de Gloria"
        title={title}
        description={description}
        hermandades={items}
        contextLabel={monthName}
        breadcrumbs={[
          { label: 'Glorias', href: '/hermandades/gloria' },
          { label: localityName },
          { label: monthName },
        ]}
      />
    </>
  )
}
