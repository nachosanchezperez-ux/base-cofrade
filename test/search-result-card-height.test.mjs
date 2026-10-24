import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

// En móvil la lista de resultados tiene altura máxima y desplazamiento. Sin
// `grid-auto-rows:max-content`, cuando hay más resultados de los que caben las
// filas se encogen hasta el `min-height` de la tarjeta (68px) y la línea gris de
// subtítulo queda fuera de la tarjeta, cortada.
test('las filas de resultados miden lo que su contenido, no el min-height', () => {
  const css = readFileSync(new URL('../components/HiloSearch.module.css', import.meta.url), 'utf8')
  const rule = css.match(/\.resultsList\{([^}]*)\}/)?.[1] || ''
  assert.match(rule, /display:grid/)
  assert.match(rule, /grid-auto-rows:max-content/)
  assert.match(rule, /max-height:/)
})
