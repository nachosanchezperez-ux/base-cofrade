import JsonLd from '@/components/JsonLd'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import { getBandsDirectory } from '@/lib/supabase/bands'
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const BAND_LOGO_PRESENTATION = {
  'banda-del-sol': { mode: 'integrated', background: 'secondary' },
  'sangre-de-san-benito': { mode: 'integrated', background: 'primary' },
  'banda-de-musica-del-maestro-tejera': { mode: 'contained', color: '#EAF4FF' },
  'banda-municipal-de-musica-de-la-puebla-del-rio': { mode: 'contained', color: '#FCEBEC' },
  'banda-de-musica-nuestra-senora-de-la-soledad-cantillana': { mode: 'integrated', background: 'secondary' },
}

function logoPresentationFor(band) {
  const presentation = BAND_LOGO_PRESENTATION[band.slug]
  if (!presentation) return { mode: 'contained', backgroundColor: '' }

  const backgroundColor = presentation.color
    || (presentation.background === 'secondary'
      ? band.secondaryColor
      : presentation.background === 'primary'
        ? band.primaryColor
        : '')

  return {
    mode: presentation.mode,
    backgroundColor,
  }
}

export const metadata = {
  title: 'Bandas de Sevilla y provincia',
  description: 'Directorio de bandas cofrades de Sevilla y su provincia: historia, acompañamientos, dirección, salidas y estrenos.',
  alternates: { canonical: '/bandas' },
  openGraph: {
    title: pageTitle('Directorio de bandas'),
    description: 'Consulta formaciones musicales y sus relaciones documentadas con hermandades, pasos, salidas, responsables y patrimonio musical.',
    url: '/bandas',
  },
}

export default async function BandasPage({ searchParams }) {
  const [bands, filters] = await Promise.all([
    getBandsDirectory(),
    searchParams,
  ])
  const type = String(filters?.tipo || '')
  const municipality = String(filters?.localidad || '')
  const items = bands.map((band) => {
    const logoPresentation = logoPresentationFor(band)

    return {
      id: band.id,
      name: band.popularName,
      officialName: band.officialName,
      href: `/bandas/${band.slug}`,
      type: band.type,
      typeSlug: band.typeSlug,
      municipality: band.municipality,
      municipalitySlug: band.municipalitySlug,
      foundation: band.foundation,
      linkedBrotherhood: band.linkedBrotherhood,
      logoPath: band.logoPath,
      logoPresentationMode: logoPresentation.mode,
      logoBackgroundColor: logoPresentation.backgroundColor,
      primaryColor: band.primaryColor,
      secondaryColor: band.secondaryColor,
      keywords: [band.officialShortName, band.summary, band.linkedBrotherhood].filter(Boolean),
    }
  })
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/bandas')}#collection`,
    url: absoluteUrl('/bandas'),
    name: 'Directorio de bandas',
    inLanguage: 'es',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
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
        { name: 'Bandas', path: '/bandas' },
      ])} />
      <JsonLd data={collection} />
      <div className="shell">
        <span className="eyebrow">Enciclopedia musical</span>
        <h1 className="page-title">Directorio de bandas</h1>
        <p className="page-lead">
          Formaciones conectadas con hermandades, pasos, salidas, responsables y patrimonio musical.
        </p>
        <RelationalEntityDirectory
          items={items}
          kind="band"
          initialTypeSlug={type}
          initialMunicipalitySlug={municipality}
        />
      </div>
    </section>
  )
}
