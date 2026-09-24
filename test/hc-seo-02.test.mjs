import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  PUBLIC_SITEMAP_SEGMENTS,
  renderSitemapXml,
  sitemapEntriesForSegment,
} from '../lib/seo-sitemap-segments.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const sample = [
  { url: 'https://hilocofrade.es/', changeFrequency: 'daily', priority: 1 },
  { url: 'https://hilocofrade.es/hermandades/san-benito', lastModified: '2026-09-20' },
  { url: 'https://hilocofrade.es/bandas/las-cigarreras' },
  { url: 'https://hilocofrade.es/imagenes/jesus-presentado-al-pueblo' },
  { url: 'https://hilocofrade.es/pasos/andas-plata-setefilla-lora' },
  { url: 'https://hilocofrade.es/marchas/aurora-reina-manana-pablo-ojeda' },
  { url: 'https://hilocofrade.es/autores/pablo-ojeda-jimenez' },
  { url: 'https://hilocofrade.es/crucetas-musicales/san-gonzalo-2026' },
  { url: 'https://hilocofrade.es/agenda-cofrade/rosarios/prueba' },
  { url: 'https://hilocofrade.es/extraordinarias/prueba' },
];

test('HC-SEO-02 reparte cada URL pública en una única familia medible', () => {
  assert.deepEqual(PUBLIC_SITEMAP_SEGMENTS, [
    'general',
    'hermandades',
    'bandas',
    'imagenes',
    'pasos',
    'marchas',
    'autores',
    'crucetas',
    'agenda',
  ]);

  const partitioned = PUBLIC_SITEMAP_SEGMENTS.flatMap((segment) => (
    sitemapEntriesForSegment(sample, segment)
  ));
  assert.equal(partitioned.length, sample.length);
  assert.equal(new Set(partitioned.map((entry) => entry.url)).size, sample.length);
  assert.equal(sitemapEntriesForSegment(sample, 'agenda').length, 2);
  assert.equal(sitemapEntriesForSegment(sample, 'desconocido'), null);
});

test('los sitemaps segmentados generan XML canónico y escapan valores', () => {
  const xml = renderSitemapXml([
    {
      url: 'https://hilocofrade.es/bandas/prueba?a=1&b=2',
      lastModified: '2026-09-20',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]);

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /a=1&amp;b=2/);
  assert.match(xml, /<lastmod>2026-09-20T00:00:00\.000Z<\/lastmod>/);
  assert.match(xml, /<changefreq>weekly<\/changefreq>/);
  assert.match(xml, /<priority>0\.8<\/priority>/);
});

test('robots publica el sitemap completo y los sitemaps segmentados de diagnóstico', () => {
  const robots = read('app/robots.js');
  for (const segment of PUBLIC_SITEMAP_SEGMENTS) {
    assert.match(robots, new RegExp(`/sitemaps/${segment}\\.xml`));
  }
  assert.match(robots, /\/sitemap\.xml/);
});

test('cada familia del sitemap queda cacheada durante una hora', () => {
  const sitemap = read('app/sitemap.js');
  const route = read('app/sitemaps/[family]/route.js');
  assert.match(sitemap, /unstable_cache/);
  assert.match(sitemap, /hilo-cofrade-public-sitemap-family-v1/);
  assert.match(sitemap, /revalidate: 3600/);
  assert.match(route, /getPublicSitemapSegmentEntries\(segment\)/);
  assert.match(route, /Content-Type.*application\/xml/s);
});
