import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const page = readFileSync(new URL('../app/extraordinarias/page.js', import.meta.url), 'utf8')

test('Extraordinarias mantiene su intención SEO principal y canonical', () => {
  assert.match(page, /extraordinarySeoCopy\(currentYear\)/)
  assert.match(page, /canonical: '\/extraordinarias'/)
  assert.match(page, /generateMetadata/)
  assert.match(page, /madridYear\(\)/)
})

test('Extraordinarias conserva datos estructurados y enlazado a guías', () => {
  assert.match(page, /breadcrumbJsonLd/)
  assert.match(page, /collectionPageJsonLd/)
  assert.match(page, /`\/extraordinarias\/\$\{outing\.slug\}`/)
})

test('la página pilar muestra datos calculados, no cifras editoriales hardcodeadas', () => {
  assert.match(page, /yearOutings\.length/)
  assert.match(page, /upcomingCount/)
  assert.match(page, /capitalCount/)
  assert.match(page, /provinceCount/)
})

test('los accesos SEO incluyen próximas citas aunque crucen de año', () => {
  assert.match(page, /upcomingOutings = visibleOutings\.filter\(\(item\) => item\.isUpcoming\)/)
  assert.doesNotMatch(page, /const currentYear = 2026/)
  assert.doesNotMatch(page, /en 2026|Sevilla 2026/)
})
