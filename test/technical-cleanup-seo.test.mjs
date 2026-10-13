import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la página 404 declara noindex propio y no menciona el prototipo', () => {
  const page = read('app/not-found.js')
  assert.match(page, /export const metadata = \{\s*title: 'Página no encontrada',\s*robots: \{ index: false, follow: true \},/)
  assert.doesNotMatch(page, /prototipo/)
})

test('el directorio de Autores publica su BreadcrumbList', () => {
  const page = read('app/autores/page.js')
  assert.match(page, /breadcrumbJsonLd\(\[\s*\{ name: 'Inicio', path: '\/' \},\s*\{ name: 'Autores', path: '\/autores' \},\s*\]\)/)
})

test('el alias antiguo de la faceta de cornetas redirige de forma permanente', () => {
  const config = read('next.config.mjs')
  assert.match(config, /source: '\/bandas\/tipo\/banda-de-cornetas-y-tambores',\s*destination: '\/bandas\/tipo\/cornetas-y-tambores',\s*permanent: true,/)
})

test('la marcha duplicada de Pablo Ojeda redirige a su ficha canónica', () => {
  const config = read('next.config.mjs')
  assert.match(config, /source: '\/marchas\/tu-eres-orgullo-nuestro-pueblo-pablo-ojeda',\s*destination: '\/marchas\/tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda',\s*permanent: true,/)
})
