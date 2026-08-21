import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')

const rootLayout = read('app/layout.js')
const panelLayout = read('app/panel/layout.js')
const typography = read('app/typography.css')

test('HC-009 carga una sola familia y solo los pesos aprobados', () => {
  const openSansWeights = [...rootLayout.matchAll(/@fontsource\/open-sans\/(\d+)\.css/g)]
    .map((match) => match[1])
    .sort()

  assert.deepEqual(openSansWeights, ['400', '600', '700', '800'])
  assert.equal(/@fontsource\/(?!open-sans\/)/.test(rootLayout), false)
  assert.match(rootLayout, /import '\.\/typography\.css'/)
  assert.match(rootLayout, /id="hc-app"/)
})

test('HC-009 define la escala canónica y evita pesos sintéticos', () => {
  const requiredTokens = [
    '--font-size-display',
    '--font-size-heading',
    '--font-size-card',
    '--font-size-body',
    '--font-size-reading',
    '--font-size-eyebrow',
    '--font-size-panel-display',
    '--font-size-panel-body',
  ]

  for (const token of requiredTokens) {
    assert.equal(typography.includes(token), true, `Falta el token ${token}`)
  }

  assert.match(typography, /--font-weight-regular:\s*400/)
  assert.match(typography, /--font-weight-semibold:\s*600/)
  assert.match(typography, /--font-weight-bold:\s*700/)
  assert.match(typography, /--font-weight-extrabold:\s*800/)
  assert.equal(typography.includes('--font-weight-black'), false)
  assert.match(typography, /font-synthesis:\s*none/)
  assert.equal(/Georgia|Times New Roman|serif/i.test(typography), false)
})

test('HC-009 separa la escala pública y la escala funcional del Panel', () => {
  assert.match(panelLayout, /id="hc-panel"/)
  assert.match(typography, /#hc-panel\s*\{/)
  assert.match(typography, /#hc-app\s*>\s*main\s*>\s*:not\(#hc-panel\)\s+h1/)
  assert.match(typography, /#hc-app\s+#entity-hero-title/)
  assert.match(typography, /#hc-panel\s+h1/)
  assert.match(typography, /#hc-panel\s+button/)
})

test('HC-009 mantiene Open Sans como familia heredada de toda la interfaz', () => {
  assert.match(typography, /--font-sans:\s*'Open Sans'/)
  assert.match(typography, /#hc-app\s+\*:not\(code\):not\(pre\):not\(kbd\):not\(samp\)/)
  assert.match(typography, /font-family:\s*inherit/)
})
