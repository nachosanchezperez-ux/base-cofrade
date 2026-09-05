import assert from 'node:assert/strict';
import test from 'node:test';
import {
  brotherhoodSeoDescription,
  brotherhoodSeoTitle,
  intentSeoTitle,
} from '../lib/seo.js';

test('brotherhoodSeoTitle añade intención sin perder nombre ni localidad', () => {
  assert.equal(
    brotherhoodSeoTitle({ nombrePopular: 'San Benito', localidad: 'Sevilla' }),
    'San Benito (Sevilla): titulares, pasos e historia'
  );
  assert.equal(
    brotherhoodSeoTitle({ nombrePopular: 'Asunción de Cantillana', localidad: 'Cantillana' }),
    'Asunción de Cantillana: titulares, pasos e historia'
  );
});

test('intentSeoTitle conserva íntegro un nombre largo cuando el añadido excede el límite', () => {
  const name = 'Archicofradía de María Auxiliadora Coronada de la Trinidad';
  assert.equal(
    intentSeoTitle(name, ['titulares, pasos e historia']),
    name
  );
});

test('brotherhoodSeoDescription enumera solo bloques realmente documentados', () => {
  const description = brotherhoodSeoDescription({
    nombrePopular: 'San Benito',
    nombreOficial: 'Hermandad de San Benito',
    localidad: 'Sevilla',
    tipos: ['Penitencia'],
    diaSalida: 'Martes Santo',
    imagenes: [{}],
    pasos: [{}],
    acompanamientoActual: [{}],
    patrimonio: [{}],
    cultos: [{}],
    cronologia: [{}],
    salidas: [{}],
  });

  assert.equal(
    description,
    'San Benito en Sevilla: Hermandad de Penitencia · Martes Santo. Titulares, pasos, música, patrimonio, cultos, historia, salidas, fuentes documentales.'
  );
});

test('brotherhoodSeoDescription ignora placeholders editoriales en el día de salida', () => {
  const description = brotherhoodSeoDescription({
    nombrePopular: 'Ficha de prueba',
    nombreOficial: 'Agrupación Parroquial de prueba',
    localidad: 'Sevilla',
    tipos: ['Penitencia'],
    diaSalida: 'Pendiente de confirmar',
    imagenes: [{}],
    fuentesFicha: [{}],
  });

  assert.match(description, /^Ficha de prueba en Sevilla: Agrupación Parroquial\./);
  assert.doesNotMatch(description, /Pendiente/i);
  assert.match(description, /Titulares, fuentes documentales\.$/);
});
