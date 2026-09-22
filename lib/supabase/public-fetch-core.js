const RETRYABLE_METHODS = new Set(['GET', 'HEAD'])
export const DEFAULT_PUBLIC_QUERY_TIMEOUT_MS = 15_000
export const DEFAULT_PUBLIC_QUERY_RETRY_DELAY_MS = 125
export const DEFAULT_PUBLIC_QUERY_MAX_CONCURRENCY = 2

function positiveMilliseconds(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function positiveInteger(value, fallback) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function publicQueryFetchPolicy(env = process.env) {
  const attemptTimeoutMs = positiveMilliseconds(
    env.SUPABASE_PUBLIC_QUERY_TIMEOUT_MS,
    DEFAULT_PUBLIC_QUERY_TIMEOUT_MS
  )
  const retryDelayMs = positiveMilliseconds(
    env.SUPABASE_PUBLIC_QUERY_RETRY_DELAY_MS,
    DEFAULT_PUBLIC_QUERY_RETRY_DELAY_MS
  )
  const totalTimeoutMs = positiveMilliseconds(
    env.SUPABASE_PUBLIC_QUERY_TOTAL_TIMEOUT_MS,
    (attemptTimeoutMs * 2) + retryDelayMs
  )
  const maxConcurrency = positiveInteger(
    env.SUPABASE_PUBLIC_QUERY_MAX_CONCURRENCY,
    DEFAULT_PUBLIC_QUERY_MAX_CONCURRENCY
  )

  return {
    attemptTimeoutMs,
    totalTimeoutMs,
    retryDelayMs,
    maxConcurrency,
  }
}

function queueTimeoutError(timeoutMs) {
  const error = new Error(`Supabase public request queue timed out after ${timeoutMs} ms`)
  error.name = 'PublicQueryQueueTimeoutError'
  return error
}

function createConcurrencyGate(limit) {
  let active = 0
  const queue = []

  function drain() {
    while (active < limit && queue.length > 0) {
      const entry = queue.shift()
      if (entry.settled) continue

      entry.settled = true
      clearTimeout(entry.timeout)
      entry.signal?.removeEventListener('abort', entry.abort)
      active += 1
      entry.resolve(() => {
        active -= 1
        drain()
      })
    }
  }

  return function acquire(signal, timeoutMs) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(signal.reason || new Error('Supabase public request aborted by caller'))
        return
      }

      const entry = {
        settled: false,
        signal,
        resolve,
        reject,
        abort: null,
        timeout: null,
      }

      const rejectEntry = (error) => {
        if (entry.settled) return
        entry.settled = true
        clearTimeout(entry.timeout)
        signal?.removeEventListener('abort', entry.abort)
        reject(error)
      }

      entry.abort = () => rejectEntry(
        signal?.reason || new Error('Supabase public request aborted by caller')
      )
      signal?.addEventListener('abort', entry.abort, { once: true })
      entry.timeout = setTimeout(
        () => rejectEntry(queueTimeoutError(timeoutMs)),
        timeoutMs
      )

      queue.push(entry)
      drain()
    })
  }
}

function requestMethod(input, init = {}) {
  if (init.method) return String(init.method).toUpperCase()

  if (typeof Request !== 'undefined' && input instanceof Request) {
    return String(input.method || 'GET').toUpperCase()
  }

  return 'GET'
}

function requestSignal(input, init = {}) {
  if (init.signal) return init.signal

  if (typeof Request !== 'undefined' && input instanceof Request) {
    return input.signal
  }

  return undefined
}

function attemptTimeoutError(timeoutMs, cause) {
  const error = new Error(`Supabase public request attempt timed out after ${timeoutMs} ms`)
  error.name = 'PublicQueryAttemptTimeoutError'
  if (cause !== undefined) error.cause = cause
  return error
}

function totalTimeoutError(totalTimeoutMs, attempts, cause) {
  const error = new Error(
    `Supabase public request timed out after ${totalTimeoutMs} ms across ${attempts} attempts`
  )
  error.name = 'PublicQueryTimeoutError'
  if (cause !== undefined) error.cause = cause
  return error
}

