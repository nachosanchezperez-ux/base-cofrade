import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20261007233320_publica_cruceta_lagrimas_puebla_gerena_2026.sql', import.meta.url), 'utf8')

test('vincula Hermandad, salida, imagen, Banda y regreso canónicos', () => {
  assert.match(sql, /'jesus-nazareno-la-puebla-de-cazalla'/)
  assert.match(sql, /'la-puebla-cazalla-lagrimas-rosario-aurora-2026-10-04'/)
  assert.match(sql, /'maria-santisima-lagrimas-la-puebla-de-cazalla'/)
  assert.match(sql, /'banda-municipal-musica-gerena'/)
  assert.match(sql, /'Regreso tras el Rosario de la Aurora'/)
  assert.match(sql, /date '2026-10-04'/)
})

test('la identidad pública prima Hermandad, fecha y Banda', () => {
  assert.match(sql, /Hermandad de Jesús Nazareno · 4 de octubre de 2026 · Banda Municipal de Música de Gerena/)
  assert.doesNotMatch(sql, /Estación de penitencia/)
})

test('conserva 29 obras, 31 interpretaciones y solo dos multiplicidades', () => {
  assert.match(sql, /debe contener 29 obras/)
  assert.match(sql, /debe sumar 31 interpretaciones/)
  assert.match(sql, /exactamente dos multiplicidades ×2/)
  assert.match(sql, /'Virgen de las Lágrimas', 'P\. López', 2/)
  assert.match(sql, /'El Día del Señor', 'A\. López', 2/)
  assert.match(sql, /×2 no presupone consecutividad/)
})

test('reutiliza las marchas canónicas y separa los homónimos', () => {
  assert.match(sql, /'coronacion-puntas-marvizon'/)
  assert.match(sql, /'coronacion-de-la-macarena-pedro-brana'/)
  assert.match(sql, /'macarena-abel-moreno'/)
  assert.match(sql, /no a sus homónimas/)
  assert.match(sql, /'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda'/)
})

test('documenta autorías propias y la dedicatoria a la Virgen de las Lágrimas', () => {
  assert.match(sql, /'Jesús Moreno Núñez'/)
  assert.match(sql, /'Pablo Jiménez Jiménez'/)
  assert.match(sql, /'Pedro López'/)
  assert.match(sql, /insert into public\.march_authors/)
  assert.match(sql, /insert into public\.march_dedications/)
  assert.match(sql, /'Lágrimas de Estrella'/)
  assert.match(sql, /'Himno a la Virgen de las Lágrimas'/)
  assert.match(sql, /1989/)
})

test('mantiene separadas la lámina interpretada y la fuente diocesana', () => {
  assert.match(sql, /Repertorio interpretado · Rosario extraordinario de María Santísima de las Lágrimas 2026/)
  assert.match(sql, /Directorio diocesano · Jesús Nazareno de La Puebla de Cazalla/)
  assert.match(sql, /'Repertorio interpretado'/)
  assert.match(sql, /'Autoría y dedicatoria musical'/)
})
