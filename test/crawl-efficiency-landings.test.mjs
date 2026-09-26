import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Marchas reparte el directorio en páginas rastreables y no indexa duplicados', () => {
  const source = read('app/marchas/page.js')
  assert.match(source, /const PAGE_SIZE = 120/)
  assert.match(source, /robots: \{ index: false, follow: true \}/)
  assert.match(source, /pageHref\(number\)/)
  assert.match(source, /aria-label="Páginas del directorio de Marchas"/)
})

test('Autores reparte el directorio en páginas rastreables y no indexa duplicados', () => {
  const source = read('app/autores/page.js')
  assert.match(source, /const PAGE_SIZE = 100/)
  assert.match(source, /robots: \{ index: false, follow: true \}/)
  assert.match(source, /pageHref\(number\)/)
  assert.match(source, /aria-label="Páginas del directorio de Autores"/)
})

test('Pasos envía al cliente solo el contrato necesario del directorio', () => {
  const source = read('app/pasos/page.js')
  assert.match(source, /function compactStepDirectoryItem/)
  assert.match(source, /searchText:/)
  assert.match(source, /directoryItems = steps\.map\(compactStepDirectoryItem\)/)
  assert.match(source, /items=\{directoryItems\}/)
})

test('Agenda compacta los actos antes de hidratar sus filtros', () => {
  const source = read('app/agenda-cofrade/page.js')
  assert.match(source, /function compactAgendaItem/)
  assert.match(source, /interactiveItems = upcoming\.map\(compactAgendaItem\)/)
  assert.match(source, /items=\{interactiveItems\}/)
})

test('las imágenes de tarjetas relacionales tienen alt descriptivo', () => {
  const source = read('components/RelationalEntityDirectory.js')
  assert.match(source, /const mediaAlt = item\.coverAlt/)
  assert.match(source, /alt=\{mediaAlt\}/)
})
