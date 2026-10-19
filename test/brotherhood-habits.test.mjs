import assert from 'node:assert/strict';
import test from 'node:test';
import { documentedHabits, habitSummary, habitsBeforeSteps } from '../lib/brotherhood-habits.js';
import { brotherhoodChapters, habitShortLabel } from '../lib/brotherhood-chapters.js';

const sanBenito = { id: 'h1', nombre: 'Hábito de nazareno', tunica: 'Túnica y capa blancas', antifaz: 'Antifaz de terciopelo morado', cordon: 'Morado, anudado al lado izquierdo' };
const baratilloCristo = { id: 'h2', nombre: 'Cortejo del paso de Cristo', tunica: 'Azul de cola', antifaz: 'Azul', cordon: 'Rojo' };
const baratilloPalio = { id: 'h3', nombre: 'Cortejo del paso de palio', tunica: 'Azul de cola', antifaz: 'Azul', cordon: 'Blanco' };
const steps = [
  { id: 's1', tipo: 'Misterio', nombre: 'Paso del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad' },
  { id: 's2', tipo: 'Palio', nombre: 'Paso de palio de María Santísima de la Caridad' },
];

test('Resumen de la túnica para el orden del cortejo', () => {
  const [habit] = documentedHabits([sanBenito]);
  assert.equal(habit.summary, 'Túnica y capa blancas · antifaz de terciopelo morado · cíngulo morado, anudado al lado izquierdo');
  assert.equal(habitSummary(documentedHabits([baratilloCristo])[0].fields), 'Azul de cola · antifaz azul · cíngulo rojo');
});

test('Sin campos documentados no hay túnica', () => {
  assert.deepEqual(documentedHabits([{ id: 'x', nombre: 'Hábito' }]), []);
});

test('Cada tramo va delante del paso que nombra; si no, al principio', () => {
  const placed = habitsBeforeSteps(documentedHabits([baratilloCristo, baratilloPalio]), steps);
  assert.deepEqual(placed.s1.map((habit) => habit.id), ['h2']);
  assert.deepEqual(placed.s2.map((habit) => habit.id), ['h3']);
  assert.equal(placed.s2[0].label, 'Cortejo del paso de palio');
  const single = habitsBeforeSteps(documentedHabits([sanBenito]), steps);
  assert.deepEqual(Object.keys(single), ['s1']);
  assert.equal(single.s1[0].label, '');
});

test('El acceso a Cortejo menciona la túnica (solo Penitencia)', () => {
  assert.equal(habitShortLabel('Túnica y capa blancas'), 'túnica y capa blancas');
  assert.equal(habitShortLabel('Azul de cola'), 'túnica azul de cola');
  const [, cortejo] = brotherhoodChapters({ types: ['Penitencia'], availability: { titulars: 3, steps: 3, habit: 'Túnica y capa blancas' } });
  assert.equal(cortejo.summary, '3 titulares · 3 pasos · túnica y capa blancas');
  const [, procesion] = brotherhoodChapters({ types: ['Gloria'], availability: { titulars: 1, steps: 1, habit: 'X' } });
  assert.equal(procesion.summary, '1 titular · 1 paso');
});

import { habitComparison, habitDifferences, habitShortName } from '../lib/brotherhood-habits.js';

test('Nombre corto y diferencias entre hábitos', () => {
  assert.equal(habitShortName('Cortejo del paso de Cristo'), 'Cristo');
  assert.equal(habitShortName('Cortejo del paso de palio'), 'Palio');
  assert.equal(habitShortName('Hábito de nazareno'), 'Hábito de nazareno');
  const habits = documentedHabits([baratilloCristo, baratilloPalio]);
  assert.deepEqual([...habitDifferences(habits)], ['cordon']);
  assert.equal(habitDifferences(documentedHabits([sanBenito])).size, 0);
  const { changed, common } = habitComparison(habits);
  assert.deepEqual(changed, [{ key: 'cordon', label: changed[0].label, prefix: '', values: ['Rojo', 'Blanco'] }]);
  const escudos = documentedHabits([{ ...baratilloCristo, escudo: 'Serigrafiado con borde rojo' }, { ...baratilloPalio, escudo: 'Serigrafiado con borde blanco' }]);
  const escudo = habitComparison(escudos).changed.find((row) => row.key === 'escudo');
  assert.deepEqual([escudo.prefix, escudo.values], ['Serigrafiado con borde', ['rojo', 'blanco']]);
  assert.deepEqual(common.map((field) => [field.key, field.value]), [['tunica', 'Azul de cola'], ['antifaz', 'Azul']]);
});

import { habitFieldDisplay, habitTitle } from '../lib/brotherhood-habits.js';

test('Prendas sin redundancia y título del cromo', () => {
  assert.deepEqual(habitFieldDisplay({ label: 'Antifaz', value: 'Antifaz de terciopelo morado' }), { label: 'Antifaz', value: 'Terciopelo morado' });
  assert.deepEqual(habitFieldDisplay({ label: 'Túnica', value: 'Túnica y capa blancas' }), { label: 'Túnica y capa', value: 'Blancas' });
  assert.deepEqual(habitFieldDisplay({ label: 'Túnica', value: 'Azul de cola' }), { label: 'Túnica', value: 'Azul de cola' });
  assert.deepEqual(habitFieldDisplay({ label: 'Antifaz', value: 'Antifaz azul' }), { label: 'Antifaz', value: 'Azul' });
  assert.deepEqual(habitTitle('Cortejo del paso de Cristo'), { kicker: 'Cortejo del paso de', name: 'Cristo' });
  assert.deepEqual(habitTitle('Hábito de nazareno'), { kicker: '', name: 'Hábito de nazareno' });
});
