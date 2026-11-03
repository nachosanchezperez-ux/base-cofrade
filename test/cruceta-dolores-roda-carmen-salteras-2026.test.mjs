import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL(
  '../supabase/migrations_archive/post-first-edition-editorial/20261102230000_publica_cruceta_dolores_roda_carmen_salteras_2026.sql',
  import.meta.url,
), 'utf8')

test('publica la cruceta de Dolores Coronada con sus 15 obras sin inventar orden', () => {
  assert.match(migration, /dolores-coronada-roda-carmen-salteras-2026/)
  assert.match(migration, /<> 15/)
  assert.match(migration, /sum\(performance_count\).*<> 15/s)
  assert.match(migration, /la disposición de las láminas no se presenta como orden procesional/i)
})

test('conserva la intervención parcial de Carmen desde la calle Erillas', () => {
  assert.match(migration, /participation_mode,sequence_no,segment_start_label,segment_end_label/)
  assert.match(migration, /'segment',1,'Calle Erillas','Parroquia de Santa Ana'/)
  assert.match(migration, /tras las andas de María Santísima de los Dolores Coronada/i)
})

test('distingue la instrumentación de Dolorosa La Roda de una composición', () => {
  assert.match(migration, /dolorosa-la-roda-instrumentacion-pedro-morales/)
  assert.match(migration, /'arranger','Instrumentación atribuida expresamente a Pedro Morales Muñoz/)
  assert.match(migration, /macarena-emilio-cebrian/)
})

test('documenta fuente directa, fuente de contraste y paleta editorial', () => {
  assert.match(migration, /Repertorio musical · Dolores Coronada de La Roda 2026/)
  assert.match(migration, /artesacro\.org\/Noticia\/Ver\/169730/)
  assert.match(migration, /'#2B1D15','#B48A2B','published'/)
})
