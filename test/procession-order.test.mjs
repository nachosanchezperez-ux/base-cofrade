import test from 'node:test';
import assert from 'node:assert/strict';
import { hasDocumentedOrder, markRepeatedHeritage, processionCounts, processionSections } from '../lib/procession-order.js';
import { PROCESSION_ORDER_DEMO } from '../lib/procession-order-demo.js';

const official = {
  year: 2026,
  source: { name: 'Nómina oficial de la Hermandad' },
  items: [
    { sequence: 30, kind: 'tramo', label: 'Tramo 1' },
    { sequence: 10, kind: 'cross_guide', label: 'Cruz de Guía' },
    { sequence: 40, kind: 'insignia', label: 'Senatus', heritage: { id: 'h1' } },
    { sequence: 50, kind: 'step', label: 'Paso de misterio' },
    { sequence: 60, kind: 'tramo', label: 'Tramo 2' },
    { sequence: 70, kind: 'insignia', label: 'Senatus', heritage: { id: 'h1' } },
    { sequence: 80, kind: 'presidency', label: 'Presidencia' },
    { sequence: 90, kind: 'step', label: 'Paso de palio' },
  ],
};

test('Sin orden, sin fuente o solo con pasos no hay cortejo completo', () => {
  assert.equal(hasDocumentedOrder(null), false);
  assert.equal(hasDocumentedOrder({ items: official.items }), false);
  assert.equal(hasDocumentedOrder({ source: { name: 'X' }, items: [{ kind: 'step', label: 'A' }, { kind: 'step', label: 'B' }, { kind: 'tramo', label: 'T' }] }), false);
  assert.deepEqual(processionSections(null), []);
  assert.equal(hasDocumentedOrder(official), true);
});

test('Respeta el orden real y diferencia tramos, insignias y pasos', () => {
  const sections = processionSections(official);
  assert.deepEqual(sections.map((s) => s.kind === 'step' ? `paso:${s.step.label}` : `${s.kind}:${s.title}|${s.items.map((i) => i.label).join(',')}`), [
    'head:|Cruz de Guía',
    'tramo:Tramo 1|Senatus',
    'paso:Paso de misterio',
    'tramo:Tramo 2|Senatus,Presidencia',
    'paso:Paso de palio',
  ]);
  // El Senatus aparece dos veces pero es la misma pieza: cuenta una.
  assert.deepEqual(processionCounts(official), { insignias: 2, tramos: 2, steps: 2 });
});

test('Una pieza patrimonial se describe una sola vez', () => {
  const sections = markRepeatedHeritage(processionSections(official));
  const senatus = sections.flatMap((s) => s.items).filter((i) => i.label === 'Senatus');
  assert.equal(senatus[0].heritage.id, 'h1');
  assert.equal(senatus[1].heritage, null);
});

test('La demostración está marcada como tal y no lleva fuente', () => {
  assert.equal(PROCESSION_ORDER_DEMO.demo, true);
  assert.equal(PROCESSION_ORDER_DEMO.source, null);
  assert.ok(PROCESSION_ORDER_DEMO.items.every((item) => /ejemplo|^Tramo \d$/i.test(item.label)));
});

import { readFileSync } from 'node:fs';
import { orderFromListing } from '../lib/procession-order.js';

test('Orden procesional del Baratillo (borrador): dos cortejos, cada uno cerrado por su paso, bocinas una sola vez', () => {
  const listing = JSON.parse(readFileSync(new URL('../docs/insignias-baratillo-borrador-2026-10-20.json', import.meta.url), 'utf8'));
  const order = orderFromListing(listing);
  assert.equal(order.scope, 'listing');
  assert.equal(order.source.url, 'https://hermandadelbaratillo.es/insignias/');
  const sections = markRepeatedHeritage(processionSections(order));
  assert.equal(order.procession, true);
  assert.deepEqual(sections.map((s) => s.kind === 'step' ? `paso:${s.step.note}` : s.title), ['Cortejo del paso de Cristo', 'paso:Paso de misterio', 'Cortejo del paso de palio', 'paso:Paso de palio']);
  assert.equal(sections[0].items[0].label, 'Cruz de Guía (1956)');
  assert.equal(sections[0].items.length, 10);
  assert.equal(sections[2].items.length, 8);
  const bocinas = sections.flatMap((s) => s.items).filter((i) => i.label.startsWith('Bocinas'));
  assert.equal(bocinas.length, 2);
  // La posición enlaza a la pieza en Patrimonio, sin copiar sus datos.
  assert.equal(bocinas[0].heritage.href, '#pieza-bocinas-1956');
  assert.equal(bocinas[0].heritage.author, undefined);
  assert.equal(bocinas[1].heritage, null);
  assert.deepEqual(processionCounts(order), { insignias: 17, tramos: 0, steps: 2 });
});

test('Piezas del Baratillo para Patrimonio: una vez cada una, con el ancla que usa el cortejo', async () => {
  const { heritagePiecesFromListing } = await import('../lib/procession-order.js');
  const { heritagePieceAnchor } = await import('../lib/heritage-anchor.js');
  const listing = JSON.parse(readFileSync(new URL('../docs/insignias-baratillo-borrador-2026-10-20.json', import.meta.url), 'utf8'));
  const pieces = heritagePiecesFromListing(listing);
  assert.equal(pieces.length, 17);
  assert.equal(pieces.filter((p) => p.nombre === 'Bocinas').length, 1);
  const order = orderFromListing(listing);
  const anchors = new Set(pieces.map((p) => `#${heritagePieceAnchor(p.id)}`));
  for (const item of order.items.filter((i) => i.heritage?.href)) assert.ok(anchors.has(item.heritage.href), item.label);
  assert.equal(heritagePieceAnchor('Senatus|1969'), 'pieza-senatus-1969');
});

test('Glosario de insignias: tipo por nombre y pista de reconocimiento', async () => {
  const { insigniaType, recognitionHint } = await import('../lib/insignia-glossary.js');
  assert.equal(insigniaType('Bandera Votiva (1969)').key, 'bandera');
  assert.equal(insigniaType('Banderín de San José').key, 'banderin');
  assert.equal(insigniaType('Guion de la Real Maestranza').key, 'guion');
  assert.equal(insigniaType('Cruz de Guía (1956)').key, 'cruz-guia');
  assert.equal(insigniaType('Elemento sin tipo'), null);
  assert.equal(recognitionHint('Terciopelo burdeos; asta de plata'), 'Terciopelo burdeos');
  assert.equal(recognitionHint(''), '');
});
