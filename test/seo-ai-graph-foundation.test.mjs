import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const robots = read('app/robots.js')
const layout = read('app/layout.js')
const brotherhood = read('app/hermandades/[slug]/page.js')
const band = read('app/bandas/[slug]/page.js')
const image = read('app/imagenes/[slug]/page.js')
const step = read('app/pasos/[slug]/page.js')
const march = read('app/marchas/[slug]/page.js')

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
