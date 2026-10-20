// Portada en PC (≥1024 px): Agenda e «Hoy en Hilo Cofrade» en dos columnas y
// cabecera más compacta. El móvil no cambia: todo va dentro de media queries.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const desktopBlocks = (css) => css.split('@media (min-width: 1024px)').slice(1).join('\n')

test('agenda: periodo e igualás en columnas solo cuando hay igualás', () => {
  const agenda = read('components/HomeAgendaNow.js')
  assert.match(agenda, /<div className=\{styles\.columns\} data-aside=\{children \? 'true' : undefined\}>/)
  assert.match(agenda, /\{children \? <div className=\{styles\.aside\}>\{children\}<\/div> : null\}/)
  const desktop = desktopBlocks(read('components/HomeAgendaNow.module.css'))
  assert.match(desktop, /\.columns\[data-aside\] \{\s*display: grid;/)
  assert.match(read('components/HomeAgendaNow.module.css'), /\.columns,\s*\.period,\s*\.aside \{\s*min-width: 0;\s*\}/)
})

test('hoy en Hilo Cofrade: ficha y marcha lado a lado; si falta una, la otra ocupa todo', () => {
  const desktop = desktopBlocks(read('components/HomeTodayV2.module.css'))
  assert.match(desktop, /\.embedded > div \{\s*display: grid;\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/)
  assert.match(desktop, /\.embedded > div > \* \{\s*grid-column: 1 \/ -1;/)
  assert.match(desktop, /\.embedded > div:has\(> \.musicCard\) > \.editorialGrid,\s*\.embedded > div:has\(> \.editorialGrid\) > \.musicCard \{\s*grid-column: auto;/)
})

test('cabecera: más compacta en PC, sin tocar el móvil', () => {
  const css = read('components/HomeHero.module.css')
  assert.match(desktopBlocks(css), /\.hero \{\s*padding: 24px 0 26px;/)
  assert.match(css, /\.hero \{\s*position: relative;[\s\S]*?padding: 18px 0 20px;/)
})
