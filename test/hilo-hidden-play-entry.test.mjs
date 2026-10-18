import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

// Contratos estructurales mínimos de la página. El comportamiento del juego se prueba en
// hilo-hidden-game.test.mjs y hilo-hidden-share.test.mjs, y la experiencia visual con QA en
// navegador (docs/EL-HILO-ESCONDIDO-PILOTO-2026-10-12.md).
const page = readFileSync(new URL('../app/juegos/el-hilo-escondido/page.js', import.meta.url), 'utf8')
const game = readFileSync(new URL('../components/HiddenThreadGame.js', import.meta.url), 'utf8')

test('la página entra directamente en el juego, con la adivinanza desde el servidor', () => {
  assert.match(page, /<h1>El hilo escondido<\/h1>/)
  assert.match(page, /<HiddenThreadGame initialDayKey=\{initialDayKey\} \/>/)
  // Render por visita: el día nunca sale de una copia en caché de otra fecha.
  assert.match(page, /export const dynamic = 'force-dynamic'/)
  assert.doesNotMatch(page, /export const revalidate/)
})

test('Cofradle aparece solo al final, como enlace externo y sin recursos de terceros', () => {
  const gameAt = page.indexOf('<HiddenThreadGame')
  const cofradleAt = page.indexOf('https://cofradle.es/')
  assert.ok(gameAt > -1 && cofradleAt > gameAt)
  assert.equal((page.match(/https:\/\/cofradle\.es\//g) || []).length, 1)
  assert.match(page, /rel="noopener noreferrer"/)
  assert.match(page, /proyecto externo e independiente/)
  // No se usa un favicon servido por Google como si fuera el logotipo oficial.
  assert.doesNotMatch(page, /google\.com\/s2\/favicons/)
  // El logotipo es la copia local del favicon oficial (permiso del propietario, 13/10/2026).
  assert.match(page, /src="\/externos\/cofradle-favicon\.svg"/)
  assert.ok(existsSync(new URL('../public/externos/cofradle-favicon.svg', import.meta.url)))
  assert.doesNotMatch(game, /cofradle/i)
})

test('no se muestran distinciones ni contenidos futuros inventados', () => {
  assert.doesNotMatch(game, /Buen conocedor|Siete días de hilo|Próximamente/)
})
