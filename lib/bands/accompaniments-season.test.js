import assert from 'node:assert/strict'
import test from 'node:test'

import { partitionAccompanimentsBySeason } from './accompaniments.js'

test('mantiene en la temporada las relaciones históricas que seguían vigentes ese año', () => {
  const current = [
    { brotherhoodName: 'Milagrosa', yearFrom: 2026, yearTo: null },
    { brotherhoodName: 'Futura', yearFrom: 2027, yearTo: null },
  ]
  const historical = [
    { brotherhoodName: 'Humildad', yearFrom: 2022, yearTo: 2026 },
    { brotherhoodName: 'Las Viñas', yearFrom: 2024, yearTo: 2026 },
    { brotherhoodName: 'San Esteban · etapa anterior', yearFrom: 2003, yearTo: 2009 },
  ]

  const season2026 = partitionAccompanimentsBySeason(current, historical, 2026)

  assert.deepEqual(
    season2026.current.map((item) => item.brotherhoodName),
    ['Milagrosa', 'Humildad', 'Las Viñas'],
  )
  assert.deepEqual(season2026.upcoming.map((item) => item.brotherhoodName), ['Futura'])
  assert.deepEqual(
    season2026.historical.map((item) => item.brotherhoodName),
    ['San Esteban · etapa anterior'],
  )

  const season2027 = partitionAccompanimentsBySeason(current, historical, 2027)
  assert.deepEqual(season2027.current.map((item) => item.brotherhoodName), ['Milagrosa', 'Futura'])
  assert.deepEqual(
    season2027.historical.map((item) => item.brotherhoodName),
    ['Humildad', 'Las Viñas', 'San Esteban · etapa anterior'],
  )
})
