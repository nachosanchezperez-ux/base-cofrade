import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('El Hilo se mueve va al final de todas las fichas, montado desde el layout', () => {
  for (const route of ['hermandades', 'bandas', 'imagenes', 'pasos']) {
    const layout = read(`app/${route}/[slug]/layout.js`)
    assert.match(layout, new RegExp(`\\{children\\}\\s*<Suspense fallback=\\{null\\}><HiloMovementsSection entityHref=\\{\`/${route}/\\$\\{slug\\}\`\\} />`), route)
  }
})

test('las páginas de ficha no pintan El Hilo se mueve por su cuenta', () => {
  for (const route of ['hermandades', 'bandas', 'imagenes', 'pasos']) {
    assert.doesNotMatch(read(`app/${route}/[slug]/page.js`), /<HiloMovementsSection/, route)
  }
})
