import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { preservedAgendaEventPaths } from '../lib/agenda-preserved-event-paths.js'
import { extraordinaryDetailHref, isStandaloneExtraordinaryPath } from '../lib/agenda-event-url-policy.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Diagnóstico SEO 25/10/2026: /extraordinarias enlazaba fichas que redirigen con 308
// a la Agenda (p. ej. via-lucis-ancilla-mairena-2026) y su ItemList declaraba esas
// URL y anclas «/extraordinarias#…».
test('las tarjetas enlazan al destino final, no a una URL que redirige', () => {
  const preserved = [...preservedAgendaEventPaths].find((path) => path.startsWith('/extraordinarias/'))
  const preservedSlug = preserved.split('/').pop()
  assert.equal(extraordinaryDetailHref({ id: 'a', slug: preservedSlug }), preserved)

  const redirected = extraordinaryDetailHref({ id: 'uuid-1', slug: 'via-lucis-ancilla-mairena-2026', outingType: 'Vía Lucis' })
  assert.match(redirected, /^\/agenda-cofrade#/)
  assert.equal(isStandaloneExtraordinaryPath(redirected), false)

  assert.equal(extraordinaryDetailHref({ id: 'uuid-2', slug: '', anchor: 'uuid-2' }), '/extraordinarias#uuid-2')
  assert.equal(isStandaloneExtraordinaryPath('/extraordinarias#uuid-2'), false)
  assert.equal(isStandaloneExtraordinaryPath(preserved), true)
})

test('el directorio y el ItemList usan detailHref', () => {
  const directory = read('components/ExtraordinaryDirectory.js')
  const page = read('app/extraordinarias/page.js')
  for (const source of [directory, page]) assert.doesNotMatch(source, /href=\{`\/extraordinarias\/\$\{outing\.slug\}`\}/)
  assert.match(page, /\.filter\(\(outing\) => isStandaloneExtraordinaryPath\(outing\.detailHref\)\)/)
  assert.match(read('lib/supabase/extraordinary-directory.js'), /detailHref: extraordinaryDetailHref\(/)
})
