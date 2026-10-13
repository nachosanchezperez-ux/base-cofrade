import { absoluteUrl, SITE_URL } from '@/lib/seo';

// `_rsc` responses are Next.js client-navigation payloads, not pages. The HTML
// is server-rendered, so crawlers do not need them. GSC (12/10/2026) shows ~60 %
// of Googlebot requests over 90 days were `?_rsc=` URLs (Aug–8 Sep); blocking
// them keeps any future crawl for public fichas.
export default function robots() {
  return {
    rules: [
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/panel/', '/*?_rsc=', '/*&_rsc='],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/panel/', '/*?_rsc=', '/*&_rsc='],
      },
    ],
    sitemap: [
      absoluteUrl('/sitemap.xml'),
      absoluteUrl('/sitemaps/general.xml'),
      absoluteUrl('/sitemaps/hermandades.xml'),
      absoluteUrl('/sitemaps/bandas.xml'),
      absoluteUrl('/sitemaps/imagenes.xml'),
      absoluteUrl('/sitemaps/pasos.xml'),
      absoluteUrl('/sitemaps/marchas.xml'),
      absoluteUrl('/sitemaps/autores.xml'),
      absoluteUrl('/sitemaps/crucetas.xml'),
      absoluteUrl('/sitemaps/agenda.xml'),
    ],
    host: SITE_URL,
  };
}
