import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const contract = read('components/DirectoryCardContract.module.css')
const relational = read('components/RelationalEntityDirectory.js')
const brotherhood = read('components/BrotherhoodDirectoryCard.js')
const enhancements = read('components/RelationalEntityDirectoryEnhancements.module.css')
const protocol = read('docs/PROTOCOLO-TARJETAS-DIRECTORIO.md')

test('el contrato fija una geometría común y un breakpoint móvil', () => {
  assert.match(contract, /--hc-directory-media-column:\s*82px/)
  assert.match(contract, /--hc-directory-media-width:\s*72px/)
  assert.match(contract, /--hc-directory-media-height:\s*92px/)
  assert.match(contract, /@media\s*\(max-width:\s*620px\)/)
  assert.match(contract, /--hc-directory-media-column:\s*64px/)
  assert.match(contract, /--hc-directory-media-width:\s*58px/)
  assert.match(contract, /--hc-directory-media-height:\s*76px/)
  assert.match(contract, /minmax\(0,\s*1fr\)/)
})

test('Hermandades, Imágenes, Pasos y Bandas comparten el mismo contrato', () => {
  assert.match(brotherhood, /DirectoryCardContract\.module\.css/)
  assert.match(brotherhood, /contractStyles\.contract/)
  assert.match(brotherhood, /contractStyles\.media/)
  assert.match(brotherhood, /contractStyles\.copy/)
  assert.match(brotherhood, /contractStyles\.action/)

  assert.match(relational, /DirectoryCardContract\.module\.css/)
  assert.match(relational, /contractStyles\.contract/)
  assert.match(relational, /contractStyles\.media/)
  assert.match(relational, /contractStyles\.copy/)
  assert.match(relational, /contractStyles\.action/)
})

test('Bandas no recupera una geometría paralela al contrato', () => {
  assert.doesNotMatch(enhancements, /\.card\.bandCard\s*\{[^}]*grid-template-columns/s)
  assert.doesNotMatch(enhancements, /\.card\.bandCard\s*>\s*\.media\.bandMedia\s*\{[^}]*width/s)
})

test('el protocolo documenta la regla de no solapamiento y la matriz de QA', () => {
  assert.match(protocol, /MEDIA \| CONTENIDO \| ACCIÓN/)
  assert.match(protocol, /no existe scroll horizontal/)
  assert.match(protocol, /media, texto y flecha no se solapan/)
  for (const viewport of ['320 px', '375 px', '390 px', '430 px', '768 px', '1024 px']) {
    assert.match(protocol, new RegExp(viewport.replace(' ', '\\s*')))
  }
})
