import assert from 'node:assert/strict'
import test from 'node:test'

import { patrimonyEntityScore, patrimonyV4Intent } from '../lib/tira-authors-patrimony-v4.js'

test('detecta Autor -> Imágenes y continuidad contextual', () => {
  assert.equal(patrimonyV4Intent('¿Qué imágenes hizo Luis Ortega Bru?')?.kind, 'agent_images')
  assert.equal(patrimonyV4Intent('¿Qué otras imágenes hizo?', { entityType: 'agent' })?.kind, 'agent_images')
})

test('detecta Autor -> trabajos en Pasos', () => {
  assert.equal(patrimonyV4Intent('¿En qué pasos trabajó Antonio Castillo Lastrucci?')?.kind, 'agent_steps')
  assert.equal(patrimonyV4Intent('¿Y en qué otros pasos?', { entityType: 'agent' })?.kind, 'agent_steps')
})

test('consulta intervenciones sin inventar restaurador', () => {
  const context = { entityType: 'image', entityId: 'image-1' }
  assert.equal(patrimonyV4Intent('¿Qué restauraciones tiene?', context)?.kind, 'image_interventions')
  assert.equal(patrimonyV4Intent('¿Quién restauró esta imagen?', context), null)
})

test('detecta Autor -> Hermandades y cruce concreto', () => {
  assert.equal(patrimonyV4Intent('¿En qué hermandades hay obras de Luis Ortega Bru?')?.kind, 'agent_brotherhoods')
  assert.equal(patrimonyV4Intent('¿Qué relación hay entre Luis Ortega Bru y la Hermandad de San Gonzalo?')?.kind, 'agent_brotherhood_works')
})

test('continúa desde una Imagen hacia otras de la misma Hermandad y autor', () => {
  const context = { entityType: 'image', entityId: 'image-1' }
  assert.equal(patrimonyV4Intent('¿Qué otras imágenes de la misma hermandad son del mismo autor?', context)?.kind, 'same_author_images_in_brotherhood')
})

test('reconoce nombres parciales de autores e imágenes', () => {
  assert.ok(patrimonyEntityScore('Luis Ortega Bru', '¿Qué imágenes hizo Ortega Bru?') >= 300)
  assert.ok(patrimonyEntityScore('Nuestra Señora de la Salud', 'restauraciones de la Virgen de la Salud') >= 300)
})

test('no secuestra preguntas básicas de autoría ya resueltas', () => {
  assert.equal(patrimonyV4Intent('¿Quién hizo la Virgen de la Salud?'), null)
  assert.equal(patrimonyV4Intent('¿De qué año es la Virgen de la Salud?'), null)
})
