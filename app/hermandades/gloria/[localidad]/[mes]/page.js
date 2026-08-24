import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import {
  directorySlug,
  gloryMonth,
  hasDirectoryType,
  labelFromSlug,
  localitySlug,
} from '@/lib/brotherhood-directory'
import { socialMetadata } from '@/lib/seo'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { localidad, mes } = await params
  const localityName = labelFromSlug(localidad)
  const monthName = labelFromSlug(mes)
  const title = `Hermandades de Gloria de ${monthName} en ${localityName}`
  const description = `Hermandades de Gloria vinculadas al mes de ${monthName} en ${localityName}.`
  const path = `/hermandades/gloria/${localidad}/${mes}`

  return {
    title,
    description,
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
  return (
    <DirectoryRoutePage
      eyebrow="Hermandades de Gloria"
      title={`${monthName} en ${localityName}`}
      description={`Hermandades cuya celebración o salida principal se sitúa en el mes de ${monthName}.`}
      hermandades={items}
      path={path}
      contextLabel={monthName}
      breadcrumbs={[
        { label: 'Glorias', href: '/hermandades/gloria' },
        { label: localityName },
        { label: monthName },
      ]}
    />
  )
}
