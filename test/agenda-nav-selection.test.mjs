import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la navegación superior separa calendarios y deja las categorías al filtro visual', () => {
  const nav = read('components/AgendaCofradeNav.js')
  const urlState = read('components/AgendaCofradeNavFromUrl.js')
  const directory = read('components/AgendaCofradeDirectoryV4.js')
  const css = read('app/agenda-cofrade/agenda-cofrade-v4.module.css')

  assert.match(nav, />Agenda<\/Link>/)
  assert.match(nav, />Extraordinarias<\/Link>/)
  assert.match(nav, />Glorias<\/Link>/)
  assert.match(nav, />Igualás y ensayos<\/Link>/)
  assert.doesNotMatch(nav, /Rosarios públicos/)
  assert.doesNotMatch(nav, />Besamanos<\/Link>/)
  assert.doesNotMatch(nav, />Conciertos<\/Link>/)
  assert.doesNotMatch(nav, /\?categoria=/)
  assert.match(nav, /className=\{v4Styles\.navSelected\}/)
  assert.match(nav, /aria-current="page"/)

  assert.match(urlState, /return <AgendaCofradeNav \/>/)
  assert.doesNotMatch(urlState, /useSearchParams/)

  assert.match(directory, /\['processions', 'Procesiones'\]/)
  assert.match(directory, /\['transfers', 'Traslados'\]/)
  assert.match(directory, /\['rosaries', 'Rosarios públicos'\]/)
  assert.match(directory, /\['devotions', 'Besamanos y besapiés'\]/)
  assert.match(directory, /\['concerts', 'Conciertos'\]/)

  assert.match(css, /grid-template-columns:repeat\(4,max-content\)/)
  assert.match(css, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/)
  assert.match(css, /\.navSelected\{/)
  assert.match(css, /navSelected::after/)
})
