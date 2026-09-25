import { cache } from 'react'
import { notFound } from 'next/navigation'
import HeritageDirectoryRoutePage from '@/components/HeritageDirectoryRoutePage'
import { heritageItemsForLocality } from '@/lib/heritage-directory'
import { socialMetadata } from '@/lib/seo'
import { getStepsDirectory } from '@/lib/supabase/directories'

export const revalidate = 900

const getSteps = cache(() => getStepsDirectory({ throwOnError: true }))

function pageData(steps, localidad) {
  const items = heritageItemsForLocality(steps, 'pasos', localidad)
  const label = items[0]?.municipality || ''
  const path = `/pasos/localidad/${localidad}`
  const title = `Pasos cofrades de ${label}`
  const description = `Directorio de pasos cofrades de ${label}, con sus fichas, hermandades, imágenes, autorías y evolución patrimonial.`
  return { items, label, path, title, description }
}

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const data = pageData(await getSteps(), localidad)
  if (!data.items.length) return { title: 'Localidad de pasos no encontrada', robots: { index: false, follow: false } }
  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function StepMunicipalityDirectoryPage({ params }) {
  const { localidad } = await params
  const steps = await getSteps()
  const data = pageData(steps, localidad)
  if (!data.items.length) notFound()

  return (
    <HeritageDirectoryRoutePage
      allItems={steps}
      items={data.items}
      kind="step"
      section="pasos"
      directoryLabel="Pasos"
      eyebrow="Patrimonio procesional"
      title={data.title}
      description={data.description}
      path={data.path}
      contextLabel={data.label}
      initialMunicipalitySlug={localidad}
      relatedAgendaHref={`/agenda-cofrade/localidad/${localidad === 'sevilla' ? 'sevilla-capital' : localidad}`}
    />
  )
}
