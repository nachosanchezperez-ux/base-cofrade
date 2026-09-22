import 'server-only'

import { createPublicQueryFetch } from '@/lib/supabase/public-fetch-core'

const resilientPublicFetch = createPublicQueryFetch(globalThis.fetch.bind(globalThis), {
  onRetry: ({ attempt, method, reason, remainingMs }) => {
    console.warn('[Hilo Cofrade] Reintentando lectura pública de Supabase', {
      attempt,
      method,
      reason,
      remainingMs,
    })
  },
})

export function fetchWithPublicQueryTimeout(input, init = {}) {
  return resilientPublicFetch(input, init)
}
