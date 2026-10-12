import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Autores forma parte de la navegación global de la enciclopedia', () => {
  const header = read('components/HiloHeader.js')
  assert.match(header, /\['\/autores', 'Autores'\]/)
})

test('la Home enlaza las familias del hilo de conocimiento desde «Descubre Hilo Cofrade»', () => {
  const discover = read('lib/home-discover.js')

  for (const href of ['/hermandades', '/imagenes', '/pasos', '/bandas', '/marchas', '/autores', '/directorio']) {
    assert.match(discover, new RegExp(`href: '${href.replaceAll('/', '\\/')}'`))
  }
})

test('el Directorio enlaza Marchas y Autores y los declara en hasPart', () => {
  const directory = read('app/directorio/page.js')

  assert.match(directory, /href="\/marchas"/)
  assert.match(directory, /href="\/autores"/)
  assert.match(directory, /Autores y talleres cofrades/)
  assert.match(directory, /absoluteUrl\('\/autores'\)/)
})

test('Organization declara logo en el schema global', () => {
  const layout = read('app/layout.js')

  assert.match(layout, /logo: \{/)
  assert.match(layout, /'@type': 'ImageObject'/)
  assert.match(layout, /\/brand\/logo\.svg/)
})
