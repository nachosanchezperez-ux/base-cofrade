import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PUBLIC_SITEMAP_SEGMENTS, sitemapEntriesForSegment } from '../lib/seo-sitemap-segments.js';

// Execute the real sitemap orchestration with controlled readers. No network,
// production credentials, or framework cache is needed to verify its contract.
async function harness({ fail = '', delay = 0 } = {}) {
  const calls = [];
  const context = {
    PUBLIC_SITEMAP_SEGMENTS, sitemapEntriesForSegment, connection: async () => {},
    absoluteUrl: (path) => `https://hilocofrade.es${path}`,
    unstable_cache: (fn) => fn,
    brotherhoodDirectoryLocalities: () => [], brotherhoodDirectoryRoutes: () => [],
    filterIndexableBrotherhoods: (rows) => rows,
    bandDirectoryFacets: () => ({ types: [], municipalities: [] }),
    agendaMunicipalityRouteSlug: (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    heritageDirectoryLocalities: () => [], heritageDirectoryTypes: () => [],
    getPublicIndexableEntityEntries: async ({ brotherhoods = [], bandDirectory = [], images = [], steps = [] }) => {
      calls.push(['indexability']);
      return [...brotherhoods, ...bandDirectory, ...images, ...steps];
    },
    getIndexableBrotherhoodDirectory: async () => {
      calls.push(['getIndexableBrotherhoodDirectory']);
      return [{ id: 'h2', slug: 'hermandad-rinconada', localidad: 'La Rinconada' }];
    },
  };
  const fixtures = {
    getHermandadesDirectory: [{ id: 'h', slug: 'hermandad', entityType: 'brotherhood' }],
    getPublicBandsDirectory: [],
    getBandsDirectory: [{ id: 'b', slug: 'banda', entityType: 'band' }],
    getImagesDirectory: [{ id: 'i', slug: 'imagen', entityType: 'image' }],
    getStepsDirectory: [{ id: 'p', slug: 'paso', entityType: 'step', updatedAt: '2026-10-01' }],
    getExtraordinaryDirectory: [{ slug: 'salida', municipality: 'Pilas' }],
    getGloryDirectory: [{ detailHref: '/procesiones-de-gloria/gloria', municipality: 'Pilas' }],
    getCrewEventDirectory: [{ detailHref: '/igualas-y-ensayos/ensayo', municipality: 'Pilas', updatedAt: '2026-10-03' }],
    getRosaryOutings: [{ detailHref: '/agenda-cofrade/rosarios/rosario', municipality: 'Pilas', updatedAt: '2026-10-02' }],
    getMusicalRepertoires: [{ href: '/crucetas-musicales/cruceta', entries: [{ marchHref: '/marchas/marcha' }] }],
    getPublicMarchSitemapEntries: [{ slug: 'marcha', updatedAt: '2026-09-24' }],
    getPublicAgentSitemapEntries: [{ slug: 'autor', updatedAt: '2026-09-30' }],
  };
  for (const [name, value] of Object.entries(fixtures)) {
    context[name] = async (options) => {
      calls.push([name, options]);
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      if (name === fail) throw new Error('backend unavailable');
      return value;
    };
  }
  const source = (await readFile(new URL('../app/sitemap.js', import.meta.url), 'utf8'))
    .replace(/import[\s\S]*?from ['"][^'"]+['"];?\n/g, '')
    .replace(/export default sitemap;/, '')
    .replace(/export /g, '');
  const api = new Function(...Object.keys(context), `${source}\nreturn { getPublicSitemapSegmentEntries, getPublicSitemapEntries };`)(...Object.values(context));
  return { ...api, calls };
}

const readersBySegment = {
  general: [],
  hermandades: ['getHermandadesDirectory', 'getImagesDirectory', 'getStepsDirectory', 'indexability'],
  bandas: ['getPublicBandsDirectory', 'getBandsDirectory', 'indexability'],
  imagenes: ['getImagesDirectory', 'indexability'],
  pasos: ['getStepsDirectory', 'indexability'],
  marchas: ['getPublicMarchSitemapEntries'],
  autores: ['getPublicAgentSitemapEntries'],
  crucetas: ['getMusicalRepertoires'],
  agenda: ['getExtraordinaryDirectory', 'getGloryDirectory', 'getCrewEventDirectory', 'getRosaryOutings', 'getIndexableBrotherhoodDirectory'],
};
for (const [segment, expected] of Object.entries(readersBySegment)) {
  test(`sitemap ${segment} only loads its required sources`, async () => {
    const api = await harness();
    const entries = await api.getPublicSitemapSegmentEntries(segment);
    assert.deepEqual(api.calls.map(([name]) => name), expected);
    assert.ok(entries.length);
    assert.deepEqual(sitemapEntriesForSegment(entries, segment), entries);
    for (const [name, options] of api.calls) {
      if (!['indexability', 'getIndexableBrotherhoodDirectory'].includes(name) && !name.endsWith('SitemapEntries')) {
        assert.equal(options.throwOnError, true);
      }
    }
  });
}

test('unknown sitemap family makes no reader calls', async () => {
  const api = await harness();
  assert.equal(await api.getPublicSitemapSegmentEntries('unknown'), null);
  assert.equal(api.calls.length, 0);
});

test('simultaneous requests share work, failed results are not retained', async () => {
  const api = await harness({ fail: 'getPublicMarchSitemapEntries', delay: 10 });
  const results = await Promise.allSettled([
    api.getPublicSitemapSegmentEntries('marchas'), api.getPublicSitemapSegmentEntries('marchas'),
  ]);
  assert.ok(results.every((r) => r.status === 'rejected'));
  assert.equal(api.calls.length, 1);
  await assert.rejects(api.getPublicSitemapSegmentEntries('marchas'), /backend unavailable/);
  assert.equal(api.calls.length, 2);
  assert.ok((await api.getPublicSitemapSegmentEntries('general')).length);
});

test('source failure never returns a successful partial Agenda sitemap', async () => {
  const api = await harness({ fail: 'getGloryDirectory' });
  await assert.rejects(api.getPublicSitemapSegmentEntries('agenda'), /backend unavailable/);
  assert.deepEqual(api.calls.map(([name]) => name), ['getExtraordinaryDirectory', 'getGloryDirectory']);
});


test('los hubs SEO heredan un lastmod real de su familia', async () => {
  const api = await harness();
  const expected = {
    pasos: ['https://hilocofrade.es/pasos', '2026-10-01T00:00:00.000Z'],
    marchas: ['https://hilocofrade.es/marchas', '2026-09-24T00:00:00.000Z'],
    autores: ['https://hilocofrade.es/autores', '2026-09-30T00:00:00.000Z'],
    agenda: ['https://hilocofrade.es/agenda-cofrade', '2026-10-03T00:00:00.000Z'],
  };

  for (const [segment, [hubUrl, iso]] of Object.entries(expected)) {
    const entries = await api.getPublicSitemapSegmentEntries(segment);
    const hub = entries.find((entry) => entry.url === hubUrl);
    assert.ok(hub, segment);
    assert.equal(hub.lastModified?.toISOString(), iso, segment);
  }
});

test('un hub no inventa lastmod cuando su familia no tiene fechas fiables', async () => {
  const api = await harness();
  const entries = await api.getPublicSitemapSegmentEntries('general');
  const home = entries.find((entry) => entry.url === 'https://hilocofrade.es/');
  assert.ok(home);
  assert.equal(home.lastModified, undefined);
});

test('full sitemap retains canonical detail URLs and unique march metadata', async () => {
  const api = await harness();
  const entries = await api.getPublicSitemapEntries();
  const urls = entries.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const path of ['/hermandades/hermandad', '/bandas/banda', '/imagenes/imagen', '/pasos/paso',
    '/marchas/marcha', '/autores/autor', '/crucetas-musicales/cruceta', '/extraordinarias/salida',
    '/procesiones-de-gloria/gloria', '/igualas-y-ensayos/ensayo', '/agenda-cofrade/rosarios/rosario',
    '/agenda-cofrade/localidad/pilas', '/agenda-cofrade/localidad/la-rinconada',
    '/agenda-cofrade/hoy', '/agenda-cofrade/manana',
    '/agenda-cofrade/fin-de-semana']) {
    assert.ok(urls.includes(`https://hilocofrade.es${path}`), path);
  }
  const march = entries.find((entry) => entry.url.endsWith('/marchas/marcha'));
  assert.equal(march.lastModified.toISOString(), '2026-09-24T00:00:00.000Z');
});

