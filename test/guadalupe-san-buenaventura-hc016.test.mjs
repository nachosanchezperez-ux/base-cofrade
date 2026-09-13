import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260913161000_cierra_guadalupe_san_buenaventura.sql', import.meta.url),
  'utf8'
)

test('Guadalupe de San Buenaventura se cierra con DML editorial y sin tocar el esquema', () => {
  assert.doesNotMatch(migration, /\b(create|alter|drop)\s+(table|policy|function|trigger|type|index)\b/i)
  assert.match(migration, /Franciscana Hermandad de Nuestra Señora de Guadalupe/)
  assert.match(migration, /nuestra-senora-guadalupe-san-buenaventura/)
})

test('la titular conserva autoría, material, ubicación y relación procesional documentadas', () => {
  assert.match(migration, /Juan Abascal Fuentes/)
  assert.match(migration, /Madera de encina/)
  assert.match(migration, /capilla sacramental/i)
  assert.match(migration, /image_authorships/)
  assert.match(migration, /image_steps/)
})

test('el paso publica su ficha barroca y el taller de Guzmán Bejarano', () => {
  assert.match(migration, /Manuel Guzmán Bejarano/)
  assert.match(migration, /Madera de cedro real americano, terminada en pan de oro/)
  assert.match(migration, /Diseño, talla y dorado del paso/)
  assert.match(migration, /step_phase_agents/)
})

test('el calendario conserva únicamente las próximas convocatorias añadidas de 2026', () => {
  for (const date of ['2026-10-10', '2026-11-07', '2026-11-14', '2026-12-05']) {
    assert.match(migration, new RegExp(date))
  }
  assert.match(migration, /Misa mensual de Hermandad/)
  assert.match(migration, /Misa por los hermanos difuntos/)
  assert.match(migration, /Misa por las personas afectadas por el cáncer/)
})

test('la cronología pública reúne hitos oficiales sin fabricar fechas incompletas', () => {
  assert.match(migration, /Entronización de Nuestra Señora de Guadalupe/)
  assert.match(migration, /Abril de 1992/)
  assert.match(migration, /Concesión del título de Franciscana/)
  assert.match(migration, /Premio Guadalupe-Hispanidad 2023/)
  assert.doesNotMatch(migration, /date '1992-04-01'/)
})
