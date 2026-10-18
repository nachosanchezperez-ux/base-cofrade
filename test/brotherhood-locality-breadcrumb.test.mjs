import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { brotherhoodLocalityDirectoryHref } from '../lib/brotherhood-public-index.js'

const sevilla = (slug) => ({ slug, localidad: 'Sevilla', nombrePopular: slug })
const directory = [sevilla('la-o'), sevilla('san-benito'), sevilla('el-baratillo'), { slug: 'x', localidad: 'Marchena' }]

test('la miga lleva al listado de hermandades cuando la localidad lo tiene', () => {
  assert.equal(brotherhoodLocalityDirectoryHref({ localidad: 'Sevilla' }, directory), '/hermandades/localidad/sevilla-capital')
})

test('sin listado propio (menos de tres fichas) no inventa la URL', () => {
  assert.equal(brotherhoodLocalityDirectoryHref({ localidad: 'Marchena' }, directory), '')
  assert.equal(brotherhoodLocalityDirectoryHref({ localidad: '' }, directory), '')
  assert.equal(brotherhoodLocalityDirectoryHref({ localidad: 'Sevilla' }, []), '')
})

test('la ficha usa el listado en la miga visible y en el JSON-LD, con respaldo a la guía', () => {
  const page = readFileSync(new URL('../app/hermandades/[slug]/page.js', import.meta.url), 'utf8')
  assert.match(page, /brotherhoodLocalityDirectoryHref\(h, indexableBrotherhoods\) \|\| municipalityHubHref/)
  assert.match(page, /href: localityBreadcrumbHref \|\| undefined/)
  assert.match(page, /path: localityBreadcrumbHref/)
  // La localidad de la cabecera sigue llevando a la guía cofrade.
  assert.match(page, /localityHref=\{municipalityHubHref\}/)
})
