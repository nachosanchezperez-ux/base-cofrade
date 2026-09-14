import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(
  new URL(
    '../supabase/migrations_archive/post-first-edition-editorial/20260914120000_cierra_madruga_sevilla.sql',
    import.meta.url,
  ),
  'utf8',
)

test('el macrolote de la Madrugá queda archivado como DML gobernado', () => {
  assert.equal((sql.match(/insert into public\./gi) ?? []).length, 262)
  assert.equal((sql.match(/insert into public\.source_links/gi) ?? []).length, 81)
  assert.doesNotMatch(sql, /\b(create|alter|drop|truncate|grant|revoke)\b/i)
  assert.doesNotMatch(sql, /insert into public\.bands/i)
  assert.match(sql, /96cc4393-fefa-4756-965b-8af1c0f59941/)
  assert.match(sql, /262\/262 · 257 insert · 5 update · 0 fallos/)
})

test('las seis Hermandades forman una única jornada sin duplicar Macarena ni Gran Poder', () => {
  assert.match(sql, /'El Silencio', 'el-silencio-sevilla'/)
  assert.match(sql, /'El Calvario', 'el-calvario-sevilla'/)
  assert.match(sql, /'Esperanza de Triana', 'hermandad-esperanza-de-triana-sevilla'/)
  assert.match(sql, /'Los Gitanos', 'hermandad-gitanos-sevilla'/)
  assert.doesNotMatch(sql, /'La Macarena', 'hermandad-de-la-macarena'/)
  assert.doesNotMatch(sql, /'Gran Poder', 'hermandad-del-gran-poder-sevilla'/)
  assert.equal((sql.match(/'Madrugada'/g) ?? []).length, 4)
})

test('el silencio procesional se conserva como dato y no como deuda musical', () => {
  assert.match(sql, /El silencio procesional es una característica documentada/)
  assert.match(sql, /La estación de penitencia se desarrolla sin acompañamiento musical/)
  assert.doesNotMatch(sql, /insert into public\.music_accompaniment_periods[\s\S]{0,500}f94f1ab8-b8e9-4a94-ace4-a0b6c6c1c4e5/i)
  assert.doesNotMatch(sql, /insert into public\.music_accompaniment_periods[\s\S]{0,500}6c50dc05-e054-4316-a046-900451467952/i)
})
