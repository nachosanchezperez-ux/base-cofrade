import HermandadesDirectory from '@/components/HermandadesDirectory';
import JsonLd from '@/components/JsonLd';
import { getHermandadesDirectory } from '@/lib/supabase/brotherhoods';
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hermandades de Sevilla y provincia',
  description: 'Hermandades de Sevilla capital y provincia en Hilo Cofrade, organizadas por día de salida y conectadas con sus imágenes, pasos y patrimonio',
  alternates: {
    canonical: '/hermandades',
  },
  openGraph: {
    title: pageTitle('Hermandades de Sevilla y provincia'),
    description: 'Consulta las hermandades de Sevilla capital y provincia y descubre sus imágenes, pasos, cultos, salidas, patrimonio y relaciones documentadas.',
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
    name: 'Hermandades de Sevilla y provincia',
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
        <span className="eyebrow">Sevilla capital y provincia</span>
        <h1 className="page-title">Hermandades de Sevilla y provincia</h1>
        <p className="page-lead">
          Busca por nombre, sede o día de salida y entra directamente en la ficha de cada hermandad
        </p>
        <HermandadesDirectory hermandades={hermandades} />
      </div>
    </section>
  );
}
