import HermandadesDirectoryV4 from '@/components/HermandadesDirectoryV4';
import BrotherhoodPublicIndex from '@/components/BrotherhoodPublicIndex';
import JsonLd from '@/components/JsonLd';
import { filterIndexableBrotherhoods } from '@/lib/brotherhood-public-index';
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory';
import { getPublicIndexableEntityEntries } from '@/lib/supabase/public-indexability';
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo';

export const revalidate = 900;

export const metadata = {
  title: 'Hermandades y Agrupaciones Parroquiales de Sevilla',
  description: 'Directorio de hermandades de Semana Santa, Gloria, Sacramentales y Agrupaciones Parroquiales de Sevilla capital y provincia.',
  alternates: {
    canonical: '/hermandades',
  },
  openGraph: {
    title: pageTitle('Directorio de hermandades y Agrupaciones Parroquiales'),
    description: 'Consulta hermandades y Agrupaciones Parroquiales de Sevilla capital y provincia.',
    url: '/hermandades',
  },
};

export default async function HermandadesPage() {
  const hermandades = await getHermandadesDirectory();
  const indexableEntries = await getPublicIndexableEntityEntries({
    brotherhoods: hermandades,
    bandDirectory: [],
    images: [],
    steps: [],
  });
  const indexableHermandades = filterIndexableBrotherhoods(hermandades, indexableEntries);
  const directoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/hermandades')}#collection`,
    url: absoluteUrl('/hermandades'),
    name: 'Directorio de hermandades y Agrupaciones Parroquiales',
    inLanguage: 'es',
    isPartOf: {
      '@id': `${absoluteUrl('/')}#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: indexableHermandades.length,
      itemListElement: indexableHermandades.map((hermandad, index) => ({
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
        <h1 className="page-title">Hermandades y Agrupaciones Parroquiales</h1>
        <p className="page-lead">
          Recorre las corporaciones de Sevilla capital y su provincia por su carácter, localidad y momento principal del calendario.
        </p>
        <HermandadesDirectoryV4 hermandades={hermandades} />
        <BrotherhoodPublicIndex brotherhoods={indexableHermandades} />
      </div>
    </section>
  );
}
