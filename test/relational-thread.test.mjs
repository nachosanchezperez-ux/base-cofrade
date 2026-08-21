import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareRelationalItems } from '../lib/relational-thread.js';

function item(kind, slug, extra = {}) {
  return {
    kind,
    title: `${kind} ${slug}`,
    href: `/${slug}`,
    ...extra,
  };
}

test('Hermandad reparte la portada entre imágenes, pasos y bandas', () => {
  const items = [
    ...Array.from({ length: 6 }, (_, index) => item('Imagen', `imagen-${index + 1}`)),
    ...Array.from({ length: 5 }, (_, index) => item('Paso', `paso-${index + 1}`)),
    ...Array.from({ length: 4 }, (_, index) => item('Banda', `banda-${index + 1}`)),
  ];

  const result = prepareRelationalItems(items, { profile: 'hermandad', maxItems: 8 });
  const kinds = result.visibleItems.map((entry) => entry.kind);

  assert.equal(result.totalItems, 15);
  assert.equal(result.visibleItems.length, 8);
  assert.equal(result.hiddenItems.length, 7);
  assert.equal(kinds.filter((kind) => kind === 'Imagen').length, 3);
  assert.equal(kinds.filter((kind) => kind === 'Paso').length, 3);
  assert.equal(kinds.filter((kind) => kind === 'Banda').length, 2);
});

test('Imagen prioriza Hermandad, Paso y después imágenes hermanas', () => {
  const result = prepareRelationalItems([
    item('Imagen', 'hermana-1'),
    item('Paso', 'paso-1'),
    item('Hermandad', 'hermandad-1'),
    item('Imagen', 'hermana-2'),
  ], { profile: 'imagen', maxItems: 4 });

  assert.deepEqual(
    result.visibleItems.map((entry) => entry.kind),
    ['Hermandad', 'Paso', 'Imagen', 'Imagen']
  );
});

test('Paso prioriza imágenes antes que Hermandad y Banda', () => {
  const result = prepareRelationalItems([
    item('Banda', 'banda-1'),
    item('Hermandad', 'hermandad-1'),
    item('Imagen', 'imagen-1'),
    item('Imagen', 'imagen-2'),
  ], { profile: 'paso', maxItems: 4 });

  assert.deepEqual(
    result.visibleItems.map((entry) => entry.kind),
    ['Imagen', 'Imagen', 'Hermandad', 'Banda']
  );
});

test('Banda prioriza pasos antes que Hermandades', () => {
  const result = prepareRelationalItems([
    item('Hermandad', 'hermandad-1'),
    item('Paso', 'paso-1'),
    item('Hermandad', 'hermandad-2'),
    item('Paso', 'paso-2'),
  ], { profile: 'banda', maxItems: 4 });

  assert.deepEqual(
    result.visibleItems.map((entry) => entry.kind),
    ['Paso', 'Paso', 'Hermandad', 'Hermandad']
  );
});

test('la misma ficha destino no se repite y gana la relación más prioritaria', () => {
  const result = prepareRelationalItems([
    item('Banda', 'banda-sol', { relation: 'Acompañamiento actual', priority: 40 }),
    item('Banda', 'banda-sol', { relation: 'Vínculo institucional', priority: 30 }),
  ], { profile: 'hermandad', maxItems: 8 });

  assert.equal(result.totalItems, 1);
  assert.equal(result.visibleItems.length, 1);
  assert.equal(result.visibleItems[0].relation, 'Vínculo institucional');
});

test('si faltan categorías, rellena la capacidad sin ocultar relaciones útiles', () => {
  const result = prepareRelationalItems(
    Array.from({ length: 6 }, (_, index) => item('Imagen', `imagen-${index + 1}`)),
    { profile: 'hermandad', maxItems: 5 }
  );

  assert.equal(result.visibleItems.length, 5);
  assert.equal(result.hiddenItems.length, 1);
});
