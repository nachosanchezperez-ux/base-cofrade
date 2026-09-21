import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const seo = read('lib/seo.js')
const robots = read('app/robots.js')
const layout = read('app/layout.js')
const brotherhood = read('app/hermandades/[slug]/page.js')
const band = read('app/bandas/[slug]/page.js')
const image = read('app/imagenes/[slug]/page.js')
const step = read('app/pasos/[slug]/page.js')
const march = read('app/marchas/[slug]/page.js')
const extraordinary = read('app/extraordinarias/[slug]/page.js')
const glory = read('app/procesiones-de-gloria/[slug]/page.js')
const crewEvent = read('app/igualas-y-ensayos/[slug]/page.js')

test('OAI-SearchBot puede descubrir la web pública sin acceder a superficies privadas', () => {
  assert.match(robots, /userAgent:\s*'OAI-SearchBot'/)
  assert.match(robots, /allow:\s*'\/'/)
  assert.match(robots, /disallow:\s*\['\/api\/', '\/panel\/'\]/)
})

test('Hilo Cofrade declara una Organization editora estable y el WebSite la referencia', () => {
  assert.match(layout, /const publisherJsonLd =/)
  assert.match(layout, /'@type': 'Organization'/)
  assert.match(layout, /'@id': `\$\{SITE_URL\}\/\#organization`/)
  assert.match(layout, /publisher:\s*\{[\s\S]*?'@id': `\$\{SITE_URL\}\/\#organization`/)
  assert.match(layout, /<JsonLd data=\{publisherJsonLd\}/)
})

test('la ficha de hermandad separa WebPage y Organization con un @id canónico compartido', () => {
  assert.match(brotherhood, /organizationJsonLdId = `\$\{absoluteUrl\(canonicalPath\)\}#organization`/)
  assert.match(brotherhood, /const organizationJsonLd =/)
  assert.match(brotherhood, /about:\s*\{\s*'@id': organizationJsonLdId/)
  assert.match(brotherhood, /mainEntity:\s*\{\s*'@id': organizationJsonLdId/)
})

test('pasos e imágenes apuntan a la misma Organization canónica de su hermandad', () => {
  for (const source of [step, image]) {
    assert.match(source, /#organization/)
    assert.match(source, /absoluteUrl\(`\/hermandades\/\$\{hermandad\.slug\}`\)/)
  }
})

test('bandas y marchas declaran entidad principal canónica', () => {
  assert.match(band, /mainEntityOfPage: absoluteUrl\(`\/bandas\/\$\{band\.slug\}`\)/)
  assert.match(march, /'@id': `\$\{absoluteUrl\(march\.href\)\}#composition`/)
  assert.match(march, /mainEntityOfPage: absoluteUrl\(march\.href\)/)
})


test('las referencias Organization internas reutilizan el @id canónico', () => {
  assert.match(seo, /export function organizationJsonLdRef/)
  assert.match(seo, /'@id': `\$\{absoluteUrl\(internalPath\)\}#organization`/)

  for (const source of [extraordinary, glory, crewEvent]) {
    assert.match(source, /organizationJsonLdRef/)
    assert.match(source, /brotherhoodHref/)
  }
})

test('ningún objeto físico usa Organization como valor de isPartOf', () => {
  for (const source of [step, image]) {
    assert.doesNotMatch(source, /isPartOf:\s*\{[\s\S]{0,120}'@type': 'Organization'/)
    assert.match(source, /'@type': 'WebPage'/)
    assert.match(source, /about:\s*\[/)
  }
})
