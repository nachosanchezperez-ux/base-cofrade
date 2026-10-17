import { notFound } from 'next/navigation'
import DirectoryRoutePage from '@/components/DirectoryRoutePage'
import { brotherhoodsForLocality } from '@/lib/brotherhood-public-index'
import { localityLabel } from '@/lib/brotherhood-directory'
import { localityBrotherhoodGroups, localityDirectorySeo } from '@/lib/locality-seo'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

// Listado de hermandades de una localidad («Hermandades de X»). La página
// principal de la localidad es su guía cofrade (/agenda-cofrade/localidad/x,
// «Cofradías de X»): este listado la enlaza arriba y comparte su lugar en el
// JSON-LD, para que los buscadores entiendan que hablan del mismo municipio.
function pageData(brotherhoods, localidad) {
  const items = brotherhoodsForLocality(brotherhoods, localidad)
  const label = items[0] ? localityLabel(items[0]) : ''
  const path = `/hermandades/localidad/${localidad}`
  const seo = localityDirectorySeo(label, items)
  const groups = localityBrotherhoodGroups(items)

  return { items, label, path, groups, guidePath: `/agenda-cofrade/localidad/${localidad}`, ...seo }
}

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const data = pageData(await getIndexableBrotherhoodDirectory(), localidad)

  if (!data.items.length) {
    return {
      title: 'Localidad de hermandades no encontrada',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function BrotherhoodMunicipalityDirectoryPage({ params }) {
  const { localidad } = await params
  const data = pageData(await getIndexableBrotherhoodDirectory(), localidad)

  if (!data.items.length) notFound()

  return (
    <DirectoryRoutePage
      eyebrow="Directorio territorial"
      title={`Hermandades de ${data.label}`}
      description={data.description}
      lead={data.lead}
      hermandades={data.items}
      groups={data.groups.length > 1 ? data.groups : []}
      path={data.path}
      breadcrumbs={[{ label: data.label }]}
      contextLabel={data.label}
      relatedAgendaHref={data.guidePath}
      relatedAgendaLabel={`Guía cofrade de ${data.label}: agenda, bandas, imágenes y pasos →`}
      place={{ path: data.guidePath, name: data.label }}
    />
  )
}
