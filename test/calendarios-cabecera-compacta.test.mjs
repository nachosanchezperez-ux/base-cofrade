import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Revisión de calidad en móvil (25/10/2026): la primera cita de los calendarios
// quedaba fuera de la primera pantalla.
const read = (path) => readFileSync(path, 'utf8')

test('los tres calendarios usan la cabecera compacta', () => {
  for (const page of ['app/igualas-y-ensayos/page.js', 'app/procesiones-de-gloria/page.js', 'app/extraordinarias/page.js']) {
    const source = read(page)
    assert.match(source, /introStyles\.compactPage/, page)
    assert.match(source, /introStyles\.compactIntro/, page)
  }
})

test('los recuentos van en una línea de la cabecera, sin recuadro aparte', () => {
  for (const page of ['app/igualas-y-ensayos/page.js', 'app/procesiones-de-gloria/page.js']) {
    const source = read(page)
    assert.match(source, /introStyles\.introStats/, page)
    assert.doesNotMatch(source, /styles\.summary/, page)
  }
  assert.doesNotMatch(read('components/ExtraordinaryDirectory.js'), /Elige el ámbito que quieras consultar/)
})

test('en móvil la cabecera reduce el aire superior', () => {
  const css = read('components/CalendarIntro.module.css')
  const mobile = css.slice(css.indexOf('@media (max-width: 720px)'))
  assert.match(mobile, /:global\(\.page-top\)\.compactPage \{\s*padding-top: 22px;/)
})

test('extraordinarias: meses en una fila y filtros más bajos en móvil', () => {
  const css = read('components/ExtraordinaryDirectory.module.css')
  const block = css.slice(css.lastIndexOf('/* Cabecera compacta'))
  assert.match(block, /\.monthNav\{display:flex;overflow-x:auto/)
  assert.match(block, /\.segmented button\{min-height:40px/)
})
