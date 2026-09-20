import test from 'node:test';
import assert from 'node:assert/strict';
import { imageRestorationCards, buildImageChronology } from '../lib/image-restoration-display.js';

const intervention = {
  id: '006101a9-ef14-4744-89bf-c5bdc62632d3',
  fecha: 'Abril de 2026–Septiembre de 2026',
  titulo: 'Restauración · Intervención concluida en 2026',
  responsable: 'Laura Pérez Meléndez',
  disciplina: 'Conservación y restauración',
  texto: 'Laura Pérez Meléndez · Reposición al culto el 19 de septiembre de 2026, tras cinco meses de trabajos en el Taller Leal Pérez.\\n\\nLimpieza y fijación de estratos.\\n\\nNueva base de cedro real y brazos articulados.',
};

test('separates responsible, title, phase, summary and full work paragraphs', () => {
  const [card] = imageRestorationCards([intervention]);
  assert.equal(card.tipo, 'Restauración');
  assert.equal(card.fase, 'Intervención concluida en 2026');
  assert.equal(card.anio, '2026');
  assert.equal(card.fecha, 'Abril de 2026 – Septiembre de 2026');
  assert.equal(card.responsable, intervention.responsable);
  assert.ok(!card.resumen.startsWith('Laura Pérez Meléndez ·'));
  assert.equal(card.detalle.length, 2);
  assert.ok(card.detalle[1].includes('cedro real'));
  assert.ok(!card.descripcion.includes('\\n'));
});

test('preserves 1990 and adds the same published intervention to the vertical chronology', () => {
  const timeline = buildImageChronology({ fecha: '1990', restauraciones: [intervention] });
  assert.equal(timeline.length, 2);
  assert.equal(timeline[0].fecha, '1990');
  assert.equal(timeline[0].titulo, 'Datación');
  assert.equal(timeline[1].fecha, '2026');
  assert.equal(timeline[1].titulo, 'Restauración');
  assert.match(timeline[1].texto, /19 de septiembre de 2026/);
  assert.equal(timeline[1].restauracionId, intervention.id);
});

test('module and chronology cross-links resolve to each other', () => {
  const cards = imageRestorationCards([intervention]);
  const timeline = buildImageChronology({}, cards);
  assert.equal(timeline[0].href, `#${cards[0].anchor}`);
  assert.equal(timeline[0].anchor, cards[0].timelineAnchor);
});

test('does not invent an execution date or earlier historical events', () => {
  const timeline = buildImageChronology({ restauraciones: [intervention] });
  assert.equal(timeline.length, 1);
  assert.equal(timeline[0].fecha, '2026');
});

test('does not duplicate an intervention already projected into the chronology', () => {
  const original = { fecha: '1990', restauraciones: [intervention, intervention] };
  const once = buildImageChronology(original);
  const twice = buildImageChronology({ ...original, cronologia: once });
  assert.deepEqual(twice, once);
});

test('retains distinct interventions from the same year', () => {
  const result = buildImageChronology({ restauraciones: [intervention, { ...intervention, id: 'different', texto: 'Otro trabajo documentado.' }] });
  assert.equal(result.length, 2);
});

test('keeps all the body of long descriptions accessible', () => {
  const description = 'Descripción documentada. '.repeat(30);
  const [card] = imageRestorationCards([{ ...intervention, texto: description }]);
  assert.ok(card.resumen.length <= 280);
  assert.deepEqual(card.detalle, [description.trim()]);
});

test('accepts actual paragraph breaks as well as escaped legacy breaks', () => {
  const [card] = imageRestorationCards([{ ...intervention, texto: 'Resumen.\n\nPrimer trabajo.\n\nSegundo trabajo.' }]);
  assert.deepEqual(card.detalle, ['Primer trabajo.', 'Segundo trabajo.']);
});

test('empty or missing data does not fabricate a module or chronology', () => {
  assert.deepEqual(imageRestorationCards(null), []);
  assert.deepEqual(buildImageChronology({}), []);
  assert.equal(buildImageChronology({ fecha: '1990' }).length, 1);
});

test('retains existing events without mutating inputs', () => {
  const event = Object.freeze({ fecha: '2005', titulo: 'Hito documentado', texto: 'Descripción.' });
  const image = Object.freeze({ cronologia: Object.freeze([event]), restauraciones: Object.freeze([Object.freeze({ ...intervention })]) });
  const result = buildImageChronology(image);
  assert.equal(result[0].titulo, event.titulo);
  assert.equal(result.length, 2);
  assert.equal(image.cronologia.length, 1);
});

test('does not infer completed status from a future or past year', () => {
  const [card] = imageRestorationCards([{ id: 'future', fecha: '2027', titulo: 'Restauración · Proyecto anunciado', texto: 'Proyecto anunciado.' }]);
  assert.equal(card.fase, 'Proyecto anunciado');
  assert.ok(!JSON.stringify(card).includes('concluida'));
});

test('preserves unknown dates and multi-year periods without exact invented dates', () => {
  const [unknown, period] = imageRestorationCards([{ id: 'a', titulo: 'Intervención', fecha: 'Siglo XX' }, { id: 'b', titulo: 'Restauración', fecha: '2025–2026' }]);
  assert.equal(unknown.anio, '');
  assert.equal(unknown.fecha, 'Siglo XX');
  assert.equal(period.anio, '2025–2026');
});
