import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20261019103722_publica_cruceta_rosario_san_julian_guillena_2026.sql', import.meta.url), 'utf8')

test('San Julián conserva Hermandad, fecha, Banda, paso y paleta de la fuente', () => {
  assert.match(migration, /rosario-san-julian-procesion-2026/)
  assert.match(migration, /date '2026-10-18'/)
  assert.match(migration, /banda-musica-villa-guillena/)
  assert.match(migration, /paso-rosario-san-julian-sevilla/)
  assert.match(migration, /'#2C1D53','#8C342C'/)
})

test('la lámina conserva 26 obras, 26 interpretaciones y ninguna multiplicidad', () => {
  assert.match(migration, /<> 26/)
  assert.match(migration, /sum\(performance_count\)[^;]+<> 26/s)
  assert.match(migration, /performance_count<>1/)
  assert.match(migration, /Pasacalles documentado por la fuente/)
})

test('la autoría anónima se conserva como crédito sin crear una persona ficticia', () => {
  assert.match(migration, /'en-tus-manos-consolacion-anonimo','En tus manos, Consolación','Anónimo'/)
  assert.doesNotMatch(migration, /'Anónimo','anonimo'/)
})

test('las marchas propias de San Julián quedan vinculadas a su titular', () => {
  assert.match(migration, /rosario-reina-san-julian-juan-dios-espinosa','imagen-rosario-san-julian-sevilla/)
  assert.match(migration, /rosario-san-julian-javier-alonso-barba','imagen-rosario-san-julian-sevilla/)
})
