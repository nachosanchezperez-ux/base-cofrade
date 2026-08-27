import assert from 'node:assert/strict'
import test from 'node:test'

import {
  filterPublicPageEntities,
  isPublicEntityPageReady,
} from '../lib/supabase/public-entity-page.js'

test('el sitemap excluye entidades publicadas sin perfil especializado', () => {
  const entities = [
    { id: 'brotherhood-ready', entity_type: 'brotherhood', slug: 'lista' },
    { id: 'brotherhood-missing', entity_type: 'brotherhood', slug: 'incompleta' },
    { id: 'band-ready', entity_type: 'band', slug: 'banda-lista' },
  ]

  const result = filterPublicPageEntities(entities, {
    brotherhood: [{ entity_id: 'brotherhood-ready' }],
    band: [{ entity_id: 'band-ready' }],
  })

  assert.deepEqual(result.map((entity) => entity.id), ['brotherhood-ready', 'band-ready'])
})

test('una ficha pública exige estado, slug y perfil especializado', () => {
  const published = { status: 'published', slug: 'hermandad-publicada' }

  assert.equal(isPublicEntityPageReady(published, { entity_id: 'profile' }), true)
  assert.equal(isPublicEntityPageReady(published, null), false)
  assert.equal(isPublicEntityPageReady({ ...published, slug: null }, { entity_id: 'profile' }), false)
  assert.equal(isPublicEntityPageReady({ ...published, status: 'draft' }, { entity_id: 'profile' }), false)
})
