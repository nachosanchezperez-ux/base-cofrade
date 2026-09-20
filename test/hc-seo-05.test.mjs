import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { agendaSeoCopy, extraordinarySeoCopy, madridYear } from '../lib/seo-calendar.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('el año SEO cambia según Europe/Madrid y no según UTC', () => {
  assert.equal(madridYear(new Date('2026-09-20T12:00:00Z')), 2026)
  assert.equal(madridYear(new Date('2026-12-31T22:30:00Z')), 2026)
  assert.equal(madridYear(new Date('2026-12-31T22:59:59Z')), 2026)
  assert.equal(madridYear(new Date('2026-12-31T23:00:00Z')), 2027)
  assert.equal(madridYear(new Date('2026-12-31T23:30:00Z')), 2027)
  assert.equal(madridYear(new Date('2027-01-01T12:00:00Z')), 2027)
})

test('Agenda y Extraordinarias comparten el año temporal en su copy SEO', () => {
  assert.match(agendaSeoCopy(2027).title, /2027/)
  assert.match(extraordinarySeoCopy(2027).title, /2027/)
  assert.match(extraordinarySeoCopy(2027).description, /en 2027/)
})

test('las dos páginas calculan metadata y contenido desde la fuente común', () => {
  const agenda = read('app/agenda-cofrade/page.js')
  const extraordinary = read('app/extraordinarias/page.js')

  for (const page of [agenda, extraordinary]) {
    assert.match(page, /export function generateMetadata\(\)/)
    assert.match(page, /madridYear\(\)/)
  }

  assert.match(agenda, /agendaSeoCopy/)
  assert.match(extraordinary, /extraordinarySeoCopy/)
})
