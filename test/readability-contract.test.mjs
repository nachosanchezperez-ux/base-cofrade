import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la red de legibilidad se importa después de todas las hojas globales', () => {
  const layout = source('app/layout.js')
  const cssImports = [...layout.matchAll(/import ['"]\.\/(.+\.css)['"];?/g)].map((match) => match[1])

  assert.ok(cssImports.length > 0)
  assert.equal(cssImports.at(-1), 'readability.css')
  assert.equal(cssImports.filter((name) => name === 'readability.css').length, 1)
})

test('la escala canónica no baja de los suelos de lectura acordados', () => {
  const typography = source('app/typography.css')

  assert.match(typography, /--font-size-body:\s*16px/)
  assert.match(typography, /--font-size-meta:\s*13px/)
  assert.match(typography, /--font-size-eyebrow:\s*12px/)
  assert.match(typography, /--font-size-button:\s*14px/)
  assert.match(typography, /--font-size-panel-body:\s*14px/)
  assert.match(typography, /--font-size-panel-meta:\s*12px/)
  assert.match(typography, /--font-size-panel-control:\s*14px/)
})

test('navegación, auxiliares y formularios tienen una barrera transversal de legibilidad', () => {
  const readability = source('app/readability.css')

  assert.match(readability, /--readability-caption:\s*12px/)
  assert.match(readability, /--readability-meta:\s*13px/)
  assert.match(readability, /--readability-interactive:\s*14px/)
  assert.match(readability, /--readability-form:\s*16px/)
  assert.match(readability, /:is\(nav, \[role='navigation'\]\) :is\(a, button, \[role='button'\]\)/)
  assert.match(readability, /#hc-app :is\(small, figcaption, dt\)/)
  assert.match(readability, /#hc-app :is\(input, select, textarea\)/)
  assert.match(readability, /#hc-app table :is\(th, td\)/)
  assert.match(readability, /\[class\*='eyebrow'\]/)
  assert.match(readability, /\[class\*='meta'\]/)
})

test('la segunda barrera cubre etiquetas estructurales de tarjetas y agendas', () => {
  const readability = source('app/readability.css')

  assert.match(readability, /article > span:first-child:not\(\[class\]\)/)
  assert.match(readability, /\[class\*='Facts'\]/)
  assert.match(readability, /\[class\*='Essentials'\]/)
  assert.match(readability, /\[class\*='cardMain'\]/)
  assert.match(readability, /\[class\*='cardMusic'\]/)
  assert.match(readability, /\[class\*='featuredMusic'\]/)
  assert.match(readability, /\[class\*='signals'\]/)
  assert.match(readability, /\[class\*='label'\]/)
  assert.match(readability, /\[class\*='routeFacts'\]/)
  assert.match(readability, /\[class\*='timelineCopy'\]/)
})

test('el Panel conserva densidad sin sacrificar lectura ni provocar zoom móvil', () => {
  const readability = source('app/readability.css')

  assert.match(readability, /#hc-panel :is\(input, select, textarea\)[\s\S]*var\(--font-size-panel-control, 14px\)/)
  assert.match(readability, /@media \(max-width: 760px\)[\s\S]*#hc-panel :is\(input, select, textarea\)[\s\S]*var\(--readability-form\)/)
})
