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

  assert.match(nav, />Agenda Cofrade<\/Link>/)
  assert.match(nav, />Extraordinarias<\/Link>/)
  assert.match(nav, />Glorias<\/Link>/)
  assert.match(nav, />Igualás y ensayos<\/Link>/)
  assert.doesNotMatch(nav, /Rosarios públicos/)
  assert.doesNotMatch(nav, />Besamanos<\/Link>/)
  assert.doesNotMatch(nav, />Conciertos<\/Link>/)
  assert.doesNotMatch(nav, /\?categoria=/)
  assert.match(nav, /activeSection = 'agenda'/)
  assert.match(nav, /selectedClass/)
  assert.match(nav, /currentPage/)
  assert.match(nav, /sticky = true/)
  assert.match(nav, /data-sticky=\{sticky \? 'true' : 'false'\}/)
  assert.match(css, /agendaNavV4\[data-sticky="false"\]/)

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

test('las cuatro agendas comparten el mismo navegador y marcan su sección activa', () => {
  const agenda = read('app/agenda-cofrade/page.js')
  const glories = read('app/procesiones-de-gloria/page.js')
  const extraordinary = read('app/extraordinarias/page.js')
  const crew = read('app/igualas-y-ensayos/page.js')

  assert.match(agenda, /AgendaCofradeNav/)
  assert.match(glories, /AgendaCofradeNav activeSection="glories"/)
  assert.match(extraordinary, /AgendaCofradeNav activeSection="extraordinary"/)
  assert.match(crew, /AgendaCofradeNav activeSection="crew"/)
})

test('las fichas individuales mantienen el acceso al ecosistema completo de agendas', () => {
  const rosary = read('app/agenda-cofrade/rosarios/[slug]/page.js')
  const glory = read('app/procesiones-de-gloria/[slug]/page.js')
  const extraordinary = read('app/extraordinarias/[slug]/page.js')
  const crew = read('app/igualas-y-ensayos/[slug]/page.js')

  assert.match(rosary, /AgendaCofradeNav activeSection="agenda" sticky=\{false\}/)
  assert.match(glory, /AgendaCofradeNav activeSection="glories" sticky=\{false\}/)
  assert.match(extraordinary, /AgendaCofradeNav activeSection="extraordinary" sticky=\{false\}/)
  assert.match(crew, /AgendaCofradeNav activeSection="crew" sticky=\{false\}/)
})
