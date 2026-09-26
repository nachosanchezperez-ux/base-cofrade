import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el modo directo no muestra textos explicativos redundantes', () => {
  const home = read('components/HomePageV2.js')
  const complement = read('lib/home-temporal-complement.js')
  const temporal = read('components/HomeTemporalFocus.js')

  assert.doesNotMatch(home, /La portada agrupa las salidas que coinciden en tiempo real/)
  assert.doesNotMatch(complement, /Además de las salidas que ya están en la calle/)
  assert.match(temporal, /temporal\.mode === 'complement' \? null/)
})
