import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

const migration = source('supabase/migrations/20261009123758_concert_programs.sql')
const loader = source('lib/supabase/concert-events.js')
const agenda = source('lib/supabase/agenda-cofrade.js')
const page = source('app/agenda-cofrade/page.js')
const directory = source('components/AgendaCofradeDirectoryV4.js')

test('los programas de concierto tienen modelo propio y no reutilizan las crucetas procesionales', () => {
  assert.match(migration, /create table if not exists public\.concert_programs/)
  assert.match(migration, /create table if not exists public\.concert_program_entries/)
  assert.match(migration, /event_entity_id uuid not null references public\.entities/)
  assert.match(migration, /band_entity_id uuid not null references public\.entities/)
  assert.match(migration, /program_kind text not null default 'announced'/)
  assert.match(migration, /march_entity_id uuid references public\.entities/)
  assert.match(migration, /unique \(event_entity_id, band_entity_id\)/)
  assert.doesNotMatch(migration, /insert into public\.musical_repertoires/)
})

test('la lectura pública exige concierto, entidad y banda publicados', () => {
  assert.match(migration, /alter table public\.concert_programs enable row level security/)
  assert.match(migration, /alter table public\.concert_program_entries enable row level security/)
  assert.match(migration, /event\.event_category = 'concert'/)
  assert.match(migration, /event_entity\.status = 'published'/)
  assert.match(migration, /band\.entity_type = 'band'/)
  assert.match(migration, /band\.status = 'published'/)
  assert.match(migration, /revoke all on public\.concert_programs from public, anon, authenticated/)
})

test('el lector trae programas y enlaza marchas canónicas cuando existen', () => {
  assert.match(loader, /from\('concert_programs'\)/)
  assert.match(loader, /from\('concert_program_entries'\)/)
  assert.match(loader, /programsByEvent/)
  assert.match(loader, /programKind: program\.program_kind/)
  assert.match(loader, /href: march\?\.entity_type === 'march' \? publicHref\(march\) : ''/)
  assert.match(loader, /if \(entity\.entity_type === 'march'\) return `\/marchas\//)
})

test('la agenda serializa y muestra el programa musical estructurado con respaldo legado', () => {
  assert.match(agenda, /programs: item\.programs \|\| \[\]/)
  assert.match(agenda, /repertoireText/)
  assert.match(page, /programs: \(item\.programs \|\| \[\]\)\.map/)
  assert.match(directory, /function concertProgramsForDisplay/)
  assert.match(directory, /Programa musical/)
  assert.match(directory, /Programa anunciado/)
  assert.match(directory, /agenda_concert_program/)
  assert.match(directory, /repertoireData\(item\.repertoireText\)/)
})
