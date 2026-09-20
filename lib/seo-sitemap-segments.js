const SEGMENT_PATHS = {
  hermandades: ['/hermandades'],
  bandas: ['/bandas'],
  imagenes: ['/imagenes'],
  pasos: ['/pasos'],
  marchas: ['/marchas'],
  crucetas: ['/crucetas-musicales'],
  agenda: [
    '/agenda-cofrade',
    '/extraordinarias',
    '/igualas-y-ensayos',
    '/procesiones-de-gloria',
  ],
};

export const PUBLIC_SITEMAP_SEGMENTS = [
  'general',
  ...Object.keys(SEGMENT_PATHS),
];

function matchesPath(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function sitemapSegment(entry) {
  const pathname = new URL(entry.url).pathname;
  for (const [segment, prefixes] of Object.entries(SEGMENT_PATHS)) {
    if (prefixes.some((prefix) => matchesPath(pathname, prefix))) return segment;
  }
  return 'general';
}

export function sitemapEntriesForSegment(entries, segment) {
  if (!PUBLIC_SITEMAP_SEGMENTS.includes(segment)) return null;
  return entries.filter((entry) => sitemapSegment(entry) === segment);
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function xmlDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function renderSitemapXml(entries) {
  const urls = entries.map((entry) => {
    const lastModified = xmlDate(entry.lastModified);
    return [
      '  <url>',
      `    <loc>${escapeXml(entry.url)}</loc>`,
      ...(lastModified ? [`    <lastmod>${lastModified}</lastmod>`] : []),
      ...(entry.changeFrequency ? [`    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>`] : []),
      ...(Number.isFinite(entry.priority) ? [`    <priority>${entry.priority}</priority>`] : []),
      '  </url>',
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}
