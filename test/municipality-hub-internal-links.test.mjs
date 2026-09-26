import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las fichas de Hermandad enlazan su guía cofrade municipal desde la portada', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const hero = read('components/BrotherhoodProgramHero.js')

  assert.match(page, /agendaMunicipalityHref\(h\.localidad\)/)
  assert.match(page, /localityHref=\{municipalityHubHref\}/)
  assert.match(hero, /localityHref = ''/)
  assert.match(hero, /<Link href=\{localityHref\}>\{locality\}<\/Link>/)
})

test('las fichas de Bandas sevillanas enlazan directorio y guía municipal', () => {
  const page = read('app/bandas/[slug]/page.js')

  assert.match(page, /band\.province === 'Sevilla'/)
  assert.match(page, /agendaMunicipalityHref\(band\.municipality\)/)
  assert.match(page, /href: municipalityHubHref \|\| undefined/)
  assert.match(page, /Guía cofrade de \{band\.municipality\}/)
})

test('Imágenes y Pasos conectan el patrimonio con la guía territorial', () => {
  const image = read('app/imagenes/[slug]/page.js')
  const step = read('app/pasos/[slug]/page.js')

  for (const source of [image, step]) {
    assert.match(source, /agendaMunicipalityHref\(hermandad\.localidad\)/)
    assert.match(source, /municipalityHubHref/)
    assert.match(source, /Guía cofrade de \{hermandad\.localidad\}/)
  }
})

test('el enlazado territorial reutiliza la ruta canónica del hub de Agenda', () => {
  const relation = read('lib/agenda-relations.js')

  assert.match(relation, /agendaMunicipalityRouteSlug/)
  assert.match(relation, /\/agenda-cofrade\/localidad\/\$\{slug\}/)
})
