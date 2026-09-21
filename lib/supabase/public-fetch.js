import 'server-only'

const DEFAULT_PUBLIC_QUERY_TIMEOUT_MS = 15_000

function publicQueryTimeoutMs() {
  const configured = Number(process.env.SUPABASE_PUBLIC_QUERY_TIMEOUT_MS)
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_PUBLIC_QUERY_TIMEOUT_MS
}

export async function fetchWithPublicQueryTimeout(input, init = {}) {
  const timeoutMs = publicQueryTimeoutMs()
  const controller = new AbortController()
  const upstreamSignal = init.signal
  const abortFromUpstream = () => controller.abort(upstreamSignal?.reason)

  if (upstreamSignal?.aborted) abortFromUpstream()
  else upstreamSignal?.addEventListener('abort', abortFromUpstream, { once: true })

  const timeout = setTimeout(() => {
    controller.abort(new Error(`Supabase public request timed out after ${timeoutMs} ms`))
  }, timeoutMs)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
    upstreamSignal?.removeEventListener('abort', abortFromUpstream)
  }
}
