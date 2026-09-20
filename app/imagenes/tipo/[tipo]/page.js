import { cache } from 'react'
import { notFound } from 'next/navigation'
import HeritageDirectoryRoutePage from '@/components/HeritageDirectoryRoutePage'
import { heritageDirectoryTypes, heritageItemsForType } from '@/lib/heritage-directory'
import { socialMetadata } from '@/lib/seo'
import { getImagesDirectory } from '@/lib/supabase/directories'

export const revalidate = 900

const getImages = cache(getImagesDirectory)

function pageData(images, tipo) {
  const facet = heritageDirectoryTypes(images, 'imagenes').find((item) => item.slug === tipo)
  const items = heritageItemsForType(images, 'imagenes', tipo)
  const path = `/imagenes/tipo/${tipo}`
  const title = `${facet?.label || 'Tipología de imágenes'} de Sevilla y provincia`
  const description = `Directorio de ${facet?.label.toLowerCase() || 'imágenes cofrades'} de Sevilla capital y provincia, con sus fichas, hermandades, autorías y relaciones documentadas.`
  return { facet, items, path, title, description }
}

export async function generateMetadata({ params }) {
  const { tipo } = await params
  const data = pageData(await getImages(), tipo)
  if (!data.items.length) return { title: 'Tipología de imágenes no encontrada', robots: { index: false, follow: false } }
  return {
    title: data.title,
    description: data.description,
    ...socialMetadata({ title: data.title, description: data.description, path: data.path }),
  }
}

export default async function ImageTypeDirectoryPage({ params }) {
  const { tipo } = await params
  const images = await getImages()
  const data = pageData(images, tipo)
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
      contextLabel={data.facet.label}
    />
  )
}
