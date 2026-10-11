import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20261008010014_publica_cruceta_divina_enfermera_paz_malaga_2026.sql', import.meta.url), 'utf8')

test('vincula Lanzada, salida, titular, paso y Banda de la Paz de Málaga', () => {
  assert.match(sql, /'hermandad-sagrada-lanzada'/)
  assert.match(sql, /'gloria-divina-enfermera-2026'/)
  assert.match(sql, /'nuestra-senora-esperanza-divina-enfermera'/)
  assert.match(sql, /'paso-procesional-divina-enfermera'/)
  assert.match(sql, /'banda-musica-nuestra-senora-paz-malaga'/)
  assert.match(sql, /date '2026-10-03'/)
})

test('la identidad pública prima Hermandad, fecha y Banda', () => {
  assert.match(sql, /La Sagrada Lanzada · 3 de octubre de 2026 · Banda de Música Nuestra Señora de la Paz de Málaga/)
  assert.doesNotMatch(sql, /Estación de penitencia/)
})

test('reproduce la paleta azul, blanca y arena de la lámina original', () => {
  assert.match(sql, /'#061B3A'/)
  assert.match(sql, /'#FFFFFF'/)
  assert.match(sql, /'#D6BF91'/)
  assert.match(sql, /primary_color, accent_color/)
})

test('conserva 27 obras, 28 interpretaciones y una sola multiplicidad', () => {
  assert.match(sql, /debe contener 27 obras/)
  assert.match(sql, /debe sumar 28 interpretaciones/)
  assert.match(sql, /exactamente una multiplicidad ×2/)
  assert.match(sql, /'Coronación de la Macarena', 'Pedro Braña', 2/)
  assert.match(sql, /×2 no presupone consecutividad/)
})

test('distingue los homónimos por autor', () => {
  assert.match(sql, /'amparo-alfonso-lopez-cortes'/)
  assert.match(sql, /'macarena-emilio-cebrian'/)
  assert.match(sql, /no a sus homónimas/)
  assert.doesNotMatch(sql, /'macarena-abel-moreno', '¡Macarena!'/)
})

test('incorpora las obras ausentes con sus autorías documentadas', () => {
  assert.match(sql, /'Esperanza, Divina Enfermera'/)
  assert.match(sql, /'Tras tu verde manto'/)
  assert.match(sql, /'Regina Pacis'/)
  assert.match(sql, /'Carmen Coronada'/)
  assert.match(sql, /'Auxilium Christianorum'/)
  assert.match(sql, /'La Estrella Trianera'/)
  assert.match(sql, /insert into public\.march_authors/)
})

test('documenta la dedicatoria propia sin inferir las demás', () => {
  assert.match(sql, /insert into public\.march_dedications/)
  assert.match(sql, /Nuestra Señora de la Esperanza Divina Enfermera/)
  assert.match(sql, /date '1980-01-01'/)
  assert.match(sql, /Directorio diocesano · Esperanza Divina Enfermera/)
})

test('separa la lámina, la identidad de la banda y el acompañamiento', () => {
  assert.match(sql, /Repertorio interpretado · Esperanza Divina Enfermera 2026/)
  assert.match(sql, /La Paz Málaga · Quiénes somos/)
  assert.match(sql, /ArteSacro · Salida procesional de la Esperanza Divina Enfermera 2026/)
  assert.match(sql, /'Repertorio interpretado'/)
  assert.match(sql, /'Acompañamiento musical'/)
})
