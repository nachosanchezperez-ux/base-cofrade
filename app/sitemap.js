import { createClient } from '@supabase/supabase-js';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

const fallbackEntities = [
  { slug: 'el-baratillo', updated_at: null, entity_type: 'brotherhood' },
  { slug: 'asuncion-de-cantillana', updated_at: null, entity_type: 'brotherhood' },
  { slug: 'las-cigarreras', updated_at: null, entity_type: 'band' },
];

async function publishedEntities() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return fallbackEntities;
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
      .select('slug, updated_at, entity_type')
      .in('entity_type', ['brotherhood', 'band', 'image', 'step'])
      .eq('status', 'published')
      .not('slug', 'is', null);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo generar el sitemap desde Supabase', {
      error: error instanceof Error ? error.message : String(error),
    });
    return fallbackEntities;
  }
}

export default async function sitemap() {
  const entities = await publishedEntities();
  const brotherhoods = entities.filter((item) => item.entity_type === 'brotherhood');
  const bands = entities.filter((item) => item.entity_type === 'band');
  const images = entities.filter((item) => item.entity_type === 'image');
  const steps = entities.filter((item) => item.entity_type === 'step');
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
      url: absoluteUrl('/bandas'),
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
    ...bands.map((band) => ({
      url: absoluteUrl(`/bandas/${band.slug}`),
      ...(band.updated_at ? { lastModified: new Date(band.updated_at) } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...images.map((image) => ({
      url: absoluteUrl(`/imagenes/${image.slug}`),
      ...(image.updated_at ? { lastModified: new Date(image.updated_at) } : {}),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    ...steps.map((step) => ({
      url: absoluteUrl(`/pasos/${step.slug}`),
      ...(step.updated_at ? { lastModified: new Date(step.updated_at) } : {}),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
