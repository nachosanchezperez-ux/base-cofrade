import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la tarjeta destacada de Hoy usa un contrato móvil independiente de la cascada general', () => {
  const component = read('components/HomeTodayV2.js')
  const css = read('components/HomeTodayMobileFix.module.css')

  assert.match(component, /import mobileFixStyles from '\.\/HomeTodayMobileFix\.module\.css'/)
  assert.match(component, /styles\.featureCard\} \$\{mobileFixStyles\.featureCard/)
  assert.match(component, /mobileFixStyles\.featureCopy/)
  assert.match(component, /mobileFixStyles\.featureVisual/)
  assert.match(component, /mobileFixStyles\.featureIcon/)

  assert.match(
    css,
    /@media \(max-width: 619px\)[\s\S]*?\.featureCard \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) !important;/
  )
  assert.match(css, /\.featureCopy \{[\s\S]*?grid-column: 1 !important;[\s\S]*?grid-row: 2 !important;/)
  assert.match(css, /\.featureVisual \{[\s\S]*?grid-column: 1 !important;[\s\S]*?grid-row: 1 !important;[\s\S]*?width: 100% !important;/)
  assert.match(css, /\.featureIcon \{[\s\S]*?display: none !important;/)
})
