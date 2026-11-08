import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { noteSentences, routeMoments, routeStreets, sourceDateLabel } from '../lib/glory-detail-presentation.js'

test('la información práctica se lee frase a frase', () => {
  assert.deepEqual(noteSentences('La procesión saldrá a las 17:00 h y entrará a las 22:45 h. La Banda abrirá el cortejo. El sábado 7 habrá bando.'), [
    'La procesión saldrá a las 17:00 h y entrará a las 22:45 h.',
    'La Banda abrirá el cortejo.',
    'El sábado 7 habrá bando.',
  ])
  // Las abreviaturas no cortan la frase.
  assert.deepEqual(noteSentences('Capataz: N.H.D. Miguel Ángel Pérez. Acompaña la Banda.'), [
    'Capataz: N.H.D. Miguel Ángel Pérez.',
    'Acompaña la Banda.',
  ])
  assert.deepEqual(noteSentences(''), [])
})

test('los momentos del recorrido son los puntos intermedios con nota', () => {
  const moments = routeMoments([
    { order: 1, label: 'Magdalena', notes: 'Salida', time: '17:00' },
    { order: 2, label: 'Rioja' },
    { order: 3, label: 'Plaza de San Francisco', notes: 'Recepción en el Ayuntamiento' },
    { order: 4, label: 'Convento', type: 'station' },
    { order: 5, label: 'Magdalena', notes: 'Entrada', time: '22:45' },
  ])
  assert.deepEqual(moments.map((moment) => moment.label), ['Plaza de San Francisco', 'Convento'])
  assert.deepEqual(routeMoments([]), [])
})

test('el recorrido cabe en una línea de calles', () => {
  assert.deepEqual(routeStreets('Magdalena → Rioja → Tetuán → Magdalena.'), ['Magdalena', 'Rioja', 'Tetuán', 'Magdalena'])
  assert.deepEqual(routeStreets('Peris Mencheta, plaza de la Mata, Feria y Relator'), ['Peris Mencheta', 'plaza de la Mata', 'Feria', 'Relator'])
  assert.deepEqual(routeStreets(''), [])
})

test('la ficha de Gloria usa la presentación compacta y deja la navegación al final', () => {
  const page = readFileSync(new URL('../app/procesiones-de-gloria/[slug]/page.js', import.meta.url), 'utf8')
  assert.match(page, /noteSentences\(item\.publicNotes\)/)
  assert.match(page, /routeMoments\(item\.routePoints/)
  assert.match(page, /<details className=\{styles\.routeDetails\}/)
  assert.ok(page.indexOf('<AgendaCofradeNav') > page.indexOf('fuentes-procesion-gloria'), 'la navegación de la Agenda va tras las fuentes')
})

test('las fuentes llevan la fecha en palabras', () => {
  assert.equal(sourceDateLabel('2026-11-07'), '7 de noviembre de 2026')
  assert.equal(sourceDateLabel(''), '')
})
