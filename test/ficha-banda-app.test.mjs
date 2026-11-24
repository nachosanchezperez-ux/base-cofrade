// Ficha de Banda en modo aplicación (24/11/2026): capítulos como la de Hermandad.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la ficha de Banda se divide en Inicio, Dónde suena, Música y Más', () => {
  const page = read('app/bandas/[slug]/page.js')
  assert.doesNotMatch(page, /EntitySectionNav/)
  for (const id of ['inicio', 'donde-suena', 'musica', 'mas']) {
    assert.match(page, new RegExp(`<EntityChapter id="${id}"`))
  }
  // Los anclajes antiguos siguen existiendo dentro de los capítulos.
  for (const id of ['resumen', 'acompanamientos', 'repertorio', 'direccion']) assert.match(page, new RegExp(`id="${id}"`))
  // Capítulos sin contenido no aparecen.
  assert.match(page, /show: hasWhereItPlays/)
  assert.match(page, /show: hasMusicChapter/)
})

test('reutiliza la navegación de la Hermandad con la portada de la ficha de entidad', () => {
  const chapters = read('components/EntityChapters.js')
  assert.match(chapters, /data-chapters-root/)
  assert.match(chapters, /heroTitleId = 'entity-hero-title'/)
  const nav = read('components/BrotherhoodChapterNav.js')
  assert.match(nav, /heroTitleId = 'brotherhood-program-title'/)
  const css = read('components/EntityChapters.module.css')
  assert.match(css, /\[aria-labelledby="entity-hero-title"\]/)
  assert.match(css, /padding-bottom: calc\(60px/)
})
