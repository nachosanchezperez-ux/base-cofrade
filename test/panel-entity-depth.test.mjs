import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Datos incorpora Profundidad como tercera capa editorial', () => {
  const hub = read('app/panel/(protected)/datos/page.js')
  const page = read('app/panel/(protected)/datos/profundidad/page.js')

  assert.match(hub, /\/panel\/datos\/profundidad/)
  assert.match(hub, /Profundidad documental/)
  assert.match(page, /Identidad 15/)
  assert.match(page, /Relaciones 25/)
  assert.match(page, /La puntuación no publica, despublica ni cambia el SEO/)
})

test('Profundidad cubre las seis familias y expone carencias accionables', () => {
  const score = read('lib/entity-depth.js')
  const loader = read('lib/panel/entity-depth.js')
  const page = read('app/panel/(protected)/datos/profundidad/page.js')

  for (const type of ['brotherhood', 'band', 'march', 'agent', 'image', 'step']) {
    assert.match(score, new RegExp(`['"]${type}['"]`))
  }

  assert.match(loader, /entity_editorial_priority/)
  assert.match(loader, /march_dedications/)
  assert.match(loader, /march_recordings/)
  assert.match(loader, /heritage_interventions/)
  assert.match(loader, /step_phases/)
  assert.match(loader, /band_releases/)
  assert.match(page, /gaps\.slice\(0, 4\)/)
  assert.match(page, /Más débil:/)
})

test('el auditor es de lectura y no altera datos ni señales SEO', () => {
  const loader = read('lib/panel/entity-depth.js')
  const page = read('app/panel/(protected)/datos/profundidad/page.js')

  assert.doesNotMatch(loader, /\.insert\(/)
  assert.doesNotMatch(loader, /\.update\(/)
  assert.doesNotMatch(loader, /\.upsert\(/)
  assert.doesNotMatch(loader, /\.delete\(/)
  assert.doesNotMatch(page, /robots/)
  assert.doesNotMatch(page, /noindex/)
  assert.doesNotMatch(page, /<form action=/)
})

test('la interfaz permite priorizar por tipo, nivel, debilidad y orden', () => {
  const page = read('app/panel/(protected)/datos/profundidad/page.js')
  const css = read('app/panel/(protected)/datos/profundidad/depth.module.css')

  assert.match(page, /name="type"/)
  assert.match(page, /name="level"/)
  assert.match(page, /name="dimension"/)
  assert.match(page, /Menor profundidad/)
  assert.match(page, /Profundidad media por familia/)
  assert.match(css, /grid-template-columns: repeat\(7/)
  assert.match(css, /@media \(max-width: 620px\)/)
})
