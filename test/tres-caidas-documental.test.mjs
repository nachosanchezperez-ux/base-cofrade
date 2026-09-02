import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migrationPath =
  'supabase/migrations/20260902104622_completa_tres_caidas_triana.sql'

const migration = readFileSync(new URL(`../${migrationPath}`, import.meta.url), 'utf8')

test('incorpora los periodos históricos documentados de Trinidad y San Pablo', () => {
  assert.match(migration, /year_from = 1987 and p\.year_to = 1991/)
  assert.match(migration, /year_from = 1992 and p\.year_to = 2024/)
  assert.match(migration, /hermandad-de-la-trinidad-sevilla/)
  assert.match(migration, /hermandad-de-san-pablo/)
})

test('normaliza la redacción pública sin borrar el contexto relevante', () => {
  assert.match(migration, /La banda es Hermana Honoraria de la Hermandad\./)
  assert.match(migration, /Estreno absoluto ante los titulares/)
  assert.doesNotMatch(migration, /Relación vigente en la Semana Santa de 2026/)
  assert.doesNotMatch(migration, /Fuente oficial de Tres Caídas de Triana/)
})

test('documenta la uniformidad de 2005 con fuente oficial', () => {
  assert.match(migration, /uniforme-tres-caidas-triana-2005/)
  assert.match(migration, /Estrenado en enero de 2005/)
  assert.match(migration, /trescaidasdetriana\.es\/historia\//)
})

test('mantiene en revisión el estreno de 1980 hasta completar su autoría', () => {
  assert.match(migration, /v_band, '1980', 'Autoría pendiente de documentar', 2025/)
  assert.match(migration, /v_source_1980, 'review'/)
})

test('añade canales oficiales y metadatos discográficos contrastados sin DDL', () => {
  assert.match(migration, /Apple Music oficial/)
  assert.match(migration, /YouTube oficial/)
  assert.match(migration, /Álbum de doce pistas publicado por Pasarela/)
  assert.match(migration, /Álbum de dieciséis pistas publicado por Pasarela/)
  assert.doesNotMatch(migration, /create\s+(table|policy|index)|alter\s+table/i)
})
