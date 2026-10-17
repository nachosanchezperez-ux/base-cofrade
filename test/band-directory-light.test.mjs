import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { bandDirectoryItems } from '../lib/band-directory.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// 17/10/2026: /bandas pintaba las 152 tarjetas dos veces (reserva de Suspense +
// versión con filtros de URL). Los filtros de URL se leen ahora en el servidor.
test('/bandas pinta el directorio una sola vez', () => {
  const page = read('app/bandas/page.js')
  assert.doesNotMatch(page, /<Suspense|RelationalEntityDirectoryFromUrl/)
  assert.equal(page.match(/<RelationalEntityDirectory\b/g).length, 1)
  assert.match(page, /initialTypeSlug = firstParam\(params\.tipo\)/)
  assert.match(page, /initialMunicipalitySlug = firstParam\(params\.localidad\)/)
  assert.match(page, /key=\{`\$\{initialTypeSlug\}:\$\{initialMunicipalitySlug\}`\}/)
})

test('los items de banda no envían id ni campos vacíos', () => {
  const [item] = bandDirectoryItems([{
    id: 'uuid', slug: 'banda-x', popularName: 'Banda X', officialName: '', type: 'Cornetas y tambores',
    typeSlug: 'cctt', municipality: 'Sevilla', municipalitySlug: 'sevilla', foundation: '', linkedBrotherhood: '',
    logoPath: '', primaryColor: '#111111', secondaryColor: '', summary: 'Resumen',
  }])
  assert.equal('id' in item, false)
  assert.equal(item.href, '/bandas/banda-x')
  for (const key of ['officialName', 'foundation', 'linkedBrotherhood', 'logoPath', 'secondaryColor', 'logoBackgroundColor']) {
    assert.equal(key in item, false, key)
  }
  assert.deepEqual(item.keywords, ['Resumen'])
  assert.equal(item.logoPresentationMode, 'contained')
})
