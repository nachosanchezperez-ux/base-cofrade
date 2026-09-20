import { cache } from 'react'
import { notFound } from 'next/navigation'
import HeritageDirectoryRoutePage from '@/components/HeritageDirectoryRoutePage'
import { heritageDirectoryTypes, heritageItemsForType } from '@/lib/heritage-directory'
import { socialMetadata } from '@/lib/seo'
import { getStepsDirectory } from '@/lib/supabase/directories'

export const revalidate = 900

const getSteps = cache(getStepsDirectory)

function pageData(steps, tipo) {
  const facet = heritageDirectoryTypes(steps, 'pasos').find((item) => item.slug === tipo)
  const items = heritageItemsForType(steps, 'pasos', tipo)
  const path = `/pasos/tipo/${tipo}`
  const title = `${facet?.label || 'Tipología de pasos'} de Sevilla y provincia`
  const description = `Directorio de ${facet?.label.toLowerCase() || 'pasos cofrades'} de Sevilla capital y provincia, con sus fichas, hermandades, imágenes y evolución patrimonial.`
  return { facet, items, path, title, description }
}

export async function generateMetadata({ params }) {
  const { tipo } = await params
  const data = pageData(await getSteps(), tipo)
  if (!data.items.length) return { title: 'Tipología de pasos no encontrada', robots: { index: false, follow: false } }
  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function StepTypeDirectoryPage({ params }) {
  const { tipo } = await params
  const steps = await getSteps()
  const data = pageData(steps, tipo)
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
      contextLabel={data.facet.label}
    />
  )
}
