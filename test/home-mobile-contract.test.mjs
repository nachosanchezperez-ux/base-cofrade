import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const [layout, css] = await Promise.all([
  readFile(new URL('../app/layout.js', import.meta.url), 'utf8'),
  readFile(new URL('../app/home-mobile-contract.css', import.meta.url), 'utf8'),
])

test('carga el contrato móvil de Home desde el layout raíz', () => {
  assert.ok(layout.includes("import './home-mobile-contract.css';"))
})

test('mantiene las preguntas sugeridas en un carrusel horizontal legible', () => {
  assert.ok(css.includes('#hc-app #tiradelhilo [aria-label="Preguntas sugeridas"]'))
  assert.ok(css.includes('grid-auto-flow: column;'))
  assert.ok(css.includes('scroll-snap-type: x mandatory;'))
  assert.ok(css.includes('border-radius: 16px;'))
})

test('fija el visual de las tarjetas de Hoy en su tercera columna', () => {
  assert.ok(css.includes('#hc-app #hoy > .shell > div > article:has(> div:nth-of-type(2))'))
  assert.ok(css.includes('grid-template-columns: 34px minmax(0, 1fr) 58px;'))
  assert.ok(css.includes('grid-column: 3;'))
  assert.ok(css.includes('-webkit-line-clamp: 2;'))
})

test('convierte las extraordinarias lejanas en un avance compacto', () => {
  assert.ok(css.includes('#hc-app #extraordinarias[data-home-urgency="later"]'))
  assert.ok(css.includes('[aria-labelledby="briefing-bandas"]'))
  assert.ok(css.includes('[aria-labelledby="briefing-lugares"]'))
  assert.ok(css.includes('div:nth-child(n + 3)'))
})
