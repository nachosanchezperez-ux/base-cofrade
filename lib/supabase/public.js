import 'server-only'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let publicClient

export function createPublicClient() {
  if (publicClient) return publicClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) throw new Error('Falta la configuración pública de Supabase')

  publicClient = createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return publicClient
}
