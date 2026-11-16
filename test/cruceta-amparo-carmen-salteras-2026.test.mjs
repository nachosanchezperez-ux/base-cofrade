import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20261116074500_publica_cruceta_amparo_carmen_salteras_2026.sql', import.meta.url),
  'utf8',
)

test('publica la cruceta del Amparo en el orden real documentado', () => {
  assert.match(migration, /42 obras y 45 interpretaciones/i)
  assert.match(migration, /el orden de la fuente es el orden real de interpretación/i)
  assert.match(migration, /\(1,'bendita-seas-dulce-madre-del-amparo-romero-gonzalez'/i)
  assert.match(migration, /\(42,'reina-de-todos-los-santos-jose-manuel-delgado'/i)
  assert.match(migration, /display_order=1 and march\.slug='bendita-seas-dulce-madre-del-amparo-romero-gonzalez'/i)
  assert.match(migration, /display_order=42 and march\.slug='reina-de-todos-los-santos-jose-manuel-delgado'/i)
})

test('conserva exactamente las multiplicidades publicadas', () => {
  assert.match(migration, /'amparame-francisco-javier-moreno-ramos','¡Ampárame!','Francisco Javier Moreno Ramos',2/i)
  assert.match(migration, /'bajo-tu-amparo-ruben-jordan-flores','Bajo tu Amparo','Rubén Jordán Flores',3/i)
  assert.match(migration, /sum\(performance_count\).*<> 45/is)
  assert.match(migration, /performance_count>1\) <> 2/i)
})

test('resuelve los homónimos mediante obra y autor correctos', () => {
  assert.match(migration, /'amparo-pedro-morales-munoz','Amparo','Pedro Morales Muñoz'/i)
  assert.match(migration, /'virgen-del-amparo-jose-martinez-peralto','Virgen del Amparo','José Martínez Peralto'/i)
  assert.match(migration, /'desamparo-german-alvarez-beigbeder','Desamparo','Germán Álvarez Beigbeder'/i)
  assert.match(migration, /'cristo-de-la-sangre-emilio-cebrian','Cristo de la Sangre','Emilio Cebrián Ruiz'/i)
  assert.doesNotMatch(migration, /'desamparo-cristobal-lopez-gandara'.*display_title/is)
  assert.doesNotMatch(migration, /'cristo-de-la-sangre-(?:campano|albero)'.*display_title/is)
})

test('vincula fecha, paso, Banda, fuente y paleta de las láminas', () => {
  assert.match(migration, /outing\.slug='sevilla-amparo-2026'/i)
  assert.match(migration, /date '2026-11-15'/i)
  assert.match(migration, /'paso-nuestra-senora-amparo-sevilla'/i)
  assert.match(migration, /'carmen-de-salteras'/i)
  assert.match(migration, /'Repertorio interpretado · Amparo Coronada 2026'/i)
  assert.match(migration, /'#3A2215','#C28A16','published'/i)
})

test('la publicación es idempotente y no elimina datos', () => {
  assert.match(migration, /on conflict\(slug\) do update/i)
  assert.match(migration, /on conflict\(repertoire_id,march_entity_id\) do update/i)
  assert.doesNotMatch(migration, /\bdelete\s+from\b/i)
})
