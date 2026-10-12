import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL('../supabase/migrations_archive/post-first-edition-editorial/20261012104552_publica_cruceta_rosario_santiponce_puebla_2026.sql', import.meta.url), 'utf8')
const loader = readFileSync(new URL('../lib/supabase/musical-repertoires.js', import.meta.url), 'utf8')
const directory = readFileSync(new URL('../app/crucetas-musicales/CrucetasDirectory.js', import.meta.url), 'utf8')
const explorer = readFileSync(new URL('../app/crucetas-musicales/[slug]/RepertoireExplorer.js', import.meta.url), 'utf8')

test('Santiponce conserva Hermandad, fecha, Banda, paso y paleta de la fuente', () => {
  assert.match(migration, /santiponce-rosario-coronada-2026-10-10/)
  assert.match(migration, /date '2026-10-10'/)
  assert.match(migration, /banda-municipal-de-musica-de-la-puebla-del-rio/)
  assert.match(migration, /paso-palio-rosario-coronada-santiponce/)
  assert.match(migration, /'#651F2A', '#D5A532'/)
})

test('las dos láminas conservan 31 obras, 33 interpretaciones y solo dos multiplicidades documentadas', () => {
  assert.match(migration, /<> 31/)
  assert.match(migration, /sum\(performance_count\)[^;]+<> 33/s)
  assert.match(migration, /performance_count = 2\) <> 2/)
  assert.match(migration, /march\.slug='himno-nacional-espana'\) <> 2/)
  assert.match(migration, /march\.slug='la-virgen-del-rosario-lopez-gandara'\) <> 2/)
})

test('la nueva presentación escala con búsqueda, filtros y obras distintas reales', () => {
  assert.match(directory, /Buscar Hermandad o Banda/)
  assert.match(directory, />Municipio</)
  assert.match(explorer, />Con escucha</)
  assert.match(explorer, />Repetidas</)
  assert.match(explorer, /Buscar marcha o autor/)
  assert.match(loader, /count\(distinct|unique\(repertoireEntries\.map/)
  assert.match(loader, /href: publicEntityHref/)
})
