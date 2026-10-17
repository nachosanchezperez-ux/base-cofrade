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

// Separators that must never be left dangling before an ellipsis ("pueblo ·…").
const SEO_TRAILING_SEPARATORS = /[\s,:;.·•|/\-–—]+$/u;

export function compactSeoTitle(value, maxLength = 44) {
  const title = String(value || '').replace(/\s+/g, ' ').trim();
  if (title.length <= maxLength) return title;

  const shortened = title
    .slice(0, maxLength - 1)
    .replace(/\s+\S*$/, '')
    .replace(SEO_TRAILING_SEPARATORS, '');

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

export function filteredViewRobots(searchParams, filterKeys = []) {
  if (!searchParams || !filterKeys.length) return undefined;

  const params = typeof searchParams.has === 'function'
    ? searchParams
    : new URLSearchParams(Object.entries(searchParams).flatMap(([key, value]) => (
      Array.isArray(value)
        ? value.map((item) => [key, item])
        : value == null ? [] : [[key, value]]
    )));

  const hasFilterParams = filterKeys.some((key) => params.has(key));
  return hasFilterParams ? { index: false, follow: true } : undefined;
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

export function municipalityPlaceJsonLd({ path, name, region = 'Sevilla', country = 'ES' }) {
  const locality = String(name || '').trim();
  const addressLocality = locality.toLocaleLowerCase('es') === 'sevilla capital'
    ? 'Sevilla'
    : locality;

  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${absoluteUrl(path)}#place`,
    name: locality,
    url: absoluteUrl(path),
    address: {
      '@type': 'PostalAddress',
      addressLocality,
      addressRegion: region,
      addressCountry: country,
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

export function collectionPageJsonLd({
  path,
  name,
  description,
  items = [],
  about = null,
  spatialCoverage = null,
}) {
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
    ...(about ? { about } : {}),
    ...(spatialCoverage ? { spatialCoverage } : {}),
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

function cleanSeoText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

// Heritage fichas (Imágenes, Pasos) share advocations across many Hermandades
// ("Santísimo Cristo de la Expiración" exists in five). The Hermandad, and the
// locality when it fits, make each title unique and match how people search.
export function contextualEntitySeoTitle(name, { context = '', locality = '' } = {}, maxLength = 68) {
  const base = cleanSeoText(name);
  if (!base) return '';

  const contextName = cleanSeoText(context);
  const ctx = contextName && !normalizedIncludes(base, contextName) ? contextName : '';
  const localityName = cleanSeoText(locality);
  const loc = localityName && !normalizedIncludes(`${base} ${ctx}`, localityName) ? localityName : '';

  const candidates = [
    ctx && loc ? `${base} · ${ctx} (${loc})` : '',
    ctx ? `${base} · ${ctx}` : '',
    !ctx && loc ? `${base} (${loc})` : '',
  ].filter(Boolean);

  return candidates.find((candidate) => candidate.length <= maxLength) || candidates.at(-1) || base;
}

// Many marches share a title ("Macarena" by Abel Moreno, Emilio Cebrián and
// Bienvenido Puelles); the composer is the natural disambiguator.
export function marchSeoTitle(name, composers = [], maxLength = 58) {
  const base = cleanSeoText(name);
  if (!base) return '';

  const names = [...new Set(composers.map(cleanSeoText).filter(Boolean))];
  const composerText = names.length > 2
    ? `${names[0]} y otros`
    : names.join(' y ');

  const candidates = [
    composerText ? `${base}, de ${composerText}` : '',
    `${base} · Marcha procesional`,
  ].filter(Boolean);

  return candidates.find((candidate) => candidate.length <= maxLength)
    || compactSeoTitle(candidates[0], maxLength);
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
    ],
    46
  );
}

export function brotherhoodSeoDescription(brotherhood) {
  const name = String(brotherhood.nombrePopular || brotherhood.nombreOficial || 'Hermandad').trim();
  const locality = String(brotherhood.localidad || '').trim();
  const localityText = locality && !normalizedIncludes(name, locality) ? ` en ${locality}` : '';
  const editorialSummary = String(brotherhood.editorialGuide?.summary || '').trim();

  if (editorialSummary) {
    const prefix = normalizedIncludes(editorialSummary, name)
      ? ''
      : `${name}${localityText}: `;
    return seoDescription(`${prefix}${editorialSummary}`);
  }

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

  // Primero, una frase de hechos que buscadores e IA pueden citar tal cual.
  const lead = brotherhoodFactSentence(brotherhood);
  const topicText = topics.join(', ');
  const capitalizedTopics = `${topicText.charAt(0).toLocaleUpperCase('es')}${topicText.slice(1)}`;
  return seoDescription(`${lead} ${capitalizedTopics}.`);
}


// ---------------------------------------------------------------------------
// Frase de hechos de una Hermandad, solo con datos publicados:
// «La Macarena es una hermandad de penitencia de Sevilla, con sede en la Basílica
// de Santa María de la Esperanza Macarena. Sale en procesión en la Madrugada.»

const TYPE_PHRASES = {
  'Hermandad de Penitencia': 'una hermandad de penitencia',
  'Hermandad de Gloria': 'una hermandad de Gloria',
  'Hermandad Sacramental': 'una hermandad sacramental',
  'Agrupación Parroquial': 'una agrupación parroquial',
  'Grupo de Fieles': 'un grupo de fieles',
  'Asociación Parroquial': 'una asociación parroquial',
  Hermandad: 'una hermandad',
};

const FEMININE_PLACE = /^(?:real |insigne |pontificia |santa |s\.\s?i\.\s?)*(?:parroquia|basílica|iglesia|capilla|catedral|ermita|casa|colegiata|santa iglesia)\b/iu;
const MASCULINE_PLACE = /^(?:real |antiguo )*(?:convento|monasterio|templo|oratorio|santuario|colegio|hospital)\b/iu;
const MONTHS_ES = /^(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)$/iu;

function placeWithArticle(place) {
  const text = cleanSeoText(place);
  if (!text) return '';
  if (/^(?:la|el|los|las)\s/iu.test(text)) return text;
  if (FEMININE_PLACE.test(text)) return `la ${text}`;
  if (MASCULINE_PLACE.test(text)) return `el ${text}`;
  return text;
}

function lowerFirst(value) {
  return `${value.charAt(0).toLocaleLowerCase('es')}${value.slice(1)}`;
}

// «el Martes Santo», «en la Madrugada», «en septiembre», «el 8 de septiembre».
// Devuelve '' cuando el dato no encaja en ninguna forma segura.
export function processionDayPhrase(value) {
  const day = cleanSeoText(String(value || '').split('·')[0]);
  if (!hasMeaningfulSeoValue(day)) return '';
  if (/^madrug/iu.test(day)) return `en la ${day}`;
  if (MONTHS_ES.test(day)) return `en ${day.toLocaleLowerCase('es')}`;
  if (/^\d{1,2} de /u.test(day)) return `el ${day}`;
  if (/^(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b/iu.test(day)) return `el ${day}`;
  if (/^(?:primer|segundo|tercer|cuarto|último|penúltimo)\b/iu.test(day)) return `el ${lowerFirst(day)}`;
  return '';
}

// Año de fundación solo cuando el texto es inequívoco («1948», «Fundada en 1931»).
export function brotherhoodFoundingYear(value) {
  const match = /^(?:fundada en\s+)?(\d{4})\.?$/iu.exec(cleanSeoText(value));
  return match ? match[1] : '';
}

function neighborhoodPhrase(brotherhood, name, locality) {
  const barrio = cleanSeoText(brotherhood.barrio);
  if (!barrio || /[·()–]/u.test(barrio)) return '';
  if (/^centro$/iu.test(barrio)) return '';
  if (normalizedIncludes(name, barrio) || normalizedIncludes(barrio, locality)) return '';
  // Entre paréntesis: evita el artículo («del Arenal», «de El Porvenir»).
  return ` (${barrio})`;
}

export function brotherhoodFactSentence(brotherhood = {}) {
  const name = cleanSeoText(brotherhood.nombrePopular || brotherhood.nombreOficial || 'Esta hermandad');
  const locality = cleanSeoText(brotherhood.localidad);
  const typePhrase = TYPE_PHRASES[brotherhoodPublicTypeLabel(brotherhood)] || 'una hermandad';
  const localityText = locality && !normalizedIncludes(name, locality) ? ` de ${locality}` : '';
  const seat = placeWithArticle(brotherhood.sede);
  const sentences = [
    `${name} es ${typePhrase}${localityText}${neighborhoodPhrase(brotherhood, name, locality)}${seat ? `, con sede en ${seat}` : ''}.`,
  ];
  const day = processionDayPhrase(brotherhood.diaSalida);
  if (day) sentences.push(`Sale en procesión ${day}.`);
  const founded = brotherhoodFoundingYear(brotherhood.fundacion);
  if (founded) sentences.push(`Fundada en ${founded}.`);
  return sentences.join(' ');
}

// Sede como Place de schema.org, con la dirección publicada desglosada cuando
// trae código postal («Plaza María Santísima del Amor, s/n, 41015 Sevilla»).
// Sin coordenadas: ninguna sede las tiene hoy y no se deducen.
export function brotherhoodSeatJsonLd(seat = {}, { locality = '', region = 'Sevilla' } = {}) {
  const name = cleanSeoText(seat?.nombre);
  if (!name) return null;
  const rawAddress = cleanSeoText(seat.direccion);
  const postal = /\b(\d{5})\b/u.exec(rawAddress);
  const seatLocality = cleanSeoText(seat.localidad || locality);
  const seatRegion = cleanSeoText(seat.provincia) || region;
  // Sin el municipio ni la provincia repetidos al final («Calle Bécquer, 1, Sevilla»),
  // y vacío si solo era el municipio («Dos Hermanas», «Alcalá de Guadaíra, Sevilla»).
  let streetAddress = postal
    ? rawAddress.slice(0, postal.index).replace(/[\s,]+$/u, '')
    : rawAddress;
  for (const suffix of [seatRegion, seatLocality]) {
    if (!suffix) continue;
    const lowerStreet = streetAddress.toLocaleLowerCase('es');
    const lowerSuffix = suffix.toLocaleLowerCase('es');
    if (lowerStreet === lowerSuffix) streetAddress = '';
    else if (lowerStreet.endsWith(`, ${lowerSuffix}`)) streetAddress = streetAddress.slice(0, -(lowerSuffix.length + 2)).trim();
  }
  return {
    '@type': 'Place',
    name,
    address: {
      '@type': 'PostalAddress',
      ...(streetAddress ? { streetAddress } : {}),
      ...(postal ? { postalCode: postal[1] } : {}),
      ...(seatLocality ? { addressLocality: seatLocality } : {}),
      addressRegion: seatRegion,
      addressCountry: 'ES',
    },
  };
}
