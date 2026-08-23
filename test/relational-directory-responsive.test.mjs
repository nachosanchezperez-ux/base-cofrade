import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const css = await readFile(new URL('../components/RelationalEntityDirectoryEnhancements.module.css', import.meta.url), 'utf8')

test('reserva una columna visual real para Imágenes y Pasos', () => {
  assert.ok(css.includes('.card:not(.bandCard) {'))
  assert.ok(css.includes('grid-template-columns: 76px minmax(0, 1fr) 24px;'))
})

test('reduce miniatura y columna al mismo ancho en móvil', () => {
  assert.ok(css.includes('grid-template-columns: 58px minmax(0, 1fr) 18px;'))
  assert.ok(css.includes('width: 58px;\n    height: 72px;'))
})

test('protege títulos largos frente al solapamiento', () => {
  assert.ok(css.includes('overflow-wrap: anywhere;'))
})
