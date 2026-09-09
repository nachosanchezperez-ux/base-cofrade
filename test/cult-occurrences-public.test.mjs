import test from 'node:test'
import assert from 'node:assert/strict'

import {
  formatCultOccurrenceDate,
  formatCultOccurrenceSchedule,
  nextCultOccurrence,
} from '../lib/cults/occurrences.js'

test('formatea la edición concreta sin confundirla con la regla recurrente', () => {
  assert.equal(formatCultOccurrenceDate('2026-10-15', '2026-10-17'), '15–17 OCT')
  assert.equal(formatCultOccurrenceDate('2026-09-30', '2026-10-02'), '30 SEP–2 OCT')
  assert.equal(formatCultOccurrenceDate('2026-12-08'), '8 DIC')
})

test('resume horarios exactos y conserva intervalos editoriales', () => {
  assert.equal(formatCultOccurrenceSchedule([
    { start_time: '20:00:00', time_text: null },
    { start_time: '20:00:00', time_text: null },
  ]), '20:00 h')
  assert.equal(formatCultOccurrenceSchedule([
    { time_text: '10:00–14:00 y 17:00–21:00' },
  ]), '10:00–14:00 y 17:00–21:00')
})

test('selecciona la primera edición ya ordenada de cada culto', () => {
  const occurrences = [
    { id: 'a', cult_id: 'culto-1' },
    { id: 'b', cult_id: 'culto-1' },
    { id: 'c', cult_id: 'culto-2' },
  ]
  assert.equal(nextCultOccurrence(occurrences, 'culto-1')?.id, 'a')
  assert.equal(nextCultOccurrence(occurrences, 'culto-3'), null)
})
