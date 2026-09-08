import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(
  new URL('../supabase/migrations/20260908160553_incorpora_pasion_linares_y_esencia.sql', import.meta.url),
  'utf8'
)

test('publica Pasión de Linares y Esencia como bandas canónicas', () => {
  assert.match(migration, /'agrupacion-musical-pasion-de-linares'/)
  assert.match(migration, /'banda-cornetas-tambores-esencia-sevilla'/)
  assert.match(migration, /'Agrupación Musical Nuestro Padre Jesús de la Pasión de Linares'/)
  assert.match(migration, /'Banda de Cornetas y Tambores Esencia'/)
  assert.match(migration, /insert into public\.bands/)
  assert.match(migration, /insert into public\.band_names/)
})

test('documenta las tres relaciones solicitadas con cronología explícita', () => {
  assert.match(migration, /'santa-genoveva',[\s\S]*?'Lunes Santo',[\s\S]*?'Desde 2019',[\s\S]*?2019/)
  assert.match(migration, /'carmen-doloroso',[\s\S]*?'Miércoles Santo',[\s\S]*?'Desde 2022',[\s\S]*?2022,[\s\S]*?'Hasta 2026',[\s\S]*?2026,[\s\S]*?false/)
  assert.match(migration, /'siete-palabras-sevilla',[\s\S]*?'Miércoles Santo',[\s\S]*?'Desde 2011',[\s\S]*?2011/)
})

test('El Carmen no queda presentado como contrato vigente de 2027', () => {
  assert.match(migration, /brotherhood\.slug = 'carmen-doloroso'[\s\S]*?period\.year_to = 2026[\s\S]*?not period\.is_current/)
  assert.match(migration, /El Carmen no puede figurar como acompañamiento futuro/)
})

test('el lote respeta el First Edition Freeze y exige fuentes', () => {
  assert.doesNotMatch(migration, /\b(?:create|alter|drop)\s+table\s+public\./i)
  assert.match(migration, /insert into public\.source_links/)
  assert.match(migration, /Alguna relación musical nueva quedó sin fuente/)
})
