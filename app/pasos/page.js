import JsonLd from '@/components/JsonLd'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import { getStepsDirectory } from '@/lib/supabase/directories'
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pasos cofrades de Sevilla y provincia',
  description: 'Directorio de pasos cofrades de Sevilla y su provincia: hermandad, imágenes, tipología, autores, talleres y evolución patrimonial.',
  alternates: { canonical: '/pasos' },
  openGraph: {
    title: pageTitle('Directorio de pasos'),
    description: 'Consulta pasos procesionales documentados y sus relaciones con hermandades, imágenes, autores, talleres y patrimonio.',
    url: '/pasos',
  },
}

export default async function PasosPage() {
  const steps = await getStepsDirectory()
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/pasos')}#collection`,
    url: absoluteUrl('/pasos'),
    name: 'Directorio de pasos',
    inLanguage: 'es',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: steps.length,
      itemListElement: steps.map((item, index) => ({
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
        { name: 'Pasos', path: '/pasos' },
      ])} />
      <JsonLd data={collection} />
      <div className="shell">
        <span className="eyebrow">Patrimonio procesional</span>
        <h1 className="page-title">Directorio de pasos</h1>
        <p className="page-lead">
          Recorre los pasos procesionales por hermandad, localidad y tipología, y sigue sus imágenes, fases de ejecución, autores y talleres.
        </p>
        <RelationalEntityDirectory items={steps} kind="step" />
      </div>
    </section>
  )
}
