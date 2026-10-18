import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Auditoría de encabezados 18/10/2026.
test('el menú móvil no usa encabezados y queda inerte cerrado', () => {
  const header = read('components/HiloHeader.js')
  const mobile = header.slice(header.indexOf('id="hilo-mobile-menu"'))
  assert.doesNotMatch(mobile, /<h[1-6][\s>]/)
  assert.match(header, /id="hilo-mobile-menu"[^>]*inert=\{!open\}/)
  assert.doesNotMatch(header, /id="hilo-mobile-menu"[^>]*aria-hidden/)
  const css = read('components/HiloHeader.module.css')
  assert.match(css, /\.mobileGroup \.mobileGroupHeading\{display:block;margin:0\}/)
  assert.doesNotMatch(css, /\.mobileGroup h2/)
})

test('los directorios de bandas, imágenes y pasos tienen un H2 de listado', () => {
  const source = read('components/RelationalEntityDirectory.js')
  assert.match(source, /<h2 className=\{styles\.resultTitle\}>\{filtered\.length\}/)
})

test('el contador de los grupos de hermandades no se pega al texto del H2', () => {
  const source = read('components/DirectoryRoutePage.js')
  assert.match(source, /<span className="sr-only"> · <\/span>\s*<span>\{group\.items\.length\}<\/span>\s*<\/h2>/)
})

test('cambios musicales 2027: municipios como H3 y Hermandades como H4', () => {
  const page = read('app/semana-santa/2027/cambios-musicales/page.js')
  assert.doesNotMatch(page, /<h2 id=\{`(?:renovaciones-)?municipio-/)
  assert.equal(page.match(/<h3 id=\{`(?:renovaciones-)?municipio-/g).length, 2)
  assert.equal(page.match(/<h4>/g).length, 2)
})
