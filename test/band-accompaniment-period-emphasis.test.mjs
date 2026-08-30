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
  assert.match(css, /font-size: 16px;/)
  assert.match(css, /font-weight: 800;/)
  assert.match(css, /font-variant-numeric: tabular-nums;/)
})

test('día de salida y antigüedad comparten una cabecera tipográfica sin pastillas', () => {
  const css = read('app/bandas/[slug]/band-period-emphasis.module.css')
  const dayRule = css.match(/div:first-child > span \{([^}]+)\}/)?.[1] || ''
  const periodRule = css.match(/div:first-child > strong \{([^}]+)\}/)?.[1] || ''

  assert.match(dayRule, /border: 0;/)
  assert.match(dayRule, /border-radius: 0;/)
  assert.match(dayRule, /background: none;/)
  assert.match(dayRule, /white-space: normal;/)
  assert.match(dayRule, /overflow-wrap: anywhere;/)
  assert.match(periodRule, /border: 0;/)
  assert.match(periodRule, /border-radius: 0;/)
  assert.match(periodRule, /background: none;/)
  assert.match(periodRule, /box-shadow: none;/)
  assert.match(periodRule, /white-space: nowrap;/)
})

test('el día de salida puede respirar o partir sin desbordar en móvil', () => {
  const css = read('app/bandas/[slug]/band-period-emphasis.module.css')
  const mobile = css.slice(css.indexOf('@media (max-width: 680px)'))

  assert.match(mobile, /div:first-child > span[\s\S]*padding: 0;/)
  assert.match(mobile, /div:first-child > span[\s\S]*font-size: 13px;/)
  assert.match(mobile, /div:first-child > strong[\s\S]*font-size: 15\.5px;/)
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
