import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { musicalHeritageAuthorHref } from '../lib/musical-heritage-links.js'

test('Crucetas: composer and arranger published entities link to canonical author pages', () => {
  const composer = { entity_type: 'agent', status: 'published', slug: 'cesareo-gabarain-azurmendi' }
  const arranger = { entity_type: 'agent', status: 'published', slug: 'jose-ramon-lozano-garrido' }
  assert.equal(musicalHeritageAuthorHref(composer), '/autores/cesareo-gabarain-azurmendi')
  assert.equal(musicalHeritageAuthorHref(arranger), '/autores/jose-ramon-lozano-garrido')
  assert.equal(musicalHeritageAuthorHref({ ...arranger, status: 'draft' }), '')
  assert.equal(musicalHeritageAuthorHref({ ...arranger, entity_type: 'band' }), '')
  assert.equal(musicalHeritageAuthorHref({ ...arranger, slug: '' }), '')
})

test('Crucetas: loader uses the shared, published-author URL policy', () => {
  const src = readFileSync(new URL('../lib/supabase/musical-repertoires.js', import.meta.url), 'utf8')
  assert.match(src, /import \{ musicalHeritageAuthorHref \} from '@\/lib\/musical-heritage-links'/)
  assert.match(src, /href: musicalHeritageAuthorHref\(relatedEntityById\.get\(item\.agent_entity_id\)\)/)
  assert.doesNotMatch(src, /href: publicEntityHref\(relatedEntityById\.get\(item\.agent_entity_id\)\)/)
})
