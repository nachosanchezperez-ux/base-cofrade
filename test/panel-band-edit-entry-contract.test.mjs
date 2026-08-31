import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const bandList = read('app/panel/(protected)/bandas/page.js')
const bandGeneral = read('app/panel/(protected)/bandas/[id]/page.js')
const directUploader = read('components/panel/DirectImageUpload.js')
const bandUploader = read('components/panel/band/BandDirectImageUpload.js')

test('el listado de Bandas abre la ficha completa y no usa Discografía como puerta paralela', () => {
  assert.match(bandList, /className=\{bandUx\.bandListLink\}/)
  assert.match(bandList, /href=\{`\/panel\/bandas\/\$\{item\.id\}`\}/)
  assert.match(bandList, /Editar banda/)
  assert.doesNotMatch(bandList, /item\.id\}\/discografia/)
})

test('General gestiona logo y fotografía sin exponer rutas técnicas', () => {
  assert.match(bandGeneral, /BandDirectImageUpload/)
  assert.match(bandGeneral, /kind="logo"/)
  assert.match(bandGeneral, /kind="hero"/)
  assert.match(bandGeneral, /syncFields=\{\{ path: 'logo_path' \}\}/)
  assert.match(bandGeneral, /syncFields=\{\{ path: 'hero_image_path', alt: 'hero_image_alt', credit: 'hero_image_credit' \}\}/)
  assert.doesNotMatch(bandGeneral, /Ruta pública del logotipo/)
  assert.doesNotMatch(bandGeneral, /Ruta pública de la fotografía principal/)
})

test('la subida contextual sincroniza los valores que conserva el formulario General', () => {
  assert.match(directUploader, /document\.querySelector\(selector\)/)
  assert.match(bandUploader, /syncFields=\{syncFields\}/)
  assert.match(bandGeneral, /type="hidden" name="logo_path"/)
  assert.match(bandGeneral, /type="hidden" name="hero_image_path"/)
  assert.match(bandGeneral, /type="hidden" name="hero_image_alt"/)
  assert.match(bandGeneral, /type="hidden" name="hero_image_credit"/)
})
