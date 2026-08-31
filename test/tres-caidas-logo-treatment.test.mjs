import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('los logos JPEG reciben un tratamiento genérico de fondo opaco', () => {
  const component = read('components/RelationalEntityHero.js')
  const css = read('components/RelationalEntityHeroBand.module.css')

  assert.match(component, /function isOpaqueRasterLogo/)
  assert.match(component, /endsWith\('\.jpg'\)/)
  assert.match(component, /endsWith\('\.jpeg'\)/)
  assert.match(component, /band-logo-remove-light-raster-background/)
  assert.match(component, /bandStyles\.logoOpaqueRaster/)
  assert.match(css, /\.logoOpaqueRaster/)
  assert.match(css, /url\("#band-logo-remove-light-raster-background"\)/)
})

test('el tratamiento conserva el equilibrado óptico común sin excepciones nominales', () => {
  const component = read('components/RelationalEntityHero.js')
  const css = read('components/RelationalEntityHeroBand.module.css')

  assert.match(css, /scale\(var\(--crest-optical-scale, 1\)\)/)
  assert.doesNotMatch(component, /tres\s+ca[íi]das|cigarreras/i)
  assert.doesNotMatch(css, /tres\s+ca[íi]das|cigarreras/i)
})
