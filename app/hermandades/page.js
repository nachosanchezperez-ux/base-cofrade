import HermandadesDirectory from '@/components/HermandadesDirectory';
import JsonLd from '@/components/JsonLd';
import { getHermandadesDirectory } from '@/lib/supabase/brotherhoods';
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hermandades de Sevilla y provincia',
  description: 'Directorio de hermandades de Semana Santa, Gloria y Sacramentales de Sevilla capital y provincia, organizado por localidad, jornada y mes.',
  alternates: {
    canonical: '/hermandades',
  },
  openGraph: {
    title: pageTitle('Directorio de hermandades'),
    description: 'Consulta las hermandades de Semana Santa, Gloria y Sacramentales de Sevilla capital y provincia.',
    url: '/hermandades',
  },
};

export default async function HermandadesPage() {
  const hermandades = await getHermandadesDirectory();
  const directoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/hermandades')}#collection`,
    url: absoluteUrl('/hermandades'),
    name: 'Directorio de hermandades',
    inLanguage: 'es',
    isPartOf: {
      '@id': `${absoluteUrl('/')}#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: hermandades.length,
      itemListElement: hermandades.map((hermandad, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: hermandad.nombrePopular,
        url: absoluteUrl(`/hermandades/${hermandad.slug}`),
      })),
    },
  };

  return (
    <section className="section page-top">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
      ])} />
      <JsonLd data={directoryJsonLd} />
      <div className="shell">
        <span className="eyebrow">Enciclopedia cofrade</span>
        <h1 className="page-title">Directorio de hermandades</h1>
        <p className="page-lead">
          Recorre las hermandades de Sevilla capital y su provincia por su naturaleza, localidad y momento principal del calendario.
        </p>
        <HermandadesDirectory hermandades={hermandades} />
      </div>
    </section>
  );
}
