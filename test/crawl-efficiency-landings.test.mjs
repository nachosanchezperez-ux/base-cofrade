import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Marchas reparte el directorio en páginas rastreables e indexables, sin indexar filtros', () => {
  const source = read('app/marchas/page.js')
  assert.match(source, /const PAGE_SIZE = 120/)
  assert.match(source, /directoryHref\(\{ page: number, query, letter, decade, filter \}\)/)
  assert.match(source, /aria-label="Páginas del directorio de Marchas"/)
  // Sin filtros, cada página es canónica e indexable: es la única vía de rastreo a las marchas 121+.
  assert.match(source, /const paginated = !filtered && page > 1/)
  assert.match(source, /const path = paginated \? directoryHref\(\{ page \}\) : '\/marchas'/)
  assert.match(source, /`\$\{title\} · página \$\{page\}`/)
  assert.match(source, /\.\.\.\(filtered \? \{ robots: \{ index: false, follow: true \} \} : \{\}\)/)
  assert.doesNotMatch(source, /page > 1 \|\| filtered/)
  assert.match(source, /if \(!hasFilters && requestedPage > totalPages\) notFound\(\)/)
})

test('Autores reparte el directorio en páginas rastreables e indexables, sin indexar categorías', () => {
  const source = read('app/autores/page.js')
  assert.match(source, /const PAGE_SIZE = 100/)
  assert.match(source, /pageHref\(number, selectedCategory\?\.slug \|\| ''\)/)
  assert.match(source, /aria-label="Páginas del directorio de Autores"/)
  // Sin categoría, cada página es canónica e indexable: es la única vía de rastreo a los autores 101+.
  assert.match(source, /const paginated = !filtered && page > 1/)
  assert.match(source, /path: paginated \? pageHref\(page\) : '\/autores'/)
  assert.match(source, /\.\.\.\(filtered \? \{ robots: \{ index: false, follow: true \} \} : \{\}\)/)
  assert.doesNotMatch(source, /page > 1 \|\| params\?\.categoria/)
  assert.match(source, /if \(!params\?\.categoria && requestedPage > totalPages\) notFound\(\)/)
})

test('Pasos envía al cliente solo el contrato necesario del directorio', () => {
  const source = read('app/pasos/page.js')
  const contract = read('lib/directory-client-items.js')
  assert.match(contract, /export function compactStepDirectoryItem/)
  assert.match(contract, /searchText:/)
  assert.match(source, /import \{ compactStepDirectoryItem, DIRECTORY_PAGE_SIZE \} from '@\/lib\/directory-client-items'/)
  assert.match(source, /directoryItems = steps\.map\(compactStepDirectoryItem\)/)
  assert.match(source, /items=\{directoryItems\}/)
})

test('Imágenes y las facetas de patrimonio envían al cliente solo el contrato necesario', () => {
  const images = read('app/imagenes/page.js')
  assert.match(images, /const directoryItems = images\.map\(compactImageDirectoryItem\)/)
  assert.match(images, /<RelationalEntityDirectory items=\{directoryItems\} kind="image" \/>/)
  const routePage = read('components/HeritageDirectoryRoutePage.js')
  assert.match(routePage, /items=\{compactHeritageDirectoryItems\(items, kind\)\}/)
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

test('los directorios de patrimonio pintan las tarjetas por tandas', () => {
  const source = read('components/RelationalEntityDirectory.js')
  const contract = read('lib/directory-client-items.js')
  assert.match(contract, /export const DIRECTORY_PAGE_SIZE = 48/)
  assert.match(source, /const visible = isBand \? filtered : filtered\.slice\(0, limit\)/)
  assert.match(source, /\{visible\.map\(renderCard\)\}/)
  assert.match(source, /Mostrar \{Math\.min\(remaining, DIRECTORY_PAGE_SIZE\)\} más/)
  // El ItemList lleva solo la primera tanda; numberOfItems, el total.
  for (const file of ['app/imagenes/page.js', 'app/pasos/page.js', 'components/HeritageDirectoryRoutePage.js']) {
    assert.match(read(file), /limit: DIRECTORY_PAGE_SIZE/, file)
  }
  // Las facetas de /pasos leen el slug real de la localidad, no el compacto.
  assert.match(read('app/pasos/page.js'), /<HeritageDirectoryFacets items=\{steps\}/)
})
