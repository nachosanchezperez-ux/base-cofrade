import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const css = await readFile(new URL('../components/HomeTodayV2.module.css', import.meta.url), 'utf8')

test('Hoy mantiene tarjetas equilibradas y adaptativas en escritorio', () => {
  assert.ok(css.includes('grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));'))
  assert.ok(css.includes('min-height: 0;'))
  assert.ok(css.includes('padding: 22px 24px;'))
})

test('elimina del escritorio elementos que no aportan información', () => {
  assert.ok(css.includes('.icon {\n    display: none;'))
  assert.ok(css.includes('.visualIdentity {\n    display: none;'))
})

test('conserva fotografías reales como contexto útil', () => {
  assert.ok(css.includes('grid-template-columns: minmax(0, 1fr) 126px;'))
  assert.ok(css.includes('width: 126px;'))
  assert.ok(css.includes('height: 146px;'))
})

test('Marcha del día sigue a ancho completo y reserva un espacio real para su portada', () => {
  assert.ok(css.includes('grid-template-columns: 116px minmax(0, 1fr) minmax(250px, .38fr);'))
  assert.ok(css.includes('.musicVisual {'))
  assert.ok(css.includes('width: 92px;'))
  assert.ok(css.includes('margin-top: 14px;'))
  assert.ok(!css.includes('grid-template-columns: 84px minmax(0, 1.35fr) minmax(280px, .65fr);'))
})
