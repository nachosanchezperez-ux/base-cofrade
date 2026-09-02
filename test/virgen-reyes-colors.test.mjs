import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(
  new URL('../supabase/migrations/20260902082445_corrige_colores_virgen_reyes.sql', import.meta.url),
  'utf8',
)

test('Virgen de los Reyes publica únicamente negro, dorado y rojo', () => {
  assert.match(migration, /'Negro', '#111111', 'primary'/)
  assert.match(migration, /'Dorado', '#C5A253', 'secondary'/)
  assert.match(migration, /'Rojo', '#B51F2E', 'accent'/)
  assert.match(migration, /primary_color = '#111111'/)
  assert.match(migration, /secondary_color = '#C5A253'/)
  assert.match(migration, /count\(\*\)[\s\S]*<> 3/)
  assert.doesNotMatch(migration, /Oro viejo|Beige dorado|Blanco/)
})
