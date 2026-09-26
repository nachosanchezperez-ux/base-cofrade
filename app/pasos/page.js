import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import HeritageDirectoryFacets from '@/components/HeritageDirectoryFacets'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import { getStepsDirectory } from '@/lib/supabase/directories'
import { breadcrumbJsonLd, collectionPageJsonLd, socialMetadata } from '@/lib/seo'

export const revalidate = 900

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

function compactStepDirectoryItem(item) {
  return {
    id: item.id,
    name: item.name,
    href: item.href,
    type: item.type,
    date: item.date,
    brotherhoodName: item.brotherhoodName,
    municipality: item.municipality,
    municipalitySlug: item.municipalitySlug,
    imageNames: (item.imageNames || []).slice(0, 2),
    authorNames: (item.authorNames || []).slice(0, 2),
    coverPath: item.coverPath,
    coverAlt: item.coverAlt || [item.name, item.brotherhoodName].filter(Boolean).join(' · '),
    searchText: [
      item.style,
      item.materials,
      item.condition,
      ...(item.imageNames || []),
      ...(item.authorNames || []),
      ...(item.disciplines || []),
    ].filter(Boolean).join(' '),
  }
}

export default async function PasosPage() {
  await connection()
  const steps = await getStepsDirectory({ throwOnError: true })
  const directoryItems = steps.map(compactStepDirectoryItem)

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
        items: directoryItems.map((item) => ({ name: item.name, path: item.href })),
      })} />
      <div className="shell">
        <span className="eyebrow">Patrimonio procesional</span>
        <h1 className="page-title">Directorio de pasos</h1>
        <p className="page-lead">
          Recorre los pasos procesionales por hermandad, localidad y tipología, y sigue sus imágenes, fases de ejecución, autores y talleres.
        </p>
        <HeritageDirectoryFacets items={directoryItems} section="pasos" title="Pasos" />
        <RelationalEntityDirectory items={directoryItems} kind="step" />
      </div>
    </section>
  )
}
