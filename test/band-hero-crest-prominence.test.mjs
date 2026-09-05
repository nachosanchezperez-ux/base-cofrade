import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../components/RelationalEntityHeroBand.module.css', import.meta.url), 'utf8')

test('el hero de Bandas trata el escudo como pieza institucional protagonista', () => {
  assert.match(css, /grid-template-columns:\s*clamp\(236px,\s*19vw,\s*284px\)/)
  assert.match(css, /\.logoStage\s*\{[\s\S]*width:\s*min\(100%,\s*278px\);[\s\S]*height:\s*286px;/)
  assert.match(css, /\.logoStage\s*\{[\s\S]*border-radius:\s*34px;[\s\S]*box-shadow:/)
  assert.match(css, /\.logoStage::before\s*\{[\s\S]*inset:\s*8px;/)
  assert.match(css, /\.identityAura\s*\{[\s\S]*width:\s*min\(102%,\s*356px\);/)
})

test('el protagonismo del escudo se adapta a tablet y móvil sin romper la cabecera', () => {
  assert.match(css, /@media \(max-width:\s*1120px\)[\s\S]*\.logoStage\s*\{[\s\S]*width:\s*min\(100%,\s*244px\);/)
  assert.match(css, /@media \(max-width:\s*620px\)[\s\S]*\.logoStage\s*\{[\s\S]*width:\s*min\(100%,\s*204px\);[\s\S]*height:\s*184px;/)
})
