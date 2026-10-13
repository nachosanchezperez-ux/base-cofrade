import { getPublicSitemapSegmentEntries } from '@/app/sitemap';
import {
  renderSitemapXml,
} from '@/lib/seo-sitemap-segments';

// Family sitemaps must not lag behind /sitemap.xml: newly published fichas
// were missing for hours behind a day-long stale-while-revalidate.
export const revalidate = 900;

export async function GET(_request, { params }) {
  const { family } = await params;
  const segment = family.endsWith('.xml') ? family.slice(0, -4) : family;
  const entries = await getPublicSitemapSegmentEntries(segment);

  if (!entries) {
    return new Response('Sitemap no encontrado', { status: 404 });
  }

  return new Response(renderSitemapXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=900',
    },
  });
}
