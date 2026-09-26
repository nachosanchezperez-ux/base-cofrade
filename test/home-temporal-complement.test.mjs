import test from 'node:test'
import assert from 'node:assert/strict'

import { buildComplementaryHomeTemporal } from '../lib/home-temporal-complement.js'

test('durante un directo la Home reserva el foco temporal para otros actos de hoy', () => {
  const temporal = {
    mode: 'live',
    remainingTodayItems: [
      { id: 'live-pilas', key: 'processions:live-pilas', title: 'Pilas', category: 'processions' },
      { id: 'later-buen-aire', key: 'processions:later-buen-aire', title: 'Buen Aire', category: 'processions' },
      { id: 'besamanos-sed', key: 'devotions:besamanos-sed', title: 'Besamanos de la Sed', category: 'devotions' },
      { id: 'concert', key: 'concerts:concert', title: 'Concierto', category: 'concerts' },
    ],
  }

  const result = buildComplementaryHomeTemporal(temporal, [
    { id: 'live-pilas' },
    { id: 'later-buen-aire' },
  ])

  assert.equal(result.mode, 'complement')
  assert.equal(result.title, 'Qué más ocurre hoy')
  assert.deepEqual(result.focusItems.map((item) => item.id), ['besamanos-sed', 'concert'])
})

test('si no quedan actos complementarios se evita repetir las salidas en curso', () => {
  const result = buildComplementaryHomeTemporal({
    remainingTodayItems: [{ id: 'live', category: 'processions' }],
  }, [{ id: 'live' }])

  assert.equal(result, null)
})
