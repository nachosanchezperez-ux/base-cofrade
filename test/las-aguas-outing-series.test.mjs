import fs from 'node:fs'
import assert from 'node:assert/strict'
import test from 'node:test'

const migration = fs.readFileSync(
  new URL('../supabase/migrations/20260906215000_completa_salidas_habituales_las_aguas.sql', import.meta.url),
  'utf8'
)

test('Las Aguas publica sus salidas habituales de Penitencia y Gloria', () => {
  assert.match(migration, /'Estación de penitencia'/)
  assert.match(migration, /'Estación de penitencia del Lunes Santo'/)
  assert.match(migration, /'Procesión de Gloria'/)
  assert.match(migration, /'Procesión de gloria de Nuestra Señora del Rosario'/)
  assert.match(migration, /'Octubre, en torno a la festividad de Nuestra Señora del Rosario'/)
})

test('las dos series quedan trazadas a fuentes institucionales', () => {
  assert.match(migration, /insert into public\.source_links/)
  assert.match(migration, /ls_las_aguas\.html/)
  assert.match(migration, /hermandades-de-gloria-que-procesionan-el-14-de-octubre/)
  assert.match(migration, /unsourced_count/)
})

test('el lote es solo DML sobre el modelo existente', () => {
  assert.doesNotMatch(migration, /\bcreate\s+table\b/i)
  assert.doesNotMatch(migration, /\balter\s+table\b/i)
  assert.doesNotMatch(migration, /\bcreate\s+policy\b/i)
  assert.doesNotMatch(migration, /\benable\s+row\s+level\s+security\b/i)
})
