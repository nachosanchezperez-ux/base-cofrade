import { getPublicSitemapEntries } from '@/app/sitemap';
import { absoluteUrl } from '@/lib/seo';
import { getPublicAgentSitemapEntries } from '@/lib/supabase/public-agents';
import {
  renderSitemapXml,
  sitemapEntriesForSegment,
} from '@/lib/seo-sitemap-segments';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET(_request, { params }) {
  const { family } = await params;
  const segment = family.endsWith('.xml') ? family.slice(0, -4) : family;
  const entries = segment === 'autores'
    ? (await getPublicAgentSitemapEntries()).map((author) => ({
        url: absoluteUrl(`/autores/${author.slug}`),
        ...(author.updatedAt ? { lastModified: author.updatedAt } : {}),
        changeFrequency: 'monthly',
        priority: 0.64,
      }))
    : sitemapEntriesForSegment(
        await getPublicSitemapEntries(),
        segment
      );

  if (!entries) {
    return new Response('Sitemap no encontrado', { status: 404 });
  }

  return new Response(renderSitemapXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
