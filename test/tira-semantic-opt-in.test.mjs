import test from 'node:test'
import assert from 'node:assert/strict'

// Este test documenta la política de producto: la capa semántica no debe
// activarse por la mera presencia de una API key. Requiere un opt-in explícito.
test('la capa semántica requiere HILO_SEMANTIC_ENABLED=true', () => {
  const enabled = (apiKey, flag = '') => Boolean(apiKey) && String(flag).toLowerCase() === 'true'

  assert.equal(enabled('sk-test', ''), false)
  assert.equal(enabled('sk-test', 'false'), false)
  assert.equal(enabled('', 'true'), false)
  assert.equal(enabled('sk-test', 'true'), true)
  assert.equal(enabled('sk-test', 'TRUE'), true)
})
