import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const [layout, css, today, hero] = await Promise.all([
  readFile(new URL('../app/layout.js', import.meta.url), 'utf8'),
  readFile(new URL('../app/home-mobile-contract.css', import.meta.url), 'utf8'),
  readFile(new URL('../components/HomeTodayV2.js', import.meta.url), 'utf8'),
  readFile(new URL('../components/HomeHero.module.css', import.meta.url), 'utf8'),
])

test('carga el contrato móvil de Home desde el layout raíz', () => {
  assert.ok(layout.includes("import './home-mobile-contract.css';"))
})

test('las preguntas sugeridas se ajustan en líneas, sin carrusel horizontal', () => {
  assert.ok(!css.includes('[aria-label="Preguntas sugeridas"]'))
  assert.ok(hero.includes('[aria-label="Preguntas sugeridas"]'))
  assert.ok(hero.includes('flex-wrap: wrap;'))
  assert.ok(!hero.includes('overflow-x'))
  assert.ok(hero.includes('min-height: 44px;'))
})

test('integra la identidad visual de los hilos sin iniciales ornamentales', () => {
  assert.ok(today.includes("data-home-card-kind={card.kind || 'card'}"))
  assert.ok(today.includes("card.kind !== 'discovery'"))
  assert.ok(css.includes('#hc-app #descubre-hoy article[data-home-card-kind="discovery"]'))
  assert.ok(css.includes('padding-right: 68px;'))
  assert.ok(css.includes('width: 56px;'))
  assert.ok(css.includes('top: 16px;'))
})
