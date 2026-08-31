import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('Hoy rota Dato Cofrade y Curiosidad según la fecha sin ocultar una selección manual', () => {
  const component = read('components/HomeTodayV2.js')
  const editorial = read('lib/supabase/home-effective-editorial.js')

  assert.match(component, /function dailySerial/)
  assert.match(component, /function rotatingEditorial/)
  assert.match(component, /serial % 2/)
  assert.match(component, /pinnedEditorialType === 'fact'/)
  assert.match(component, /pinnedEditorialType === 'curiosity'/)
  assert.match(editorial, /pinnedEditorialType: type/)
})

test('Hoy incorpora un hilo adicional sin duplicar los tres hilos del bloque inferior', () => {
  const snapshot = read('lib/supabase/home-snapshot.js')
  const component = read('components/HomeTodayV2.js')

  assert.match(snapshot, /getDiverseHomeDiscoveryThreads\(4\)/)
  assert.match(snapshot, /enrichedDiscoveryThreads\.slice\(0, 3\)/)
  assert.match(snapshot, /todayCardFromThread\(enrichedDiscoveryThreads\[3\]\)/)
  assert.match(component, /content\?\.discoverySecondary/)
})

test('la composición de escritorio alterna el lado protagonista y conserva móvil en una columna', () => {
  const component = read('components/HomeTodayV2.js')
  const css = read('components/HomeTodayDynamic.module.css')

  assert.match(component, /data-daily-layout=\{featureRight \? 'lead-right' : 'lead-left'\}/)
  assert.match(component, /dynamicStyles\.featureRight/)
  assert.match(css, /@media \(min-width: 860px\)/)
  assert.match(css, /\.featureRight[\s\S]*grid-template-columns: minmax\(330px, \.68fr\) minmax\(0, 1\.32fr\)/)
  assert.match(css, /@media \(max-width: 859px\)[\s\S]*\.featureRight/)
})

test('una protagonista sin fotografía se compacta y elimina también la fila visual vacía', () => {
  const css = read('components/HomeTodayDynamic.module.css')

  assert.match(css, /\.featureCardSlot:not\(:has\(\[data-home-visual-kind="photo"\]\)\)/)
  assert.match(css, /grid-column: 1 \/ -1 !important;/)
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\) !important;/)
  assert.match(css, /grid-template-rows: auto !important;/)
  assert.match(css, /min-height: 0 !important;/)
  assert.match(css, /> div:not\(\[data-home-visual-kind\]\)[\s\S]*grid-row: 1 !important;/)
  assert.match(css, /> \[data-home-visual-kind\]:not\(\[data-home-visual-kind="photo"\]\)[\s\S]*display: none !important;/)
  assert.match(css, /\+ \.sideColumnSlot[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/)
})

test('la caché pública se renueva con el nuevo contrato de rotación', () => {
  const snapshot = read('lib/supabase/home-snapshot.js')
  assert.match(snapshot, /hilo-cofrade-home-public-snapshot-v12/)
})