for (const [file, name] of [
  ['brotherhood-directory', 'getHermandadesDirectory'],
  ['bands-directory-public', 'getPublicBandsDirectory'],
  ['bands-core', 'getBandsDirectory'],
  ['crew-events', 'getCrewEventDirectory'],
  ['musical-repertoires', 'getMusicalRepertoires'],
]) {
  test(`${name} propagates failure for sitemap callers and preserves its default fallback`, async () => {
    const source = await readFile(new URL(`../lib/supabase/${file}.js`, import.meta.url), 'utf8');
    const start = source.indexOf(`export async function ${name}(`);
    assert.ok(start >= 0);
    const end = source.indexOf('\n}', start) + 2;
    const fnSource = source.slice(start, end).replace('export ', '');
    const failure = new Error('backend unavailable');
    const reader = new Function('createPublicClient', 'console', `${fnSource}; return ${name};`)(
      () => { throw failure; }, { error() {} },
    );
    assert.deepEqual(await reader(), []);
    await assert.rejects(reader({ throwOnError: true }), (error) => error === failure);
  });
}


test('el sitemap usa namespace v2 para no servir familias anteriores al lastmod de hubs', async () => {
  const source = await readFile(new URL('../app/sitemap.js', import.meta.url), 'utf8');
  assert.match(source, /hilo-cofrade-public-sitemap-family-v2/);
  assert.doesNotMatch(source, /hilo-cofrade-public-sitemap-family-v1/);
});
