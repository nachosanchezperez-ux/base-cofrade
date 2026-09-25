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

const SEO_PLACEHOLDER_PATTERN = /^(?:por documentar|pendiente(?:\s+de.*)?|por confirmar|sin documentar|en preparaci[oó]n)$/i;

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

export function compactSeoTitle(value, maxLength = 44) {
  const title = String(value || '').replace(/\s+/g, ' ').trim();
  if (title.length <= maxLength) return title;

  const shortened = title
    .slice(0, maxLength - 1)
    .replace(/\s+\S*$/, '')
    .replace(/[,:;.\-\s]+$/, '');

  return `${shortened || title.slice(0, maxLength - 1).trimEnd()}…`;
}

const SPANISH_MONTHS = new Map([
  ['enero', 1],
  ['febrero', 2],
  ['marzo', 3],
  ['abril', 4],
  ['mayo', 5],
  ['junio', 6],
  ['julio', 7],
  ['agosto', 8],
  ['septiembre', 9],
  ['setiembre', 9],
  ['octubre', 10],
  ['noviembre', 11],
  ['diciembre', 12],
]);

export function schemaDate(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return undefined;
  if (/^\d{4}(?:-\d{2}-\d{2})?$/.test(text)) return text;

  const fullDate = text.toLocaleLowerCase('es').match(/\b(\d{1,2})\s+de\s+([a-záéíóúüñ]+)\s+de\s+(\d{4})\b/u);
  const month = SPANISH_MONTHS.get(fullDate?.[2]);
  if (fullDate && month) {
    return `${fullDate[3]}-${String(month).padStart(2, '0')}-${String(fullDate[1]).padStart(2, '0')}`;
  }

  return text.match(/\b(\d{4})\b/)?.[1] || undefined;
}

export function schemaEventStatus({
  eventStatus,
  isCancelled = false,
  isPostponed = false,
  isUpcoming = false,
} = {}) {
  if (isCancelled || eventStatus === 'cancelled') return 'https://schema.org/EventCancelled';
  if (isPostponed || eventStatus === 'postponed') return 'https://schema.org/EventPostponed';
  if (eventStatus === 'held' || !isUpcoming) return undefined;
  return 'https://schema.org/EventScheduled';
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

export function filteredViewRobots(searchParams) {
  if (!searchParams) return undefined;

  const hasParams = typeof searchParams.keys === 'function'
    ? !searchParams.keys().next().done
    : typeof searchParams === 'object' && Object.keys(searchParams).length > 0;

  return hasParams ? { index: false, follow: true } : undefined;
}

export function organizationJsonLdRef({ name, path, url } = {}) {
  const internalPath = String(path || '').startsWith('/') ? String(path) : '';
  const resolvedUrl = internalPath ? absoluteUrl(internalPath) : String(url || path || '').trim();

  return {
    '@type': 'Organization',
    ...(internalPath ? { '@id': `${absoluteUrl(internalPath)}#organization` } : {}),
    ...(name ? { name } : {}),
    ...(resolvedUrl ? { url: resolvedUrl } : {}),
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

function hasMeaningfulSeoValue(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return Boolean(text) && !SEO_PLACEHOLDER_PATTERN.test(text);
}

function normalizedIncludes(value, fragment) {
  if (!value || !fragment) return false;
  return String(value)
    .toLocaleLowerCase('es')
    .includes(String(fragment).toLocaleLowerCase('es'));
}

export function intentSeoTitle(baseTitle, intentVariants = [], maxLength = 52) {
  const base = String(baseTitle || '').replace(/\s+/g, ' ').trim();
  if (!base) return '';

  for (const intent of intentVariants) {
    const candidate = `${base}: ${intent}`;
    if (candidate.length <= maxLength) return candidate;
  }

  return base;
}

export function brotherhoodInstitutionLabel(brotherhood) {
  const types = brotherhood.tipos || [];
  const officialName = String(brotherhood.nombreOficial || '').toLocaleLowerCase('es');

  if (types.includes('Agrupación Parroquial')) return 'Agrupación Parroquial';
  if (officialName.includes('agrupación parroquial')) return 'Agrupación Parroquial';
  if (officialName.includes('grupo de fieles')) return 'Grupo de Fieles';
  if (officialName.includes('asociación parroquial')) return 'Asociación Parroquial';
  return 'Hermandad';
}

export function brotherhoodPublicTypeLabel(brotherhood) {
  const institution = brotherhoodInstitutionLabel(brotherhood);
  if (institution !== 'Hermandad') return institution;

  const types = brotherhood.tipos || [];
  if (types.includes('Penitencia')) return 'Hermandad de Penitencia';
  if (types.includes('Gloria')) return 'Hermandad de Gloria';
  if (types.includes('Sacramental')) return 'Hermandad Sacramental';
  return institution;
}

function brotherhoodContextName(brotherhood) {
  const name = String(brotherhood.nombrePopular || brotherhood.nombreOficial || '').trim();
  const locality = String(brotherhood.localidad || '').trim();
  if (!locality || normalizedIncludes(name, locality)) return name;
  return `${name} (${locality})`;
}

export function brotherhoodSeoTitle(brotherhood) {
  return intentSeoTitle(
    brotherhoodContextName(brotherhood),
    [
      'titulares, pasos e historia',
      'titulares y pasos',
      'historia y pasos',
    ]
  );
}

export function brotherhoodSeoDescription(brotherhood) {
  const name = String(brotherhood.nombrePopular || brotherhood.nombreOficial || 'Hermandad').trim();
  const locality = String(brotherhood.localidad || '').trim();
  const localityText = locality && !normalizedIncludes(name, locality) ? ` en ${locality}` : '';
  const day = hasMeaningfulSeoValue(brotherhood.diaSalida) ? String(brotherhood.diaSalida).trim() : '';
  const topics = [];

  if (brotherhood.imagenes?.length) topics.push('titulares');
  if (brotherhood.pasos?.length) topics.push('pasos');
  if (
    brotherhood.acompanamientoActual?.length
    || brotherhood.acompanamientos?.length
    || brotherhood.patrimonioMusical?.length
  ) topics.push('música');
  if (brotherhood.patrimonio?.length) topics.push('patrimonio');
  if (brotherhood.cultos?.length) topics.push('cultos');
  if (brotherhood.cronologia?.length || hasMeaningfulSeoValue(brotherhood.historia)) topics.push('historia');
  if (brotherhood.salidas?.length) topics.push('salidas');
  topics.push('fuentes documentales');

  const lead = `${name}${localityText}: ${brotherhoodPublicTypeLabel(brotherhood)}${day ? ` · ${day}` : ''}.`;
  const topicText = topics.join(', ');
  const capitalizedTopics = `${topicText.charAt(0).toLocaleUpperCase('es')}${topicText.slice(1)}`;
  return seoDescription(`${lead} ${capitalizedTopics}.`);
}
