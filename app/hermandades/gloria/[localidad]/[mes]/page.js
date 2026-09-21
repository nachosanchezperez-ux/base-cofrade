import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import {
  labelFromSlug,
} from '@/lib/brotherhood-directory'
import { brotherhoodsForDirectoryRoute } from '@/lib/brotherhood-public-index'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

async function pageData(localidad, mes) {
  const path = `/hermandades/gloria/${localidad}/${mes}`
  const items = brotherhoodsForDirectoryRoute(
    await getIndexableBrotherhoodDirectory(),
    'gloria',
    path
  )
  const localityName = labelFromSlug(localidad)
  const monthName = labelFromSlug(mes)
  const title = `Hermandades de Gloria de ${monthName} en ${localityName}`
  const description = `Hermandades de Gloria vinculadas al mes de ${monthName} en ${localityName}.`

  return { items, localityName, monthName, path, title, description }
}

export async function generateMetadata({ params }) {
  const { localidad, mes } = await params
  const data = await pageData(localidad, mes)

  if (!data.items.length) {
    return {
      title: 'Directorio de Gloria no encontrado',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function GloryLocalityMonthPage({ params }) {
  const { localidad, mes } = await params
  const data = await pageData(localidad, mes)

  if (!data.items.length) notFound()

  return (
    <DirectoryRoutePage
      eyebrow="Hermandades de Gloria"
      title={`${data.monthName} en ${data.localityName}`}
      description={`Hermandades cuya celebración o salida principal se sitúa en el mes de ${data.monthName}.`}
      hermandades={data.items}
      path={data.path}
      contextLabel={data.monthName}
      breadcrumbs={[
        { label: 'Glorias', href: '/hermandades/gloria' },
        { label: data.localityName },
        { label: data.monthName },
      ]}
    />
  )
}
