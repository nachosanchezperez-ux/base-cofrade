import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { groupBrotherhoodsByLocality } from '../lib/brotherhood-public-index.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('el índice agrupa por localidad, prioriza Sevilla y ordena las fichas', () => {
  const groups = groupBrotherhoodsByLocality([
    { id: '3', slug: 'z', nombrePopular: 'Zeta', localidad: 'Carmona' },
    { id: '2', slug: 'a', nombrePopular: 'Ánimas', localidad: 'Carmona' },
    { id: '1', slug: 's', nombrePopular: 'Silencio', localidad: 'Sevilla' },
    { id: '4', slug: '', nombrePopular: 'Sin URL', localidad: 'Écija' },
  ])

  assert.deepEqual(groups.map((group) => group.locality), ['Sevilla', 'Carmona'])
  assert.deepEqual(groups[1].items.map((item) => item.slug), ['a', 'z'])
})

test('Hermandades publica enlaces HTML directos sin depender del componente cliente', () => {
  const page = read('app/hermandades/page.js')
  const index = read('components/BrotherhoodPublicIndex.js')

  assert.match(page, /<BrotherhoodPublicIndex brotherhoods=\{hermandades\} \/>/)
  assert.doesNotMatch(index, /['"]use client['"]/)
  assert.match(index, /href=\{`\/hermandades\/\$\{item\.slug\}`\}/)
  assert.match(index, /groupBrotherhoodsByLocality/)
  assert.match(index, /Hermandades por localidad/)
})

test('el índice reduce el prefetch masivo sin retirar los enlaces rastreables', () => {
  const index = read('components/BrotherhoodPublicIndex.js')

  assert.match(index, /prefetch=\{false\}/)
  assert.match(index, /<Link/)
  assert.match(index, /<ul>/)
  assert.match(index, /<li key=/)
})
