import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las fichas de Banda destacan visualmente desde cuándo existe cada acompañamiento', () => {
  const layout = read('app/bandas/[slug]/layout.js')
  const css = read('app/bandas/[slug]/band-period-emphasis.module.css')

  assert.match(layout, /band-period-emphasis\.module\.css/)
  assert.match(layout, /periodStyles\.periodScope/)
  assert.match(css, /:global\(#acompanamientos\)/)
  assert.match(css, /:global\(#proximos-acompanamientos\)/)
  assert.match(css, /:global\(#glorias\)/)
  assert.match(css, /font-size: 15px;/)
  assert.match(css, /font-weight: 800;/)
  assert.match(css, /background: #fff;/)
  assert.match(css, /font-variant-numeric: tabular-nums;/)
})

test('día de salida y antigüedad comparten una cabecera equilibrada', () => {
  const css = read('app/bandas/[slug]/band-period-emphasis.module.css')

  assert.match(css, /div:first-child > span[\s\S]*min-height: 36px;/)
  assert.match(css, /div:first-child > span[\s\S]*border-radius: 999px;/)
  assert.match(css, /div:first-child > strong[\s\S]*min-height: 36px;/)
})

test('las tarjetas delegan la localidad en una única regla de presentación', () => {
  const page = read('app/bandas/[slug]/page.js')
  const card = page.slice(page.indexOf('function AccompanimentCard'), page.indexOf('function HistoricalIcon'))

  assert.match(card, /presentAccompanimentLocation\(item\)/)
  assert.doesNotMatch(card, /Sevilla capital/)
  assert.doesNotMatch(card, /<span>Localidad<\/span>/)
})

test('el tipo de paso es una categoría tipográfica sin píldora', () => {
  const page = read('app/bandas/[slug]/page.js')
  const baseCss = read('app/bandas/bandas.module.css')
  const periodCss = read('app/bandas/[slug]/band-period-emphasis.module.css')
  const typeRule = baseCss.match(/\.relationshipStep \.relationshipStepType \{([^}]+)\}/)?.[1] || ''

  assert.match(page, /className=\{styles\.relationshipStepType\}/)
  assert.match(typeRule, /color: var\(--band-primary\)/)
  assert.match(typeRule, /font-weight: 800/)
  assert.match(typeRule, /background: none/)
  assert.match(typeRule, /border: 0/)
  assert.match(typeRule, /border-radius: 0/)
  assert.doesNotMatch(periodCss, /div:nth-child\(4\) > span/)
  assert.doesNotMatch(page, />Tras el paso/)
})

test('móvil mantiene el protagonismo de Desde y el nombre del paso sin encoger tipografía', () => {
  const periodCss = read('app/bandas/[slug]/band-period-emphasis.module.css')
  const baseCss = read('app/bandas/bandas.module.css')
  const mobile = periodCss.slice(periodCss.indexOf('@media (max-width: 680px)'))
  const typeRule = baseCss.match(/\.relationshipStep \.relationshipStepType \{([^}]+)\}/)?.[1] || ''

  assert.match(mobile, /div:first-child > strong[\s\S]*font-size: 15\.5px;/)
  assert.match(mobile, /div:nth-child\(4\) > strong[\s\S]*font-size: 15px;/)
  assert.match(typeRule, /font-size: 13px/)
})

test('Semana Santa, próximos acompañamientos y Glorias reutilizan la misma tarjeta', () => {
  const page = read('app/bandas/[slug]/page.js')

  assert.match(page, /id="acompanamientos"[\s\S]*orderedAccompaniments\.map[\s\S]*<AccompanimentCard/)
  assert.match(page, /id="proximos-acompanamientos"[\s\S]*upcomingAccompaniments\.map[\s\S]*<AccompanimentCard/)
  assert.match(page, /id="glorias"[\s\S]*group\.items\.map[\s\S]*<AccompanimentCard/)
})

test('los estados no accionables no consumen un pie completo de tarjeta', () => {
  const css = read('app/bandas/[slug]/band-period-emphasis.module.css')

  assert.match(css, /div:last-child:has\(> span\)[\s\S]*display: none;/)
})
