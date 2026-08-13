export const SITE_NAME = 'Hilo Cofrade';
export const SITE_URL = 'https://hilocofrade.es';
export const HOME_TITLE = 'Hilo Cofrade | Enciclopedia cofrade de Sevilla y provincia';
export const DEFAULT_DESCRIPTION = 'Enciclopedia cofrade de Sevilla y su provincia: hermandades, imágenes, pasos, bandas, marchas, autores, patrimonio, cultos y salidas relacionados.';

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

export function brotherhoodSeoTitle(brotherhood) {
  const name = brotherhood.nombrePopular;
  const locality = brotherhood.localidad;
  const knownTitles = {
    'el-baratillo': 'Hermandad del Baratillo',
    'asuncion-de-cantillana': 'Hermandad de la Asunción de Cantillana',
  };
  const baseTitle = knownTitles[brotherhood.slug] || `Hermandad: ${name}`;
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
