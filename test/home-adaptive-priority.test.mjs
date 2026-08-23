import assert from 'node:assert/strict'
import test from 'node:test'

import { daysUntilDate, getHomeAdaptivePriority } from '../lib/home-adaptive-priority.js'

test('calcula días naturales entre fechas sin depender de zona horaria', () => {
  assert.equal(daysUntilDate('2026-09-12', '2026-08-23'), 20)
  assert.equal(daysUntilDate('2026-08-23', '2026-08-23'), 0)
  assert.equal(daysUntilDate('fecha-invalida', '2026-08-23'), null)
})

test('prioriza una extraordinaria hoy, mañana o en tres días', () => {
  assert.equal(getHomeAdaptivePriority({ dateKey: '2026-08-23', todayKey: '2026-08-23' }).extraordinaryFirst, true)
  assert.equal(getHomeAdaptivePriority({ dateKey: '2026-08-24', todayKey: '2026-08-23' }).extraordinaryFirst, true)
  assert.equal(getHomeAdaptivePriority({ dateKey: '2026-08-26', todayKey: '2026-08-23' }).extraordinaryFirst, true)
})

test('cede el segundo scroll a Hoy cuando la extraordinaria está más lejos', () => {
  const result = getHomeAdaptivePriority({ dateKey: '2026-09-12', todayKey: '2026-08-23' })
  assert.equal(result.daysAway, 20)
  assert.equal(result.extraordinaryFirst, false)
  assert.equal(result.eyebrow, 'Próxima extraordinaria · En 20 días')
})

test('mantiene delante una extraordinaria en curso o recién celebrada hoy', () => {
  const live = getHomeAdaptivePriority({ dateKey: '2026-08-23', todayKey: '2026-08-23', liveState: 'live' })
  const done = getHomeAdaptivePriority({ dateKey: '2026-08-23', todayKey: '2026-08-23', liveState: 'done' })

  assert.equal(live.extraordinaryFirst, true)
  assert.equal(live.eyebrow, 'Hoy · En curso')
  assert.equal(done.extraordinaryFirst, true)
  assert.equal(done.eyebrow, 'Celebrada hoy')
})
