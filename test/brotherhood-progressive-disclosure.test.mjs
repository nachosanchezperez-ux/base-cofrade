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

test('la ficha cierra con las rutas del hilo y no repite las relaciones directas', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const closing = page.lastIndexOf('<BrotherhoodReadingDiscovery brotherhoodId={h.id} />')
  const officialLinks = page.lastIndexOf('<OfficialLinks')
  const titulares = page.indexOf('id="titulares"')

  assert.ok(closing > titulares)
  assert.ok(closing < officialLinks)
  // Imágenes, pasos, bandas y marchas ya tienen su sección: sin bloques de conexiones repetidos.
  assert.doesNotMatch(page, /<RelationalThread/)
  assert.match(page, /excludeAccompanimentIds=\{accompanimentIdsInSteps\}/)
})

test('Historia conserva todos los hitos en HTML pero pliega cronologías largas', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const component = read('components/BrotherhoodHistoryTimeline.js')
  const css = read('components/BrotherhoodHistoryTimeline.module.css')

  assert.match(page, /<BrotherhoodHistoryTimeline items=\{h\.cronologia \|\| \[\]\} introduction=\{publicText\(h\.historia\)\}(?: semanticPreview=\{reading\})?(?: formerTitulars=\{h\.antiguasTitulares \|\| \[\]\})? \/>/)
  assert.doesNotMatch(page, /h\.cronologia\.map/)
  assert.match(component, /items\.length > 5/)
  assert.match(component, /Ver cronología completa/)
  assert.match(component, /items\.map\(\(item\) =>/)
  assert.match(component, /Recorrido rápido por la Historia/)
  assert.match(css, /\.preview/)
  assert.match(css, /\.disclosure/)
})

test('Historia sin hitos conserva el texto documental y no desaparece', () => {
  const component = read('components/BrotherhoodHistoryTimeline.js')
  assert.match(component, /if \(!items\.length && !introduction(?: && !formerTitulars\.length)?\) return null/)
  assert.ok(component.includes('<p className={styles.introduction}>{introduction}</p>'))
})
