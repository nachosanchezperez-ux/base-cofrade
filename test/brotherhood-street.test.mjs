import test from 'node:test'
import assert from 'node:assert/strict'
import { splitStreetUpdates, streetBadge, STREET_UPDATES_MAX } from '../lib/brotherhood-street.js'

const item = (id, ano, tipo = 'Estreno') => ({ id, ano, tipo, titulo: `Pieza ${id}` })

test('«En la calle» muestra lo de este año y el anterior; el resto va al archivo sin repetir', () => {
  const { street, archive } = splitStreetUpdates([
    item(1, 2019), item(2, 2026, 'Restauración'), item(3, 2025), item(4, 2026),
  ], 2026)
  assert.deepEqual(street.map((x) => x.id), [4, 2, 3])
  assert.deepEqual(archive.map((x) => x.id), [1])
})

test('las novedades tienen tope y lo que sobra sigue en Patrimonio', () => {
  const many = Array.from({ length: STREET_UPDATES_MAX + 2 }, (_, i) => item(i + 1, 2026))
  const { street, archive } = splitStreetUpdates(many, 2026)
  assert.equal(street.length, STREET_UPDATES_MAX)
  assert.equal(archive.length, 2)
})

test('sin año o sin título no se presenta como novedad', () => {
  const { street } = splitStreetUpdates([{ id: 1, tipo: 'Estreno', titulo: 'X' }, { id: 2, ano: 2026 }], 2026)
  assert.equal(street.length, 0)
})

test('distintivo legible', () => {
  assert.equal(streetBadge(item(1, 2026)), 'Estreno 2026')
  assert.equal(streetBadge(item(1, '2025', 'Restauración')), 'Restaurado 2025')
  assert.equal(streetBadge({ fechaIso: '2026-03-01' }), 'Estreno 2026')
})
