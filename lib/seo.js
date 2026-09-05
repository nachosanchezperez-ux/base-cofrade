export const SITE_NAME = 'Hilo Cofrade';
export const SITE_URL = 'https://hilocofrade.es';
export const HOME_TITLE = 'Hilo Cofrade | Enciclopedia cofrade de Sevilla y provincia';
export const DEFAULT_DESCRIPTION = 'Enciclopedia cofrade de Sevilla y su provincia: hermandades, imágenes, pasos, bandas, marchas, autores, patrimonio, cultos y salidas relacionados.';

const DEFAULT_SOCIAL_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Hilo Cofrade, enciclopedia cofrade de Sevilla y provincia',
};

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function seoDescription(value, fallback = DEFAULT_DESCRIPTION, maxLength = 160) {
  const text = String(value || fallback)
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;

  const shortened = text
    .slice(0, maxLength - 1)
    .replace(/\s+\S*$/, '')
    .replace(/[,:;.\-\s]+$/, '');

  return `${shortened}…`;
}

export function pageTitle(title) {
  return `${title} · ${SITE_NAME}`;
}

export function socialMetadata({ title, description, path, type = 'website', images = [DEFAULT_SOCIAL_IMAGE] }) {
  const resolvedTitle = String(title).includes(SITE_NAME) ? String(title) : pageTitle(title);
  const resolvedDescription = seoDescription(description);

  return {
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: 'es_ES',
      siteName: SITE_NAME,
      title: resolvedTitle,
      description: resolvedDescription,
      url: path,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: images.map((image) => image.url || image),
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd({ path, name, description, items = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(path)}#collection`,
    url: absoluteUrl(path),
    name,
    description: seoDescription(description),
    inLanguage: 'es',
    isPartOf: {
      '@id': `${absoluteUrl('/')}#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

function brotherhoodInstitutionLabel(brotherhood) {
  const officialName = String(brotherhood.nombreOficial || '').toLocaleLowerCase('es');

  if (officialName.includes('agrupación parroquial')) return 'Agrupación Parroquial';
  if (officialName.includes('grupo de fieles')) return 'Grupo de Fieles';
  if (officialName.includes('asociación parroquial')) return 'Asociación Parroquial';
  return 'Hermandad';
}

export function brotherhoodSeoTitle(brotherhood) {
  const name = brotherhood.nombrePopular;
  const locality = brotherhood.localidad;
  const knownTitles = {
    'el-baratillo': 'Hermandad del Baratillo',
    'asuncion-de-cantillana': 'Hermandad de la Asunción de Cantillana',
  };
  const alreadyInstitutional = /^(?:hermandad|archicofrad[ií]a|cofrad[ií]a|agrupaci[oó]n parroquial|grupo de fieles|asociaci[oó]n parroquial)\b/i.test(name);
  const baseTitle = knownTitles[brotherhood.slug]
    || (alreadyInstitutional ? name : `${brotherhoodInstitutionLabel(brotherhood)} de ${name}`);
  const includesLocality = locality && baseTitle
    .toLocaleLowerCase('es')
    .includes(locality.toLocaleLowerCase('es'));

  return `${baseTitle}${locality && !includesLocality ? ` (${locality})` : ''}`;
}

export function brotherhoodSeoDescription(brotherhood) {
  const fallback = [
    `Ficha documentada de ${brotherhood.nombrePopular}`,
    brotherhood.localidad ? `en ${brotherhood.localidad}` : '',
    ': historia, titulares, pasos, cultos, salidas, patrimonio, acompañamientos musicales y fuentes.',
  ].filter(Boolean).join(' ')
    .replace(/\s+:/, ':');

  return seoDescription(fallback);
}
