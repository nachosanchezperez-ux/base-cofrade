import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  brotherhoodDirectoryLocalities,
  brotherhoodLocalityPath,
  brotherhoodsForLocality,
} from '../lib/brotherhood-public-index.js'
import { renderBrotherhoodDirectory } from '../test-support/brotherhood-directory-ssr.mjs'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const sample = [
  { id: '1', slug: 'a', nombrePopular: 'A', localidad: 'Sevilla' },
  { id: '2', slug: 'b', nombrePopular: 'B', localidad: 'Sevilla' },
  { id: '3', slug: 'c', nombrePopular: 'C', localidad: 'Sevilla' },
  { id: '4', slug: 'd', nombrePopular: 'D', localidad: 'Dos Hermanas' },
  { id: '5', slug: 'e', nombrePopular: 'E', localidad: 'Dos Hermanas' },
]

test('HC-SEO-09 solo publica localidades con masa editorial suficiente', () => {
  assert.deepEqual(brotherhoodDirectoryLocalities(sample), [{
    slug: 'sevilla-capital',
    label: 'Sevilla capital',
    count: 3,
    href: '/hermandades/localidad/sevilla-capital',
  }])
  assert.equal(brotherhoodLocalityPath('estepa'), '/hermandades/localidad/estepa')
  assert.deepEqual(brotherhoodsForLocality(sample, 'sevilla-capital').map((item) => item.id), ['1', '2', '3'])
  assert.deepEqual(brotherhoodsForLocality(sample, 'dos-hermanas'), [])
})

test('la landing municipal comparte la frontera pública de indexabilidad', async () => {
  const [page, sharedDirectory] = await Promise.all([
    read('app/hermandades/localidad/[localidad]/page.js'),
    read('lib/supabase/indexable-brotherhood-directory.js'),
  ])
  assert.match(page, /getIndexableBrotherhoodDirectory/)
  assert.match(sharedDirectory, /getPublicIndexableEntityEntries/)
  assert.match(sharedDirectory, /filterIndexableBrotherhoods/)
  assert.match(page, /brotherhoodsForLocality/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /notFound\(\)/)
  assert.match(page, /socialMetadata/)
  assert.match(page, /DirectoryRoutePage/)
})

test('el HTML inicial y el sitemap descubren solo páginas municipales canónicas elegibles', async () => {
  const [page, sitemap, html] = await Promise.all([
    read('app/hermandades/page.js'),
    read('app/sitemap.js'),
    renderBrotherhoodDirectory(sample),
  ])
  assert.match(page, /localities: brotherhoodDirectoryLocalities\(indexableHermandades\)/)
  const hrefs = [...html.matchAll(/href="(\/hermandades\/localidad\/[^"?#]+)"/g)].map((match) => match[1])
  assert.deepEqual(hrefs, ['/hermandades/localidad/sevilla-capital'])
  // A locality below the landing threshold keeps its individual profile links.
  assert.match(html, /href="\/hermandades\/d"/)
  assert.match(html, /href="\/hermandades\/e"/)
  assert.match(sitemap, /filterIndexableBrotherhoods/)
  assert.match(sitemap, /brotherhoodLocalityEntries\(indexableBrotherhoods\)/)
})
