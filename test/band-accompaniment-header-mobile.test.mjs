import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la ficha de Banda carga la protección de cabeceras de acompañamientos', () => {
  const layout = read('app/bandas/[slug]/layout.js')
  const css = read('app/bandas/[slug]/band-accompaniment-header-fix.module.css')

  assert.match(layout, /band-accompaniment-header-fix\.module\.css/)
  assert.match(layout, /headerStyles\.headerScope/)
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) max-content;/)
})

test('el tipo de salida no puede romperse letra a letra en móvil', () => {
  const css = read('app/bandas/[slug]/band-accompaniment-header-fix.module.css')

  assert.match(css, /overflow-wrap: normal !important;/)
  assert.match(css, /word-break: normal !important;/)
  assert.doesNotMatch(css, /overflow-wrap: anywhere;/)
  assert.match(css, /@media \(max-width: 360px\)[\s\S]*grid-template-columns: 1fr;/)
})

test('el periodo se conserva completo y no parte Desde ni el año', () => {
  const css = read('app/bandas/[slug]/band-accompaniment-header-fix.module.css')

  assert.match(css, /min-width: max-content;/)
  assert.match(css, /word-break: keep-all !important;/)
  assert.match(css, /white-space: nowrap !important;/)
  assert.match(css, /text-align: right;/)
})

test('la migración cierra Candelaria Madre de Dios en 2025 y elimina fuentes duplicadas de notas', () => {
  const migration = read('supabase/migrations_archive/first-edition/20260830140331_normalize_cruz_roja_glorias_2026.sql')

  assert.match(migration, /Hermandad de la Candelaria Madre de Dios/)
  assert.match(migration, /year_to = 2025/)
  assert.match(migration, /is_current = false/)
  assert.match(migration, /AMUECI/)
  assert.match(migration, /source_links/)
  assert.match(migration, /notes = null/)
})

test('Redención incorpora Monte-Sión y La Milagrosa al histórico hasta 2025', () => {
  const migration = read('supabase/migrations_archive/first-edition/20260830233859_redencion_historicos_montesion_milagrosa_2025.sql')

  assert.match(migration, /hermandad-monte-sion-sevilla/)
  assert.match(migration, /hermandad-milagrosa-sevilla/)
  assert.match(migration, /2025/)
  assert.match(migration, /false/)
  assert.match(migration, /Jueves Santo/)
  assert.match(migration, /Sábado de Pasión/)
})

test('las etiquetas sin fecha inicial se compactan antes de llegar a la cabecera', () => {
  const migration = read('supabase/migrations_archive/first-edition/20260830234116_compact_band_period_labels_2026.sql')

  assert.match(migration, /Hasta 2025/)
  assert.match(migration, /Vigente · \\1/)
  assert.match(migration, /year_from is null/)
})
