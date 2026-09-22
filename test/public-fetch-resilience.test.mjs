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
  SUPABASE_PUBLIC_QUERY_MAX_CONCURRENCY: '4',
  ...overrides,
})

test('la política pública mantiene un presupuesto total acotado', () => {
  const policy = publicQueryFetchPolicy(testEnv())

  assert.equal(policy.attemptTimeoutMs, 10)
  assert.equal(policy.totalTimeoutMs, 80)
  assert.equal(policy.retryDelayMs, 1)
  assert.equal(policy.maxConcurrency, 4)
  assert.equal(publicQueryFetchPolicy({}).maxConcurrency, 2)
})

test('la cola limita la concurrencia real sin perder lecturas', async () => {
  let active = 0
  let maximumActive = 0
  const releases = []

  const fakeFetch = async () => {
    active += 1
    maximumActive = Math.max(maximumActive, active)
    await new Promise((resolve) => releases.push(resolve))
    active -= 1
    return new Response('[]', { status: 200 })
  }

  const resilientFetch = createPublicQueryFetch(fakeFetch, {
    env: testEnv({ SUPABASE_PUBLIC_QUERY_MAX_CONCURRENCY: '2' }),
  })
  const requests = Array.from({ length: 4 }, () => (
    resilientFetch('https://example.test/rest/v1/entities', { method: 'GET' })
  ))

  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.equal(maximumActive, 2)

  releases.splice(0).forEach((resolve) => resolve())
  await new Promise((resolve) => setTimeout(resolve, 0))
  releases.splice(0).forEach((resolve) => resolve())
  await Promise.all(requests)

  assert.equal(maximumActive, 2)
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

test('las respuestas HTTP transitorias se delegan al retry nativo de Supabase', async () => {
  let calls = 0

  const fakeFetch = async () => {
    calls += 1
    return new Response('temporary', { status: 503 })
  }

  const resilientFetch = createPublicQueryFetch(fakeFetch, { env: testEnv() })
  const response = await resilientFetch('https://example.test/rest/v1/entities', { method: 'GET' })

  assert.equal(response.status, 503)
  assert.equal(calls, 1)
})

test('los errores de red se delegan al retry nativo de Supabase', async () => {
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
  assert.equal(calls, 1)
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

test('un abort previo del llamante no abre conexión ni activa un segundo intento', async () => {
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
  assert.equal(calls, 0)
})
