import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la imagen para estados es vertical, valida el ID y solo usa datos publicados de la salida', () => {
  const route = read('app/salidas/[id]/estado/route.js')
  const image = read('lib/outing-story-image.js')
  assert.match(route, /\^\[0-9a-f-\]\{36\}\$/)
  assert.match(image, /const WIDTH = 1080;/)
  assert.match(image, /const HEIGHT = 1920;/)
  assert.match(image, /getGloryDetailByOutingId\(outingId\)/)
  assert.match(image, /© OpenStreetMap/)
})

test('los iconos de Lucide se incluyen con su licencia, sin dependencias nuevas', () => {
  const icons = read('components/icons/LucideIcons.js')
  const pkg = JSON.parse(read('package.json'))
  assert.match(icons, /Licencia ISC/)
  assert.equal(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).some((name) => /lucide|icons/i.test(name)), false)
})

test('la tarjeta de la salida ofrece calendario, imagen para estados, WhatsApp, compartir y cómo llegar', () => {
  const bar = read('components/OutingShareBar.js')
  for (const label of ['Añadir al calendario', 'Imagen para tus estados', 'WhatsApp', 'Compartir', 'Cómo llegar']) assert.match(bar, new RegExp(label))
  assert.match(bar, /navigator\.canShare\?\.\(\{ files: \[file\] \}\)/)
  assert.match(read('components/BrotherhoodChapterOuting.js'), /storyHref=\{upcoming \? `\/salidas\/\$\{outing\.id\}\/estado` : ''\}/)
})
