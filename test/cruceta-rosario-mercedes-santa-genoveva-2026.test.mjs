import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260927204551_publica_cruceta_rosario_mercedes_santa_genoveva_2026.sql', import.meta.url),
  'utf8'
)

test('la cruceta se vincula con Santa Genoveva, el Rosario y Carmen de Salteras', () => {
  assert.match(sql, /'sevilla-santa-genoveva-mercedes-rosario-2026-09-27'/)
  assert.match(sql, /date '2026-09-27'/)
  assert.match(sql, /'santa-genoveva'/)
  assert.match(sql, /'nuestra-senora-mercedes-coronada-santa-genoveva'/)
  assert.match(sql, /'carmen-de-salteras'/)
  assert.match(sql, /'santa-genoveva-rosario-mercedes-carmen-salteras-2026'/)
})

test('el repertorio pertenece solo al tramo de regreso de Carmen de Salteras', () => {
  assert.match(sql, /'Regreso del Rosario de la Aurora'/)
  assert.match(sql, /exclusivamente al regreso acompañado por Carmen de Salteras/)
  assert.match(sql, /la ida con el Coro Nuestra Señora de las Mercedes conserva su relación independiente/)
})

test('la lámina conserva 12 obras y 13 interpretaciones', () => {
  assert.match(sql, /debe contener 12 obras distintas/)
  assert.match(sql, /debe sumar 13 interpretaciones/)
  assert.match(sql, /'reina-de-las-mercedes-juan-velazquez', 'Reina de las Mercedes', 'Juan Velázquez Sánchez', 2/)
})

test('la repetición no se convierte en consecutividad ni cronología inventadas', () => {
  assert.match(sql, /×2 expresa únicamente dos interpretaciones documentadas/)
  assert.match(sql, /sin deducir que las interpretaciones fueran consecutivas/)
  assert.match(sql, /no una cronología del recorrido/)
  assert.doesNotMatch(sql, /consecutive/i)
})

test('las homonimias se resuelven mediante título y autor', () => {
  assert.match(sql, /'la-virgen-de-las-mercedes-pedro-galvez', 'La Virgen de las Mercedes'/)
  assert.match(sql, /'virgen-de-las-mercedes-manuel-marvizon', 'Virgen de las Mercedes'/)
  assert.match(sql, /'virgen-macarena-francisco-javier-alonso-delgado', 'Virgen Macarena'/)
  assert.match(sql, /se reutiliza la ficha canónica Javier Alonso Delgado/)
})

test('las marchas incorporan autorías y dedicatorias documentadas', () => {
  assert.match(sql, /insert into public\.march_authors/)
  assert.match(sql, /insert into public\.march_dedications/)
  assert.match(sql, /'mercedes-cristobal-lopez-gandara', 'nuestra-senora-mercedes-coronada-santa-genoveva'/)
  assert.match(sql, /'coronacion-puntas-marvizon', 'nuestra-senora-dolores-cerro-aguila'/)
})

test('dos pistas ya catalogadas de Carmen quedan enlazadas para escucha', () => {
  assert.match(sql, /update public\.band_release_tracks track/)
  assert.match(sql, /'La Virgen de las Mercedes', 'la-virgen-de-las-mercedes-pedro-galvez'/)
  assert.match(sql, /'La Virgen del Carmen', 'la-virgen-del-carmen-rafael-wals-dantas'/)
})
