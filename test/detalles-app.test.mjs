// Detalles de aplicación (24/11/2026): siluetas de carga y «Volver arriba».
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('fichas y listados muestran su silueta mientras cargan', () => {
  for (const path of ['hermandades/[slug]', 'bandas/[slug]', 'marchas/[slug]', 'imagenes/[slug]', 'pasos/[slug]']) {
    assert.match(read(`app/${path}/loading.js`), /<PageSkeleton variant="ficha" \/>/)
  }
  for (const path of ['hermandades', 'bandas', 'marchas', 'agenda-cofrade']) {
    assert.match(read(`app/${path}/loading.js`), /<PageSkeleton variant="listado" \/>/)
  }
  assert.equal(existsSync(new URL('../app/loading.js', import.meta.url)), false, 'sin silueta global: cada sección decide')
  const skeleton = read('components/PageSkeleton.js')
  assert.match(skeleton, /role="status"/)
  const css = read('components/PageSkeleton.module.css')
  assert.match(css, /prefers-reduced-motion: no-preference/)
})

test('«Volver arriba» aparece al bajar, flota sobre la barra y no sale en el Panel', () => {
  const button = read('components/HiloBackToTop.js')
  assert.match(button, /window\.scrollY > window\.innerHeight \* 1\.5/)
  assert.match(button, /startsWith\('\/panel'\)/)
  assert.match(button, /prefers-reduced-motion: reduce/)
  const css = read('components/HiloBackToTop.module.css')
  assert.match(css, /bottom: calc\(76px \+ env\(safe-area-inset-bottom/)
  assert.match(css, /Instalar Hilo Cofrade/)
  assert.match(read('app/layout.js'), /<HiloBackToTop \/>/)
})
