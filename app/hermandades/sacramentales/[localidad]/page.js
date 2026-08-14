import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import {
  hasDirectoryType,
  labelFromSlug,
  localitySlug,
} from '@/lib/brotherhood-directory'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const localityName = labelFromSlug(localidad)
  return {
    title: `Hermandades Sacramentales de ${localityName}`,
    description: `Directorio de Hermandades Sacramentales de ${localityName}.`,
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
  return (
    <DirectoryRoutePage
      eyebrow="Hermandades Sacramentales"
      title={`Sacramentales de ${localityName}`}
      description={`Corporaciones sacramentales documentadas en ${localityName}.`}
      hermandades={items}
      contextLabel="Sacramental"
      breadcrumbs={[
        { label: 'Sacramentales', href: '/hermandades/sacramentales' },
        { label: localityName },
      ]}
    />
  )
}
