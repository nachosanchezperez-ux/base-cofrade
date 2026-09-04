import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../components/BrotherhoodProgramHero.module.css', import.meta.url), 'utf8')

test('la cabecera móvil muestra completo el nombre oficial de la Hermandad', () => {
  const mobileBlock = css.slice(css.indexOf('@media (max-width: 700px)'), css.indexOf('@media (max-width: 420px)'))
  const officialNameBlock = mobileBlock.slice(
    mobileBlock.indexOf('.officialName {'),
    mobileBlock.indexOf('\n  }', mobileBlock.indexOf('.officialName {')) + 4,
  )

  assert.match(officialNameBlock, /display:\s*block/)
  assert.match(officialNameBlock, /overflow:\s*visible/)
  assert.match(officialNameBlock, /font-size:\s*clamp\(13px,\s*3\.7vw,\s*15px\)/)
  assert.equal(/line-clamp|-webkit-line-clamp/.test(officialNameBlock), false)
  assert.equal(/text-overflow:\s*ellipsis/.test(officialNameBlock), false)
})
