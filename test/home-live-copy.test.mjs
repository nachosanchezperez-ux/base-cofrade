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


test('la destacada del fin de semana no añade una entradilla editorial redundante', () => {
  const home = read('components/HomePageV2.js')

  assert.doesNotMatch(home, /María Santísima de Regla recupera el gran formato editorial/)
  assert.doesNotMatch(home, /con horarios, música y lugares clave/)
})


test('la Home no renderiza ni carga la retransmisión destacada del Rosario', () => {
  const home = read('components/HomePageV2.js')
  const page = read('app/page.js')
  const snapshot = read('lib/supabase/home-snapshot.js')

  assert.doesNotMatch(home, /HomeFeaturedVideo/)
  assert.doesNotMatch(home, /featuredVideo/)
  assert.doesNotMatch(page, /featuredVideo/)
  assert.doesNotMatch(snapshot, /getHomeFeaturedVideo/)
  assert.doesNotMatch(snapshot, /featuredVideo/)
  assert.match(snapshot, /hilo-cofrade-home-public-snapshot-v22/)
})
