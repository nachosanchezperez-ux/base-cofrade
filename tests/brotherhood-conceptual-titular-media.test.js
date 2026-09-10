import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(
  new URL('../components/BrotherhoodRelationalExtras.js', import.meta.url),
  'utf8'
)

test('las titularidades conceptuales no heredan fotografías físicas de otros contextos', () => {
  const component = source.slice(
    source.indexOf('export async function BrotherhoodConceptualTitulars'),
    source.indexOf('function BrotherhoodDiscoveryPaths')
  )

  assert.doesNotMatch(component, /getPublishedEntityCoverMediaMap/)
  assert.doesNotMatch(component, /media\.path/)
  assert.match(component, /Identidad devocional titular independiente de una Imagen física\./)
})
