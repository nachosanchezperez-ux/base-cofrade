import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sql = readFileSync(
  new URL(
    '../supabase/migrations_archive/post-first-edition-editorial/20260914130000_cierra_sabado_santo_sevilla.sql',
    import.meta.url,
  ),
  'utf8',
)

test('el Sábado Santo queda archivado como DML gobernado', () => {
  assert.equal((sql.match(/insert into public\./gi) ?? []).length, 206)
  assert.equal((sql.match(/insert into public\."source_links"/gi) ?? []).length, 57)
  assert.doesNotMatch(sql, /\b(create|alter|drop|truncate|grant|revoke)\b/i)
  assert.match(sql, /7fe7b65d-4f00-4d40-906f-82df8ee7c0a2/)
  assert.match(sql, /206\/206 · 199 insert · 7 update · 0 fallos/)
})

test('el cierre publica las tres fichas pendientes y preserva las dos certificadas', () => {
  assert.match(sql, /'Hermandad del Sol', 'hermandad-del-sol'/)
  assert.match(sql, /'El Santo Entierro', 'santo-entierro-sevilla'/)
  assert.match(sql, /'La Soledad de San Lorenzo', 'la-soledad-de-san-lorenzo'/)
  assert.doesNotMatch(sql, /'Hermandad de la Trinidad', 'hermandad-de-la-trinidad-sevilla'/)
  assert.doesNotMatch(sql, /'Los Servitas', 'servitas-sevilla'/)
})

test('la Soledad conserva el silencio como dato legítimo', () => {
  assert.match(sql, /La estación se desarrolla sin acompañamiento musical/)
  assert.doesNotMatch(sql, /insert into public\."music_accompaniment_periods"[\s\S]{0,500}'1e85ab84-d074-49be-803c-b26201b20561'/i)
})
