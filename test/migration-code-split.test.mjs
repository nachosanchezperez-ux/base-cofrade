import assert from 'node:assert/strict'
import test from 'node:test'

import {
  evaluateSplit,
  extractSchemaIdentifiers,
  findIdentifierUsages,
  isMigrationPath,
  isRuntimeCodePath,
  isTolerantMigration,
  parseAddedLines,
} from '../scripts/lib/migration-code-split.mjs'

// Fragmento real de 20261012120000_outings_home_featured_window.sql (#1144).
const HOME_FEATURED_SQL = `
-- Tarea 06 · Destacados de la portada gestionables desde el Panel.
alter table public.outings
  add column if not exists home_featured_starts_on date,
  add column if not exists home_featured_ends_on date,
  add column if not exists home_featured_priority smallint not null default 0;
`

test('extrae columnas añadidas en una o varias sentencias', () => {
  assert.deepEqual(extractSchemaIdentifiers(HOME_FEATURED_SQL), [
    'home_featured_ends_on',
    'home_featured_priority',
    'home_featured_starts_on',
  ])
})

test('extrae tablas, vistas y funciones nuevas, con o sin esquema y comillas', () => {
  const sql = `
    create table if not exists public."concert_programs" (id uuid primary key);
    create or replace view public.current_music_accompaniments with (security_invoker = true) as select 1;
    CREATE OR REPLACE FUNCTION public.consume_rate_limit(p_key text) returns boolean language sql as $$ select true $$;
    create materialized view private.home_cache as select 1;
  `
  assert.deepEqual(extractSchemaIdentifiers(sql), [
    'concert_programs',
    'consume_rate_limit',
    'current_music_accompaniments',
    'home_cache',
  ])
})

test('ignora lo que solo aparece en comentarios', () => {
  const sql = `-- add column fantasma text\n/* create table otra_fantasma () */\nalter table x add column real_column int;`
  assert.deepEqual(extractSchemaIdentifiers(sql), ['real_column'])
})

test('reconoce la marca de código tolerante solo como comentario de línea propio', () => {
  assert.equal(isTolerantMigration('-- hc-despliegue: tolerante (el Panel comprueba la columna)\nalter table x add column y int;'), true)
  assert.equal(isTolerantMigration('alter table x add column y int; -- sin marca'), false)
  assert.equal(isTolerantMigration("select '-- hc-despliegue: tolerante en texto';"), false)
})

test('clasifica rutas de migraciones y de código de ejecución', () => {
  assert.equal(isMigrationPath('supabase/migrations/20261012120000_x.sql'), true)
  assert.equal(isMigrationPath('supabase/migrations_archive/20260901_x.sql'), false)
  assert.equal(isMigrationPath('supabase/migrations/README.md'), false)

  assert.equal(isRuntimeCodePath('app/page.js'), true)
  assert.equal(isRuntimeCodePath('app/panel/(protected)/hoy/destacados/actions.js'), true)
  assert.equal(isRuntimeCodePath('lib/supabase/home-snapshot.js'), true)
  assert.equal(isRuntimeCodePath('components/HiloSearch.js'), true)
  assert.equal(isRuntimeCodePath('proxy.js'), true)
  assert.equal(isRuntimeCodePath('test/home-featured-form.test.mjs'), false)
  assert.equal(isRuntimeCodePath('lib/foo.test.mjs'), false)
  assert.equal(isRuntimeCodePath('scripts/integrity-audit.mjs'), false)
  assert.equal(isRuntimeCodePath('app/styles/home.module.css'), false)
  assert.equal(isRuntimeCodePath('docs/ESTADO-PROYECTO.md'), false)
})

test('parseAddedLines reparte solo las líneas añadidas por fichero', () => {
  const diff = [
    'diff --git a/lib/a.js b/lib/a.js',
    '--- a/lib/a.js',
    '+++ b/lib/a.js',
    '@@ -1,0 +2,2 @@',
    "+const columns = 'id, home_featured_starts_on'",
    '-const old = 1',
    '+const other = 2',
    'diff --git a/lib/b.js b/lib/b.js',
    '--- a/lib/b.js',
    '+++ /dev/null',
    '-borrado',
    'diff --git a/lib/c.js b/lib/c.js',
    '--- /dev/null',
    '+++ b/lib/c.js',
    '+nuevo()',
  ].join('\n')
  assert.deepEqual(parseAddedLines(diff), {
    'lib/a.js': ["const columns = 'id, home_featured_starts_on'", 'const other = 2'],
    'lib/c.js': ['nuevo()'],
  })
})

test('findIdentifierUsages exige palabra completa', () => {
  const usages = findIdentifierUsages(
    { 'lib/a.js': ['select("news_topic, slug")', 'const news_topics = []', 'row.NEWS_TOPIC'] },
    ['news_topic'],
  )
  assert.deepEqual(usages.map((usage) => usage.line), ['select("news_topic, slug")', 'row.NEWS_TOPIC'])
})

test('caso #1144: migración y código que la lee en la misma PR → falla', () => {
  const result = evaluateSplit({
    migrations: [{ path: 'supabase/migrations/20261012120000_outings_home_featured_window.sql', sql: HOME_FEATURED_SQL }],
    addedLinesByFile: {
      'lib/supabase/home-featured-outings.js': [".select('id, slug, home_featured_starts_on, home_featured_ends_on')"],
      'test/home-featured-form.test.mjs': ['home_featured_priority: 3'],
    },
  })
  assert.equal(result.ok, false)
  assert.deepEqual([...new Set(result.usages.map((usage) => usage.file))], ['lib/supabase/home-featured-outings.js'])
})

test('fase 1: solo la migración (y su test de historial) → correcto', () => {
  const result = evaluateSplit({
    migrations: [{ path: 'supabase/migrations/20261012120000_x.sql', sql: HOME_FEATURED_SQL }],
    addedLinesByFile: { 'test/migration-history.test.mjs': ['"20261012120000_x.sql",'] },
  })
  assert.equal(result.ok, true)
  assert.equal(result.watched.length, 3)
})

test('un nombre que ya existía en el código no se vigila', () => {
  const result = evaluateSplit({
    migrations: [{ path: 'supabase/migrations/20261016090000_x.sql', sql: 'alter table public.editorial_content add column if not exists slug text, add column if not exists news_topic text;' }],
    addedLinesByFile: { 'lib/supabase/hilo-movements.js': [".select('id, slug, title')"] },
    existingIdentifiers: new Set(['slug']),
  })
  assert.equal(result.ok, true)
  assert.deepEqual(result.watched.map((entry) => entry.identifier), ['news_topic'])
})

test('la marca de código tolerante exime a esa migración y queda registrada', () => {
  const result = evaluateSplit({
    migrations: [{ path: 'supabase/migrations/20261020000000_x.sql', sql: `-- hc-despliegue: tolerante\n${HOME_FEATURED_SQL}` }],
    addedLinesByFile: { 'lib/supabase/home-featured-outings.js': ['home_featured_starts_on'] },
  })
  assert.equal(result.ok, true)
  assert.deepEqual(result.tolerant, ['supabase/migrations/20261020000000_x.sql'])
})
