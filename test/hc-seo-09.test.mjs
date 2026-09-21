import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  brotherhoodDirectoryLocalities,
  brotherhoodLocalityPath,
  brotherhoodsForLocality,
} from '../lib/brotherhood-public-index.js'

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
  const page = await read('app/hermandades/localidad/[localidad]/page.js')

  assert.match(page, /getPublicIndexableEntityEntries/)
  assert.match(page, /filterIndexableBrotherhoods/)
  assert.match(page, /brotherhoodsForLocality/)
  assert.match(page, /robots: \{ index: false, follow: false \}/)
  assert.match(page, /notFound\(\)/)
  assert.match(page, /socialMetadata/)
  assert.match(page, /DirectoryRoutePage/)
})

test('el índice SSR y el sitemap descubren las páginas municipales canónicas', async () => {
  const [index, sitemap] = await Promise.all([
    read('components/BrotherhoodPublicIndex.js'),
    read('app/sitemap.js'),
  ])

  assert.match(index, /brotherhoodDirectoryLocalities/)
  assert.match(index, /<Link href=\{localityPage\.href\}/)
  assert.match(sitemap, /filterIndexableBrotherhoods/)
  assert.match(sitemap, /brotherhoodLocalityEntries\(indexableBrotherhoods\)/)
})
