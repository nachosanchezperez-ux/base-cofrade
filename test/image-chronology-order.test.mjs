import test from 'node:test';
import assert from 'node:assert/strict';
import { imageRestorationCards, buildImageChronology } from '../lib/image-restoration-display.js';

test('textual dating remains before later interventions, without inventing a numeric date', () => {
  const timeline = buildImageChronology({ fecha: 'Siglo XVIII', restauraciones: [{ id: 'a', fecha: '2026', titulo: 'Restauración' }] });
  assert.equal(timeline[0].fecha, 'Siglo XVIII');
  assert.equal(timeline[1].fecha, '2026');
});

test('distinct canonical IDs remain distinct even when their summaries match', () => {
  const items = [{ id: 'a', fecha: '2026', titulo: 'Restauración', texto: 'Conservación documentada.' }, { id: 'b', fecha: '2026', titulo: 'Restauración', texto: 'Conservación documentada.' }];
  assert.equal(buildImageChronology({}, imageRestorationCards(items)).length, 2);
});

test('new interventions are ordered without moving pre-existing textual milestones', () => {
  const timeline = buildImageChronology({
    cronologia: [{ fecha: 'Siglo XVIII', titulo: 'Datación' }, { fecha: '2010', titulo: 'Hito existente' }],
    restauraciones: [{ id: 'recent', fecha: '2026', titulo: 'Restauración' }, { id: 'older', fecha: '2005', titulo: 'Restauración' }],
  });
  assert.deepEqual(timeline.map((item) => item.fecha), ['Siglo XVIII', '2005', '2010', '2026']);
});

test('undated interventions remain undated', () => {
  const timeline = buildImageChronology({ fecha: '1990', restauraciones: [{ id: 'unknown', titulo: 'Restauración', texto: 'Sin fecha documentada.' }] });
  assert.equal(timeline[1].fecha, '');
  assert.equal(timeline.length, 2);
});
