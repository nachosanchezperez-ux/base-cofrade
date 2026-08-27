import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Wikimedia Commons está autorizada como origen remoto de imágenes', async () => {
  const config = await read('next.config.mjs');

  assert.match(config, /hostname: 'upload\.wikimedia\.org'/);
  assert.match(config, /pathname: '\/wikipedia\/commons\/\*\*'/);
});

test('los logotipos oficiales externos de Bandas usan orígenes remotos acotados', async () => {
  const config = await read('next.config.mjs');

  assert.match(config, /hostname: 'www\.virgendelosreyes\.es'/);
  assert.match(config, /hostname: 'www\.bandacruzroja\.es'/);
  assert.match(config, /pathname: '\/wp-content\/uploads\/\*\*'/);
});

test('la media pública conserva licencia y crédito visible', async () => {
  const source = await read('lib/supabase/entity-media.js');

  assert.match(source, /rights_status, license, width_px, height_px/);
  assert.match(source, /licenseLabel/);
  assert.match(source, /creditParts\.join\(' · '\)/);
});

test('los créditos enlazan a la procedencia de la fotografía', async () => {
  const hero = await read('components/RelationalEntityHeroMedia.js');
  const gallery = await read('components/EntityMediaGallery.js');

  assert.match(hero, /commons\.wikimedia\.org\/wiki\/File:/);
  assert.match(hero, /target="_blank" rel="noreferrer"/);
  assert.match(gallery, /item\.sourceUrl/);
  assert.match(gallery, /target="_blank" rel="noreferrer"/);
});

test('las imágenes de Wikimedia evitan el optimizador externo sin afectar a otros orígenes', async () => {
  const hero = await read('components/RelationalEntityHeroMedia.js');
  const gallery = await read('components/EntityMediaGallery.js');

  assert.match(hero, /function isWikimediaUpload/);
  assert.match(hero, /unoptimized=\{bypassImageOptimizer\}/);
  assert.match(gallery, /function isWikimediaUpload/);
  assert.match(gallery, /unoptimized=\{isWikimediaUpload\(item\.path\)\}/);
});
