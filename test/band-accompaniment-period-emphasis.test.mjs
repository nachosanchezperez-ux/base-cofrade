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

test('la localidad no repite Localidad, Sevilla y Sevilla capital', () => {
  const css = read('app/bandas/[slug]/band-period-emphasis.module.css')

  assert.match(css, /div:nth-child\(2\) > span,[\s\S]*div:nth-child\(2\) > small[\s\S]*display: none;/)
  assert.match(css, /div:nth-child\(2\) > strong[\s\S]*font-size: 13px;/)
})

test('el tipo de paso se convierte en una clave visual dentro de la tarjeta', () => {
  const css = read('app/bandas/[slug]/band-period-emphasis.module.css')

  assert.match(css, /div:nth-child\(4\) > span[\s\S]*background: color-mix/)
  assert.match(css, /div:nth-child\(4\) > span[\s\S]*font-weight: 800;/)
  assert.match(css, /div:nth-child\(4\) > span[\s\S]*text-transform: none;/)
})

test('los estados no accionables no consumen un pie completo de tarjeta', () => {
  const css = read('app/bandas/[slug]/band-period-emphasis.module.css')

  assert.match(css, /div:last-child:has\(> span\)[\s\S]*display: none;/)
})
