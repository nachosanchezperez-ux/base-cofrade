import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la ficha reduce la navegación a destinos editoriales principales', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const navBlock = page.slice(
    page.indexOf('<EntitySectionNav items={['),
    page.indexOf(']} />', page.indexOf('<EntitySectionNav items={[')) + 5
  )

  for (const label of ['Resumen', 'Titulares', 'Historia', 'Música', 'Patrimonio']) {
    assert.match(navBlock, new RegExp(`label: '${label}'`))
  }
  assert.match(navBlock, /label: 'Agenda'/)
  assert.match(navBlock, /label: 'Cultos'/)
  assert.doesNotMatch(navBlock, /label: 'Conexiones'/)
  assert.doesNotMatch(navBlock, /label: 'Fuentes'/)
})

test('Conexiones se desplaza al final de la lectura principal', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const thread = page.lastIndexOf('<RelationalThread')
  const officialLinks = page.lastIndexOf('<OfficialLinks')
  const titulares = page.indexOf('id="titulares"')

  assert.ok(thread > titulares)
  assert.ok(thread < officialLinks)
  assert.equal(page.indexOf('<RelationalThread'), thread)
})

test('Historia conserva todos los hitos en HTML pero pliega cronologías largas', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const component = read('components/BrotherhoodHistoryTimeline.js')
  const css = read('components/BrotherhoodHistoryTimeline.module.css')

  assert.match(page, /<BrotherhoodHistoryTimeline items=\{h\.cronologia \|\| \[\]\} \/>/)
  assert.doesNotMatch(page, /h\.cronologia\.map/)
  assert.match(component, /items\.length > 5/)
  assert.match(component, /Ver cronología completa/)
  assert.match(component, /items\.map\(\(item\) =>/)
  assert.match(component, /Recorrido rápido por la Historia/)
  assert.match(css, /\.preview/)
  assert.match(css, /\.disclosure/)
})
