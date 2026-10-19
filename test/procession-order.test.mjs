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
  assert.deepEqual(processionCounts(official), { insignias: 3, tramos: 2, steps: 2 });
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
