import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../app/juegos/el-hilo-escondido/page.js', import.meta.url), 'utf8')
const game = readFileSync(new URL('../components/HiddenThreadGame.js', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../components/HiddenThreadGame.module.css', import.meta.url), 'utf8')

test('El hilo escondido es el título principal y el usuario juega sin pantalla de selección', () => {
  assert.match(page, /<h1>El hilo escondido<\/h1>/)
  assert.match(page, /Nuestro juego diario/)
  assert.match(page, /<HiddenThreadGame initialDayKey=\{initialDayKey\} \/>/)
  assert.doesNotMatch(page, /entryChoices|Elige tu juego|Dos desafíos cofrades|href="#partida-del-hilo"/)
  assert.match(game, /className=\{styles\.modes\} id="partida-del-hilo"/)
  assert.match(game, /className=\{styles\.gameCard\}/)
  assert.match(game, /¿Cuál es la respuesta\?/)
  assert.match(game, /Elige una tarjeta/)
  assert.match(game, /onClick=\{\(\) => chooseAnswer\(option\)\}/)
  assert.match(game, /Prefiero escribir mi respuesta/)
  assert.match(page, /await connection\(\)/)
})

test('Cofradle aparece solo como recomendación final, nunca al comenzar', () => {
  const positionGame = page.indexOf('<HiddenThreadGame initialDayKey={initialDayKey} />')
  const positionRecommended = page.indexOf('className={styles.recommendationSection}')
  assert.ok(positionGame > -1 && positionRecommended > positionGame)
  assert.equal((page.match(/href="https:\/\/cofradle\.es\/"/g) || []).length, 1)
  assert.match(page, /Cofradle es un proyecto externo e independiente/)
  assert.match(page, /target="_blank"/)
  assert.match(page, /rel="noopener noreferrer"/)
  assert.doesNotMatch(game, /className=\{styles\.cofradleFeature\}/)
})

test('el acceso a Cofradle es visual pero secundario y sin controles anidados', () => {
  assert.match(page, /<a\s+className=\{styles\.recommendationCard\}/)
  assert.match(page, /Visitar Cofradle/)
  assert.match(styles, /\.recommendationSection\s*\{/)
  assert.match(styles, /\.recommendationCard:focus-visible/)
  assert.match(styles, /@media \(max-width: 620px\)/)
  assert.match(styles, /prefers-reduced-motion: reduce/)
})

test('la partida precede al contenido futuro y tiene una sola ancla', () => {
  assert.equal((game.match(/id="partida-del-hilo"/g) || []).length, 1)
  assert.ok(game.indexOf('className={styles.modes}') < game.indexOf('className={styles.gameCard}'))
  assert.ok(game.indexOf('className={styles.gameCard}') < game.indexOf('className={styles.nextTopics}'))
  assert.match(game, /Próximamente: hermandades, imágenes, marchas y autores/)
  assert.doesNotMatch(game, /className=\{styles\.gameLobby\}|className=\{styles\.topicCard/)
})
