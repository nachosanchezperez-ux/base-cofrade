import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260921193000_publica_cruceta_sangre_gerena_2026.sql', import.meta.url),
  'utf8'
)

test('la cruceta se vincula con Vera-Cruz de Gerena, la salida, el paso y su Banda', () => {
  assert.match(sql, /'gerena-sangre-2026'/)
  assert.match(sql, /date '2026-09-12'/)
  assert.match(sql, /'paso-palio-sangre-gerena'/)
  assert.match(sql, /'banda-municipal-musica-gerena'/)
  assert.match(sql, /'virgen-sangre-gerena-coronacion-2026'/)
})

test('la lámina conserva los dos tramos, 48 obras y 59 menciones', () => {
  assert.match(sql, /9 en el traslado de ida y 50 en la procesión triunfal de regreso/)
  assert.match(sql, /debe contener 48 obras distintas/)
  assert.match(sql, /debe sumar 59 menciones interpretadas/)
  assert.match(sql, /'virgen-de-la-sangre-manuel-vizcaino', 'Virgen de la Sangre', 'M\. Vizcaíno', 3/)
  assert.match(sql, /'reina-de-gerena-coronada-manuel-jesus-castro', 'Reina de Gerena Coronada', 'M\. J\. Castro', 3/)
})

test('la multiplicidad no se convierte en una cronología inventada', () => {
  assert.match(sql, /sin deducir consecutividad, punto del recorrido ni chicotá/)
  assert.doesNotMatch(sql, /consecutive/i)
})

test('se preservan los créditos de la fuente y se reconcilia su errata', () => {
  assert.match(sql, /'Rocío', 'Vidriet y Tejera'/)
  assert.match(sql, /«Madre de los Cruceos de Gerena» se reconcilia con el título canónico «Madre de los Cruceros de Gerena»/)
  assert.match(sql, /'Madre de los Cruceros de Gerena', 'M\. Carrero'/)
})

test('las pistas ya catalogadas de la Banda quedan enlazadas para escucha', () => {
  assert.match(sql, /update public\.band_release_tracks track/)
  assert.match(sql, /set march_entity_id = march\.id/)
  assert.match(sql, /'Sangre Coronada', 'sangre-coronada-a-nogales'/)
  assert.match(sql, /'Reina de Gerena Coronada', 'reina-de-gerena-coronada-manuel-jesus-castro'/)
})
