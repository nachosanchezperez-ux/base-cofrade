import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el patrimonio musical segmenta las marchas por los tres estilos cofrades principales', async () => {
  const code = await source('components/BrotherhoodMusicalHeritage.js')

  assert.match(code, /Banda de Música/)
  assert.match(code, /Cornetas y Tambores/)
  assert.match(code, /Banda de CC\. y TT\./)
  assert.match(code, /Agrupación Musical/)
  assert.match(code, /MarchStyleGroups/)
  assert.match(code, /item\.musicType === group\.key/)
})

test('las marchas con estilos nuevos o sin clasificar no desaparecen del patrimonio musical', async () => {
  const code = await source('components/BrotherhoodMusicalHeritage.js')

  assert.match(code, /Otros estilos/)
  assert.match(code, /!KNOWN_MARCH_STYLES\.has\(item\.musicType\)/)
})

test('la segmentación evita repetir la columna Estilo dentro de cada bloque', async () => {
  const code = await source('components/BrotherhoodMusicalHeritage.js')

  assert.match(code, /MusicList items=\{group\.items\} showStyle=\{false\} headingLevel=\{5\}/)
  assert.match(code, /showStyle \? <span>Estilo<\/span> : null/)
})

test('la jerarquía accesible no salta del título de sección a las composiciones', async () => {
  const code = await source('components/BrotherhoodMusicalHeritage.js')

  assert.match(code, /<h3>\{group\.label\}<\/h3>/)
  assert.match(code, /<h4>\{group\.label\}<\/h4>/)
  assert.match(code, /headingLevel=\{5\}/)
  assert.match(code, /headingLevel=\{4\}/)
  assert.doesNotMatch(code, /<h4>\{item\.name\}<\/h4>/)
})
