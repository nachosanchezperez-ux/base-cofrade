import JsonLd from '@/components/JsonLd'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import { getImagesDirectory } from '@/lib/supabase/directories'
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Imágenes cofrades de Sevilla y provincia',
  description: 'Directorio de imágenes cofrades de Sevilla y su provincia: autoría, datación, hermandad, ubicación y relaciones históricas.',
  alternates: { canonical: '/imagenes' },
  openGraph: {
    title: pageTitle('Directorio de imágenes'),
    description: 'Consulta imágenes cofrades documentadas y sus relaciones con hermandades, autores, lugares y pasos.',
    url: '/imagenes',
  },
}

export default async function ImagenesPage() {
  const images = await getImagesDirectory()
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/imagenes')}#collection`,
    url: absoluteUrl('/imagenes'),
    name: 'Directorio de imágenes',
    inLanguage: 'es',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: images.length,
      itemListElement: images.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.href),
      })),
    },
  }

  return (
    <section className="section page-top">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Imágenes', path: '/imagenes' },
      ])} />
      <JsonLd data={collection} />
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
