import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260913213359_publica_cruceta_pastora_padre_pio_2026.sql', import.meta.url),
  'utf8'
)

test('la cruceta de Padre Pío se vincula con Hermandad, paso, salida y Banda canónicos', () => {
  assert.match(sql, /slug = 'pastora-padre-pio'/)
  assert.match(sql, /'paso-procesional-divina-pastora-padre-pio'/)
  assert.match(sql, /date '2026-09-12'/)
  assert.match(sql, /'banda-musica-ciudad-dos-hermanas'/)
  assert.match(sql, /'divina-pastora-padre-pio-procesion-2026'/)
})

test('la fuente conserva el pasacalles y las 29 obras distintas', () => {
  assert.match(sql, /'ganando-barlovento-ramon-saez-adana', 'Ganando Barlovento'/)
  assert.match(sql, /debe contener 29 obras distintas/)
  assert.match(sql, /debe sumar 30 interpretaciones/)
})

test('el Himno Nacional suma dos apariciones sin inferir consecutividad', () => {
  assert.match(sql, /'himno-nacional-de-espana', 'Himno Nacional de España', null::text, 2/)
  assert.match(sql, /se conserva como ×2 sin deducir consecutividad/)
  assert.doesNotMatch(sql, /consecutive/i)
})

test('solo Macarena conserva la autoría que aparece en la lámina', () => {
  assert.match(sql, /'macarena-abel-moreno', 'Macarena', 'Abel Moreno'/)
  assert.match(sql, /'Coronación', null::text/)
  assert.match(sql, /'Triana', null::text/)
})
