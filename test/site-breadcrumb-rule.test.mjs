import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la web dispone de una miga de pan canónica con sección actual destacada', () => {
  const component = read('components/SiteBreadcrumb.js')
  const css = read('components/SiteBreadcrumb.module.css')

  assert.match(component, /data-site-breadcrumb="true"/)
  assert.match(component, /aria-current=\{isCurrent \? 'page'/)
  assert.match(component, /!isCurrent \? <i aria-hidden="true">→<\/i>/)
  assert.match(css, /--breadcrumb-current-bg: #123a67/)
  assert.match(css, /span\[aria-current="page"\]/)
  assert.match(css, /background: var\(--breadcrumb-current-bg\)/)
  assert.match(css, /font-weight: 850/)
})

test('en móvil conserva visible la jerarquía útil y prioriza los tres últimos niveles', () => {
  const css = read('components/SiteBreadcrumb.module.css')

  assert.match(css, /@media \(max-width: 620px\)/)
  assert.match(css, /flex-wrap: nowrap/)
  assert.match(css, /overflow-x: auto/)
  assert.match(css, /li:not\(:nth-last-child\(-n\+3\)\)/)
  assert.match(css, /ol:has\(li:nth-child\(4\)\)::before/)
  assert.match(css, /scrollbar-width: none/)
})

test('las migas heredadas reciben la misma regla visual hasta su migración', () => {
  const globals = read('app/globals.css')

  assert.match(globals, /Migas de pan/)
  assert.match(globals, /Ruta de navegación/)
  assert.match(globals, /:not\(\[data-site-breadcrumb="true"\]\)/)
  assert.match(globals, /strong:last-child/)
  assert.match(globals, /\[aria-current="page"\]/)
})

test('los heroes relacionales comparten la miga canónica', () => {
  for (const path of [
    'components/BrotherhoodProgramHero.js',
    'components/RelationalEntityHero.js',
    'components/ImageHeroV2.js',
  ]) {
    const source = read(path)
    assert.match(source, /SiteBreadcrumb/)
    assert.match(source, /tone="dark"/)
  }
})

test('las fichas principales usan su nombre real como sección actual', () => {
  const brotherhood = read('app/hermandades/[slug]/page.js')
  const image = read('app/imagenes/[slug]/page.js')
  const step = read('app/pasos/[slug]/page.js')

  assert.match(brotherhood, /\{ label: h\.nombrePopular \}/)
  assert.match(image, /\{ label: imagen\.nombre \}/)
  assert.match(step, /\{ label: paso\.nombre \}/)
  assert.doesNotMatch(image, /\{ label: 'Ficha' \}/)
  assert.doesNotMatch(step, /\{ label: 'Ficha' \}/)
})
