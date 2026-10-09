import test from 'node:test'
import assert from 'node:assert/strict'
import { agendaEventAnchor, schedulePrecision, agendaDirectionsHref } from '../lib/agenda-event-presentation.js'

test('un acto se comparte con un fragmento estable de agenda sin generar una página', () => {
  assert.equal(agendaEventAnchor({ key: 'rosaries:2575623e' }), 'acto-rosaries-2575623e')
})

test('no convierte horas publicadas en exactas ni inventa precisión', () => {
  const schedule = [{ label: 'Salida', notes: 'Hora aproximada publicada' }, { label: 'Entrada', notes: 'Entrada prevista' }]
  assert.equal(schedulePrecision(schedule, 'departure'), 'Aprox.')
  assert.equal(schedulePrecision(schedule, 'arrival'), 'Prevista')
  assert.equal(schedulePrecision([], 'departure'), '')
})

test('cómo llegar necesita lugar y municipio y conserva los caracteres del nombre', () => {
  assert.equal(agendaDirectionsHref('', 'Dos Hermanas'), '')
  const href = new URL(agendaDirectionsHref('Parroquia del Rocío', 'Dos Hermanas'))
  assert.equal(href.searchParams.get('query'), 'Parroquia del Rocío, Dos Hermanas, Sevilla, España')
})
