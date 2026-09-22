import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import {
  labelFromSlug,
} from '@/lib/brotherhood-directory'
import { brotherhoodsForDirectoryRoute } from '@/lib/brotherhood-public-index'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

async function pageData(localidad, jornada) {
  const path = `/hermandades/semana-santa/${localidad}/${jornada}`
  const items = brotherhoodsForDirectoryRoute(
    await getIndexableBrotherhoodDirectory(),
    'semana-santa',
    path,
    1
  )
  const localityName = labelFromSlug(localidad)
  const dayName = labelFromSlug(jornada)
  const title = `${dayName} en ${localityName}`
  const description = `Hermandades del ${dayName} en ${localityName}, con acceso a sus titulares, pasos, patrimonio, cultos y salidas.`

  return { items, localityName, dayName, path, title, description }
}

export async function generateMetadata({ params }) {
  const { localidad, jornada } = await params
  const data = await pageData(localidad, jornada)

  if (!data.items.length) {
    return {
      title: 'Jornada de Semana Santa no encontrada',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function HolyWeekLocalityDayPage({ params }) {
  const { localidad, jornada } = await params
  const data = await pageData(localidad, jornada)

  if (!data.items.length) notFound()

  return (
    <DirectoryRoutePage
      eyebrow="Hermandades de Semana Santa"
      title={data.title}
      description={`Hermandades que realizan su salida procesional el ${data.dayName} en ${data.localityName}.`}
      hermandades={data.items}
      path={data.path}
      contextLabel={data.dayName}
      breadcrumbs={[
        { label: 'Semana Santa', href: '/hermandades/semana-santa' },
        { label: data.localityName },
        { label: data.dayName },
      ]}
    />
  )
}