function isAttemptTimeout(error) {
  return error?.name === 'PublicQueryAttemptTimeoutError'
}

async function abortableDelay(milliseconds, signal) {
  if (milliseconds <= 0) return

  await new Promise((resolve, reject) => {
    let timeout

    const abort = () => {
      clearTimeout(timeout)
      reject(signal?.reason || new Error('Supabase public retry aborted by caller'))
    }

    if (signal?.aborted) {
      abort()
      return
    }

    signal?.addEventListener('abort', abort, { once: true })
    timeout = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }, milliseconds)
  })
}

async function fetchAttempt(fetchImpl, input, init, timeoutMs, upstreamSignal) {
  const controller = new AbortController()
  let timedOut = false

  const abortFromUpstream = () => controller.abort(upstreamSignal?.reason)

  if (upstreamSignal?.aborted) abortFromUpstream()
  else upstreamSignal?.addEventListener('abort', abortFromUpstream, { once: true })

  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort(attemptTimeoutError(timeoutMs))
  }, timeoutMs)

  try {
    return await fetchImpl(input, { ...init, signal: controller.signal })
  } catch (error) {
    if (timedOut) throw attemptTimeoutError(timeoutMs, error)
    throw error
  } finally {
    clearTimeout(timeout)
    upstreamSignal?.removeEventListener('abort', abortFromUpstream)
  }
}

export function createPublicQueryFetch(
  fetchImpl,
  {
    env = process.env,
    now = () => Date.now(),
    sleep = abortableDelay,
    onRetry = null,
  } = {}
) {
  if (typeof fetchImpl !== 'function') {
    throw new TypeError('createPublicQueryFetch necesita una implementación de fetch')
  }

  const policy = publicQueryFetchPolicy(env)
  const acquire = createConcurrencyGate(policy.maxConcurrency)

  return async function fetchPublicQuery(input, init = {}) {
    const method = requestMethod(input, init)
    const canRetry = RETRYABLE_METHODS.has(method)
    const upstreamSignal = requestSignal(input, init)
    const deadline = now() + policy.totalTimeoutMs
    let attempts = 0
    let lastError = null

    while (attempts < (canRetry ? 2 : 1)) {
      attempts += 1

      const remainingMs = deadline - now()
      if (remainingMs <= 0) {
        throw totalTimeoutError(policy.totalTimeoutMs, attempts - 1 || 1, lastError)
      }

      const attemptTimeoutMs = Math.min(policy.attemptTimeoutMs, remainingMs)
      let release

      try {
        release = await acquire(upstreamSignal, remainingMs)
        const remainingAfterQueueMs = deadline - now()
        if (remainingAfterQueueMs <= 0) {
          throw totalTimeoutError(policy.totalTimeoutMs, attempts - 1 || 1, lastError)
        }

        const response = await fetchAttempt(
          fetchImpl,
          input,
          init,
          Math.min(attemptTimeoutMs, remainingAfterQueueMs),
          upstreamSignal
        )

        return response
      } catch (error) {
        release?.()
        release = null

        if (upstreamSignal?.aborted) throw error

        if (error?.name === 'PublicQueryQueueTimeoutError') {
          throw totalTimeoutError(policy.totalTimeoutMs, attempts - 1 || 1, error)
        }

        lastError = error
        const timedOut = isAttemptTimeout(error)
        const remainingAfterErrorMs = deadline - now()
        const shouldRetryTimeout = timedOut
          && canRetry
          && attempts < 2
          && remainingAfterErrorMs > policy.retryDelayMs

        if (!shouldRetryTimeout) {
          if (timedOut) {
            throw totalTimeoutError(policy.totalTimeoutMs, attempts, error)
          }

          throw error
        }

        onRetry?.({
          attempt: attempts + 1,
          method,
          reason: 'timeout',
          remainingMs: remainingAfterErrorMs,
        })

        await sleep(
          Math.min(policy.retryDelayMs, Math.max(0, remainingAfterErrorMs - 1)),
          upstreamSignal
        )
      } finally {
        release?.()
      }
    }

    throw totalTimeoutError(policy.totalTimeoutMs, attempts, lastError)
  }
}
