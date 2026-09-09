import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('todas las fichas de Hermandad cargan la capa cromática transversal', async () => {
  const [page, hero, styles] = await Promise.all([
    source('app/hermandades/[slug]/page.js'),
    source('components/BrotherhoodProgramHero.js'),
    source('components/BrotherhoodProgramHeroCorporate.module.css'),
  ])

  assert.match(page, /BrotherhoodProgramHero/)
  assert.match(hero, /BrotherhoodProgramHeroCorporate\.module\.css/)
  assert.match(hero, /corporateStyles\.corporateHero/)

  for (const section of [
    '#resumen',
    '#acompanamiento-musical',
    '#musica',
    '#cultos',
    '#via-crucis-cofradias',
    '#salidas',
    '#simpecados',
    '#fuentes',
  ]) {
    assert.match(styles, new RegExp(section.replaceAll('-', '\\-')))
  }

  assert.match(styles, /--brotherhood-neutral-ink: #25282c/)
  assert.match(styles, /--brotherhood-neutral-surface: #f7f7f7/)
  assert.match(styles, /--brotherhood-line-soft: color-mix\(in srgb, var\(--brotherhood-primary/)
  assert.match(styles, /\.official-links-section/)
  assert.match(styles, /\.heritage-section/)
  assert.match(styles, /\.release-card-visual::after/)
})

test('la portada con fotografía no añade un velo azul ajeno a la Hermandad', async () => {
  const styles = await source('components/BrotherhoodProgramHeroCorporate.module.css')
  const marker = 'Las fotografías conservan la identidad de la Hermandad'
  const start = styles.indexOf(marker)

  assert.notEqual(start, -1)
  const photoGuard = styles.slice(start)

  assert.match(photoGuard, /__hero.*:not\(\[class\*=\"__noPhoto\"\]\).*__photoVeil/s)
  assert.match(photoGuard, /rgba\(0, 0, 0, \.995\)/)
  assert.match(photoGuard, /@media \(max-width: 920px\)/)
  assert.match(photoGuard, /@media \(max-width: 620px\)/)
  assert.doesNotMatch(photoGuard, /rgba\((?:2|3|4|6|7|8|9|13|14|20|21),\s*(?:11|15|18|25|28|35|38|41|42|49|59),/)
})

test('la segunda pasada cubre los módulos que aún conservaban azul editorial', async () => {
  const styles = await source('components/BrotherhoodProgramHeroCorporate.module.css')

  assert.match(styles, /#musica[\s\S]*?--brotherhood-neutral-surface/)
  assert.match(styles, /#cultos[\s\S]*?--brotherhood-neutral-ink/)
  assert.match(styles, /#via-crucis-cofradias[\s\S]*?--brotherhood-neutral-ink/)
  assert.match(styles, /#salidas[\s\S]*?color-mix\(in srgb, var\(--brotherhood-dark/)
  assert.match(styles, /#simpecados[\s\S]*?color-mix\(in srgb, var\(--brotherhood-primary/)
  assert.match(styles, /#fuentes[\s\S]*?--brotherhood-neutral-ink/)

  assert.doesNotMatch(styles, /#17324d|#162d43|#172a3d|#15293a|#18334f/i)
})
