import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(
  new URL('../supabase/migrations/20260902111558_completa_dedicatoria_hijo_esperanza_y_certifica_redencion.sql', import.meta.url),
  'utf8',
)

test('relaciona El Hijo de la Esperanza con el Cristo de las Cinco Llagas y la Trinidad', () => {
  assert.match(migration, /marcha-el-hijo-de-la-esperanza/)
  assert.match(migration, /Santísimo Cristo de las Cinco Llagas de la Hermandad de la Trinidad/)
  assert.match(migration, /hermandad-de-la-trinidad-sevilla/)
  assert.match(migration, /march_dedications/)
  assert.match(migration, /oficialtrescaidasdetriana/)
})

test('cierra los históricos documentados de Redención y conserva Huévar como pendiente real', () => {
  assert.match(migration, /year_from = 2006[\s\S]*Hermandad de Monte-Sión'/)
  assert.match(migration, /year_from = 2008[\s\S]*Hermandad de la Milagrosa'/)
  assert.match(migration, /La fecha de inicio está pendiente de documentación/)
})

test('normaliza la voz de los estrenos sin perder su taxonomía', () => {
  assert.match(migration, /Tipo de novedad: estreno absoluto\. Dedicada al Señor de la Humildad/)
  assert.match(migration, /Tipo de novedad: adaptación\. Versión para agrupación musical/)
  assert.match(migration, /Tipo de novedad: estreno por la formación/)
  assert.doesNotMatch(migration, /Tipo de novedad: estreno absoluto\. Estreno absoluto/)
  assert.doesNotMatch(migration, /Tipo de novedad: adaptación\. Estreno por La Redención/)
})

test('añade relaciones de dedicatoria solo hacia nodos canónicos identificados', () => {
  assert.match(migration, /hermandad-cerro-del-aguila-sevilla/)
  assert.match(migration, /hermandad-sacramental-tomares/)
  assert.match(migration, /agrupacion-parroquial-humildad-sevilla-este/)
  assert.match(migration, /jesus-salud-remedios-bellavista/)
  assert.match(migration, /hermandad-santa-cruz-victoria-cristo-paterna-campo/)
})

test('protege la discografía certificada de Redención', () => {
  assert.match(migration, /<> 12/)
  assert.match(migration, /<> 149/)
  assert.doesNotMatch(migration, /create\s+table/i)
  assert.doesNotMatch(migration, /alter\s+table/i)
  assert.doesNotMatch(migration, /create\s+policy/i)
})
