import {
  brotherhoodDirectoryLocalities,
  brotherhoodDirectoryRoutes,
  filterIndexableBrotherhoods,
} from '@/lib/brotherhood-public-index';
import { unstable_cache } from 'next/cache';
import { connection } from 'next/server';
import { PUBLIC_SITEMAP_SEGMENTS, sitemapEntriesForSegment } from '@/lib/seo-sitemap-segments';
import { getBandsDirectory } from '@/lib/supabase/bands';
import { absoluteUrl } from '@/lib/seo';
import { bandDirectoryFacets } from '@/lib/band-directory';
import { heritageDirectoryLocalities, heritageDirectoryTypes } from '@/lib/heritage-directory';
import { getPublicBandsDirectory } from '@/lib/supabase/bands-directory-public';
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory';
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory';
import { getGloryDirectory } from '@/lib/supabase/glory-directory';
import { getCrewEventDirectory } from '@/lib/supabase/crew-events';
import { getPublicIndexableEntityEntries } from '@/lib/supabase/public-indexability';
import { getMusicalRepertoires } from '@/lib/supabase/musical-repertoires';
import { getPublicMarchSitemapEntries } from '@/lib/supabase/public-marches';
import { getPublicAgentSitemapEntries } from '@/lib/supabase/public-agents';
import { getRosaryOutings } from '@/lib/supabase/rosary-outings';
import { getImagesDirectory, getStepsDirectory } from '@/lib/supabase/directories';

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
    url: absoluteUrl('/hermandades/agrupaciones-parroquiales'),
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
    url: absoluteUrl('/crucetas-musicales'),
    changeFrequency: 'weekly',
    priority: 0.86,
  },
  {
    url: absoluteUrl('/marchas'),
    changeFrequency: 'weekly',
    priority: 0.88,
  },
  {
    url: absoluteUrl('/autores'),
    changeFrequency: 'weekly',
    priority: 0.84,
  },
  {
    url: absoluteUrl('/agenda-cofrade'),
    changeFrequency: 'daily',
    priority: 0.92,
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
  return brotherhoodDirectoryRoutes(brotherhoods).map((route) => ({
    url: absoluteUrl(route.href),
    changeFrequency: 'weekly',
    priority: 0.72,
  }));
}

function brotherhoodLocalityEntries(brotherhoods) {
  return brotherhoodDirectoryLocalities(brotherhoods).map((locality) => ({
    url: absoluteUrl(locality.href),
    changeFrequency: 'weekly',
    priority: 0.76,
  }));
}

function bandDirectoryEntries(bands) {
  const facets = bandDirectoryFacets(bands);
  return [...facets.types, ...facets.municipalities].map((facet) => ({
    url: absoluteUrl(facet.href),
    changeFrequency: 'weekly',
    priority: 0.72,
  }));
}

