import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la ficha de Banda carga una capa visual específica para Glorias y cultos externos', () => {
  const layout = read('app/bandas/[slug]/layout.js')
  const css = read('app/bandas/[slug]/band-detail-polish.module.css')

  assert.match(layout, /band-detail-polish\.module\.css/)
  assert.match(layout, /detailStyles\.detailScope/)
  assert.match(css, /:global\(#glorias\)/)
})

test('el módulo de Glorias evita repetir localidad y ámbito como encabezados completos', () => {
  const css = read('app/bandas/[slug]/band-detail-polish.module.css')

  assert.match(css, /div:nth-child\(2\) > span,[\s\S]*div:nth-child\(2\) > small \{[\s\S]*display: none;/)
  assert.match(css, /section > header > div > span \{[\s\S]*display: none;/)
  assert.match(css, /div:last-child > span \{[\s\S]*text-transform: none;/)
})

test('la vista móvil mantiene tarjetas compactas y el resumen como carrusel horizontal', () => {
  const css = read('app/bandas/[slug]/band-detail-polish.module.css')

  assert.match(css, /@media \(max-width: 680px\)/)
  assert.match(css, /flex-wrap: nowrap;/)
  assert.match(css, /overflow-x: auto;/)
  assert.match(css, /article > div:first-child \{[\s\S]*min-height: 48px;/)
})
