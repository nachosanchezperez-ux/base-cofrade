import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Revisión de calidad en móvil (25/10/2026): sin fotografía, la cabecera se ajusta
// al texto, sin recuadros de relleno (mismo criterio que #1305 en imagen y paso).

test('la ficha de extraordinaria sin foto no pinta el recuadro de fecha y localidad', () => {
  const page = readFileSync('app/extraordinarias/[slug]/page.js', 'utf8')
  assert.doesNotMatch(page, /styles\.datePoster/)
  assert.match(page, /\{item\.heroImagePath \? \(\s*<div className=\{styles\.heroMedia\}>/)
  assert.match(readFileSync('app/extraordinarias/[slug]/extraordinary-detail.module.css', 'utf8'), /\.heroGridText\{grid-template-columns:minmax\(0,1fr\)\}/)
})

test('la cabecera de Hermandad sin foto no reserva hueco en móvil ni pinta el logotipo de relleno', () => {
  const css = readFileSync('components/BrotherhoodProgramHero.module.css', 'utf8')
  const mobile = css.slice(css.lastIndexOf('@media (max-width: 700px)'))
  assert.match(mobile, /\.noPhoto \{\s*min-height: 0;/)
  assert.match(mobile, /\.noPhoto \.content \{\s*padding-top: 28px;/)
  assert.match(mobile, /\.crestFallback \{\s*display: none;/)
  assert.match(readFileSync('components/BrotherhoodProgramHero.js', 'utf8'), /styles\.crestFallback/)
})
