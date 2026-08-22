import JsonLd from '@/components/JsonLd'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import { getStepsDirectory } from '@/lib/supabase/directories'
import { breadcrumbJsonLd, collectionPageJsonLd, socialMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = 'Pasos cofrades de Sevilla y provincia'
const description = 'Directorio de pasos cofrades de Sevilla y su provincia: hermandad, imágenes, tipología, autores, talleres y evolución patrimonial.'

export const metadata = {
  title,
  description,
  ...socialMetadata({
    title: 'Directorio de pasos',
    description: 'Consulta pasos procesionales documentados y sus relaciones con hermandades, imágenes, autores, talleres y patrimonio.',
    path: '/pasos',
  }),
}

export default async function PasosPage() {
  const steps = await getStepsDirectory()

  return (
    <section className="section page-top">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Pasos', path: '/pasos' },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: '/pasos',
        name: 'Directorio de pasos',
        description,
        items: steps.map((item) => ({ name: item.name, path: item.href })),
      })} />
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
