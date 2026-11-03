import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { FOLLOWED_BANDS_STORAGE_KEY, isFollowedUpdate, toggleFollowedBand } from '../lib/followed-bands.js'
import { FOLLOWED_STORAGE_KEY } from '../lib/followed-brotherhoods.js'
import { buildPlatformUpdates } from '../lib/platform-updates.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las bandas seguidas se guardan aparte de las hermandades', () => {
  assert.notEqual(FOLLOWED_BANDS_STORAGE_KEY, FOLLOWED_STORAGE_KEY)
  const list = toggleFollowedBand([], { slug: 'carmen-de-salteras', name: 'Carmen de Salteras' })
  assert.deepEqual(list.map((item) => item.slug), ['carmen-de-salteras'])
  assert.deepEqual(toggleFollowedBand(list, { slug: 'carmen-de-salteras' }), [])
})

test('una cruceta nueva se marca si se sigue su banda o su Hermandad', () => {
  const [update] = buildPlatformUpdates({
    repertoires: [{
      id: 'r1', slug: 'macarena-2026', status: 'published', displayTitle: 'La Macarena · 25 de octubre de 2026',
      bandName: 'Carmen de Salteras', bandEntityId: 'b1', bandSlug: 'carmen-de-salteras',
      brotherhoodEntityId: 'h1', brotherhoodSlug: 'la-macarena', outingId: 'o1', createdAt: '2026-10-26T10:00:00Z',
    }],
    now: new Date('2026-11-04T10:00:00Z'),
  })
  assert.deepEqual(update.follow, { brotherhood: 'la-macarena', band: 'carmen-de-salteras' })
  assert.equal(isFollowedUpdate(update, { bands: [{ slug: 'carmen-de-salteras' }] }), true)
  assert.equal(isFollowedUpdate(update, { brotherhoods: [{ slug: 'la-macarena' }] }), true)
  assert.equal(isFollowedUpdate(update, { bands: [{ slug: 'otra' }], brotherhoods: [] }), false)
  assert.equal(isFollowedUpdate({ title: 'sin follow' }, { bands: [{ slug: 'x' }] }), false)
})

test('la ficha de banda muestra «Seguir banda» y Novedades destaca lo seguido', () => {
  assert.match(read('app/bandas/[slug]/page.js'), /actions=\{<FollowBandButton slug=\{band\.slug\}/)
  assert.match(read('components/RelationalEntityHero.js'), /\{actions \? <div/)
  const updates = read('components/HiloUpdates.js')
  assert.match(updates, /isFollowedUpdate\(item, \{ brotherhoods: followedBrotherhoods, bands: followedBands \}\)/)
  assert.match(updates, /De lo que sigues/)
})
