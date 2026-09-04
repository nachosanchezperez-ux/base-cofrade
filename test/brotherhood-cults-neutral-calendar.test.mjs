import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const styles = readFileSync(
  new URL('../components/BrotherhoodCultsSection.module.css', import.meta.url),
  'utf8',
)

test('el calendario de Cultos usa una base neutra y deja el color corporativo en acentos', () => {
  const dateBlock = styles.slice(styles.indexOf('.date {'), styles.indexOf('.bindings {'))
  const monthBlock = styles.slice(styles.indexOf('.month,'), styles.indexOf('.mainDate {'))
  const titleBlock = styles.slice(styles.indexOf('.copy h3 {'), styles.indexOf('.copy p {'))

  assert.match(dateBlock, /background: linear-gradient\(180deg, #ffffff 0%, #f6f7f8 100%\)/)
  assert.match(dateBlock, /color: #1b2c3d/)
  assert.doesNotMatch(dateBlock, /var\(--brotherhood-light\)/)
  assert.doesNotMatch(monthBlock, /var\(--brotherhood-secondary\)/)
  assert.match(monthBlock, /color: #6b747c/)
  assert.match(styles, /\.bindings i[\s\S]*var\(--brotherhood-primary\)/)
  assert.match(styles, /\.type::before[\s\S]*var\(--brotherhood-secondary\)/)
  assert.match(titleBlock, /color: #172432/)
})

test('la regla neutra se mantiene también en móvil', () => {
  const mobile = styles.slice(styles.indexOf('@media (max-width: 560px)'))

  assert.match(mobile, /\.date\s*\{[\s\S]*min-height: 116px/)
  assert.equal(/background:\s*var\(--brotherhood/.test(mobile), false)
})
