import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la Agenda consulta solo salidas tipificadas como rosario público', () => {
  const source = read('lib/supabase/rosary-outings.js')
  assert.match(source, /\.from\('outings'\)/)
  assert.match(source, /\.eq\('status', 'published'\)/)
  assert.match(source, /\.ilike\('outing_type', '%rosario%'\)/)
  assert.doesNotMatch(source, /\.ilike\('title', '%rosario%'\)/)
  assert.doesNotMatch(source, /\.ilike\('description', '%rosario%'\)/)
})

test('la clasificación pública distingue aurora, matutino y vespertino', () => {
  const source = read('lib/supabase/rosary-outings.js')
  assert.match(source, /Rosario de la Aurora/)
  assert.match(source, /Rosario matutino/)
  assert.match(source, /Rosario vespertino/)
  assert.doesNotMatch(source, /Rosario nocturno/)
})

test('Agenda expone rosarios en navegación, sitemap y fichas SEO propias', () => {
  const header = read('components/HiloHeader.js')
  const sitemap = read('app/sitemap.js')
  const page = read('app/agenda-cofrade/page.js')
  const directory = read('components/AgendaCofradeDirectory.js')
  const detail = read('app/agenda-cofrade/rosarios/[slug]/page.js')

  assert.match(header, /\['agenda', 'Agenda'\]/)
  assert.match(header, /\/agenda-cofrade/)
  assert.match(sitemap, /getRosaryOutings/)
  assert.match(sitemap, /\/agenda-cofrade/)
  assert.match(page, /Rosarios públicos/)
  assert.match(directory, /Rosarios/)
  assert.match(detail, /'@type': 'Event'/)
  assert.match(detail, /const \{ slug \} = await params/)
})
