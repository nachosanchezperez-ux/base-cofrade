import JsonLd from '@/components/JsonLd'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import { getImagesDirectory } from '@/lib/supabase/directories'
import { breadcrumbJsonLd, collectionPageJsonLd, socialMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = 'Imágenes cofrades de Sevilla y provincia'
const description = 'Directorio de imágenes cofrades de Sevilla y su provincia: autoría, datación, hermandad, ubicación y relaciones históricas.'

export const metadata = {
  title,
  description,
  ...socialMetadata({
    title: 'Directorio de imágenes',
    description: 'Consulta imágenes cofrades documentadas y sus relaciones con hermandades, autores, lugares y pasos.',
    path: '/imagenes',
  }),
}

export default async function ImagenesPage() {
  const images = await getImagesDirectory()

  return (
    <section className="section page-top">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Imágenes', path: '/imagenes' },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: '/imagenes',
        name: 'Directorio de imágenes',
        description,
        items: images.map((item) => ({ name: item.name, path: item.href })),
      })} />
      <div className="shell">
        <span className="eyebrow">Enciclopedia cofrade</span>
        <h1 className="page-title">Directorio de imágenes</h1>
        <p className="page-lead">
          Descubre titulares y otras imágenes físicas a través de su hermandad, localidad, autoría, datación y relaciones documentadas.
        </p>
        <RelationalEntityDirectory items={images} kind="image" />
      </div>
    </section>
  )
}
