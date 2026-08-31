import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import test from 'node:test';

const legacyColors = [
  '#123a67',
  '#b71f37',
  '#0f2742',
  '#0d2949',
  '#153b69',
  '#174f67',
  '#c33b4b',
  '#66b8d4',
];

const identityPaths = [
  'app/brand.css',
  'app/icon.svg',
  'app/layout.js',
  'app/manifest.js',
  'app/opengraph-image.js',
  'components/HiloFooter.js',
  'components/HiloFooter.module.css',
  'components/HiloHeader.js',
  'components/HiloHeader.module.css',
];

const textExtensions = new Set([
  '.css',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.svg',
  '.json',
  '.md',
]);

const ignoredDirectories = new Set(['.git', '.next', 'node_modules']);

function walk(directory, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(path, files);
    } else if (textExtensions.has(extname(entry.name).toLowerCase()) && statSync(path).size < 2_000_000) {
      files.push(path);
    }
  }
  return files;
}

function legacyMatches() {
  const matches = [];
  for (const file of walk(process.cwd())) {
    const source = readFileSync(file, 'utf8');
    const lines = source.split(/\r?\n/);
    lines.forEach((line, index) => {
      const lower = line.toLowerCase();
      for (const color of legacyColors) {
        if (lower.includes(color)) {
          matches.push({
            path: relative(process.cwd(), file).replaceAll('\\', '/'),
            line: index + 1,
            color,
          });
        }
      }
    });
  }
  return matches;
}

test('official Hilo Cofrade brand assets are present', () => {
  for (const path of [
    'public/brand/logo-header.svg',
    'public/brand/logo.svg',
    'public/brand/favicon.ico',
    'public/brand/favicon-16x16.png',
    'public/brand/favicon-32x32.png',
    'public/brand/favicon-48x48.png',
    'public/brand/apple-touch-icon.png',
    'public/brand/icon.svg',
    'public/brand/icon-192.png',
    'public/brand/icon-512.png',
  ]) {
    assert.equal(existsSync(path), true, `Missing official brand asset: ${path}`);
  }
});

test('global identity files do not retain provisional colors', () => {
  const matches = legacyMatches();
  const institutionalLegacy = matches.filter(({ path }) =>
    identityPaths.includes(path) || path.startsWith('public/brand/')
  );

  assert.deepEqual(
    institutionalLegacy,
    [],
    `Legacy corporate colors remain in global identity files:\n${JSON.stringify(institutionalLegacy, null, 2)}`
  );

  const retained = matches.filter(({ path }) =>
    !identityPaths.includes(path) && !path.startsWith('public/brand/')
  );
  console.log(`[brand-audit] retained-outside-global=${JSON.stringify(retained)}`);
});
