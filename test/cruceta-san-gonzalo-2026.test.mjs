import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(
  new URL('../supabase/migrations_archive/post-first-edition-editorial/20260914235000_publica_cruceta_san_gonzalo_2026.sql', import.meta.url),
  'utf8'
)

test('la cruceta se vincula con San Gonzalo, el palio, la salida y Santa Ana', () => {
  assert.match(sql, /'hermandad-de-san-gonzalo'/)
  assert.match(sql, /'paso-palio-virgen-salud-san-gonzalo'/)
  assert.match(sql, /'estacion-penitencia-san-gonzalo-2026'/)
  assert.match(sql, /date '2026-03-30'/)
  assert.match(sql, /'banda-musica-santa-ana-dos-hermanas'/)
  assert.match(sql, /'virgen-salud-san-gonzalo-lunes-santo-2026'/)
})

test('las dos láminas conservan 66 obras y 80 menciones interpretadas', () => {
  assert.match(sql, /debe contener 66 obras distintas/)
  assert.match(sql, /debe sumar 80 menciones interpretadas/)
  assert.match(sql, /'salve-nuestra-senora-salud-romero-gomez', 'Salve a Ntra\. Sra\. de la Salud', 'Rafael Romero Foncubierta y David Gómez Ramírez', 4/)
  assert.match(sql, /'marcha-la-salud-en-triana', 'La Salud en Triana', 'Joaquín Eligio y José Colomé', 3/)
})

test('las repeticiones no se convierten en una cronología inventada', () => {
  assert.match(sql, /sin deducir orden, punto del recorrido ni consecutividad/)
  assert.doesNotMatch(sql, /consecutive/i)
})

test('las variantes y créditos dudosos se preservan sin sobrescribir el catálogo', () => {
  assert.match(sql, /«La Gloria del Pueblo» se reconcilia con «La Gloria de un Pueblo»/)
  assert.match(sql, /'El Día del Señor', 'Alfonso Pérez', 2/)
  assert.match(sql, /la ficha canónica mantiene la autoría catalogada/)
  assert.match(sql, /'Virgen Coronada de Estrellas', 'Manuel Rebollo Orden'/)
})

test('la lámina ajena de Pasión no forma parte de esta carga', () => {
  assert.doesNotMatch(sql, /Hermandad de Pasión/)
  assert.doesNotMatch(sql, /Martes Santo/)
  assert.doesNotMatch(sql, /69 chicotás/)
})