function heritageDirectoryEntries(images, steps) {
  return [
    ...heritageDirectoryTypes(images, 'imagenes'),
    ...heritageDirectoryTypes(steps, 'pasos'),
    ...heritageDirectoryLocalities(images, 'imagenes'),
    ...heritageDirectoryLocalities(steps, 'pasos'),
  ].map((facet) => ({
    url: absoluteUrl(facet.href),
    changeFrequency: 'monthly',
    priority: 0.7,
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

function musicalRepertoireEntries(repertoires) {
  return repertoires.flatMap((repertoire) => [
    {
      url: absoluteUrl(repertoire.href),
      changeFrequency: 'monthly',
      priority: 0.72,
    },
    ...repertoire.entries
      .filter((entry) => entry.marchHref)
      .map((entry) => ({
        url: absoluteUrl(entry.marchHref),
        changeFrequency: 'monthly',
        priority: 0.66,
      })),
  ]);
}

function marchEntries(marches) {
  return marches.map((march) => {
    const lastModified = validLastModified(march.updatedAt);
    return {
      url: absoluteUrl(`/marchas/${march.slug}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly',
      priority: 0.66,
    };
  });
}

function authorEntries(authors) {
  return authors.map((author) => {
    const lastModified = validLastModified(author.updatedAt);
    return {
      url: absoluteUrl(`/autores/${author.slug}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly',
      priority: 0.64,
    };
  });
}

function rosaryEntries(outings) {
  return outings
    .filter((outing) => Boolean(outing.detailHref))
    .map((outing) => ({
      url: absoluteUrl(outing.detailHref),
      ...(validLastModified(outing.updatedAt) ? { lastModified: validLastModified(outing.updatedAt) } : {}),
      changeFrequency: outing.isUpcoming ? 'daily' : 'monthly',
      priority: outing.isUpcoming ? 0.82 : 0.64,
    }));
}

// Each cache entry owns one family. Do not load the full graph before filtering.
async function buildPublicSitemapSegmentEntries(segment) {
  const strict = { throwOnError: true };
  const entries = [...sitemapEntriesForSegment(staticEntries, segment)];

  if (segment === 'hermandades') {
    const brotherhoodDirectory = await getHermandadesDirectory(strict);
    // Child sources are part of the existing brotherhood indexability contract.
    const imageDirectory = await getImagesDirectory(strict);
    const stepDirectory = await getStepsDirectory(strict);
    const indexableEntities = await getPublicIndexableEntityEntries({
      brotherhoods: brotherhoodDirectory, bandDirectory: [],
      images: imageDirectory, steps: stepDirectory,
    });
    const indexableBrotherhoods = filterIndexableBrotherhoods(brotherhoodDirectory, indexableEntities);
    entries.push(...entityEntries(indexableEntities),
      ...directoryEntries(indexableBrotherhoods), ...brotherhoodLocalityEntries(indexableBrotherhoods));
  } else if (segment === 'bandas') {
    const bandDirectory = await getPublicBandsDirectory(strict);
    const bands = await getBandsDirectory(strict);
    const indexableEntities = await getPublicIndexableEntityEntries({
      bandDirectory: bands, images: [], steps: [],
    });
    entries.push(...entityEntries(indexableEntities), ...bandDirectoryEntries(bandDirectory));
  } else if (segment === 'imagenes' || segment === 'pasos') {
    const imageDirectory = segment === 'imagenes' ? await getImagesDirectory(strict) : [];
    const stepDirectory = segment === 'pasos' ? await getStepsDirectory(strict) : [];
    const indexableEntities = await getPublicIndexableEntityEntries({
      bandDirectory: [], images: imageDirectory, steps: stepDirectory,
    });
    entries.push(...entityEntries(indexableEntities), ...heritageDirectoryEntries(imageDirectory, stepDirectory));
  } else if (segment === 'agenda') {
    // Sequence the source groups to avoid multiplying their internal fan-out.
    const extraordinaryOutings = await getExtraordinaryDirectory(strict);
    const gloryOutings = await getGloryDirectory(strict);
    const crewEvents = await getCrewEventDirectory(strict);
    const rosaryOutings = await getRosaryOutings(strict);
    entries.push(...extraordinaryEntries(extraordinaryOutings), ...gloryEntries(gloryOutings),
      ...crewEventEntries(crewEvents), ...rosaryEntries(rosaryOutings));
  } else if (segment === 'crucetas') {
    const musicalRepertoires = await getMusicalRepertoires(strict);
    entries.push(...musicalRepertoireEntries(musicalRepertoires));
  } else if (segment === 'marchas') {
    const marches = await getPublicMarchSitemapEntries();
    // The paginated canonical reader covers every published march, including
    // those referenced by a repertoire, without loading repertoire relations.
    entries.push(...marchEntries(marches));
  } else if (segment === 'autores') {
    const authors = await getPublicAgentSitemapEntries();
    entries.push(...authorEntries(authors));
  }

  return [...new Map(sitemapEntriesForSegment(entries, segment)
    .map((entry) => [entry.url, entry])).values()];
}

const getCachedPublicSitemapSegmentEntries = unstable_cache(
  buildPublicSitemapSegmentEntries,
  ['hilo-cofrade-public-sitemap-family-v1'],
  { revalidate: 3600, tags: ['seo-sitemap'] }
);

// Coalesce simultaneous requests in the same process; failures are never kept.
const pendingSegments = new Map();
export async function getPublicSitemapSegmentEntries(segment) {
  if (!PUBLIC_SITEMAP_SEGMENTS.includes(segment)) return null;
  if (!pendingSegments.has(segment)) {
    const pending = getCachedPublicSitemapSegmentEntries(segment)
      .finally(() => pendingSegments.delete(segment));
    pendingSegments.set(segment, pending);
  }
  return pendingSegments.get(segment);
}

export async function getPublicSitemapEntries() {
  const entries = [];
  for (const segment of PUBLIC_SITEMAP_SEGMENTS) {
    entries.push(...await getPublicSitemapSegmentEntries(segment));
  }
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}

async function sitemap() {
  // Production data must not determine whether the application can build.
  await connection();
  return getPublicSitemapEntries();
}

export default sitemap;
