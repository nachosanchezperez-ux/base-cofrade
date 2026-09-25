import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la navegación de secciones evita trabajo de layout continuo al hacer scroll', () => {
  const source = read('components/EntitySectionNav.js')

  assert.match(source, /new IntersectionObserver/)
  assert.doesNotMatch(source, /window\.addEventListener\('scroll', updateActiveSection/)
  assert.doesNotMatch(source, /getBoundingClientRect\(\)/)
})

test('la fotografía principal de Banda se carga con prioridad', () => {
  const source = read('components/BandFeaturePhoto.js')
  const photo = source.slice(
    source.indexOf('{showPhoto ? ('),
    source.indexOf(') : (', source.indexOf('{showPhoto ? ('))
  )

  assert.match(photo, /<Image/)
  assert.match(photo, /\bpriority\b/)
  assert.match(photo, /sizes=/)
})

test('el hero de Imagen abarata el fondo duplicado y mantiene prioritario el sujeto', () => {
  const source = read('components/ImageHeroV2.js')
  const backdropStart = source.indexOf('className={`${styles.photoBackdrop}')
  const stageStart = source.indexOf('className={`${styles.subjectStage}', backdropStart)
  const backdrop = source.slice(backdropStart, stageStart)
  const subject = source.slice(stageStart, source.indexOf('</div>', stageStart))

  assert.match(backdrop, /quality=\{35\}/)
  assert.match(backdrop, /sizes="50vw"/)
  assert.doesNotMatch(backdrop, /\bpriority\b/)
  assert.match(subject, /\bpriority\b/)
})

test('Glorias permite a Next optimizar las fotografías locales', () => {
  const source = read('components/GloryDirectory.js')

  assert.doesNotMatch(source, /unoptimized=\{featured\.heroImagePath\.startsWith\('\/'\)\}/)
  assert.doesNotMatch(source, /unoptimized=\{outing\.heroImagePath\.startsWith\('\/'\)\}/)
  assert.match(source, /featured\.heroImagePath[\s\S]*\bpriority\b/)
})
