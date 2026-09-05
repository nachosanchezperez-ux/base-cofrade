import {
  DIRECTORY_TYPES,
  directoryPath,
  hasDirectoryType,
} from '@/lib/brotherhood-directory';
import { absoluteUrl } from '@/lib/seo';
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory';
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory';
import { getGloryDirectory } from '@/lib/supabase/glory-directory';
import { getCrewEventDirectory } from '@/lib/supabase/crew-events';
import { getPublicIndexableEntityEntries } from '@/lib/supabase/public-indexability';

export const revalidate = 3600;

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
    url: absoluteUrl('/igualas-y-ensayos'),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: absoluteUrl('/procesiones-de-gloria'),
    changeFrequency: 'daily',
    priority: 0.88,
  },
  {
    url: absoluteUrl('/pregunta'),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: absoluteUrl('/aviso-legal'),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
  {
    url: absoluteUrl('/privacidad'),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
  {
    url: absoluteUrl('/cookies'),
    changeFrequency: 'yearly',
    priority: 0.2,
  },
];

const entitySitemapConfig = {
  brotherhood: { segment: 'hermandades', changeFrequency: 'weekly', priority: 0.8 },
  band: { segment: 'bandas', changeFrequency: 'weekly', priority: 0.8 },
  image: { segment: 'imagenes', changeFrequency: 'monthly', priority: 0.7 },
  step: { segment: 'pasos', changeFrequency: 'monthly', priority: 0.7 },
};

function validLastModified(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function entityEntries(items) {
  return items.flatMap((item) => {
    const config = entitySitemapConfig[item.entityType];
    if (!config || !item.slug) return [];
    const lastModified = validLastModified(item.updatedAt);
    return [{
      url: absoluteUrl(`/${config.segment}/${item.slug}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: config.changeFrequency,
      priority: config.priority,
    }];
  });
}

function directoryEntries(brotherhoods) {
  const paths = DIRECTORY_TYPES.flatMap(({ key }) => (
    brotherhoods
      .filter((brotherhood) => hasDirectoryType(brotherhood, key))
      .map((brotherhood) => directoryPath(brotherhood, key))
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

function gloryEntries(outings) {
  return outings
    .filter((outing) => Boolean(outing.detailHref))
    .map((outing) => ({
      url: absoluteUrl(outing.detailHref),
      changeFrequency: outing.isUpcoming ? 'daily' : 'monthly',
      priority: outing.isUpcoming ? 0.8 : 0.66,
    }));
}

function crewEventEntries(events) {
  return events
    .filter((event) => Boolean(event.detailHref))
    .map((event) => ({
      url: absoluteUrl(event.detailHref),
      ...(validLastModified(event.updatedAt) ? { lastModified: validLastModified(event.updatedAt) } : {}),
      changeFrequency: event.isUpcoming ? 'daily' : 'monthly',
      priority: event.isUpcoming ? 0.82 : 0.66,
    }));
}

export default async function sitemap() {
  const [brotherhoodDirectory, extraordinaryOutings, gloryOutings, crewEvents] = await Promise.all([
    getHermandadesDirectory(),
    getExtraordinaryDirectory(),
    getGloryDirectory(),
    getCrewEventDirectory(),
  ]);
  const indexableEntities = await getPublicIndexableEntityEntries({
    brotherhoods: brotherhoodDirectory,
  });

  const entries = [
    ...staticEntries,
    ...entityEntries(indexableEntities),
    ...directoryEntries(brotherhoodDirectory),
    ...extraordinaryEntries(extraordinaryOutings),
    ...gloryEntries(gloryOutings),
    ...crewEventEntries(crewEvents),
  ];

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
