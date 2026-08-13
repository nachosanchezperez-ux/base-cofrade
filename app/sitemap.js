import { createClient } from '@supabase/supabase-js';
import { hermandades } from '@/lib/data';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

async function publishedBrotherhoods() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return hermandades.map(({ slug }) => ({ slug, updated_at: null }));
  }

  try {
    const supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    const { data, error } = await supabase
      .from('entities')
      .select('slug, updated_at')
      .eq('entity_type', 'brotherhood')
      .eq('status', 'published')
      .not('slug', 'is', null);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo generar el sitemap desde Supabase', {
      error: error instanceof Error ? error.message : String(error),
    });
    return hermandades.map(({ slug }) => ({ slug, updated_at: null }));
  }
}

export default async function sitemap() {
  const brotherhoods = await publishedBrotherhoods();
  const entries = [
    {
      url: absoluteUrl('/'),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/hermandades'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/colabora'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...brotherhoods.map((brotherhood) => ({
      url: absoluteUrl(`/hermandades/${brotherhood.slug}`),
      ...(brotherhood.updated_at ? { lastModified: new Date(brotherhood.updated_at) } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...hermandades.flatMap((hermandad) => [
      ...hermandad.imagenes.map((imagen) => ({
        url: absoluteUrl(`/imagenes/${imagen.slug}`),
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
      ...hermandad.pasos.map((paso) => ({
        url: absoluteUrl(`/pasos/${paso.slug}`),
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
    ]),
  ];

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
