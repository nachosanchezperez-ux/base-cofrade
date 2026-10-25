// Portada (25/10/2026): sin rojo ni rosa sobre azul, rótulos en minúscula en
// «Hoy en Hilo Cofrade» y, en PC, la marcha y el reto en la columna derecha.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('sobre azul, las etiquetas van en azul claro, no en rosa', () => {
  assert.match(read('app/home-tokens.css'), /--home-on-blue: #b9d3ee;/)
  for (const file of ['app/home-tokens.css', 'components/HomeTodayV2.module.css', 'components/HomeUpdatesLink.module.css', 'components/HomeHero.module.css']) {
    const css = read(file)
    assert.doesNotMatch(css, /--home-pink|#f3c8d0|#f0a5b0/, file)
  }
})

test('Hoy en Hilo Cofrade: rótulos sin mayúsculas espaciadas en la portada', () => {
  const css = read('components/HomeTodayV2.module.css')
  assert.match(css, /\.embedded \.date,\s*\.embedded \.type,\s*\.embedded \.musicContext small,\s*\.embedded \.whyToday span \{[^}]*text-transform: none;/)
  assert.match(read('components/HiddenThreadTeaser.module.css'), /\.teaserFeature \.teaserCopy span \{[^}]*text-transform: none;/)
})

test('PC: la marcha y el reto comparten la columna derecha', () => {
  const css = read('components/HomeTodayV2.module.css')
  assert.match(css, /> \.editorialGrid \{\s*grid-column: 1;\s*grid-row: 2 \/ span 2;/)
  assert.match(css, /> \.musicCard \{\s*grid-column: 2;\s*grid-row: 2;/)
  assert.match(css, /> aside \{\s*grid-column: 2;\s*grid-row: 3;/)
})
