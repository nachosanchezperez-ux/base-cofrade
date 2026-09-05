import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('el directorio de Bandas normaliza el peso visual de escudos contenidos', () => {
  const directory = read('components/RelationalEntityDirectory.js')
  const css = read('components/RelationalEntityDirectoryEnhancements.module.css')

  assert.match(directory, /BrotherhoodDirectoryCrestImage/)
  assert.match(directory, /isBand && item\.logoPresentationMode !== 'integrated'/)
  assert.match(directory, /maxScale=\{2\.1\}/)
  assert.match(directory, /bandLogoOptical/)
  assert.match(css, /\.bandMedia img\.bandLogoOptical/)
  assert.match(css, /--crest-optical-scale/)
  assert.match(css, /--crest-optical-x/)
  assert.match(css, /--crest-optical-y/)
})

test('la normalización no introduce excepciones nominales de Bandas', () => {
  const directory = read('components/RelationalEntityDirectory.js')
  const css = read('components/RelationalEntityDirectoryEnhancements.module.css')

  assert.equal(/centuria|cigarreras|banda-del-sol/i.test(`${directory}\n${css}`), false)
})
