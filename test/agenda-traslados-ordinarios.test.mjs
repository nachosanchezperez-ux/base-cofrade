import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { parseQuickAct, quickActTitle, quickOutingPayload } from '../lib/panel/quick-act-core.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('los traslados ordinarios entran en la Agenda como traslados', () => {
  const loader = read('lib/supabase/general-public-outings.js')
  assert.match(loader, /\.in\('outing_type', \['Romería', 'Procesión', 'Traslado'\]\)/)
  assert.match(loader, /type\.includes\('traslado'\) \? 'transfer'/)
  // Los extraordinarios siguen llegando solo por su directorio.
  assert.match(loader, /\.eq\('character', 'ordinary'\)/)
  const agenda = read('lib/supabase/agenda-cofrade.js')
  assert.match(agenda, /transfer: \{ category: 'transfers', label: 'Traslado'/)
  assert.match(agenda, /hilo-cofrade-agenda-sources-v12-traslados/)
  assert.match(read('lib/supabase/home-upcoming-agenda.js'), /isTransfer \? 'Traslado'/)
})

test('el alta rápida ofrece el traslado ordinario', () => {
  const { act } = parseQuickAct((name) => ({ act_type: 'traslado', brotherhood_id: '11111111-1111-4111-8111-111111111111', start_date: '2026-11-22' })[name] ?? '')
  const payload = quickOutingPayload(act, { brotherhoodName: 'Hermandad de la Soledad' })
  assert.equal(payload.outing_type, 'Traslado')
  assert.equal(payload.character, 'ordinary')
  assert.equal(quickActTitle(act, 'Hermandad de la Soledad'), 'Traslado · Hermandad de la Soledad')
})
