import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260923163000_publica_cruceta_carmen_estepa_2026.sql', import.meta.url),
  'utf8'
)

test('la cruceta se vincula con el Carmen de Estepa, su paso y la Banda de Música de Estepa', () => {
  assert.match(sql, /'estepa-carmen-2026-09-12'/)
  assert.match(sql, /date '2026-09-12'/)
  assert.match(sql, /'paso-carmen-estepa'/)
  assert.match(sql, /'banda-musica-estepa'/)
  assert.match(sql, /'virgen-carmen-estepa-procesion-2026'/)
})

test('el carrusel completo de tres láminas conserva 28 obras y 28 interpretaciones', () => {
  assert.match(sql, /Carrusel oficial completo de tres láminas/)
  assert.match(sql, /debe contener 28 obras distintas/)
  assert.match(sql, /debe sumar 28 interpretaciones/)
  assert.match(sql, /\(28, 'himno-nacional-espana', 'Himno Nacional'/)
})

test('la fuente no se transforma en una cronología ni en multiplicidades inventadas', () => {
  assert.match(sql, /sin deducir orden cronológico, punto del recorrido, chicotá ni consecutividad/)
  assert.doesNotMatch(sql, /, [2-9], (null|'[^']*')\)/)
})

test('las homonimias y los créditos literales se conservan sin duplicar obras', () => {
  assert.match(sql, /'macarena-emilio-cebrian', 'Macarena', 'Emilio Cebrián Ruiz'/)
  assert.doesNotMatch(sql, /'macarena-abel-moreno', 'Macarena'/)
  assert.match(sql, /'Esperanza de Triana Coronada', 'José Alberto Francés'/)
  assert.match(sql, /autor canónico José Albero Francés/)
})

test('las marchas se relacionan con autorías y dedicatorias documentadas', () => {
  assert.match(sql, /insert into public\.march_authors/)
  assert.match(sql, /'salve-cristobal-oudrid-juan-antonio-carmona', 'Juan Antonio Carmona Páez', 'arranger'/)
  assert.match(sql, /insert into public\.march_dedications/)
  assert.match(sql, /'esperanza-del-cielo-francisco-javier-sojo', 'maria-santisima-esperanza-coronada-estepa'/)
})

test('tres pistas de la Banda quedan enlazadas para su escucha', () => {
  assert.match(sql, /update public\.band_release_tracks track/)
  assert.match(sql, /'Danos la Paz', 'danos-la-paz-jesus-joaquin-espinosa'/)
  assert.match(sql, /'Esperanza Del Cielo', 'esperanza-del-cielo-francisco-javier-sojo'/)
  assert.match(sql, /'Procesión de Semana Santa en Sevilla', 'procesion-de-semana-santa-en-sevilla-pascual-marquina'/)
})
