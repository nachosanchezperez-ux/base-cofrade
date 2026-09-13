import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260913193000_publica_cruceta_castillo_lebrija_2026.sql', import.meta.url),
  'utf8'
)

test('la cruceta del Castillo se vincula con la salida, la Hermandad y una Banda canónica', () => {
  assert.match(sql, /brotherhood\.slug = 'castillo-lebrija'/)
  assert.match(sql, /outing\.outing_date = date '2026-09-12'/)
  assert.match(sql, /'banda-musica-virgen-castillo-lebrija'/)
  assert.match(sql, /set band_entity_id = band\.id,[\s\S]*band_name_text = null/)
  assert.match(sql, /'virgen-castillo-lebrija-procesion-2026'/)
})

test('la fuente conserva 26 obras y no inventa repeticiones', () => {
  assert.match(sql, /La fuente no indica repeticiones, orden cronológico ni puntos del recorrido/)
  assert.match(sql, /Todas las obras se registran con una interpretación/)
  assert.match(sql, /<> 26/)
  assert.match(sql, /1, seed\.display_order/)
  assert.doesNotMatch(sql, /consecutive|consecutiv/i)
})

test('los homónimos y las marchas propias conservan autoría y slug distintos', () => {
  assert.match(sql, /'macarena-emilio-cebrian', '¡Macarena!', 'Emilio Cebrián Ruiz'/)
  assert.match(sql, /'macarena-abel-moreno', 'Macarena', 'Abel Moreno Gómez'/)
  assert.match(sql, /'castillo-coronada-francisco-manuel-lopez'/)
  assert.match(sql, /'madre-del-castillo-coronada-jose-maria-dorantes'/)
  assert.match(sql, /'patrona-lebrija-coronada-abel-moreno'/)
  assert.match(sql, /'virgen-del-castillo-coronada-fulgencio-moron'/)
})
