import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('Virgen de los Reyes usa una presentación apaisada sin sustituir el recurso', () => {
  const directory = read('app/bandas/page.js')
  const detail = read('app/bandas/[slug]/page.js')
  const hero = read('components/RelationalEntityHero.js')

  assert.match(directory, /agrupacion-musical-virgen-de-los-reyes-sevilla': \{ mode: 'wide' \}/)
  assert.match(detail, /crestPresentation: band\.slug === 'agrupacion-musical-virgen-de-los-reyes-sevilla' \? 'wide' : 'default'/)
  assert.match(hero, /presentation === 'wide'/)
  assert.doesNotMatch(directory, /logo-virgen-de-los-reyes\.png/)
  assert.doesNotMatch(detail, /logo-virgen-de-los-reyes\.png/)
})

test('la presentación apaisada gana ancho y conserva object-fit contain', () => {
  const directoryCss = read('components/RelationalEntityDirectoryEnhancements.module.css')
  const heroCss = read('components/RelationalEntityHeroBand.module.css')

  assert.match(directoryCss, /data-logo-presentation='wide'/)
  assert.match(directoryCss, /\.bandMediaWide img \{[\s\S]*object-fit: contain;/)
  assert.match(heroCss, /\.logoStageWide \{[\s\S]*width: min\(100%, 380px\);/)
  assert.match(heroCss, /\.logo\.logoWide \{[\s\S]*max-height: 150px;/)
})
