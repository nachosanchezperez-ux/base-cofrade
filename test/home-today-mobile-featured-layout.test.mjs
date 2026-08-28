import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la tarjeta destacada de Hoy conserva su rejilla editorial en móvil', () => {
  const component = read('components/HomeTodayV2.js')
  const css = read('components/HomeTodayV2.module.css')

  assert.match(component, /featured \? styles\.featureVisual : polishStyles\.todayVisual/)
  assert.match(component, /isFeatured \? '' : polishStyles\.todayCardWithVisual/)
  assert.match(component, /isFeatured \? styles\.featureCard : `\$\{styles\.compactCard\} \$\{polishStyles\.todayCard\}`/)

  assert.match(
    css,
    /@media \(max-width: 619px\)[\s\S]*?\.featureCard\.cardWithVisual \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\);/
  )
  assert.match(
    css,
    /\.featureCard\.cardWithVisual \.copy \{[\s\S]*?grid-row: 2;/
  )
  assert.match(
    css,
    /\.featureCard\.cardWithVisual \.featureVisual \{[\s\S]*?grid-row: 1;[\s\S]*?grid-column: 1;[\s\S]*?width: 100%;/
  )
})
