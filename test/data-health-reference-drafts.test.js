import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Salud solo trata como crítica una referencia publicada sin ficha especializada', () => {
  const health = source('lib/panel/data-health.js')

  assert.match(health, /for \(const entity of published\.filter\(\(item\) => SPECIALIZED_TYPES\.includes\(item\.entity_type\)\)\)/)
  assert.match(health, /href: '\/panel\/datos\/referencias'/)
  assert.match(health, /Nodo publicado sin ficha editable/)
  assert.doesNotMatch(health, /for \(const entity of entities\.filter\(\(item\) => SPECIALIZED_TYPES\.includes\(item\.entity_type\)\)\)/)
})
