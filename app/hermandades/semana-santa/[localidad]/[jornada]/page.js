import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import {
  directorySlug,
  hasDirectoryType,
  labelFromSlug,
  localitySlug,
} from '@/lib/brotherhood-directory'
import { socialMetadata } from '@/lib/seo'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { localidad, jornada } = await params
  const localityName = labelFromSlug(localidad)
  const dayName = labelFromSlug(jornada)
  const title = `${dayName} en ${localityName}`
  const description = `Hermandades del ${dayName} en ${localityName}, con acceso a sus titulares, pasos, patrimonio, cultos y salidas.`
  const path = `/hermandades/semana-santa/${localidad}/${jornada}`

  return {
    title,
    description,
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
  return (
    <DirectoryRoutePage
      eyebrow="Hermandades de Semana Santa"
      title={`${dayName} en ${localityName}`}
      description={`Hermandades que realizan su salida procesional el ${dayName} en ${localityName}.`}
      hermandades={items}
      path={path}
      contextLabel={dayName}
      breadcrumbs={[
        { label: 'Semana Santa', href: '/hermandades/semana-santa' },
        { label: localityName },
        { label: dayName },
      ]}
    />
  )
}
