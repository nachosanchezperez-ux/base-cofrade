import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import JsonLd from '@/components/JsonLd'
import {
  directorySlug,
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
  const { localidad, jornada } = await params
  const localityName = labelFromSlug(localidad)
  const dayName = labelFromSlug(jornada)
  const path = `/hermandades/semana-santa/${localidad}/${jornada}`
  const title = `${dayName} en ${localityName}`
  const description = `Hermandades del ${dayName} en ${localityName}, con acceso a sus titulares, pasos, patrimonio, cultos y salidas.`
  const items = (await getHermandadesDirectory()).filter((item) => (
    hasDirectoryType(item, 'semana-santa')
    && localitySlug(item) === localidad
    && directorySlug(item.diaSalida) === jornada
  ))

  return {
    title,
    description,
    robots: directoryRobots(items),
    ...socialMetadata({ title, description, path }),
  }
}

export default async function HolyWeekLocalityDayPage({ params }) {
  const { localidad, jornada } = await params
  const hermandades = await getHermandadesDirectory()
  const items = hermandades.filter((item) => (
    hasDirectoryType(item, 'semana-santa')
    && localitySlug(item) === localidad
    && directorySlug(item.diaSalida) === jornada
  ))

  if (!items.length) notFound()

  const localityName = labelFromSlug(localidad)
  const dayName = labelFromSlug(jornada)
  const path = `/hermandades/semana-santa/${localidad}/${jornada}`
  const title = `${dayName} en ${localityName}`
  const description = `Hermandades que realizan su salida procesional el ${dayName} en ${localityName}.`
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        { name: 'Semana Santa', path: '/hermandades/semana-santa' },
        { name: title, path },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path,
        name: title,
        description,
        items: items.map((item) => ({ name: item.nombrePopular, path: `/hermandades/${item.slug}` })),
      })} />
      <DirectoryRoutePage
        eyebrow="Hermandades de Semana Santa"
        title={title}
        description={description}
        hermandades={items}
        contextLabel={dayName}
        breadcrumbs={[
          { label: 'Semana Santa', href: '/hermandades/semana-santa' },
          { label: localityName },
          { label: dayName },
        ]}
      />
    </>
  )
}
