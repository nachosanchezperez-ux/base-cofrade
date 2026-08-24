import { DIRECTORY_TYPES, directoryPath } from '@/lib/brotherhood-directory';
import { absoluteUrl } from '@/lib/seo';
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory';
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory';
import { createPublicClient } from '@/lib/supabase/public';

export const revalidate = 3600;

const fallbackEntities = [
  { slug: 'el-baratillo', updated_at: null, entity_type: 'brotherhood' },
  { slug: 'asuncion-de-cantillana', updated_at: null, entity_type: 'brotherhood' },
  { slug: 'las-cigarreras', updated_at: null, entity_type: 'band' },
];

const staticEntries = [
  {
    url: absoluteUrl('/'),
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: absoluteUrl('/directorio'),
    changeFrequency: 'daily',
    priority: 0.95,
  },
  {
    url: absoluteUrl('/hermandades'),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: absoluteUrl('/hermandades/semana-santa'),
    changeFrequency: 'weekly',
    priority: 0.85,
  },
  {
    url: absoluteUrl('/hermandades/gloria'),
    changeFrequency: 'weekly',
    priority: 0.85,
  },
  {
    url: absoluteUrl('/hermandades/sacramentales'),
    changeFrequency: 'weekly',
    priority: 0.85,
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
    url: absoluteUrl('/extraordinarias'),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: absoluteUrl('/pregunta'),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: absoluteUrl('/colabora'),
    changeFrequency: 'monthly',
    priority: 0.4,
  },
];

function validLastModified(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function entityEntry(item, path, changeFrequency, priority) {
  const lastModified = validLastModified(item.updated_at);
  return {
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  };
}

async function publishedEntities() {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('entities')
      .select('slug, updated_at, entity_type')
      .in('entity_type', ['brotherhood', 'band', 'image', 'step'])
      .eq('status', 'published')
      .not('slug', 'is', null);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo generar el sitemap desde Supabase', {
      error: error instanceof Error ? error.message : String(error),
    });
    return fallbackEntities;
  }
}

function directoryEntries(brotherhoods) {
  const paths = DIRECTORY_TYPES.flatMap(({ key }) => (
    brotherhoods.map((brotherhood) => directoryPath(brotherhood, key))
  )).filter(Boolean);

  return [...new Set(paths)].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'weekly',
    priority: 0.72,
  }));
}

function extraordinaryEntries(outings) {
  return outings
    .filter((outing) => Boolean(outing.slug))
    .map((outing) => ({
      url: absoluteUrl(`/extraordinarias/${outing.slug}`),
      changeFrequency: outing.isUpcoming ? 'daily' : 'monthly',
      priority: outing.isUpcoming ? 0.82 : 0.68,
    }));
}

export default async function sitemap() {
  const [entities, brotherhoodDirectory, extraordinaryOutings] = await Promise.all([
    publishedEntities(),
    getHermandadesDirectory(),
    getExtraordinaryDirectory(),
  ]);
  const brotherhoods = entities.filter((item) => item.entity_type === 'brotherhood');
  const bands = entities.filter((item) => item.entity_type === 'band');
  const images = entities.filter((item) => item.entity_type === 'image');
  const steps = entities.filter((item) => item.entity_type === 'step');
  const entries = [
    ...staticEntries,
    ...brotherhoods.map((brotherhood) => entityEntry(
      brotherhood,
      `/hermandades/${brotherhood.slug}`,
      'weekly',
      0.8
    )),
    ...bands.map((band) => entityEntry(
      band,
      `/bandas/${band.slug}`,
      'weekly',
      0.8
    )),
    ...images.map((image) => entityEntry(
      image,
      `/imagenes/${image.slug}`,
      'monthly',
      0.7
    )),
    ...steps.map((step) => entityEntry(
      step,
      `/pasos/${step.slug}`,
      'monthly',
      0.7
    )),
    ...directoryEntries(brotherhoodDirectory),
    ...extraordinaryEntries(extraordinaryOutings),
  ];

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
