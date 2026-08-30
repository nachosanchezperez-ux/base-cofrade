import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la ficha de Banda carga la protección de cabeceras de acompañamientos', () => {
  const layout = read('app/bandas/[slug]/layout.js')
  const css = read('app/bandas/[slug]/band-accompaniment-header-fix.module.css')

  assert.match(layout, /band-accompaniment-header-fix\.module\.css/)
  assert.match(layout, /headerStyles\.headerScope/)
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) auto;/)
})

test('el tipo de salida no puede romperse letra a letra en móvil', () => {
  const css = read('app/bandas/[slug]/band-accompaniment-header-fix.module.css')

  assert.match(css, /overflow-wrap: normal;/)
  assert.match(css, /word-break: normal;/)
  assert.doesNotMatch(css, /overflow-wrap: anywhere;/)
  assert.match(css, /@media \(max-width: 360px\)[\s\S]*grid-template-columns: 1fr;/)
})

test('el periodo puede envolver sin salirse de la cabecera', () => {
  const css = read('app/bandas/[slug]/band-accompaniment-header-fix.module.css')

  assert.match(css, /max-width: min\(48%, 220px\);/)
  assert.match(css, /white-space: normal;/)
  assert.match(css, /text-align: right;/)
})

test('la migración cierra Candelaria Madre de Dios en 2025 y elimina fuentes duplicadas de notas', () => {
  const migration = read('supabase/migrations/20260830140331_normalize_cruz_roja_glorias_2026.sql')

  assert.match(migration, /Hermandad de la Candelaria Madre de Dios/)
  assert.match(migration, /year_to = 2025/)
  assert.match(migration, /is_current = false/)
  assert.match(migration, /AMUECI/)
  assert.match(migration, /source_links/)
  assert.match(migration, /notes = null/)
})
