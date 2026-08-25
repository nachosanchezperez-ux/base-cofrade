import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('los escudos reales del directorio se muestran sin cuadrado visible y aprovechan el espacio', async () => {
  const card = await source('components/BrotherhoodDirectoryCard.js')
  const css = await source('components/BrotherhoodDirectoryCrest.module.css')

  assert.match(card, /BrotherhoodDirectoryCrestImage/)
  assert.match(card, /BrotherhoodDirectoryCrest\.module\.css/)
  assert.match(card, /crestStyles\.crestMedia/)
  assert.match(card, /crestStyles\.crestImage/)

  assert.match(css, /\.crestMedia\.crestMedia/)
  assert.match(css, /--hc-directory-media-width:\s*82px/)
  assert.match(css, /--hc-directory-media-height:\s*104px/)
  assert.match(css, /border:\s*0/)
  assert.match(css, /background:\s*transparent/)
  assert.match(css, /object-fit:\s*contain/)
  assert.match(css, /@media \(max-width: 620px\)/)
})

test('la normalización óptica centra el contorno visible y conserva margen de seguridad', async () => {
  const image = await source('components/BrotherhoodDirectoryCrestImage.js')
  const css = await source('components/BrotherhoodDirectoryCrest.module.css')

  assert.match(image, /SAFE_INSET = 0\.075/)
  assert.match(image, /TARGET_COVERAGE = 1 - \(SAFE_INSET \* 2\)/)
  assert.match(image, /SAMPLE_LIMIT = 192/)
  assert.match(image, /ALPHA_THRESHOLD = 4/)
  assert.match(image, /getImageData/)
  assert.match(image, /readVisibleBounds/)
  assert.match(image, /opticalBalance/)
  assert.match(image, /visibleCenterX/)
  assert.match(image, /visibleCenterY/)
  assert.match(image, /--crest-optical-scale/)
  assert.match(image, /--crest-optical-x/)
  assert.match(image, /--crest-optical-y/)
  assert.match(image, /ResizeObserver/)
  assert.doesNotMatch(image, /La Cena|La Misión|Pastora|la-cena|mision|pastora/i)

  assert.match(css, /translate\(var\(--crest-optical-x, 0px\), var\(--crest-optical-y, 0px\)\)/)
  assert.match(css, /scale\(var\(--crest-optical-scale, 1\)\)/)
})

test('el contenedor común no recorta los escudos cuando se normalizan', async () => {
  const card = await source('components/BrotherhoodDirectoryCard.js')
  const contract = await source('components/DirectoryCardContract.module.css')

  assert.match(card, /data-media-overflow=\{crest \? 'visible' : undefined\}/)
  assert.match(contract, /\.media\.media\.media\.media\[data-media-overflow='visible'\]/)
  assert.match(contract, /overflow:\s*visible/)
})

test('el fallback conserva una referencia visual sin imponer marco a los escudos reales', async () => {
  const card = await source('components/BrotherhoodDirectoryCard.js')
  const css = await source('components/BrotherhoodDirectoryCrest.module.css')

  assert.match(card, /crest \? crestStyles\.crestMedia : crestStyles\.fallbackMedia/)
  assert.match(card, /crestStyles\.monogram/)
  assert.match(css, /\.monogram\.monogram/)
  assert.match(css, /border:\s*1px solid #e7edf3/)
})
