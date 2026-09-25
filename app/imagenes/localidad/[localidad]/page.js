import { cache } from 'react'
import { notFound } from 'next/navigation'
import HeritageDirectoryRoutePage from '@/components/HeritageDirectoryRoutePage'
import { heritageItemsForLocality } from '@/lib/heritage-directory'
import { socialMetadata } from '@/lib/seo'
import { getImagesDirectory } from '@/lib/supabase/directories'

export const revalidate = 900

const getImages = cache(() => getImagesDirectory({ throwOnError: true }))

function pageData(images, localidad) {
  const items = heritageItemsForLocality(images, 'imagenes', localidad)
  const label = items[0]?.municipality || ''
  const path = `/imagenes/localidad/${localidad}`
  const title = `Imágenes cofrades de ${label}`
  const description = `Directorio de imágenes cofrades de ${label}, con sus fichas, hermandades, autorías, datación y relaciones documentadas.`
  return { items, label, path, title, description }
}

export async function generateMetadata({ params }) {
  const { localidad } = await params
  const data = pageData(await getImages(), localidad)
  if (!data.items.length) return { title: 'Localidad de imágenes no encontrada', robots: { index: false, follow: false } }
  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function ImageMunicipalityDirectoryPage({ params }) {
  const { localidad } = await params
  const images = await getImages()
  const data = pageData(images, localidad)
  if (!data.items.length) notFound()

  return (
    <HeritageDirectoryRoutePage
      allItems={images}
      items={data.items}
      kind="image"
      section="imagenes"
      directoryLabel="Imágenes"
      eyebrow="Patrimonio devocional"
      title={data.title}
      description={data.description}
      path={data.path}
      contextLabel={data.label}
      initialMunicipalitySlug={localidad}
      relatedAgendaHref={`/agenda-cofrade/localidad/${localidad === 'sevilla' ? 'sevilla-capital' : localidad}`}
    />
  )
}
