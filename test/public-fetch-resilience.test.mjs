import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createPublicQueryFetch,
  publicQueryFetchPolicy,
} from '../lib/supabase/public-fetch-core.js'

const testEnv = (overrides = {}) => ({
  SUPABASE_PUBLIC_QUERY_TIMEOUT_MS: '10',
  SUPABASE_PUBLIC_QUERY_TOTAL_TIMEOUT_MS: '80',
  SUPABASE_PUBLIC_QUERY_RETRY_DELAY_MS: '1',
  ...overrides,
})

test('la política pública mantiene un presupuesto total acotado', () => {
  const policy = publicQueryFetchPolicy(testEnv())

  assert.equal(policy.attemptTimeoutMs, 10)
  assert.equal(policy.totalTimeoutMs, 80)
  assert.equal(policy.retryDelayMs, 1)
})

test('una lectura GET reintenta una vez cuando el primer intento agota su timeout', async () => {
  let calls = 0

  const fakeFetch = async (_input, init = {}) => {
    calls += 1

    if (calls === 1) {
      return new Promise((_resolve, reject) => {
        if (init.signal?.aborted) {
          reject(init.signal.reason)
          return
        }

        init.signal?.addEventListener('abort', () => reject(init.signal.reason), { once: true })
      })
    }

    return new Response('[]', { status: 200 })
  }

  const resilientFetch = createPublicQueryFetch(fakeFetch, { env: testEnv() })
  const response = await resilientFetch('https://example.test/rest/v1/entities', { method: 'GET' })

  assert.equal(response.status, 200)
  assert.equal(calls, 2)
})

test('una respuesta transitoria 503 de lectura se reintenta una sola vez', async () => {
  let calls = 0

  const fakeFetch = async () => {
    calls += 1
    return calls === 1
      ? new Response('temporary', { status: 503 })
      : new Response('[]', { status: 200 })
  }

  const resilientFetch = createPublicQueryFetch(fakeFetch, { env: testEnv() })
  const response = await resilientFetch('https://example.test/rest/v1/entities', { method: 'GET' })

  assert.equal(response.status, 200)
  assert.equal(calls, 2)
})

test('los errores de red de lectura no superan dos intentos', async () => {
  let calls = 0

  const fakeFetch = async () => {
    calls += 1
    throw new TypeError('network unavailable')
  }

  const resilientFetch = createPublicQueryFetch(fakeFetch, { env: testEnv() })

  await assert.rejects(
    resilientFetch('https://example.test/rest/v1/entities', { method: 'GET' }),
    /network unavailable/
  )
  assert.equal(calls, 2)
})

test('las peticiones no idempotentes no se reintentan', async () => {
  let calls = 0

  const fakeFetch = async () => {
    calls += 1
    throw new TypeError('network unavailable')
  }

  const resilientFetch = createPublicQueryFetch(fakeFetch, { env: testEnv() })

  await assert.rejects(
    resilientFetch('https://example.test/rest/v1/rpc', { method: 'POST' }),
    /network unavailable/
  )
  assert.equal(calls, 1)
})

test('un abort del llamante se respeta y nunca activa un segundo intento', async () => {
  let calls = 0
  const caller = new AbortController()
  caller.abort(new Error('caller aborted'))

  const fakeFetch = async (_input, init = {}) => {
    calls += 1
    if (init.signal?.aborted) throw init.signal.reason
    return new Response('[]', { status: 200 })
  }

  const resilientFetch = createPublicQueryFetch(fakeFetch, { env: testEnv() })

  await assert.rejects(
    resilientFetch('https://example.test/rest/v1/entities', {
      method: 'GET',
      signal: caller.signal,
    }),
    /caller aborted/
  )
  assert.equal(calls, 1)
})
