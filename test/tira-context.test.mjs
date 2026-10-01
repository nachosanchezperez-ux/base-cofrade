import test from 'node:test'
import assert from 'node:assert/strict'

import {
  disciplineFromQuestion,
  genericSetIntent,
  normalizeTira,
  refersToPreviousSet,
  singleEntityRelationIntent,
  typeNoun,
} from '../lib/tira-context.js'

test('normaliza preguntas cofrades con tildes', () => {
  assert.equal(normalizeTira('¿Qué bandas acompañan?'), 'que bandas acompanan')
})

test('detecta referencias al conjunto anterior', () => {
  assert.equal(refersToPreviousSet('¿Y cuáles son de música?'), true)
  assert.equal(refersToPreviousSet('Compáralos'), true)
  assert.equal(refersToPreviousSet('Háblame del Baratillo'), false)
})

test('clasifica repreguntas sobre bandas', () => {
  assert.equal(genericSetIntent('¿Cuáles son bandas de música?', 'band'), 'band_filter_music')
  assert.equal(genericSetIntent('¿Desde cuándo acompaña cada una?', 'band'), 'band_accompaniment_since')
  assert.equal(genericSetIntent('¿Cuál aparece relacionada con más hermandades?', 'band'), 'band_most_brotherhoods')
  assert.equal(genericSetIntent('Compáralas', 'band'), 'band_compare')
})

test('clasifica repreguntas sobre pasos y hermandades', () => {
  assert.equal(genericSetIntent('¿Quién lleva cada uno?', 'step'), 'step_personnel')
  assert.equal(genericSetIntent('¿Qué bandas acompañan estos pasos?', 'step'), 'step_bands')
  assert.equal(genericSetIntent('¿Cuántos pasos tiene cada una?', 'brotherhood'), 'brotherhood_steps')
})

test('reconoce preguntas directas sobre los pasos de una Hermandad sin exigir la palabra hermandad', () => {
  assert.equal(singleEntityRelationIntent('¿Qué pasos tiene San Benito?'), 'steps_of_brotherhood')
  assert.equal(singleEntityRelationIntent('¿Cuántos pasos posee El Baratillo?'), 'steps_of_brotherhood')
  assert.equal(singleEntityRelationIntent('¿Quién lleva el paso de misterio de San Benito?'), null)
})

test('extrae disciplinas en lenguaje natural', () => {
  assert.equal(disciplineFromQuestion('Enséñame solo los orfebres'), 'orfebreria')
  assert.equal(disciplineFromQuestion('¿Cuáles son compositores?'), 'composicion')
})

test('flexiona etiquetas de conjunto', () => {
  assert.equal(typeNoun('band', 1), 'banda')
  assert.equal(typeNoun('band', 3), 'bandas')
  assert.equal(typeNoun('agent', 2), 'autores o profesionales')
})
