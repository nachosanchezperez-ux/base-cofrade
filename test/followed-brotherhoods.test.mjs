import test from 'node:test'
import assert from 'node:assert/strict'
import {
  FOLLOWED_LIMIT,
  brotherhoodSlugFromHref,
  followedServerSnapshot,
  normalizeFollowed,
  readFollowed,
  toggleFollowed,
} from '../lib/followed-brotherhoods.js'

test('el slug de la Hermandad sale de su ficha, con o sin ancla', () => {
  assert.equal(brotherhoodSlugFromHref('/hermandades/san-benito'), 'san-benito')
  assert.equal(brotherhoodSlugFromHref('/hermandades/la-paz#cultos'), 'la-paz')
  assert.equal(brotherhoodSlugFromHref('/hermandades/la-paz/'), 'la-paz')
  assert.equal(brotherhoodSlugFromHref('/bandas/las-cigarreras'), '')
  assert.equal(brotherhoodSlugFromHref('/hermandades'), '')
  assert.equal(brotherhoodSlugFromHref('https://evil.example/hermandades/x'), '')
})

test('seguir y dejar de seguir alterna sin duplicar', () => {
  const one = toggleFollowed([], { slug: 'san-benito', name: 'San Benito', municipality: 'Sevilla' })
  assert.deepEqual(one, [{ slug: 'san-benito', name: 'San Benito', municipality: 'Sevilla' }])
  const two = toggleFollowed(one, { slug: 'la-paz', name: 'La Paz' })
  assert.deepEqual(two.map((item) => item.slug), ['la-paz', 'san-benito'], 'la última seguida va primero')
  assert.deepEqual(toggleFollowed(two, { slug: 'san-benito' }).map((item) => item.slug), ['la-paz'])
  assert.deepEqual(toggleFollowed(two, { slug: 'No Válido' }), two)
})

test('los datos guardados se limpian: sin duplicados, sin basura y con límite', () => {
  const dirty = [{ slug: 'a' }, { slug: 'a' }, { slug: '../x' }, null, 'texto', { slug: 'b', name: 'B'.repeat(300) }]
  const clean = normalizeFollowed(dirty)
  assert.deepEqual(clean.map((item) => item.slug), ['a', 'b'])
  assert.equal(clean[1].name.length, 120)
  assert.deepEqual(normalizeFollowed('no es una lista'), [])
  const many = Array.from({ length: FOLLOWED_LIMIT + 10 }, (_, index) => ({ slug: `h-${index}` }))
  assert.equal(normalizeFollowed(many).length, FOLLOWED_LIMIT)
})

test('sin navegador no se rompe: lista vacía estable para el servidor', () => {
  assert.deepEqual(readFollowed(), [])
  assert.equal(followedServerSnapshot(), followedServerSnapshot())
})
