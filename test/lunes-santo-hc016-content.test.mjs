import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20260914143000_cierra_lunes_santo_sevilla.sql', import.meta.url), 'utf8')

test('el Lunes Santo queda archivado como DML editorial', () => {
  assert.equal((sql.match(/insert into public\./gi) ?? []).length, 308)
  assert.equal((sql.match(/insert into public\."source_links"/gi) ?? []).length, 83)
  assert.doesNotMatch(sql, /\b(create|alter|drop|truncate|grant|revoke)\b/i)
})

test('publica las cuatro fichas ausentes y conserva las cinco certificadas', () => {
  for (const slug of ['hermandad-de-la-redencion', 'santa-genoveva', 'santa-marta-sevilla', 'vera-cruz-sevilla']) assert.match(sql, new RegExp(`'${slug}'`))
  for (const slug of ['hermandad-de-san-pablo', 'hermandad-de-san-gonzalo', 'las-penas-de-san-vicente', 'las-aguas-sevilla', 'el-museo']) assert.doesNotMatch(sql, new RegExp(`'${slug}'`))
})

test('preserva el silencio de Santa Marta y la música sacra de Vera+Cruz', () => {
  assert.match(sql, /La estación de penitencia se realiza en silencio/)
  assert.match(sql, /Capilla Musical Gólgota/)
  assert.match(sql, /capillamusicalgolgota\.blogspot\.com\/2011\/04\/semana-santa-2011\.html/)
  assert.doesNotMatch(sql, /santa-genoveva-ya-tiene-todas-bandas-confirmadas/)
  assert.match(sql, /b73f2543-4840-43af-ae52-06b116bebf67/)
  assert.doesNotMatch(sql, /music:santa-marta/)
})
