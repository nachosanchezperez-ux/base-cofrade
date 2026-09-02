import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const page = readFileSync(new URL('../app/hermandades/[slug]/page.js', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')

test('las salidas enlazan su guía extraordinaria desde la propia tarjeta', () => {
  assert.match(page, /s\.slug \? `\/extraordinarias\/\$\{s\.slug\}` : ''/)
  assert.match(page, /const OutingCard = isWholeCardLink \? Link : 'article'/)
  assert.match(page, /Ver guía/)
  assert.match(styles, /\.outing-card-related:focus-visible/)
})

test('el carácter no repite extraordinaria cuando ya forma parte del tipo', () => {
  assert.match(page, /function outingCharacterLabel/)
  assert.match(page, /type\.includes\(normalizedCharacter\) \? '' : character/)
  assert.doesNotMatch(page, /\{s\.caracter && <small>\{s\.caracter\}<\/small>\}/)
})
