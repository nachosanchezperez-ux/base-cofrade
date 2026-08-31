import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('Tres Caídas elimina visualmente el fondo claro sin afectar a otras bandas', () => {
  const component = read('components/RelationalEntityHero.js')
  const css = read('components/RelationalEntityHeroBand.module.css')

  assert.match(component, /tres\\s\+ca\[íi\]das\\s\+de\\s\+triana/)
  assert.match(component, /band-logo-remove-light-background/)
  assert.match(component, /bandStyles\.logoCleanLight/)
  assert.match(css, /\.logoCleanLight/)
  assert.match(css, /url\("#band-logo-remove-light-background"\)/)
})

test('el logo limpio gana presencia óptica y se adapta en móvil', () => {
  const css = read('components/RelationalEntityHeroBand.module.css')

  assert.match(css, /\.logoCleanLight[\s\S]*scale\(1\.34\)/)
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*\.logoCleanLight[\s\S]*scale\(1\.27\)/)
  assert.match(css, /@media \(max-width: 390px\)[\s\S]*\.logoCleanLight[\s\S]*scale\(1\.23\)/)
})
