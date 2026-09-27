import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { groupHeritageReleases, knownReleaseText, releaseAuthorship, releaseYear } from '../lib/heritage-release-groups.js';

test('six restorations remain six compact entries in the current year', () => {
  const items = Array.from({ length: 6 }, (_, index) => Object.freeze({ id: `r${index}`, ano: 2026, tipo: 'Restauración', descripcion: `Texto íntegro ${index}` }));
  Object.freeze(items);
  const groups = groupHeritageReleases(items, 2026);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].countLabel, '6 restauraciones');
  assert.equal(groups[0].open, true);
  assert.deepEqual(groups[0].items, items);
  assert.strictEqual(groups[0].items[0], items[0]);
});

test('orders years descending, keeps current year open and other years closed', () => {
  const result = groupHeritageReleases([{ ano: 2025 }, { ano: 2027 }, { ano: 2026 }], 2026);
  assert.deepEqual(result.map(({ year, open }) => [year, open]), [[2027, false], [2026, true], [2025, false]]);
});

test('opens most recent available group when no current-year entry exists', () => {
  const result = groupHeritageReleases([{ ano: 2010 }, { ano: 2025 }], 2026);
  assert.deepEqual(result.map((g) => g.open), [true, false]);
});

test('does not invent a year or drop undated entries', () => {
  const result = groupHeritageReleases([{ id: 'a' }, { id: 'b', ano: '1934–1935' }, { id: 'c', ano: 2026 }], 2026);
  assert.equal(result[1].label, 'Otras actuaciones');
  assert.equal(result[1].items.length, 2);
  assert.equal(result.flatMap((g) => g.items).length, 3);
});

test('supports numeric years, strings, ISO dates and legacy display dates', () => {
  assert.equal(releaseYear({ ano: 2026 }), 2026);
  assert.equal(releaseYear({ ano: '2026' }), 2026);
  assert.equal(releaseYear({ fechaIso: '2026-10-03' }), 2026);
  assert.equal(releaseYear({ ano: '3 de octubre de 2026' }), 2026);
  assert.equal(releaseYear({ ano: 'Sin fecha' }), null);
});

test('singular and mixed counts are meaningful', () => {
  assert.equal(groupHeritageReleases([{ ano: 2026, tipo: 'Restauración' }], 2026)[0].countLabel, '1 restauración');
  assert.equal(groupHeritageReleases([{ ano: 2026, tipo: 'Estreno' }], 2026)[0].countLabel, '1 estreno');
  assert.equal(groupHeritageReleases([{ ano: 2026, tipo: 'Estreno' }, { ano: 2026, tipo: 'Restauración' }], 2026)[0].countLabel, '2 actuaciones');
});

test('unknown authorship is omitted without erasing meaningful anonymity', () => {
  assert.equal(releaseAuthorship({ autoria: 'Responsable no documentado' }), '');
  assert.equal(knownReleaseText('Autor desconocido'), '');
  assert.equal(knownReleaseText('Autoría anónima'), 'Autoría anónima');
  assert.equal(releaseAuthorship({ autoria: 'Taller documentado' }), 'Taller documentado');
});

test('known agents are retained once and take precedence over fallback authorship', () => {
  assert.equal(releaseAuthorship({ agentes: [{ nombre: 'Santa Clara' }, { nombre: 'Santa Clara' }, { nombre: '' }], autoria: 'Responsable no documentado' }), 'Santa Clara');
});

test('handles empty or invalid collections without creating a placeholder row', () => {
  assert.deepEqual(groupHeritageReleases([], 2026), []);
  assert.deepEqual(groupHeritageReleases(null, 2026), []);
  assert.deepEqual(groupHeritageReleases([null, undefined], 2026), []);
});

test('server component uses native disclosures and no photo placeholders', () => {
  const component = readFileSync(new URL('../components/BrotherhoodHeritageUpdates.js', import.meta.url), 'utf8');
  assert.match(component, /<details/);
  assert.match(component, /open=\{group.open\}/);
  assert.match(component, /imageSrc \? \(/);
  assert.match(component, /data-heritage-updates="compact"/);
  assert.doesNotMatch(component, /release-card-placeholder|use client|useEffect|dangerouslySetInnerHTML/);
  assert.match(component, /\{description\}/);
});

test('optional photographs retain credits, contained framing and responsive sizes', () => {
  const component = readFileSync(new URL('../components/BrotherhoodHeritageUpdates.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../components/BrotherhoodHeritageUpdates.module.css', import.meta.url), 'utf8');
  assert.match(component, /item\.imagen\.credito/);
  assert.match(component, /sizes="52px"/);
  assert.match(css, /object-fit: contain/);
  assert.match(css, /var\(--brotherhood-primary\)/);
  assert.match(css, /focus-visible/);
  assert.match(css, /font-size: 1rem/);
});
