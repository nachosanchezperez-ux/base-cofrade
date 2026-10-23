import assert from 'node:assert/strict';
import test from 'node:test';
import { brotherhoodThread, historyParagraphs, splitHistory } from '../lib/brotherhood-thread.js';

const brotherhood = { slug: 'hermandad-x', nombrePopular: 'Hermandad X' };
const titular = { id: 'img-1', slug: 'cristo-x', nombre: 'Cristo X', autor: 'Autor A', fecha: '1966', fichaDisponible: true };
const step = { id: 'paso-1', slug: 'paso-cristo-x', nombre: 'Paso del Cristo', fichaDisponible: true, imagenes: ['img-1'] };
const band = { pasoId: 'paso-1', banda: 'Banda B', bandaSlug: 'banda-b', periodo: 'Desde 1997' };
const march = { slug: 'marcha-m', name: 'Marcha M', year: 1995, bandRelation: { label: 'Grabada por', slug: 'banda-b' }, composers: [{ name: 'Compositor C', slug: 'compositor-c' }] };

test('Cadena completa con relaciones publicadas', () => {
  const nodes = brotherhoodThread({ brotherhood, titulars: [titular], steps: [step], accompaniments: [band], marches: [march] });
  assert.deepEqual(nodes.map((node) => node.kind), ['brotherhood', 'image', 'step', 'band', 'march', 'author']);
  assert.equal(nodes[1].detail, 'Autor A · 1966');
  assert.equal(nodes[3].detail, 'Desde 1997');
  assert.equal(nodes[4].relation, 'Marcha dedicada · grabada por esta banda');
  assert.equal(nodes[5].href, '/autores/compositor-c');
});

test('La cadena se corta donde falta una relación (no salta eslabones)', () => {
  const withoutMarch = brotherhoodThread({ brotherhood, titulars: [titular], steps: [step], accompaniments: [band], marches: [{ ...march, bandRelation: { label: 'Grabada por', slug: 'otra' } }] });
  assert.deepEqual(withoutMarch.map((node) => node.kind), ['brotherhood', 'image', 'step', 'band']);
  const withoutBand = brotherhoodThread({ brotherhood, titulars: [titular], steps: [step], accompaniments: [], marches: [march] });
  assert.deepEqual(withoutBand.map((node) => node.kind), ['brotherhood', 'image', 'step']);
});

test('Sin ficha publicada no hay eslabón ni cadena', () => {
  assert.deepEqual(brotherhoodThread({ brotherhood, titulars: [{ ...titular, fichaDisponible: false }], steps: [step] }), []);
  assert.deepEqual(brotherhoodThread({ brotherhood, titulars: [titular], steps: [{ ...step, fichaDisponible: false }] }), []);
});

test('Elige el paso con la cadena más larga y prefiere la marcha estrenada', () => {
  const titular2 = { ...titular, id: 'img-2', slug: 'virgen-x', nombre: 'Virgen X' };
  const step2 = { ...step, id: 'paso-2', slug: 'paso-palio', nombre: 'Paso de palio', imagenes: ['img-2'] };
  const band2 = { ...band, pasoId: 'paso-2', banda: 'Banda P', bandaSlug: 'banda-p' };
  const premiered = { ...march, slug: 'estreno', name: 'Estreno', bandRelation: { label: 'Estrenada por', slug: 'banda-p' } };
  const recorded = { ...march, slug: 'grabada', name: 'Grabada', bandRelation: { label: 'Grabada por', slug: 'banda-p' } };
  const nodes = brotherhoodThread({ brotherhood, titulars: [titular, titular2], steps: [step, step2], accompaniments: [band2], marches: [recorded, premiered] });
  assert.equal(nodes[2].label, 'Paso de palio');
  assert.equal(nodes[4].label, 'Estreno');
});

test('Historia: lo anunciado o futuro no se presenta como historia consumada', () => {
  const { past, upcoming } = splitHistory([
    { fecha: '1735', titulo: 'Fundación' },
    { fecha: '2026', titulo: 'Coronación', estado: 'Acontecimiento anunciado' },
    { fecha: '2027', titulo: 'Futuro' },
    { fecha: '1996', titulo: 'Pregón', estado: 'Salida extraordinaria' },
  ], '2026-10-19');
  assert.deepEqual(past.map((item) => item.titulo), ['Fundación', 'Pregón']);
  assert.deepEqual(upcoming.map((item) => item.titulo), ['Coronación', 'Futuro']);
});

test('Historia: primer párrafo visible, el resto plegado', () => {
  assert.deepEqual(historyParagraphs('Uno.\n\nDos.\n\n\nTres.'), { lead: 'Uno.', rest: ['Dos.', 'Tres.'] });
  assert.deepEqual(historyParagraphs('\nSolo uno.\n'), { lead: 'Solo uno.', rest: [] });
});
