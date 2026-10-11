import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20261007141226_publica_crucetas_panaderos_santa_lucia_2026.sql', import.meta.url), 'utf8')

test('vincula las dos Hermandades, salidas, pasos y Bandas canónicas', () => {
  assert.match(sql, /'hermandad-de-los-panaderos'/)
  assert.match(sql, /'sevilla-regla-coronada-2026'/)
  assert.match(sql, /'paso-palio-regla-coronada-panaderos'/)
  assert.match(sql, /'banda-musica-santa-ana-dos-hermanas'/)
  assert.match(sql, /'santa-lucia-sevilla'/)
  assert.match(sql, /'santa-lucia-sevilla-procesion-2026-10-04'/)
  assert.match(sql, /'paso-santa-lucia-sevilla'/)
  assert.match(sql, /'banda-musica-liceo-sevilla'/)
  assert.match(sql, /date '2026-10-04'/)
})

test('la identidad pública prima Hermandad, fecha y Banda', () => {
  assert.match(sql, /Los Panaderos · 4 de octubre de 2026 · Santa Ana de Dos Hermanas/)
  assert.match(sql, /Santa Lucía · 4 de octubre de 2026 · Liceo de Sevilla/)
  assert.doesNotMatch(sql, /Estación de penitencia/)
})

test('Panaderos conserva 25 obras, 27 interpretaciones y el tramo de regreso', () => {
  assert.match(sql, /debe contener 25 obras/)
  assert.match(sql, /debe sumar 27 interpretaciones/)
  assert.match(sql, /'Himno Nacional', 'Bartolomé Pérez Casas \/ Francisco Grau', 2/)
  assert.match(sql, /'Madre de Regla Coronada', 'José Núñez Mayoral', 2/)
  assert.match(sql, /assignment\.segment_start_label = 'Convento de San Leandro'/)
  assert.match(sql, /assignment\.segment_end_label = 'Capilla de San Andrés'/)
  assert.match(sql, /no presupone consecutividad/)
})

test('Santa Lucía conserva 33 obras y 33 interpretaciones', () => {
  assert.match(sql, /debe contener 33 obras/)
  assert.match(sql, /debe sumar 33 interpretaciones/)
  assert.match(sql, /'himno-a-santa-lucia-javier-calvo-gavino'/)
  assert.match(sql, /'virgen-de-los-estudiantes-abel-moreno'/)
  assert.match(sql, /'y-te-corono-sevilla-d-segado', 'Y Te Coronó Sevilla', 'David Segado Ramírez'/)
})

test('reutiliza obras canónicas, autorías y homónimos sin inventar dedicatorias', () => {
  assert.match(sql, /insert into public\.march_authors/)
  assert.doesNotMatch(sql, /insert into public\.march_dedications/)
  assert.match(sql, /'macarena-abel-moreno'/)
  assert.match(sql, /no a sus homónimas/)
  assert.match(sql, /'coronacion-puntas-marvizon'/)
  assert.match(sql, /'coronacion-de-la-macarena-pedro-brana'/)
})
