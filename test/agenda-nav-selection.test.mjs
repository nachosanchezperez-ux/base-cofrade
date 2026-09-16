import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la navegación de Agenda marca de forma natural la sección filtrada', () => {
  const page = read('app/agenda-cofrade/page.js')
  const css = read('app/agenda-cofrade/agenda-cofrade-v4.module.css')

  assert.match(page, /const agendaNavSection = \['rosaries', 'devotions', 'concerts'\]\.includes\(initialCategory\)/)
  assert.match(page, /navClass\('agenda'\)/)
  assert.match(page, /navClass\('rosaries'\)/)
  assert.match(page, /navClass\('devotions'\)/)
  assert.match(page, /navClass\('concerts'\)/)
  assert.match(page, /aria-current=\{navCurrent\('agenda'\)\}/)
  assert.doesNotMatch(page, /className=\{styles\.current\}/)

  assert.match(css, /\.navSelected\{/)
  assert.match(css, /navSelected\[data-section="rosaries"\]/)
  assert.match(css, /navSelected\[data-section="devotions"\]/)
  assert.match(css, /navSelected\[data-section="concerts"\]/)
  assert.match(css, /navSelected::after/)
  assert.match(css, /a:last-child\{grid-column:1\/-1\}/)
})
