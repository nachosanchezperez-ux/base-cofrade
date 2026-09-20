import { Suspense } from 'react'
import BandDirectoryFacets from '@/components/BandDirectoryFacets'
import JsonLd from '@/components/JsonLd'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import RelationalEntityDirectoryFromUrl from '@/components/RelationalEntityDirectoryFromUrl'
import { bandDirectoryItems } from '@/lib/band-directory'
import { getPublicBandsDirectory } from '@/lib/supabase/bands-directory-public'
import { breadcrumbJsonLd, collectionPageJsonLd, socialMetadata } from '@/lib/seo'

export const revalidate = 900

const title = 'Bandas de Sevilla y provincia'
const description = 'Directorio de bandas cofrades de Sevilla y su provincia: historia, acompañamientos, dirección, salidas y estrenos.'

export const metadata = {
  title,
  description,
  ...socialMetadata({
    title: 'Directorio de bandas',
    description: 'Consulta formaciones musicales y sus relaciones documentadas con hermandades, pasos, salidas, responsables y patrimonio musical.',
    path: '/bandas',
  }),
}

export default async function BandasPage() {
  const bands = await getPublicBandsDirectory()
  const items = bandDirectoryItems(bands)

  return (
    <section className="section page-top">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Bandas', path: '/bandas' },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: '/bandas',
        name: 'Directorio de bandas',
        description,
        items: items.map((item) => ({ name: item.name, path: item.href })),
      })} />
      <div className="shell">
        <span className="eyebrow">Enciclopedia musical</span>
        <h1 className="page-title">Directorio de bandas</h1>
        <p className="page-lead">
          Formaciones conectadas con hermandades, pasos, salidas, responsables y patrimonio musical.
        </p>
        <BandDirectoryFacets bands={bands} />
        <Suspense fallback={<RelationalEntityDirectory items={items} kind="band" />}>
          <RelationalEntityDirectoryFromUrl items={items} kind="band" />
        </Suspense>
      </div>
    </section>
  )
}
