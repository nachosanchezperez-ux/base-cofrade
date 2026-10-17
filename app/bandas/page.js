import { connection } from 'next/server'
import Link from 'next/link'
import BandDirectoryFacets from '@/components/BandDirectoryFacets'
import DirectoryIntroLink from '@/components/DirectoryIntroLink'
import JsonLd from '@/components/JsonLd'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import { bandDirectoryItems } from '@/lib/band-directory'
import { getPublicBandsDirectory } from '@/lib/supabase/public-directory-cache'
import { breadcrumbJsonLd, collectionPageJsonLd, filteredViewRobots, socialMetadata } from '@/lib/seo'

export const revalidate = 900

const title = 'Bandas de Sevilla y provincia'
const description = 'Directorio de bandas cofrades de Sevilla y su provincia: historia, acompañamientos, dirección, salidas y estrenos.'

export async function generateMetadata({ searchParams } = {}) {
  const robots = filteredViewRobots(await searchParams, ['tipo', 'localidad'])
  return {
    title,
    description,
    ...socialMetadata({
      title: 'Directorio de bandas',
      description: 'Consulta formaciones musicales y sus relaciones documentadas con hermandades, pasos, salidas, responsables y patrimonio musical.',
      path: '/bandas',
    }),
    ...(robots ? { robots } : {}),
  }
}

// Filtros heredados por URL (/bandas?tipo=…&localidad=…). Se leen en el
// servidor: antes un componente cliente con useSearchParams obligaba a un
// Suspense cuyo fallback pintaba las 152 tarjetas otra vez (381 KB de HTML).
function firstParam(value) {
  return String(Array.isArray(value) ? value[0] : value || '').trim()
}

export default async function BandasPage({ searchParams } = {}) {
  await connection()
  const params = (await searchParams) || {}
  const initialTypeSlug = firstParam(params.tipo)
  const initialMunicipalitySlug = firstParam(params.localidad)
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
          Formaciones conectadas con hermandades, pasos, salidas, responsables y patrimonio musical. Explora el archivo de{' '}
          <DirectoryIntroLink href="/marchas">marchas procesionales</DirectoryIntroLink>{' '}
          y el directorio de <DirectoryIntroLink href="/autores">autores y oficios</DirectoryIntroLink>.
        </p>
        <p>
          <Link className="button button-ghost" href="/acompanamientos-musicales" style={{ fontSize: '16px', gap: '10px' }}>
            Consultar acompañamientos por banda <span aria-hidden="true">→</span>
          </Link>
        </p>
        <BandDirectoryFacets bands={bands} />
        <RelationalEntityDirectory
          key={`${initialTypeSlug}:${initialMunicipalitySlug}`}
          items={items}
          kind="band"
          initialTypeSlug={initialTypeSlug}
          initialMunicipalitySlug={initialMunicipalitySlug}
        />
      </div>
    </section>
  )
}
