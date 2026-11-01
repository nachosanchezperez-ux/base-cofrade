import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { musicalHeritageAuthorHref, musicalHeritageMarchHref } from '../lib/musical-heritage-links.js'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('una marcha publicada con slug enlaza a su ficha', () => {
  assert.equal(
    musicalHeritageMarchHref({ slug: 'marcha-piedad-del-baratillo-funebre', status: 'published' }),
    '/marchas/marcha-piedad-del-baratillo-funebre'
  )
})

test('sin slug o sin publicar, la marcha no enlaza', () => {
  assert.equal(musicalHeritageMarchHref({ slug: '', status: 'published' }), '')
  assert.equal(musicalHeritageMarchHref({ slug: 'x', status: 'draft' }), '')
  assert.equal(musicalHeritageMarchHref(undefined), '')
})

test('solo un autor publicado del tipo agente enlaza a /autores', () => {
  assert.equal(
    musicalHeritageAuthorHref({ slug: 'pedro-vicedo-beneyto', status: 'published', entity_type: 'agent' }),
    '/autores/pedro-vicedo-beneyto'
  )
  // Una banda en la misma consulta de entidades no puede acabar en /autores.
  assert.equal(musicalHeritageAuthorHref({ slug: 'banda-x', status: 'published', entity_type: 'band' }), '')
  assert.equal(musicalHeritageAuthorHref({ slug: 'y', status: 'draft', entity_type: 'agent' }), '')
  assert.equal(musicalHeritageAuthorHref({ status: 'published', entity_type: 'agent' }), '')
})

test('los datos del patrimonio musical calculan los enlaces de marcha y compositor', async () => {
  const code = await source('lib/supabase/brotherhood-musical-heritage.js')
  assert.match(code, /href: musicalHeritageMarchHref\(entity\)/)
  assert.match(code, /href: musicalHeritageAuthorHref\(item\.entity\)/)
})

test('la ficha de Hermandad pinta enlaces HTML a la marcha y al compositor cuando existen', async () => {
  const code = await source('components/BrotherhoodMusicalHeritage.js')
  // Antes el título era texto plano: <Heading>{item.name}</Heading>.
  assert.doesNotMatch(code, /<Heading>\{item\.name\}<\/Heading>/)
  assert.match(code, /item\.href \? <Link href=\{item\.href\} prefetch=\{false\}>\{item\.name\}<\/Link> : item\.name/)
  assert.match(code, /author\.href \? <Link href=\{author\.href\} prefetch=\{false\}>\{author\.name\}<\/Link> : author\.name/)
})
