const RETRYABLE_METHODS = new Set(['GET', 'HEAD'])
const RETRYABLE_STATUS_CODES = new Set([408, 502, 503, 504, 520, 522, 524])

export const DEFAULT_PUBLIC_QUERY_TIMEOUT_MS = 15_000
export const DEFAULT_PUBLIC_QUERY_RETRY_DELAY_MS = 125

function positiveMilliseconds(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
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

  return {
    attemptTimeoutMs,
    totalTimeoutMs,
    retryDelayMs,
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

async function releaseResponse(response) {
  try {
    await response?.body?.cancel()
  } catch {
    // El cuerpo pertenece a una respuesta transitoria que vamos a descartar.
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

      try {
        const response = await fetchAttempt(
          fetchImpl,
          input,
          init,
          attemptTimeoutMs,
          upstreamSignal
        )

        const shouldRetryResponse = canRetry
          && attempts < 2
          && RETRYABLE_STATUS_CODES.has(response.status)

        if (!shouldRetryResponse) return response

        const remainingAfterResponseMs = deadline - now()
        if (remainingAfterResponseMs <= policy.retryDelayMs) return response

        await releaseResponse(response)
        onRetry?.({
          attempt: attempts + 1,
          method,
          reason: `http_${response.status}`,
          remainingMs: remainingAfterResponseMs,
        })

        await sleep(
          Math.min(policy.retryDelayMs, Math.max(0, remainingAfterResponseMs - 1)),
          upstreamSignal
        )
      } catch (error) {
        if (upstreamSignal?.aborted) throw error

        lastError = error
        const timedOut = isAttemptTimeout(error)
        const remainingAfterErrorMs = deadline - now()
        const shouldRetryError = canRetry
          && attempts < 2
          && remainingAfterErrorMs > policy.retryDelayMs

        if (!shouldRetryError) {
          if (timedOut) {
            throw totalTimeoutError(policy.totalTimeoutMs, attempts, error)
          }

          throw error
        }

        onRetry?.({
          attempt: attempts + 1,
          method,
          reason: timedOut ? 'timeout' : 'network_error',
          remainingMs: remainingAfterErrorMs,
        })

        await sleep(
          Math.min(policy.retryDelayMs, Math.max(0, remainingAfterErrorMs - 1)),
          upstreamSignal
        )
      }
    }

    throw totalTimeoutError(policy.totalTimeoutMs, attempts, lastError)
  }
}
