import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('crew search joins the event entity instead of its organising brotherhood', () => {
  const route = readFileSync(new URL('../app/api/panel/search/route.js', import.meta.url), 'utf8')
  assert.match(route, /events!events_entity_id_fkey!inner\(event_category, event_date, event_type\)/)
})
