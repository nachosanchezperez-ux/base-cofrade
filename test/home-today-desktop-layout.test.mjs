import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const [component, css, mobileContract] = await Promise.all([
  readFile(new URL('../components/HomeTodayV2.js', import.meta.url), 'utf8'),
  readFile(new URL('../components/HomeTodayV2.module.css', import.meta.url), 'utf8'),
  readFile(new URL('../app/home-mobile-contract.css', import.meta.url), 'utf8'),
])

test('Hoy identifica una pieza principal, secundarias y Marcha del día', () => {
  assert.ok(component.includes("data-home-today-role={index === 0 ? 'lead' : 'secondary'}"))
  assert.ok(component.includes('data-home-today-role="music"'))
  assert.ok(component.includes('data-home-today-card'))
})

test('la versión de escritorio usa jerarquía editorial 7/5 aproximada', () => {
  assert.ok(css.includes('@media (min-width: 1040px)'))
  assert.ok(css.includes('grid-template-columns: minmax(0, 1.3fr) minmax(390px, .7fr);'))
  assert.ok(css.includes('[data-home-today-role="lead"]'))
  assert.ok(css.includes('min-height: 344px;'))
})

test('las piezas secundarias no fuerzan la misma altura que la principal', () => {
  assert.ok(css.includes('[data-home-today-role="secondary"]'))
  assert.ok(css.includes('min-height: 0;'))
  assert.ok(css.includes('-webkit-line-clamp: 2;'))
})

test('Marcha del día se integra como tarjeta compacta del carril derecho', () => {
  assert.ok(css.includes('[data-home-today-role="music"]'))
  assert.ok(css.includes('grid-template-columns: minmax(0, 1fr) minmax(190px, 225px);'))
  assert.ok(css.includes('.musicAccent {\n    display: none;'))
})

test('el contrato móvil sigue aislando solo las tarjetas editoriales', () => {
  assert.ok(mobileContract.includes('#hc-app #hoy [data-home-today-card]'))
  assert.ok(mobileContract.includes('[data-home-visual-kind="photo"]'))
})
