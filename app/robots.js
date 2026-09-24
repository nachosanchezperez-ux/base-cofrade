import { absoluteUrl, SITE_URL } from '@/lib/seo';

export default function robots() {
  return {
    rules: [
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/panel/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/panel/'],
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
