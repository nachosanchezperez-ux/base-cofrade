import assert from 'node:assert/strict'
import test from 'node:test'
import { clientKey, createRateLimiter, tiraQuestionLimiter, tiraSearchLimiter } from '../lib/request-rate-limit.js'

function clock(start = 1_000_000) {
  let value = start
  return { now: () => value, advance: (ms) => { value += ms } }
}

function headers(values) {
  const map = new Map(Object.entries(values).map(([key, value]) => [key.toLowerCase(), value]))
  return { get: (name) => map.get(String(name).toLowerCase()) ?? null }
}

test('permite hasta el límite y bloquea la petición siguiente con Retry-After', () => {
  const time = clock()
  const limiter = createRateLimiter({ limit: 3, windowMs: 60_000, now: time.now })

  assert.deepEqual(
    [1, 2, 3].map(() => limiter.consume('a').allowed),
    [true, true, true],
  )
  const blocked = limiter.consume('a')
  assert.equal(blocked.allowed, false)
  assert.equal(blocked.remaining, 0)
  assert.equal(blocked.retryAfterSeconds, 60)

  time.advance(45_000)
  assert.equal(limiter.consume('a').retryAfterSeconds, 15)
})

test('la ventana se reinicia al vencer', () => {
  const time = clock()
  const limiter = createRateLimiter({ limit: 2, windowMs: 10_000, now: time.now })

  limiter.consume('a')
  limiter.consume('a')
  assert.equal(limiter.consume('a').allowed, false)

  time.advance(10_000)
  const renewed = limiter.consume('a')
  assert.equal(renewed.allowed, true)
  assert.equal(renewed.remaining, 1)
})

test('cada cliente tiene su propio contador', () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 60_000, now: clock().now })

  assert.equal(limiter.consume('a').allowed, true)
  assert.equal(limiter.consume('a').allowed, false)
  assert.equal(limiter.consume('b').allowed, true)
})

test('la memoria nunca supera el tope de claves, aunque lleguen muchas IP distintas', () => {
  const time = clock()
  const limiter = createRateLimiter({ limit: 5, windowMs: 60_000, maxKeys: 100, now: time.now })

  for (let index = 0; index < 1_000; index += 1) limiter.consume(`ip-${index}`)
  assert.ok(limiter.size() <= 100, `size=${limiter.size()}`)

  // Las ventanas vencidas se liberan antes que las vigentes.
  time.advance(60_000)
  limiter.consume('nueva')
  assert.ok(limiter.size() <= 100)
})

test('rechaza configuraciones inválidas', () => {
  assert.throws(() => createRateLimiter({ limit: 0, windowMs: 1000 }))
  assert.throws(() => createRateLimiter({ limit: 1, windowMs: 0 }))
})

test('la clave del cliente no contiene la IP en claro y usa la primera IP reenviada', () => {
  const key = clientKey(headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }))

  assert.match(key, /^[0-9a-f]{32}$/)
  assert.ok(!key.includes('203.0.113.7'))
  assert.equal(key, clientKey(headers({ 'x-forwarded-for': '203.0.113.7' })))
  assert.notEqual(key, clientKey(headers({ 'x-forwarded-for': '198.51.100.9' })))
  assert.equal(key, clientKey(headers({ 'x-real-ip': '203.0.113.7' })))
})

test('sin IP, agrupa por agente de usuario en lugar de fallar', () => {
  const key = clientKey(headers({ 'user-agent': 'bot/1.0' }))
  assert.match(key, /^[0-9a-f]{32}$/)
  assert.equal(key, clientKey(headers({ 'user-agent': 'bot/1.0' })))
  assert.match(clientKey(headers({})), /^[0-9a-f]{32}$/)
})

test('los límites públicos de Tira del hilo son más estrictos en preguntas que en autocompletado', () => {
  const question = Array.from({ length: 16 }, () => tiraQuestionLimiter.consume('prueba-preguntas').allowed)
  const search = Array.from({ length: 91 }, () => tiraSearchLimiter.consume('prueba-busqueda').allowed)

  assert.equal(question.filter(Boolean).length, 15)
  assert.equal(question.at(-1), false)
  assert.equal(search.filter(Boolean).length, 90)
  assert.equal(search.at(-1), false)
})
