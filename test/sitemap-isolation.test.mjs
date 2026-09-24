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
    heritageDirectoryLocalities: () => [], heritageDirectoryTypes: () => [],
    getPublicIndexableEntityEntries: async ({ brotherhoods = [], bandDirectory = [], images = [], steps = [] }) => {
      calls.push(['indexability']);
      return [...brotherhoods, ...bandDirectory, ...images, ...steps];
    },
  };
  const fixtures = {
    getHermandadesDirectory: [{ id: 'h', slug: 'hermandad', entityType: 'brotherhood' }],
    getPublicBandsDirectory: [],
    getBandsDirectory: [{ id: 'b', slug: 'banda', entityType: 'band' }],
    getImagesDirectory: [{ id: 'i', slug: 'imagen', entityType: 'image' }],
    getStepsDirectory: [{ id: 'p', slug: 'paso', entityType: 'step' }],
    getExtraordinaryDirectory: [{ slug: 'salida' }],
    getGloryDirectory: [{ detailHref: '/procesiones-de-gloria/gloria' }],
    getCrewEventDirectory: [{ detailHref: '/igualas-y-ensayos/ensayo' }],
    getRosaryOutings: [{ detailHref: '/agenda-cofrade/rosarios/rosario' }],
    getMusicalRepertoires: [{ href: '/crucetas-musicales/cruceta', entries: [{ marchHref: '/marchas/marcha' }] }],
    getPublicMarchSitemapEntries: [{ slug: 'marcha', updatedAt: '2026-09-24' }],
    getPublicAgentSitemapEntries: [{ slug: 'autor' }],
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
  agenda: ['getExtraordinaryDirectory', 'getGloryDirectory', 'getCrewEventDirectory', 'getRosaryOutings'],
};
for (const [segment, expected] of Object.entries(readersBySegment)) {
  test(`sitemap ${segment} only loads its required sources`, async () => {
    const api = await harness();
    const entries = await api.getPublicSitemapSegmentEntries(segment);
    assert.deepEqual(api.calls.map(([name]) => name), expected);
    assert.ok(entries.length);
    assert.deepEqual(sitemapEntriesForSegment(entries, segment), entries);
    for (const [name, options] of api.calls) {
      if (name !== 'indexability' && !name.endsWith('SitemapEntries')) assert.equal(options.throwOnError, true);
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

test('full sitemap retains canonical detail URLs and unique march metadata', async () => {
  const api = await harness();
  const entries = await api.getPublicSitemapEntries();
  const urls = entries.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const path of ['/hermandades/hermandad', '/bandas/banda', '/imagenes/imagen', '/pasos/paso',
    '/marchas/marcha', '/autores/autor', '/crucetas-musicales/cruceta', '/extraordinarias/salida',
    '/procesiones-de-gloria/gloria', '/igualas-y-ensayos/ensayo', '/agenda-cofrade/rosarios/rosario']) {
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
