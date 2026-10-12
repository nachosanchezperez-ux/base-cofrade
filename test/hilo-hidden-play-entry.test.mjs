import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../app/juegos/el-hilo-escondido/page.js', import.meta.url), 'utf8')
const game = readFileSync(new URL('../components/HiddenThreadGame.js', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../components/HiddenThreadGame.module.css', import.meta.url), 'utf8')

test('el visitante puede jugar aquí o en Cofradle desde la primera pantalla', () => {
  assert.match(page, /href="#partida-del-hilo"/)
  assert.match(page, /Jugar aquí/)
  assert.match(page, /href="https:\/\/cofradle\.es\/"/)
  assert.match(page, /Jugar en Cofradle/)
  assert.match(page, /target="_blank" rel="noopener noreferrer"/)
})

test('el ancla de partida aparece antes de la hidratación', () => {
  assert.match(game, /className=\{styles\.modes\} id="partida-del-hilo"/)
  assert.equal((game.match(/id="partida-del-hilo"/g) || []).length, 1)
})

test('el juego aparece antes de los bloques informativos', () => {
  const choice = game.indexOf('className={styles.modes}')
  const card = game.indexOf('className={styles.gameCard}')
  const promotion = game.indexOf('className={styles.cofradleFeature}')
  const library = game.indexOf('className={styles.gameLobby}')
  assert.ok(choice >= 0 && card > choice && promotion > card && library > promotion)
})

test('la tarjeta externa completa invita a un clic sin botones simulados', () => {
  assert.match(game, /<a\s+className=\{styles\.cofradleFeature\}\s+href="https:\/\/cofradle\.es\/"/)
  assert.match(game, /<span className=\{styles\.cofradleAction\}>Jugar ahora/)
  assert.match(game, /independiente de Hilo Cofrade/)
  assert.equal((game.match(/href="https:\/\/cofradle\.es\/"/g) || []).length, 1)
  assert.match(styles, /\.cofradleFeature:focus-visible/)
  assert.match(styles, /@media \(max-width: 720px\)/)
})
