import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../app/juegos/el-hilo-escondido/page.js', import.meta.url), 'utf8')
const game = readFileSync(new URL('../components/HiddenThreadGame.js', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../components/HiddenThreadGame.module.css', import.meta.url), 'utf8')

test('dos tarjetas jugables se ven antes de la partida, sin botones ficticios', () => {
  assert.match(page, /<nav className=\{styles\.entryChoices\} aria-label="Elige tu juego">/)
  assert.match(page, /href="#partida-del-hilo"/)
  assert.match(page, /Jugar aquí/)
  assert.match(page, /href="https:\/\/cofradle\.es\/"/)
  assert.match(page, /Jugar en Cofradle/)
  assert.match(page, /target="_blank"/)
  assert.match(page, /rel="noopener noreferrer"/)
  assert.ok(page.indexOf('className={styles.entryChoices}') < page.indexOf('<HiddenThreadGame />'))
})

test('Cofradle es un enlace externo independiente y no duplica llamadas en el pie', () => {
  assert.match(page, /Cofradle es un proyecto independiente de Hilo Cofrade/)
  assert.equal((page.match(/href="https:\/\/cofradle\.es\/"/g) || []).length, 1)
  assert.doesNotMatch(game, /className=\{styles\.cofradleFeature\}/)
})

test('el juego local se puede alcanzar sin esperar a hidratarse', () => {
  assert.match(game, /className=\{styles\.modes\} id="partida-del-hilo"/)
  assert.equal((game.match(/id="partida-del-hilo"/g) || []).length, 1)
  assert.ok(game.indexOf('className={styles.modes}') < game.indexOf('className={styles.gameCard}'))
  assert.ok(game.indexOf('className={styles.gameCard}') < game.indexOf('className={styles.nextTopics}'))
})

test('las categorías sin juego no obstaculizan la primera pantalla', () => {
  assert.doesNotMatch(game, /className=\{styles\.gameLobby\}/)
  assert.doesNotMatch(game, /className=\{styles\.topicCard/)
  assert.match(game, /Próximamente: hermandades, imágenes, marchas y autores/)
})

test('dos superficies completas, enfoque accesible y responsive', () => {
  assert.match(styles, /\.entryChoices\s*\{[^}]*grid-template-columns:\s*repeat\(2/)
  assert.match(styles, /\.entryChoice:focus-visible/)
  assert.match(styles, /@media \(max-width: 620px\)/)
  assert.match(styles, /@media \(max-width: 350px\)/)
  assert.match(styles, /prefers-reduced-motion: reduce/)
  assert.match(styles, /#partida-del-hilo/)
})
