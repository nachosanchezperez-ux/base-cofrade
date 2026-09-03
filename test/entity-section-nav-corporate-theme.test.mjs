import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const componentPath = new URL('../components/EntitySectionNav.js', import.meta.url)
const stylesPath = new URL('../components/EntitySectionNav.module.css', import.meta.url)

test('el menú de fichas hereda una versión oscura de la paleta corporativa', async () => {
  const [component, styles] = await Promise.all([
    readFile(componentPath, 'utf8'),
    readFile(stylesPath, 'utf8'),
  ])

  assert.match(component, /EntitySectionNav\.module\.css/)
  assert.match(component, /styles\.nav/)
  assert.match(styles, /--brotherhood-primary/)
  assert.match(styles, /--brotherhood-secondary/)
  assert.match(styles, /--band-primary/)
  assert.match(styles, /color-mix\(/)
  assert.match(styles, /#000/)
  assert.doesNotMatch(styles, /#0d2949/i)
  assert.doesNotMatch(styles, /--bc-blue/)
})
