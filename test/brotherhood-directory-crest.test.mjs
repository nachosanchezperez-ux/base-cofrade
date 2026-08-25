import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('los escudos reales del directorio se muestran sin cuadrado visible y aprovechan el espacio', async () => {
  const card = await source('components/BrotherhoodDirectoryCard.js')
  const css = await source('components/BrotherhoodDirectoryCrest.module.css')

  assert.match(card, /BrotherhoodDirectoryCrest\.module\.css/)
  assert.match(card, /crestStyles\.crestMedia/)
  assert.match(card, /crestStyles\.crestImage/)
  assert.match(card, /width=\{82\}/)
  assert.match(card, /height=\{104\}/)

  assert.match(css, /\.crestMedia\.crestMedia/)
  assert.match(css, /width:\s*82px/)
  assert.match(css, /height:\s*104px/)
  assert.match(css, /border:\s*0/)
  assert.match(css, /background:\s*transparent/)
  assert.match(css, /object-fit:\s*contain/)
  assert.match(css, /@media \(max-width: 620px\)/)
})

test('el fallback conserva una referencia visual sin imponer marco a los escudos reales', async () => {
  const card = await source('components/BrotherhoodDirectoryCard.js')
  const css = await source('components/BrotherhoodDirectoryCrest.module.css')

  assert.match(card, /crest \? crestStyles\.crestMedia : crestStyles\.fallbackMedia/)
  assert.match(card, /crestStyles\.monogram/)
  assert.match(css, /\.monogram\.monogram/)
  assert.match(css, /border:\s*1px solid #e7edf3/)
})
