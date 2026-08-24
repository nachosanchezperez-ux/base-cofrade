import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const page = readFileSync(new URL('../app/extraordinarias/page.js', import.meta.url), 'utf8')

test('Extraordinarias mantiene su intención SEO principal y canonical', () => {
  assert.match(page, /Procesiones y salidas extraordinarias de Sevilla 2026/)
  assert.match(page, /canonical: '\/extraordinarias'/)
  assert.match(page, /salidas extraordinarias de Sevilla en 2026/)
  assert.match(page, /fechas, horarios, recorridos, acompañamientos musicales/)
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
