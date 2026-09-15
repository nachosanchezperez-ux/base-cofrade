import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const sql = readFileSync('supabase/migrations_archive/post-first-edition-editorial/20260915160000_cierra_glorias_octubre_sevilla.sql', 'utf8')

test('Glorias de octubre usa el lote propio y solo DML', () => {
  assert.match(sql, /c0160022-0000-4000-8000-000000000001/)
  assert.doesNotMatch(sql, /create\s+table|alter\s+table|create\s+policy|drop\s+policy/i)
})

test('el censo de octubre conserva quince identidades canónicas', () => {
  const censusLinks = sql.match(/Censo institucional · Glorias de octubre/g) ?? []
  assert.equal(censusLinks.length, 15)
  for (const slug of [
    'hermandad-virgen-cabeza-sevilla', 'rosario-barrio-leon-sevilla',
    'pilar-san-pedro-sevilla', 'rosario-humeros-sevilla', 'rosario-san-julian-sevilla',
    'virgen-sierra-sevilla', 'montemayor-sevilla',
  ]) assert.match(sql, new RegExp(slug))

  for (const canonicalId of [
    'c1000000-0000-0000-0000-000000000002', // La Cena / Encarnación
    '48ee9020-71ed-473e-8693-34809f2d083c', // Sagrada Lanzada / Divina Enfermera
    'b277068e-92e4-425d-8768-bff9e58ff1c9', // Madre de Dios del Rosario
    'dc7f2757-ed02-4cd6-a0e0-ef112d5b6515', // Las Aguas / Rosario de Dos de Mayo
    'd53478f8-3826-4bc8-a264-39ce3b8171da', // Guadalupe
    '55087e87-9fe7-4f8b-9a01-0fe8c3142751', // Nieves
    '9da8a301-5014-4783-b143-88261934f22b', // Macarena / Rosario
    '417a2bc3-0396-435f-af3f-44e2cb711c86', // El Sol / Salud
  ]) assert.match(sql, new RegExp(canonicalId))
})

test('las siete salidas de 2026 permanecen anunciadas', () => {
  const announced = sql.match(/'announced'/g) ?? []
  assert.equal(announced.length, 7)
  assert.doesNotMatch(sql, /'2026-10-(03|04|10|12)'[^;]*'held'/)
  for (const slug of [
    'gloria-cabeza-2026', 'gloria-divina-enfermera-2026', 'gloria-encarnacion-2026',
    'gloria-barrio-leon-2026', 'gloria-humeros-2026', 'gloria-pilar-2026',
    'gloria-madre-dios-2026',
  ]) assert.match(sql, new RegExp(slug))
})

test('los Rosarios homónimos quedan identificados por sede y corporación', () => {
  assert.match(sql, /Rosario del Barrio León/)
  assert.match(sql, /Rosario de los Humeros/)
  assert.match(sql, /Rosario de San Julián/)
  assert.match(sql, /dc7f2757-ed02-4cd6-a0e0-ef112d5b6515/)
  assert.match(sql, /9da8a301-5014-4783-b143-88261934f22b/)
})
