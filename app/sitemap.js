import { getCachedPublicData, PUBLIC_CACHE_TAGS } from '@/lib/cache/public-cache';
import {
  DIRECTORY_TYPES,
  directoryPath,
  hasDirectoryType,
} from '@/lib/brotherhood-directory';
import { absoluteUrl, INDEXABLE_DIRECTORY_MIN_ITEMS } from '@/lib/seo';
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 3600;

const fallbackEntities = [
  { slug: 'el-baratillo', updated_at: null, entity_type: 'brotherhood' },
  { slug: 'asuncion-de-cantillana', updated_at: null, entity_type: 'brotherhood' },
  { slug: 'las-cigarreras', updated_at: null, entity_type: 'band' },
];

async function loadPublishedEntities() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    if (process.env.VERCEL) {
      throw new Error('La generación del sitemap no dispone de las variables públicas de Supabase');
    }
    return fallbackEntities;
  }

  try {
    const supabase = createPublicClient();
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
    throw error;
  }
}

function publishedEntities() {
  return getCachedPublicData({
    key: ['sitemap-entities'],
    tags: [
      PUBLIC_CACHE_TAGS.BROTHERHOODS,
      PUBLIC_CACHE_TAGS.BANDS,
      PUBLIC_CACHE_TAGS.IMAGES,
      PUBLIC_CACHE_TAGS.STEPS,
    ],
    loader: loadPublishedEntities,
  });
}

export default async function sitemap() {
  const entities = await publishedEntities();
  const directoryBrotherhoods = process.env.NEXT_PUBLIC_SUPABASE_URL
    && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ? await getHermandadesDirectory()
    : [];
  const brotherhoods = entities.filter((item) => item.entity_type === 'brotherhood');
  const bands = entities.filter((item) => item.entity_type === 'band');
  const images = entities.filter((item) => item.entity_type === 'image');
  const steps = entities.filter((item) => item.entity_type === 'step');
  const thematicPaths = DIRECTORY_TYPES.flatMap((type) => {
    const items = directoryBrotherhoods.filter((item) => hasDirectoryType(item, type.key));
    const leafCounts = new Map();

    for (const item of items) {
      const path = directoryPath(item, type.key);
      if (path === type.href) continue;
      leafCounts.set(path, (leafCounts.get(path) || 0) + 1);
    }

    return [
      ...(items.length >= INDEXABLE_DIRECTORY_MIN_ITEMS ? [type.href] : []),
      ...[...leafCounts.entries()]
        .filter(([, count]) => count >= INDEXABLE_DIRECTORY_MIN_ITEMS)
        .map(([path]) => path),
    ];
  });
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
      url: absoluteUrl('/imagenes'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/pasos'),
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
    ...thematicPaths.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
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
