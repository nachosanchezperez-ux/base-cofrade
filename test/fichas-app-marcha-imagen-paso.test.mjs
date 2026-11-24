// Modo aplicación en las fichas de marcha, imagen y paso (24/11/2026).
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const cases = {
  'app/marchas/[slug]/page.js': ['resumen', 'escuchar', 'crucetas', 'discografia'],
  'app/imagenes/[slug]/page.js': ['inicio', 'fotos', 'historia'],
  'app/pasos/[slug]/page.js': ['resumen', 'acompanamiento', 'patrimonio', 'fotos'],
}

for (const [path, chapters] of Object.entries(cases)) {
  test(`${path}: capítulos ${chapters.join(' · ')} y sin la tira de anclas antigua`, () => {
    const page = read(path)
    assert.doesNotMatch(page, /EntitySectionNav/)
    assert.match(page, /<EntityChapters/)
    for (const id of chapters) {
      assert.match(page, new RegExp(`(data-chapter="${id}"|<EntityChapter id="${id}")`))
      assert.match(page, new RegExp(`id: '${id}'`))
    }
  })
}

test('la portada de la marcha se identifica para ocultarse fuera de Inicio', () => {
  const page = read('app/marchas/[slug]/page.js')
  assert.match(page, /<header className=\{styles\.hero\} aria-labelledby="entity-hero-title">/)
  assert.match(page, /<h1 id="entity-hero-title">/)
  const css = read('components/EntityChapters.module.css')
  assert.match(css, /:global\(\[aria-labelledby="entity-hero-title"\]\)/)
})

test('iconos nuevos de la barra de capítulos', () => {
  const nav = read('components/BrotherhoodChapterNav.js')
  for (const icon of ['escuchar', 'disco', 'galeria']) assert.match(nav, new RegExp(`  ${icon}: <path`))
})
