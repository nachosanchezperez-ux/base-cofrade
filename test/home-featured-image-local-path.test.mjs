import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const source = fs.readFileSync(new URL('../components/HomePageV2.js', import.meta.url), 'utf8')

test('la imagen destacada de la Home evita el optimizador para medios locales', () => {
  const featuredImageBlock = source.match(/<Image[\s\S]*?src=\{featuredOuting\.heroImagePath\}[\s\S]*?\/>/)?.[0] || ''

  assert.ok(featuredImageBlock, 'debe existir la imagen destacada de la próxima salida')
  assert.match(featuredImageBlock, /\bunoptimized\b/, 'los medios locales deben servirse directamente para evitar el fondo vacío')
})
