import test from 'node:test';
import assert from 'node:assert/strict';
import { brotherhoodMilestone, nextBrotherhoodAppointment, upcomingBrotherhoodActs } from '../lib/brotherhood-reading.js';
import { historyParagraphs } from '../lib/brotherhood-thread.js';

const agenda = [
  { key: 'bando', date: '2026-11-07', title: 'Bando anunciador de la Coronación Canónica de Nuestra Señora del Amparo · 2026' },
  { key: 'procesion', date: '2026-11-08', startTime: '17:00', title: 'Solemne Procesión de Alabanzas de la Coronación Canónica de Nuestra Señora del Amparo' },
];
const cults = [
  { id: 'novena', anunciada: true, fechaInicio: '2026-10-24', nombre: 'Novena de la Coronación Canónica de Nuestra Señora del Amparo', tipo: 'Novena · 20:00' },
  { id: 'funcion', anunciada: true, fechaInicio: '2026-11-08', nombre: 'Función Principal de Instituto y Coronación Canónica de Nuestra Señora del Amparo', tipo: 'Función Principal de Instituto · 10:00' },
];

test('La gran cita es el acto de la coronación, no los preparatorios', () => {
  const acts = upcomingBrotherhoodActs(agenda, [], '2026-10-19', cults);
  const milestone = brotherhoodMilestone(acts);
  assert.equal(milestone.kind, 'Coronación canónica');
  assert.equal(milestone.name, 'Coronación Canónica de Nuestra Señora del Amparo');
  assert.equal(milestone.date, '2026-11-08');
  assert.deepEqual(milestone.day.map((item) => item.time), ['10:00', '17:00']);
  assert.deepEqual(milestone.day.map((item) => item.key), ['cult:funcion', 'procesion']);
});

test('Próximamente no se desplaza: sigue siendo el siguiente acto', () => {
  assert.equal(nextBrotherhoodAppointment(agenda, [], '2026-10-19', cults).key, 'cult:novena');
});

test('Sin hito, no hay gran cita', () => {
  assert.equal(brotherhoodMilestone(upcomingBrotherhoodActs(agenda.slice(0, 1), [], '2026-10-19', [])), null);
});

test('Historia larga en un solo bloque: entrada breve y el resto completo', () => {
  const text = ('Primera frase de la historia con bastante detalle documentado. Segunda frase con más datos de la corporación y su sede. ').repeat(5).trim();
  const { lead, rest } = historyParagraphs(text);
  assert.ok(lead.length < text.length);
  assert.equal(`${lead} ${rest.join(' ')}`.replace(/\s+/g, ' ').trim(), text);
  assert.deepEqual(historyParagraphs('Breve.\n\nSegundo párrafo.'), { lead: 'Breve.', rest: ['Segundo párrafo.'] });
});
