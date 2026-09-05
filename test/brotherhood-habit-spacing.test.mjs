import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../app/habit-spacing.css', import.meta.url), 'utf8')
const layout = readFileSync(new URL('../app/layout.js', import.meta.url), 'utf8')

test('la Túnica carga una capa de respiración después de su identidad cromática', () => {
  assert.match(layout, /habit-layout\.css[\s\S]*habit-identity\.css[\s\S]*habit-spacing\.css/)
})

test('una sola túnica gana aire vertical y lateral en escritorio', () => {
  assert.match(css, /grid-template-columns: minmax\(340px, \.88fr\) minmax\(0, 1\.12fr\);/)
  assert.match(css, /min-height: 590px;/)
  assert.match(css, /padding: 28px 34px 18px;/)
  assert.match(css, /height: min\(550px, 46vw\);/)
  assert.match(css, /max-height: 550px;/)
})

test('tablet y móvil mantienen margen alrededor de la ilustración', () => {
  assert.match(css, /@media \(min-width: 621px\) and \(max-width: 900px\)[\s\S]*min-height: 450px;[\s\S]*padding: 20px 22px 12px;/)
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*min-height: 400px;[\s\S]*padding: 16px 16px 8px;/)
})
