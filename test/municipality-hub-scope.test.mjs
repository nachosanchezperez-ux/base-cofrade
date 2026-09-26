import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('una Banda externa no puede crear por sí sola un hub municipal', () => {
  const source = read('lib/municipality-agenda.js')

  assert.match(source, /const hasSevilleAnchor = Boolean\(agenda\.length \|\| crew\.length \|\| localBrotherhoods\.length\)/)
  assert.match(source, /const localBands = hasSevilleAnchor/)
  assert.match(source, /item\.province === 'Sevilla'/)
  assert.match(source, /exists: hasSevilleAnchor/)
})

test('Imágenes y Pasos complementan un hub válido pero no lo originan', () => {
  const source = read('lib/municipality-agenda.js')

  assert.match(source, /const localImages = hasSevilleAnchor/)
  assert.match(source, /const localSteps = hasSevilleAnchor/)
  assert.doesNotMatch(source, /exists:[\s\S]{0,180}localImages\.length/)
  assert.doesNotMatch(source, /exists:[\s\S]{0,180}localSteps\.length/)
})
