import test from 'node:test'
import assert from 'node:assert/strict'
import { extraordinarySeoCopy } from '../lib/seo-calendar.js'

test('Extraordinarias prioriza la consulta con señal real de GSC sin truncar metadata', () => {
  const { title, description } = extraordinarySeoCopy(2026)

  assert.equal(title, 'Extraordinarias Sevilla 2026: calendario')
  assert.match(description, /^Procesiones y salidas extraordinarias de Sevilla en 2026:/)
  assert.ok(title.length <= 45)
  assert.ok(description.length <= 160)
})
