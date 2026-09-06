import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../components/RelationalEntityHeroBand.module.css', import.meta.url), 'utf8')

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] || ''
}

test('el hero de Bandas trata el escudo como pieza institucional protagonista', () => {
  assert.match(css, /grid-template-columns:\s*clamp\(236px,\s*19vw,\s*284px\)/)
  assert.match(css, /\.logoStage\s*\{[\s\S]*width:\s*min\(100%,\s*278px\);[\s\S]*height:\s*286px;/)
  assert.match(rule('.logoStage'), /overflow:\s*visible/)
  assert.doesNotMatch(rule('.logoStage'), /padding:|border:|border-radius:|background:|box-shadow:/)
  assert.doesNotMatch(css, /\.logoStage::before/)
  assert.doesNotMatch(css, /\.logoStage\[data-(?:custom|light)-background/)
  assert.match(css, /\.identityAura\s*\{[\s\S]*opacity:\s*\.32;/)
})

test('el protagonismo del escudo se adapta a tablet y móvil sin romper la cabecera', () => {
  assert.match(css, /@media \(max-width:\s*1120px\)[\s\S]*\.logoStage\s*\{[\s\S]*width:\s*min\(100%,\s*244px\);/)
  assert.match(css, /@media \(max-width:\s*620px\)[\s\S]*\.logoStage\s*\{[\s\S]*width:\s*min\(100%,\s*204px\);[\s\S]*height:\s*184px;/)
})
