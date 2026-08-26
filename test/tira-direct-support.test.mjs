import test from 'node:test'
import assert from 'node:assert/strict'

import { directSupportKind, supportReferenceLabel } from '../lib/tira-direct-support.js'

test('detecta titularidad y pasos de hermandad', () => {
  assert.equal(directSupportKind(['Hermandad', 'Titularidad', 'Imágenes']), 'brotherhood_images')
  assert.equal(directSupportKind(['Hermandad', 'Pasos', 'Relaciones']), 'brotherhood_steps')
})

test('detecta personal y acompañamientos', () => {
  assert.equal(directSupportKind(['Profesional', 'Paso', 'Hermandad']), 'step_personnel_agent')
  assert.equal(directSupportKind(['Paso', 'Personal', 'Profesionales']), 'step_personnel_step')
  assert.equal(directSupportKind(['Hermandad', 'Acompañamiento', 'Banda']), 'music_brotherhood')
  assert.equal(directSupportKind(['Banda', 'Acompañamientos', 'Hermandades']), 'music_band')
})

test('detecta autoría y restauraciones sobre conjuntos de imágenes', () => {
  assert.equal(directSupportKind(['Contexto anterior', '3 imágenes', 'Autoría']), 'image_authorships')
  assert.equal(directSupportKind(['Contexto anterior', '3 imágenes', 'Restauraciones']), 'image_restorations')
})

test('etiqueta la precisión de cada fuente', () => {
  assert.equal(supportReferenceLabel('music_band'), 'Fuente del acompañamiento')
  assert.equal(supportReferenceLabel('step_personnel_step'), 'Fuente del cargo actual')
})
