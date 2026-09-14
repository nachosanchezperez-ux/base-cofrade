import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sqlUrl = new URL(
  '../supabase/migrations_archive/post-first-edition-editorial/20260914021602_cierra_sagrada_resurreccion_sevilla.sql',
  import.meta.url,
)
const sql = readFileSync(sqlUrl, 'utf8')

test('el decimotercer lote queda archivado como DML gobernado y completo', () => {
  assert.match(sql, /feb6f1c2-4df3-4208-a4d8-b808d97609e9/)
  assert.match(sql, /164\/164; 0 inválidos; 0 fallos/)
  assert.doesNotMatch(sql, /\b(?:create|alter|drop)\s+(?:table|policy|function|type|index)\b/i)
})

test('la Resurrección conserva sus cinco titulares y dos Pasos', () => {
  for (const name of [
    'Sagrada Resurrección de Nuestro Señor Jesucristo',
    'Nuestra Señora de la Aurora',
    'María Santísima del Amor',
    'Santa Marina',
    'San Juan Bautista de La Salle',
    'Paso de la Sagrada Resurrección',
    'Paso de palio de Nuestra Señora de la Aurora',
  ]) {
    assert.match(sql, new RegExp(name))
  }
})

test('los Cultos y la Salida de 2026 mantienen fechas y estados válidos', () => {
  assert.match(sql, /Triduo a Nuestra Señora de la Aurora/)
  assert.match(sql, /2026-09-05[\s\S]*2026-09-07/)
  assert.match(sql, /2026-09-08/)
  assert.match(sql, /2026-09-14/)
  assert.match(sql, /2026-09-24/)
  assert.match(sql, /2026-04-05[\s\S]*08:15[\s\S]*16:30/)
  assert.doesNotMatch(sql, /'celebrated'/)
})

test('la música distingue vigencias, históricos y el hueco juvenil legítimo', () => {
  assert.match(sql, /1983–1987/)
  assert.match(sql, /Desde 1989/)
  assert.match(sql, /1992 y 1993/)
  assert.match(sql, /1994 y 1995/)
  assert.match(sql, /desde 1996/i)
  assert.match(sql, /Vigente en 2026; inicio no determinado/)
  assert.match(sql, /no se fija año inicial no documentado/)
})

test('los canales usan el vocabulario canónico', () => {
  assert.match(sql, /'x', 'https:\/\/twitter\.com\/resurreccionsev\?lang=es'/)
  assert.match(sql, /'facebook'/)
  assert.match(sql, /'instagram'/)
  assert.match(sql, /'youtube'/)
  assert.doesNotMatch(sql, /'twitter'/)
})
